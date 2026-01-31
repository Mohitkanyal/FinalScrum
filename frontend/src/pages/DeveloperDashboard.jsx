import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Calendar,
  CheckCircle,
  Layout,
  Flame,
  Zap,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Clock
} from "lucide-react";
import SideBar from "../components/SideBar";
import { useSelector } from "react-redux";
import axios from "axios";
import SummaryApi from "../common";
import { NavLink } from "react-router-dom";

const DeveloperDashboard = () => {
  /* ---------------- REDUX ---------------- */
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const user = useSelector((state) => state?.user?.user);

  /* ---------------- STATE ---------------- */
  const [tasks, setTasks] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  /* ---------------- FETCH (SAME AS MyTasks) ---------------- */
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

  /* ---------------- CALENDAR ---------------- */
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const daysInMonth = endOfMonth.getDate();
  const startDay = startOfMonth.getDay();

  const prevMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const monthYear = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  /* ---------------- DERIVED DATA ---------------- */
  const focusTask = tasks.find(t => t.status === "In Progress");

  const topCards = [
    {
      title: "Active Sprint",
      subtitle: "Current Sprint",
      status: `${metrics.total || 0} Tasks`,
      icon: <Zap className="text-yellow-400" />
    },
    {
      title: "My Tasks",
      subtitle: "Assigned to me",
      status: `${metrics.total || 0} Tasks Total`,
      icon: <Layout className="text-blue-400" />
    },
    {
      title: "Blockers",
      subtitle: "Needs Attention",
      status: `${metrics.blocked || 0} Active`,
      icon: <Flame className="text-red-400" />
    },
    {
      title: "Completed",
      subtitle: "Progress",
      status: `${metrics.completed || 0} Done`,
      icon: <CheckCircle className="text-green-400" />
    }
  ];

  if (loading)
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-blue-500 font-bold animate-pulse">
        Initialising Mission Control...
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <SideBar />

      <main className={`flex-1 transition-all ${isOpen ? "ml-64" : "ml-20"}`}>
        {/* HEADER */}
        <header className="flex justify-between px-6 py-4 bg-[#1b1b1b] border-b border-gray-700">
          <div>
            <h1 className="text-2xl font-bold">Developer Mission Control</h1>
            <p className="text-xs text-gray-400 uppercase">
              Viewing as: {user?.role || "Developer"}
            </p>
          </div>
          <div className="relative hidden md:block">
            <Search className="absolute top-2.5 left-2.5 text-gray-400" size={18} />
            <input
              className="pl-9 pr-4 py-2 bg-[#2a2a2a] rounded-md text-sm"
              placeholder="Search tasks..."
            />
          </div>
        </header>

        <div className="flex">
          {/* MAIN */}
          <div className="flex-1 p-6">
            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {topCards.map((c, i) => (
                <div key={i} className="bg-[#1f1f1f] p-5 rounded-xl border border-white/5">
                  <div className="mb-3 p-2 bg-white/5 w-fit rounded-lg">{c.icon}</div>
                  <h2 className="font-semibold">{c.title}</h2>
                  <p className="text-sm text-gray-400">{c.subtitle}</p>
                  <div className="mt-2 text-xs font-bold text-blue-500">{c.status}</div>
                </div>
              ))}
            </div>

            {/* CALENDAR */}
            <div className="bg-[#1f1f1f] p-6 rounded-xl border border-white/5">
              <div className="flex justify-between mb-6">
                <h2 className="font-bold flex gap-2">
                  <Calendar className="text-blue-500" /> Sprint Timeline
                </h2>
                <div className="flex gap-2">
                  <button onClick={prevMonth}><ChevronLeft /></button>
                  <span>{monthYear}</span>
                  <button onClick={nextMonth}><ChevronRight /></button>
                </div>
              </div>

              <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-3">
                {daysOfWeek.map(d => <div key={d}>{d}</div>)}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: startDay }).map((_, i) => <div key={i} />)}

                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const dayTasks = tasks.filter(t => {
                    if (!t.due_date) return false;
                    const d = new Date(t.due_date);
                    return (
                      d.getDate() === day &&
                      d.getMonth() === currentMonth.getMonth() &&
                      d.getFullYear() === currentMonth.getFullYear()
                    );
                  });

                  return (
                    <div key={i} className="min-h-[80px] p-2 bg-[#262626] rounded-lg border border-white/5">
                      <span className="text-xs text-gray-400">{day}</span>
                      {dayTasks.map(task => (
                        <div
                          key={task._id}
                          className="mt-1 text-[9px] bg-blue-600/20 border border-blue-500/30 rounded px-1 truncate"
                        >
                          {task.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="w-80 bg-[#1b1b1b] border-l border-gray-700 p-6 hidden xl:block">
            <h3 className="text-xs text-gray-500 mb-4 uppercase">Focus Task</h3>

            {focusTask ? (
              <div className="bg-[#2a2a2a] p-4 rounded-xl">
                <p className="font-bold">{focusTask.title}</p>
                <p className="text-xs text-gray-400 mb-3 flex gap-1">
                  <Clock size={12} /> In Progress
                </p>
                <div className="w-full bg-gray-700 h-1 rounded-full">
                  <div
                    className="bg-blue-500 h-1 rounded-full"
                    style={{ width: `${focusTask.percent_complete || 0}%` }}
                  />
                </div>
                <p className="text-xs text-right mt-1 text-blue-400">
                  {focusTask.percent_complete || 0}%
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">No active task</p>
            )}

            <div className="mt-8">
              <NavLink
                to="/TeamMembers"
                className="flex items-center gap-2 text-xs text-blue-400 hover:underline"
              >
                <MessageSquare size={14} /> Team Chat
              </NavLink>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default DeveloperDashboard;
