import React from "react";
import SideBar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Users, CheckCircle, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const performanceMetrics = [
  { title: "Team Engagement", value: "85%", icon: <Users className="text-blue-400" /> },
  { title: "Blockers Resolved", value: "12 / 15", icon: <CheckCircle className="text-green-400" /> },
  { title: "Sprint Velocity", value: "32 Points", icon: <TrendingUp className="text-purple-400" /> },
];

const barData = [
  { name: "Sprint 1", Completed: 20, Pending: 5, Overdue: 2 },
  { name: "Sprint 2", Completed: 25, Pending: 3, Overdue: 1 },
  { name: "Sprint 3", Completed: 32, Pending: 2, Overdue: 0 },
  { name: "Sprint 4", Completed: 28, Pending: 4, Overdue: 1 },
];

const pieData = [
  { name: "Completed", value: 60 },
  { name: "Pending", value: 25 },
  { name: "Overdue", value: 15 },
];

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

export default function Performance() {
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-200">
      <SideBar />
      <main className={`flex-1 transition-all ${isOpen ? "ml-64" : "ml-20"} p-8`}>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Team Performance Overview</h1>
          <p className="text-slate-400 mt-1">
            Sprint-wise productivity, workload distribution, and efficiency metrics
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {performanceMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="bg-[#111827] border border-slate-700 rounded-xl p-5 flex items-center gap-4 hover:border-slate-500 transition"
            >
              <div className="p-3 rounded-lg bg-[#1e293b]">{metric.icon}</div>
              <div>
                <p className="text-sm text-slate-400">{metric.title}</p>
                <p className="text-xl font-semibold">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#111827] border border-slate-700 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Sprint Completion Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fill: "#cbd5e1" }} />
                <YAxis tick={{ fill: "#cbd5e1" }} />
                <Tooltip />
                <Bar dataKey="Completed" fill="#22c55e" onClick={(b) => navigate(`/sprint/${b.payload.name.split(" ")[1]}`)} />
                <Bar dataKey="Pending" fill="#f59e0b" />
                <Bar dataKey="Overdue" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#111827] border border-slate-700 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Task Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-8 bg-[#111827] border border-slate-700 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Sprint Insights</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>Team engagement remains consistently high across sprints.</li>
            <li>Pending tasks are decreasing sprint-over-sprint.</li>
            <li>Velocity trend indicates stable delivery capacity.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
