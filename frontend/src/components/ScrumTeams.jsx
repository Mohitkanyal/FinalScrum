import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipboardCheck, UserCheck, Calendar } from "lucide-react";
import SideBar from "./SideBar";
import SummaryApi from "../common";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ScrumTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(SummaryApi.allTeams.url, { withCredentials: true })
      .then(res => res.data?.success ? setTeams(res.data.data) : toast.error("Failed to load teams"))
      .catch(() => toast.error("Failed to load teams"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="ml-20 p-6 text-white">Loading teams...</div>;

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <SideBar />
      <main className={`flex-1 p-6 transition-all ${isOpen ? "ml-64" : "ml-20"}`}>
        <h1 className="text-2xl font-semibold text-blue-400 mb-6">
          Scrum Teams
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(team => (
            <div key={team._id} className="bg-[#1f1f1f] p-6 rounded-xl border border-white/10">
              <h2 className="text-lg font-semibold mb-3">{team.teamName}</h2>

              <div className="text-sm text-gray-300 space-y-2">
                <p><ClipboardCheck size={14} className="inline mr-2" /> {team.projectName}</p>
                <p><UserCheck size={14} className="inline mr-2" /> {team.teamLeader?.name || "N/A"}</p>
                <p><Calendar size={14} className="inline mr-2" /> {team.completionDate || "N/A"}</p>
                <p>Members: {team.members?.length || 0}</p>
              </div>

              <button
                onClick={() => navigate("/Performance")}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-sm"
              >
                View Performance
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
