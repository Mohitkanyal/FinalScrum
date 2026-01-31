# import os
# import re
# os.environ["CUDA_VISIBLE_DEVICES"] = ""  # FORCE CPU

# from fastapi import FastAPI
# from pydantic import BaseModel
# from pymongo import MongoClient
# from datetime import datetime
# import spacy
# from sentence_transformers import SentenceTransformer, util

# # --------------------------------------------------
# # 1. FASTAPI INIT
# # --------------------------------------------------
# app = FastAPI(title="Scrum NLP Chatbot Backend")
# from fastapi.middleware.cors import CORSMiddleware

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # for development only
#     allow_credentials=True,
#     allow_methods=["*"],  # allows OPTIONS, POST, etc.
#     allow_headers=["*"],
# )
# # --------------------------------------------------
# # 2. DATABASE (MongoDB)
# # --------------------------------------------------
# client = MongoClient("mongodb://localhost:27017")
# db = client["scrum_bot"]

# subtasks_col = db["subtasks"]
# standups_col = db["standups"]
# blockers_col = db["blockers"]

# # --------------------------------------------------
# # 3. INSERT DUMMY DATA (ONLY ONCE)
# # --------------------------------------------------
# if subtasks_col.count_documents({}) == 0:
#     subtasks_col.insert_many([
#         {
#             "_id": "ST1",
#             "title": "Login API integration",
#             "status": "In Progress",
#             "percent_complete": 40,
#             "assignee": "dev1"
#         },
#         {
#             "_id": "ST2",
#             "title": "JWT authentication",
#             "status": "Not Started",
#             "percent_complete": 0,
#             "assignee": "dev1"
#         },
#         {
#     "_id": "ST3",
#     "title": "Frontend login UI",
#     "status": "In Progress",
#     "percent_complete": 60,
#     "assignee": "dev1"
#   },
#   {
#     "_id": "ST4",
#     "title": "User registration API",
#     "status": "Not Started",
#     "percent_complete": 0,
#     "assignee": "dev1"
#   },
#   {
#     "_id": "ST5",
#     "title": "Password reset flow",
#     "status": "Not Started",
#     "percent_complete": 0,
#     "assignee": "dev1"
#   },
#   {
#     "_id": "ST6",
#     "title": "API testing and validation",
#     "status": "Not Started",
#     "percent_complete": 0,
#     "assignee": "dev1"
#   }
#     ])

# # --------------------------------------------------
# # 4. NLP MODELS
# # --------------------------------------------------
# nlp = spacy.load("en_core_web_sm")
# embedder = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")

# # --------------------------------------------------
# # 5. REQUEST MODEL
# # --------------------------------------------------
# class ChatRequest(BaseModel):
#     developer_id: str
#     message: str

# # --------------------------------------------------
# # 6. NLP HELPERS
# # --------------------------------------------------
# def detect_status(text: str):
#     text = text.lower()

#     # IMPORTANT: Done must be detected BEFORE Blocked
#     if any(w in text for w in ["done", "completed", "finished"]):
#         return "Done"

#     if any(w in text for w in ["blocked", "stuck", "issue", "error"]):
#         return "Blocked"

#     return "In Progress"


# def extract_percent(text: str):
#     text = text.lower()

#     if "half" in text:
#         return 50
#     if "almost" in text:
#         return 80
#     if any(w in text for w in ["done", "completed", "finished"]):
#         return 100

#     return None


# def clean_blocker_reason(text: str):
#     # Remove completed part
#     text = re.sub(r"(done|completed|finished)[^,]*,?", "", text, flags=re.I)
#     return text.strip().capitalize()


# def match_subtask(text: str):
#     subtasks = list(subtasks_col.find())
#     titles = [s["title"] for s in subtasks]

#     text_embedding = embedder.encode(text, convert_to_tensor=True)
#     task_embeddings = embedder.encode(titles, convert_to_tensor=True)

#     scores = util.cos_sim(text_embedding, task_embeddings)[0]
#     best_idx = scores.argmax().item()

#     return subtasks[best_idx], float(scores[best_idx])

# # --------------------------------------------------
# # 7. PARSE ONE SENTENCE
# # --------------------------------------------------
# def parse_sentence(sentence: str):
#     subtask, score = match_subtask(sentence)

#     if score < 0.40:
#         return None

#     return {
#         "subtask_id": subtask["_id"],
#         "title": subtask["title"],
#         "status": detect_status(sentence),
#         "percent_complete": extract_percent(sentence),
#         "raw_sentence": sentence
#     }

# # --------------------------------------------------
# # 8. CHAT ENDPOINT (MULTI-SENTENCE LOGIC)
# # --------------------------------------------------
# @app.post("/chat")
# def chat(req: ChatRequest):

#     # Split on comma + dot
#     sentences = [
#         s.strip()
#         for s in re.split(r"[.,]", req.message)
#         if s.strip()
#     ]

#     parsed_results = []
#     replies = []

#     for sentence in sentences:
#         parsed = parse_sentence(sentence)
#         if not parsed:
#             continue

#         # ---------------- UPDATE SUBTASK ----------------
#         update_fields = {"status": parsed["status"]}

#         if parsed["percent_complete"] is not None:
#             update_fields["percent_complete"] = parsed["percent_complete"]

#         subtasks_col.update_one(
#             {"_id": parsed["subtask_id"]},
#             {"$set": update_fields}
#         )

#         # ---------------- BLOCKER HANDLING ----------------
#         if parsed["status"] == "Blocked":
#             blockers_col.insert_one({
#                 "subtask_id": parsed["subtask_id"],
#                 "reason": clean_blocker_reason(sentence),
#                 "reported_by": req.developer_id,
#                 "date": datetime.utcnow()
#             })

#         parsed_results.append(parsed)

#         replies.append(
#             f"{'⚠' if parsed['status']=='Blocked' else '✅'} "
#             f"{parsed['title']} marked as {parsed['status']}"
#         )

#     # ---------------- STANDUP ENTRY ----------------
#     standups_col.insert_one({
#         "developer_id": req.developer_id,
#         "raw_message": req.message,
#         "parsed_updates": parsed_results,
#         "date": datetime.utcnow()
#     })

#     if not replies:
#         return {"reply": "❓ I couldn’t confidently match any subtask."}

#     return {"reply": "\n".join(replies)}

# # --------------------------------------------------
# # 9. HEALTH CHECK
# # --------------------------------------------------
# @app.get("/")
# def root():
#     return {"status": "Scrum NLP Chatbot Backend Running"}

# import os
# import re
# os.environ["CUDA_VISIBLE_DEVICES"] = ""  # FORCE CPU

# from fastapi import FastAPI
# from pydantic import BaseModel
# from pymongo import MongoClient
# from bson import ObjectId
# from datetime import datetime

# import spacy
# from sentence_transformers import SentenceTransformer, util

# # --------------------------------------------------
# # 1. FASTAPI INIT
# # --------------------------------------------------
# app = FastAPI(title="Scrum NLP Chatbot Backend")

# from fastapi.middleware.cors import CORSMiddleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --------------------------------------------------
# # 2. DATABASE
# # --------------------------------------------------
# client = MongoClient("mongodb://localhost:27017")
# db = client["scrumbotdb"]

# tasks_col = db["tasks"]
# subtasks_col = db["subtasks"]
# standups_col = db["standups"]
# blockers_col = db["blockers"]

# # --------------------------------------------------
# # 3. NLP MODELS
# # --------------------------------------------------
# nlp = spacy.load("en_core_web_sm")
# embedder = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")

# # --------------------------------------------------
# # 4. REQUEST MODEL
# # --------------------------------------------------
# class ChatRequest(BaseModel):
#     developer_id: str
#     message: str

# # --------------------------------------------------
# # 5. NLP HELPERS
# # --------------------------------------------------

# def has_no_blockers(text: str) -> bool:
#     t = text.lower()
#     return any(p in t for p in [
#         "no blocker",
#         "no blockers",
#         "not blocked",
#         "without blockers",
#         "nothing blocked"
#     ])

# def detect_status(text: str):
#     t = text.lower()

#     if any(w in t for w in ["blocked", "stuck", "issue", "error"]):
#         return "Blocked"

#     if any(w in t for w in [
#         "working on", "working", "currently", "doing",
#         "in progress", "implementing", "building", "creating"
#     ]):
#         return "In Progress"

#     if any(w in t for w in ["done", "completed", "finished"]):
#         return "Done"

#     return None


# def extract_percent(text: str):
#     t = text.lower()

#     if "half" in t:
#         return 50
#     if "almost" in t:
#         return 80
#     if any(w in t for w in ["working", "in progress"]):
#         return 60
#     if any(w in t for w in ["done", "completed", "finished"]):
#         return 100

#     return None


# def clean_blocker_reason(text: str):
#     text = re.sub(r"(blocked|stuck|issue|error)", "", text, flags=re.I)
#     return text.strip().capitalize()


# def fetch_all_subtasks():
#     return list(subtasks_col.find({}))


# def match_subtask(sentence: str):
#     subtasks = fetch_all_subtasks()
#     if not subtasks:
#         return None, 0.0

#     titles = [s["title"] for s in subtasks]

#     sent_emb = embedder.encode(sentence, convert_to_tensor=True)
#     task_emb = embedder.encode(titles, convert_to_tensor=True)

#     scores = util.cos_sim(sent_emb, task_emb)[0]
#     best_idx = scores.argmax().item()

#     return subtasks[best_idx], float(scores[best_idx])

# # --------------------------------------------------
# # 6. SENTENCE PARSER
# # --------------------------------------------------
# def parse_sentence(sentence: str, global_no_blockers: bool):
#     subtask, score = match_subtask(sentence)

#     if not subtask or score < 0.40:
#         return None

#     status = detect_status(sentence)

#     # 🚫 Explicit NO BLOCKERS OVERRIDE
#     if global_no_blockers and status == "Blocked":
#         return None

#     task = tasks_col.find_one({"_id": subtask["task_id"]})

#     return {
#         "subtask_id": str(subtask["_id"]),
#         "subtask_title": subtask["title"],
#         "task_title": task["title"] if task else None,
#         "status": status,
#         "percent_complete": extract_percent(sentence),
#         "raw_sentence": sentence,
#         "confidence": round(score, 2)
#     }

# # --------------------------------------------------
# # 7. CHAT ENDPOINT
# # --------------------------------------------------
# @app.post("/chat")
# def chat(req: ChatRequest):

#     global_no_blockers = has_no_blockers(req.message)

#     sentences = [
#         s.strip()
#         for s in re.split(r"[.,]| and | then | also ", req.message, flags=re.I)
#         if s.strip()
#     ]

#     updates = []
#     replies = []

#     for s in sentences:
#         parsed = parse_sentence(s, global_no_blockers)
#         if not parsed:
#             continue

#         update_fields = {}
#         if parsed["status"]:
#             update_fields["status"] = parsed["status"]
#         if parsed["percent_complete"] is not None:
#             update_fields["percent_complete"] = parsed["percent_complete"]

#         if update_fields:
#             subtasks_col.update_one(
#                 {"_id": ObjectId(parsed["subtask_id"])},
#                 {"$set": update_fields}
#             )

#         # 🚨 Blocker insert only if explicitly blocked
#         if parsed["status"] == "Blocked" and not global_no_blockers:
#             blockers_col.insert_one({
#                 "subtask_id": ObjectId(parsed["subtask_id"]),
#                 "reason": clean_blocker_reason(s),
#                 "reported_by": req.developer_id,
#                 "created_at": datetime.utcnow()
#             })

#         updates.append(parsed)

#         replies.append(
#             f"{'⚠️' if parsed['status']=='Blocked' else '✅'} "
#             f"{parsed['subtask_title']} → {parsed['status']}"
#         )

#     standups_col.insert_one({
#         "developer_id": req.developer_id,
#         "message": req.message,
#         "updates": updates,
#         "no_blockers": global_no_blockers,
#         "created_at": datetime.utcnow()
#     })

#     if not replies:
#         return {"reply": "❓ I couldn’t confidently match any task."}

#     return {
#         "reply": "\n".join(replies),
#         "updates": updates
#     }

# # --------------------------------------------------
# # 8. HEALTH CHECK
# # --------------------------------------------------
# @app.get("/")
# def root():
#     return {"status": "Scrum NLP Chatbot Backend Running"}
import os
import re
os.environ["CUDA_VISIBLE_DEVICES"] = ""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

from pymongo import MongoClient
from bson import ObjectId

from sentence_transformers import SentenceTransformer, util

# ==================================================
# 1. FASTAPI INIT
# ==================================================
app = FastAPI(title="ScrumX AI Daily Standup Bot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================================================
# 2. DATABASE (MONGODB ONLY)
# ==================================================
mongo = MongoClient("mongodb://localhost:27017")
db = mongo["scrumbotdb"]

subtasks_col = db["subtasks"]
standups_col = db["standups"]
blockers_col = db["blockers"]

# ==================================================
# 3. NLP MODEL
# ==================================================
embedder = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")

# ==================================================
# 4. REQUEST MODEL
# ==================================================
class ChatRequest(BaseModel):
    developer_id: str
    message: str

# ==================================================
# 5. INTENT DETECTION
# ==================================================
def detect_intent(text: str) -> str:
    t = text.lower()

    QUERY_KEYWORDS = [
        "what did i", "show my standup", "view standup",
        "show tasks", "my progress"
    ]

    EDIT_KEYWORDS = [
        "edit", "change", "update yesterday",
        "modify standup", "correct standup"
    ]

    UPDATE_KEYWORDS = [
        "completed", "done", "finished",
        "working on", "today working", "started",
        "blocked", "no blockers"
    ]

    if any(keyword in t for keyword in QUERY_KEYWORDS):
        return "QUERY"

    if any(keyword in t for keyword in EDIT_KEYWORDS):
        return "EDIT"

    if any(keyword in t for keyword in UPDATE_KEYWORDS):
        return "STANDUP_UPDATE"

    return "UNKNOWN"

# ==================================================
# 6. NLP HELPERS
# ==================================================
def has_no_blockers(text: str) -> bool:
    return any(p in text.lower() for p in [
        "no blocker", "no blockers", "not blocked", "without blockers"
    ])
def detect_status(text: str) -> Optional[str]:
    t = text.lower()

    if any(w in t for w in ["blocked", "stuck", "issue", "error"]):
        return "Blocked"

    if any(w in t for w in [
        "working on", "working", "implementing",
        "building", "creating", "today working"
    ]):
        return "In Progress"

    if any(w in t for w in ["done", "completed", "finished"]):
        return "Done"

    return None

def extract_percent(status: str) -> Optional[int]:
    if status == "Done":
        return 100
    if status == "In Progress":
        return 60
    return None

def match_subtask(sentence: str):
    subtasks = list(subtasks_col.find({}))
    if not subtasks:
        return None, 0.0

    titles = [s["title"] for s in subtasks]
    sent_emb = embedder.encode(sentence, convert_to_tensor=True)
    task_emb = embedder.encode(titles, convert_to_tensor=True)

    scores = util.cos_sim(sent_emb, task_emb)[0]
    idx = scores.argmax().item()

    return subtasks[idx], float(scores[idx])

# ==================================================
# 7. QUERY HANDLER
# ==================================================
def handle_query(dev_id: str):
    last = standups_col.find_one(
        {"developer_id": dev_id},
        sort=[("created_at", -1)]
    )

    subtasks = list(subtasks_col.find(
        {"assignee": dev_id},
        {"title": 1, "status": 1, "percent_complete": 1}
    ))

    return {
        "last_standup": last,
        "current_tasks": subtasks
    }

# ==================================================
# 8. EDIT HANDLER (BASIC)
# ==================================================
def handle_edit(dev_id: str, message: str):
    last = standups_col.find_one(
        {"developer_id": dev_id},
        sort=[("created_at", -1)]
    )

    if not last:
        return {"message": "No standup found to edit"}

    standups_col.update_one(
        {"_id": last["_id"]},
        {"$set": {"message": message, "edited_at": datetime.utcnow()}}
    )

    return {"message": "Last standup updated"}

# ==================================================
# 9. CHAT ENDPOINT
# ==================================================
@app.post("/chat")
def chat(req: ChatRequest):

    intent = detect_intent(req.message)

    if intent == "QUERY":
        return handle_query(req.developer_id)

    if intent == "EDIT":
        return handle_edit(req.developer_id, req.message)

    if intent != "STANDUP_UPDATE":
        return {"intent": intent, "message": "No action detected"}

    sentences = [
        s.strip()
        for s in re.split(r"[.,]| and | then | also ", req.message, flags=re.I)
        if s.strip()
    ]

    no_blockers = has_no_blockers(req.message)
    updates = []
    replies = []

    for s in sentences:
        subtask, score = match_subtask(s)
        if not subtask or score < 0.40:
            continue

        status = detect_status(s)
        if not status:
            continue

        if status == "Blocked" and no_blockers:
            continue

        percent = extract_percent(status)

        subtasks_col.update_one(
            {"_id": subtask["_id"]},
            {"$set": {
                "status": status,
                "percent_complete": percent,
                "updated_at": datetime.utcnow()
            }}
        )

        if status == "Blocked":
            blockers_col.insert_one({
                "subtask_id": subtask["_id"],
                "reason": s,
                "reported_by": req.developer_id,
                "created_at": datetime.utcnow()
            })

        updates.append({
            "subtask_id": str(subtask["_id"]),
            "title": subtask["title"],
            "status": status,
            "confidence": round(score, 2)
        })

        replies.append(f"✅ {subtask['title']} → {status}")

    standups_col.insert_one({
        "developer_id": req.developer_id,
        "message": req.message,
        "intent": intent,
        "no_blockers": no_blockers,
        "updates": updates,
        "created_at": datetime.utcnow()
    })

    if not updates:
        return {"reply": "❓ No confident task match found"}

    return {
        "intent": intent,
        "reply": "\n".join(replies),
        "updates": updates
    }

# ==================================================
# 10. HEALTH CHECK
# ==================================================
@app.get("/")
def root():
    return {"status": "ScrumX AI Bot Running"}
