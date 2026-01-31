import React, { useEffect, useState } from "react";
import axios from "axios";
import SummaryApi from "../common";
import SideBar from "../components/SideBar";
import { useSelector } from "react-redux";
import { Target, AlertTriangle, CheckCircle } from "lucide-react";

const CurrentSprint = () => {
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const [sprintData, setSprintData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentSprint();
  }, []);

  const fetchCurrentSprint = async () => {
    try {
      const res = await axios.get(SummaryApi.currentSprint.url);
      if (res.data.success) {
        setSprintData(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load current sprint", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-blue-500 font-bold animate-pulse">
        Loading Current Sprint...
      </div>
    );

  if (!sprintData)
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-gray-400">
        No active sprint assigned
      </div>
    );

  const { sprint, subtasks, metrics } = sprintData;

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <SideBar />

      <main className={`flex-1 transition-all ${isOpen ? "ml-64" : "ml-20"} p-6`}>
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Target className="text-blue-500" />
            {sprint.name}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{sprint.goal}</p>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <MetricCard title="Total Tasks" value={metrics.total} />
          <MetricCard title="Completed" value={metrics.completed} icon={<CheckCircle />} />
          <MetricCard title="Blocked" value={metrics.blocked} icon={<AlertTriangle />} />
          <MetricCard title="Progress" value={`${metrics.progress}%`} />
        </div>

        {/* PROGRESS BAR */}
        <div className="mb-8">
          <div className="w-full bg-gray-700 h-2 rounded-full">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${metrics.progress}%` }}
            />
          </div>
        </div>

        {/* TASK TABLE */}
        <div className="bg-[#1f1f1f] rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#2a2a2a] text-gray-400">
              <tr>
                <th className="p-3 text-left">Task</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Est. Hours</th>
              </tr>
            </thead>
            <tbody>
              {subtasks.map(task => (
                <tr key={task._id} className="border-t border-white/5">
                  <td className="p-3">{task.title}</td>
                  <td>{task.status}</td>
                  <td>{task.percent_complete || 0}%</td>
                  <td>{task.estimated_hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

const MetricCard = ({ title, value, icon }) => (
  <div className="bg-[#1f1f1f] p-4 rounded-xl border border-white/5">
    <div className="flex justify-between items-center">
      <h3 className="text-sm text-gray-400">{title}</h3>
      {icon && <span className="text-red-400">{icon}</span>}
    </div>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default CurrentSprint;
