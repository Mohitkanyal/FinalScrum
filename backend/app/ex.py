from flask import Flask, request, jsonify
from pymongo import MongoClient
from datetime import datetime
import nltk
import re
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS

# ------------------ INIT ------------------

nltk.download("stopwords")
from nltk.corpus import stopwords

STOPWORDS = set(stopwords.words("english"))

EMBED_MODEL = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")

SIMILARITY_THRESHOLD = 0.65
AMBIGUITY_GAP = 0.08

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client["scrumbotdb"]

# ------------------ NLP UTILITIES ------------------

def normalize(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", "", text)
    tokens = [t for t in text.split() if t not in STOPWORDS]
    return " ".join(tokens)

def extract_phrases(sentences):
    return [normalize(s) for s in sentences if normalize(s)]

def semantic_parse(text):
    text_l = text.lower()

    yesterday, today, blockers = [], [], []

    sentences = re.split(r"[,.]", text_l)

    for s in sentences:
        if any(k in s for k in ["done", "completed", "finished", "yesterday"]):
            yesterday.append(s)
        elif any(k in s for k in ["will", "today", "plan", "working"]):
            today.append(s)
        elif any(k in s for k in ["blocked", "stuck", "issue", "problem"]):
            blockers.append(s)

    return {
        "yesterday_phrases": extract_phrases(yesterday),
        "today_phrases": extract_phrases(today),
        "blocker_phrases": extract_phrases(blockers)
    }

# ------------------ SEMANTIC MATCHING ------------------

def load_sprint_subtasks(sprint_id):
    return list(db.subtasks.find({"sprint_id": sprint_id}))

def match_phrase_to_subtasks(phrase, subtasks):
    if not subtasks:
        return []

    titles = [s["title"] for s in subtasks if s.get("title")]
    if not titles:
        return []

    phrase_vec = EMBED_MODEL.encode([phrase])
    title_vecs = EMBED_MODEL.encode(titles)

    sims = cosine_similarity(phrase_vec, title_vecs)[0]

    matches = []
    for i, score in enumerate(sims):
        matches.append({
            "subtask_id": subtasks[i]["_id"],
            "title": subtasks[i]["title"],
            "score": float(score)
        })

    matches.sort(key=lambda x: x["score"], reverse=True)
    return matches

def evaluate_confidence(matches):
    if not matches:
        return None, "no_match"

    top = matches[0]

    if top["score"] < SIMILARITY_THRESHOLD:
        return None, "low_confidence"

    if len(matches) > 1:
        gap = top["score"] - matches[1]["score"]
        if gap < AMBIGUITY_GAP:
            return None, "ambiguous"

    return top, "confident"

# ------------------ DB UPDATE ------------------

def update_subtask(subtask_id, status, percent):
    subtask = db.subtasks.find_one({"_id": subtask_id})
    if not subtask:
        return

    db.subtasks.update_one(
        {"_id": subtask_id},
        {
            "$set": {
                "status": status,
                "percent_complete": percent,
                "updated_at": datetime.utcnow()
            }
        }
    )

def recalc_sprint_progress(sprint_id):
    subtasks = list(db.subtasks.find({"sprint_id": sprint_id}))
    if not subtasks:
        return 0

    avg = sum(s["percent_complete"] for s in subtasks) / len(subtasks)
    db.sprints.update_one(
        {"_id": sprint_id},
        {"$set": {"progress": round(avg, 2)}}
    )
    return avg

# ------------------ API ------------------

@app.route("/standup", methods=["POST"])
def standup():
    data = request.json

    if not data:
        return jsonify({"message": "Invalid request body"}), 400

    developer_id = data.get("developer_id")
    sprint_id = data.get("sprint_id")
    standup_text = data.get("standup_text")

    if not all([developer_id, sprint_id, standup_text]):
        return jsonify({"message": "Missing required fields"}), 400

    parsed = semantic_parse(standup_text)
    subtasks = load_sprint_subtasks(sprint_id)

    if not subtasks:
        return jsonify({
            "message": "No subtasks found for this sprint"
        }), 400

    updates = {"yesterday": [], "today": []}
    clarification = []

    def process(phrases, target):
        for phrase in phrases:
            matches = match_phrase_to_subtasks(phrase, subtasks)
            top, status = evaluate_confidence(matches)

            if status != "confident":
                clarification.append({
                    "phrase": phrase,
                    "options": matches[:3]
                })
            else:
                updates[target].append(top)

    process(parsed["yesterday_phrases"], "yesterday")
    process(parsed["today_phrases"], "today")

    if clarification:
        return jsonify({
            "status": "clarification_required",
            "options": clarification
        })

    for u in updates["yesterday"]:
        update_subtask(u["subtask_id"], "Done", 100)

    for u in updates["today"]:
        update_subtask(u["subtask_id"], "In Progress", 5)

    db.standups.insert_one({
        "developer_id": developer_id,
        "sprint_id": sprint_id,
        "raw_text": standup_text,
        "parsed_output": parsed,
        "created_at": datetime.utcnow()
    })

    progress = recalc_sprint_progress(sprint_id)

    return jsonify({
        "status": "updated",
        "summary": {
            "completed": [u["title"] for u in updates["yesterday"]],
            "planned": [u["title"] for u in updates["today"]],
            "blockers": parsed["blocker_phrases"],
            "sprint_progress": progress
        }
    })
if __name__ == "__main__": app.run(debug=True)