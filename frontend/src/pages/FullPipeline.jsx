import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import { useSelector } from "react-redux";

export default function FullPipeline() {
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [updates, setUpdates] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError("Please enter your standup update.");
      return;
    }

    setLoading(true);
    setError("");
    setReply("");
    setUpdates([]);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          developer_id: "dev1",
          message
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Server error");

      setReply(data.reply);
      setUpdates(data.updates || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-gray-100">
      <Sidebar />

      <main className={`flex-1 transition-all ${isOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-10 max-w-4xl mx-auto">

          <h1 className="text-3xl font-bold mb-6 text-indigo-400">
            Daily Standup Assistant
          </h1>

          <textarea
            rows={4}
            className="w-full rounded-xl bg-slate-800 border border-gray-700 p-4 text-sm"
            placeholder="I completed login API, JWT auth is blocked by env issue..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition"
          >
            {loading ? "Analyzing..." : "Submit Standup"}
          </button>

          {error && (
            <div className="mt-4 text-red-400">{error}</div>
          )}

          {reply && (
            <div className="mt-6 bg-slate-800 border border-gray-700 rounded-xl p-5">
              <h3 className="font-semibold text-emerald-400 mb-2">Result</h3>
              <pre className="text-sm whitespace-pre-wrap">{reply}</pre>
            </div>
          )}

          {updates.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold text-indigo-300">
                Detected Updates
              </h3>

              {updates.map((u, i) => (
                <div
                  key={i}
                  className="bg-slate-800 border border-gray-700 rounded-lg p-4"
                >
                  <p className="font-medium">{u.subtask_title}</p>
                  <p className="text-sm text-gray-400">
                    Status: {u.status} | Confidence: {u.confidence}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}