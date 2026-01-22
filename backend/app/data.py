from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ------------------ DB CONNECTION ------------------
client = MongoClient("mongodb://localhost:27017/")
db = client["scrumbotdb"]

sprints = db["sprints"]
stories = db["user_stories"]
tasks = db["tasks"]
blockers = db["blockers"]
standups = db["standups"]
teams = db["teams"]

# ------------------ INTELLIGENCE WRAP API ------------------
@app.route("/api/intelligence-wrap/<sprint_id>")
def intelligence_wrap(sprint_id):

    try:
        sprint_oid = ObjectId(sprint_id)
    except:
        return jsonify({"success": False, "message": "Invalid sprint ID"}), 400

    sprint = sprints.find_one({"_id": sprint_oid})
    if not sprint:
        return jsonify({"success": False, "message": "Sprint not found"}), 404

    sprint_stories = list(stories.find({"sprint_id": sprint_oid}))
    story_ids = [s["_id"] for s in sprint_stories]

    sprint_tasks = list(tasks.find({"story_id": {"$in": story_ids}}))
    sprint_blockers = list(blockers.find({"sprint_id": sprint_oid}))
    sprint_standups = list(standups.find({"sprint_id": sprint_oid}))

    planned_sp = sum(s.get("story_points", 0) for s in sprint_stories)
    delivered_sp = sum(s.get("story_points", 0) for s in sprint_stories if s.get("status") == "Done")

    scope_creep = sum(
        s.get("story_points", 0)
        for s in sprint_stories
        if s.get("created_at") > sprint["start_date"]
    )

    est_hours = sum(t.get("estimated_hours", 0) for t in sprint_tasks)
    act_hours = sum(t.get("actual_hours", 0) for t in sprint_tasks)
    overrun = act_hours - est_hours

    workload = {}
    for t in sprint_tasks:
        dev = t.get("assignee", "Unassigned")
        workload[dev] = workload.get(dev, 0) + t.get("actual_hours", 0)

    mttr = round(
        sum(b.get("resolution_days", 0) for b in sprint_blockers) / len(sprint_blockers),
        1
    ) if sprint_blockers else 0

    consistency = round(
        (len([s for s in sprint_standups if s.get("quality") == "Good"]) /
         len(sprint_standups)) * 100, 1
    ) if sprint_standups else 0

    return jsonify({
        "sprint": {
            "name": sprint.get("name"),
            "goal": sprint.get("goal"),
            "duration": sprint.get("start_date") + " → " + sprint.get("end_date"),
            "plannedSP": planned_sp,
            "deliveredSP": delivered_sp,
            "scopeCreep": scope_creep
        },
        "predictability": {
            "reliability": round((delivered_sp / planned_sp) * 100, 1) if planned_sp else 0,
            "carryover": 100 - round((delivered_sp / planned_sp) * 100, 1) if planned_sp else 0
        },
        "effort": {
            "estimatedHours": est_hours,
            "actualHours": act_hours,
            "overrun": overrun
        },
        "workload": workload,
        "blockers": {
            "count": len(sprint_blockers),
            "mttr": mttr
        },
        "standups": {
            "consistency": consistency,
            "vague": round(consistency / 2, 1)
        }
    })

# ------------------ TEAM PERFORMANCE API ------------------
@app.route("/api/team-performance/<team_id>")
def team_performance(team_id):

    team = teams.find_one({"_id": ObjectId(team_id)})
    if not team:
        return jsonify({"success": False, "message": "Team not found"}), 404

    return jsonify({
        "team": team["name"],
        "velocity": team.get("velocity", []),
        "utilization": team.get("utilization", 0),
        "quality": team.get("quality_index", 0),
        "risks": team.get("risk_score", 0)
    })

# ------------------
if __name__ == "__main__":
    app.run(debug=True)
