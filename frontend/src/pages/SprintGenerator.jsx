import React, { useState } from "react";
import axios from "axios";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import Sidebar from "../components/SideBar";

export default function SprintGeneration() {
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);

  const [form, setForm] = useState({
    project_id: 1,
    sprint_name: "",
    sprint_length_days: 10,
    team_size: 4
  });

  const [stories, setStories] = useState([
    { story_id: "US1", title: "", description: "", priority: "High" }
  ]);

  const handleStoryChange = (index, field, value) => {
    const updated = [...stories];
    updated[index][field] = value;
    setStories(updated);
  };

  const addStory = () => {
    setStories([
      ...stories,
      { story_id: `US${stories.length + 1}`, title: "", description: "", priority: "Medium" }
    ]);
  };

  const removeStory = (index) => {
    setStories(stories.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const res = await axios.post("http://localhost:5000/generate_sprint", {
        ...form,
        user_stories: stories
      });

      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate sprint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar />
      <main
        className={`flex-1 transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Header */}
        <header className="px-6 py-4 bg-[#1b1b1b] border-b border-gray-700">
          <h2 className="text-2xl font-bold text-blue-400">🌀 Sprint Generator</h2>
        </header>

        <div className="p-6 max-w-5xl mx-auto space-y-6">
          {/* Sprint Details */}
          <div className="bg-[#1f1f1f] p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-semibold mb-4 text-blue-300">
              Sprint Configuration
            </h3>

            <input
              placeholder="Sprint Name"
              className="w-full p-3 mb-3 rounded bg-[#2a2a2a] border border-gray-600"
              value={form.sprint_name}
              onChange={(e) =>
                setForm({ ...form, sprint_name: e.target.value })
              }
            />

            <div className="grid grid-cols-1 gap-4">
              <p>Number Of Days:</p><input
                type="number"
                placeholder="Sprint Length (days)"
                className="p-3 rounded bg-[#2a2a2a] border border-gray-600"
                value={form.sprint_length_days}
                onChange={(e) =>
                  setForm({ ...form, sprint_length_days: Number(e.target.value) })
                }
              />
              <p>Team Size:</p>
              <input
                type="number"
                placeholder="Team Size"
                className="p-3 rounded bg-[#2a2a2a] border border-gray-600"
                value={form.team_size}
                onChange={(e) =>
                  setForm({ ...form, team_size: Number(e.target.value) })
                }
              />
            </div>
          </div>

          {/* User Stories */}
          <div className="bg-[#1f1f1f] p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-semibold mb-4 text-blue-300">
              User Stories
            </h3>

            {stories.map((story, index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-[#2a2a2a] rounded-xl border border-gray-700"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{story.story_id}</span>
                  {stories.length > 1 && (
                    <Trash2
                      onClick={() => removeStory(index)}
                      className="cursor-pointer text-red-400 hover:text-red-600"
                    />
                  )}
                </div>

                <input
                  placeholder="Story Title"
                  className="w-full p-2 mb-2 rounded bg-[#1f1f1f]"
                  value={story.title}
                  onChange={(e) =>
                    handleStoryChange(index, "title", e.target.value)
                  }
                />

                <textarea
                  placeholder="Story Description"
                  className="w-full p-2 mb-2 rounded bg-[#1f1f1f]"
                  value={story.description}
                  onChange={(e) =>
                    handleStoryChange(index, "description", e.target.value)
                  }
                />

                <select
                  className="p-2 rounded bg-[#1f1f1f]"
                  value={story.priority}
                  onChange={(e) =>
                    handleStoryChange(index, "priority", e.target.value)
                  }
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            ))}

            <button
              onClick={addStory}
              className="flex items-center text-blue-400 hover:text-blue-600"
            >
              <Plus className="mr-2" /> Add Story
            </button>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-xl font-semibold flex items-center justify-center hover:scale-105 transition"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Generate Sprint"}
          </button>

          {/* Response */}
          {error && <p className="text-red-400">{error}</p>}

          {response && (
            <div className="bg-[#1f1f1f] p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold text-green-400 mb-2">
                Sprint Created Successfully ✅
              </h3>
              <p>
                <strong>Sprint ID:</strong> {response.sprint_id}
              </p>
              <p className="mt-2">
                <strong>Goal:</strong> {response.goal}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
