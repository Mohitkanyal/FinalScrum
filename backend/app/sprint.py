from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List
from pymongo import MongoClient
from datetime import datetime, timedelta
import re
import os
from dotenv import load_dotenv

# -----------------------------
# 1️⃣ Load environment variables
# -----------------------------
load_dotenv()

# -----------------------------
# 2️⃣ Setup MongoDB
# -----------------------------
client = MongoClient("mongodb://localhost:27017/")
db = client.scrumbot
projects_col = db.projects
sprints_col = db.sprints
team_col = db.team

# -----------------------------
# 3️⃣ Define LLM
# -----------------------------
llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    task="text-generation",
)
model = ChatHuggingFace(llm=llm)

# -----------------------------
# 4️⃣ Define Sprint Models
# -----------------------------
class SubTask(BaseModel):
    subtask_id: int
    title: str
    description: str
    role: str = Field(..., description="Role responsible for the subtask")
    duration_days: int = Field(..., description="Estimated duration in days")

class Task(BaseModel):
    task_id: int
    title: str
    description: str
    role: str = Field(..., description="Role responsible for the task")
    duration_days: int = Field(..., description="Estimated duration in days")
    subtasks: List[SubTask] = []

class Sprint(BaseModel):
    sprint_id: int
    sprint_name: str
    goal: str
    start_date: str
    end_date: str
    tasks: List[Task] = []

parser = PydanticOutputParser(pydantic_object=Sprint)

# -----------------------------
# 5️⃣ LLM Prompt
# -----------------------------
project_name = "Agile automation tool"
project_description = "AI-powered tool to automate Agile project management: sprint planning, task tracking, role assignment, and deadlines."

prompt_template = PromptTemplate(
    input_variables=["project_name", "project_description"],
    partial_variables={
        "format_instructions": """
Expected JSON format:
{
  "sprint_id": 1,
  "sprint_name": "Sprint Name",
  "goal": "Sprint Goal",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "tasks": [
    {
      "task_id": 1,
      "title": "Task Title",
      "description": "Task Description",
      "role": "Role Name",
      "duration_days": 3,
      "subtasks": [
        {
          "subtask_id": 101,
          "title": "Subtask Title",
          "description": "Subtask Description",
          "role": "Role Name",
          "duration_days": 1
        }
      ]
    }
  ]
}
"""
    },
    template="""
You are an expert Agile project planner AI.
Generate a sprint plan for the given project with the following:

- Assign each task and subtask a role (Backend, Frontend, QA, etc.)
- Assign estimated duration_days for each task and subtask
- Generate start_date and end_date for the sprint
- Include tasks and subtasks with unique IDs
- Respond ONLY with valid JSON according to the format instructions

Project Name: {project_name}
Project Description: {project_description}

{format_instructions}
"""
)

prompt = prompt_template.invoke({
    "project_name": project_name,
    "project_description": project_description
})

# -----------------------------
# 6️⃣ Call LLM
# -----------------------------
response = model.invoke(prompt)

# -----------------------------
# 7️⃣ Extract JSON
# -----------------------------
def extract_json(text):
    match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    return match.group(1) if match else text.strip()

raw_output = response.content
cleaned = extract_json(raw_output)
parsed_sprint_plan = parser.parse(cleaned)

# -----------------------------
# 8️⃣ Assign Members and Deadlines
# -----------------------------
def assign_member(role: str):
    """Assign member with least tasks."""
    members = list(team_col.find({"role": role}))
    if not members:
        return None
    members.sort(key=lambda m: m.get("tasks_assigned", 0))
    selected = members[0]
    team_col.update_one({"_id": selected["_id"]}, {"$inc": {"tasks_assigned": 1}})
    return selected["name"]

sprint_start = datetime.strptime(parsed_sprint_plan.start_date, "%Y-%m-%d")
current_day = sprint_start

for task in parsed_sprint_plan.tasks:
    task.start_date = current_day.strftime("%Y-%m-%d")
    task.end_date = (current_day + timedelta(days=task.duration_days - 1)).strftime("%Y-%m-%d")
    task.assigned_to = assign_member(task.role)
    
    sub_current = datetime.strptime(task.start_date, "%Y-%m-%d")
    for subtask in task.subtasks:
        subtask.start_date = sub_current.strftime("%Y-%m-%d")
        subtask.end_date = (sub_current + timedelta(days=subtask.duration_days - 1)).strftime("%Y-%m-%d")
        subtask.assigned_to = assign_member(subtask.role)
        sub_current += timedelta(days=subtask.duration_days)
    
    current_day += timedelta(days=task.duration_days)

# -----------------------------
# 9️⃣ Save to MongoDB
# -----------------------------
sprint_doc = parsed_sprint_plan.model_dump()
sprints_col.insert_one(sprint_doc)

print("Sprint generated and saved to MongoDB successfully!")
