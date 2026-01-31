import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, AlertTriangle, Clock } from "lucide-react";
import SideBar from "../components/SideBar";
import SummaryApi from "../common";
import { useSelector } from "react-redux";

const MyTasks = () => {
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  const [tasks, setTasks] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      const res = await axios.get(SummaryApi.myTasks.url);

      if (res.data.success) {
        setTasks(res.data.data.subtasks);
        setMetrics(res.data.data.metrics);
      }
    } catch (err) {
      console.error("Failed to load developer tasks", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b0f1a] text-gray-200">
      <SideBar />

      <main className={`flex-1 ${isOpen ? "ml-64" : "ml-20"} p-8 transition-all`}>
        <h1 className="text-2xl font-black text-white mb-1">My Tasks</h1>
        <p className="text-xs text-gray-500 mb-8">
          Static Developer View (ScrumX Demo)
        </p>

        {/* METRICS */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <Metric label="Total Tasks" value={metrics.total} icon={<Clock />} />
          <Metric label="Completed" value={metrics.completed} icon={<CheckCircle />} />
          <Metric label="Blocked" value={metrics.blocked} danger icon={<AlertTriangle />} />
        </div>

        {/* TASK TABLE */}
        <div className="bg-[#111827] rounded-3xl border border-white/5 overflow-hidden">
          <table className="w-full">
            <thead className="bg-black/20 text-[10px] uppercase text-gray-500">
              <tr>
                <th className="px-8 py-4">Task</th>
                <th className="px-8 py-4">Hours</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tasks.map(task => (
                <tr key={task._id} className="hover:bg-white/[0.03]">
                  <td className="px-8 py-5 text-sm">{task.title}</td>
                  <td className="px-8 py-5 text-xs text-blue-400 font-mono">
                    {task.estimated_hours}h
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-8 py-5">
                    <ProgressBar percent={task.percent_complete || 0} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {tasks.length === 0 && (
            <div className="text-center py-10 text-gray-500 text-sm">
              No tasks assigned to this developer
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

/* ---------- UI Helpers ---------- */

const Metric = ({ label, value, icon, danger }) => (
  <div className={`p-6 rounded-3xl border ${danger ? "border-red-500/30" : "border-white/5"} bg-[#111827]"`}>
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-white/5 rounded-xl">{icon}</div>
      <p className="text-xs uppercase text-gray-500 font-bold">{label}</p>
    </div>
    <h2 className="text-3xl font-black text-white">{value || 0}</h2>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    "Done": "bg-green-500/10 text-green-400",
    "Blocked": "bg-red-500/10 text-red-400",
    "In Progress": "bg-blue-500/10 text-blue-400"
  };
  return (
    <span className={`px-3 py-1 rounded-xl text-[10px] font-black ${map[status]}`}>
      {status}
    </span>
  );
};

const ProgressBar = ({ percent }) => (
  <div className="flex items-center gap-3">
    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
      <div className="h-full bg-green-500" style={{ width: `${percent}%` }} />
    </div>
    <span className="text-[10px] text-gray-400 font-bold">{percent}%</span>
  </div>
);

export default MyTasks;
