// import React, { useState, useEffect } from "react";
// import { Search, Bell, Calendar, CheckCircle, Clock, Layout, Flame, Zap } from "lucide-react";
// import SideBar from "../components/SideBar";
// import { useSelector } from "react-redux";
// import { ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
// // import axios from "axios"; // 👈 DB CONNECT: Uncomment this
// // import SummaryApi from "../common"; // 👈 DB CONNECT: Uncomment this

// const DeveloperDashboard = () => {
//   const isOpen = useSelector((state) => state.sidebar.isOpen);
//   const user = useSelector((state) => state?.user?.user);

//   /* -----------------------------------------------------------
//      DATABASE / STATE LOGIC (Commented for your future use)
//   ----------------------------------------------------------- */
//   // const [dbData, setDbData] = useState(null);
//   // const [loading, setLoading] = useState(true);

//   /* useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         // Example: const res = await axios.get(SummaryApi.get_dev_stats.url);
//         // if (res.data.success) setDbData(res.data.data);
//       } catch (err) { console.error(err); }
//       finally { setLoading(false); }
//     };
//     fetchDashboardData();
//   }, []); 
//   */

//   /* -----------------------------------------------------------
//      CALENDAR LOGIC
//   ----------------------------------------------------------- */
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//   const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
//   const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
//   const daysInMonth = endOfMonth.getDate();
//   const startDay = startOfMonth.getDay();

//   const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
//   const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
//   const monthYear = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

//   /* -----------------------------------------------------------
//      DUMMY DATA (Replace with dbData from DB later)
//   ----------------------------------------------------------- */
//   const tasks = [
//     { date: 5, title: "API Integration", subtitle: "Auth Module", status: "In Progress" },
//     { date: 12, title: "Bug Fix #402", subtitle: "CSS Overlap", status: "Urgent" },
//     { date: 20, title: "Sprint Demo", subtitle: "Internal Review", status: "Scheduled" },
//   ];

//   const topCards = [
//     { title: "Active Sprint", subtitle: "Sprint #14", status: "4 Days Left", icon: <Zap className="text-yellow-400" /> },
//     { title: "My Tasks", subtitle: "Assigned to me", status: "8 Tasks Total", icon: <Layout className="text-blue-400" /> },
//     { title: "Daily Bot", subtitle: "Bot Standup", status: "Pending", icon: <MessageSquare className="text-green-400" /> },
//     { title: "Velocity", subtitle: "Last 3 Sprints", status: "Avg: 12pts", icon: <Flame className="text-orange-400" /> },
//   ];

//   return (
//     <div className="flex min-h-screen bg-[#121212] text-white">
//       <SideBar />

//       <main className={`flex-1 flex flex-col transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"}`}>
//         {/* Header - Profile Circle Removed */}
//         <header className="flex items-center justify-between px-6 py-4 bg-[#1b1b1b] border-b border-gray-700">
//           <div>
//             <h1 className="text-2xl font-bold">Developer Mission Control</h1>
//             <p className="text-xs text-gray-400">Viewing as: {user?.role?.replace('_', ' ') || "Developer"}</p>
//           </div>
//           <div className="flex items-center gap-6">
//             <div className="relative hidden md:block">
//               <Search className="absolute top-2.5 left-2.5 text-gray-400" size={18} />
//               <input
//                 type="text"
//                 placeholder="Search tasks..."
//                 className="pl-9 pr-4 py-2 rounded-md bg-[#2a2a2a] text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 border border-transparent focus:border-blue-500/50"
//               />
//             </div>
//             <div className="flex items-center gap-4 border-l border-gray-700 pl-6">
//               <Bell className="cursor-pointer text-gray-300 hover:text-white transition-colors" size={20} />
//               <Calendar className="cursor-pointer text-gray-300 hover:text-white transition-colors" size={20} />
//             </div>
//           </div>
//         </header>

//         {/* Body Content */}
//         <div className="flex flex-1 overflow-hidden">
//           {/* Left Side: Stats + Calendar */}
//           <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//               {topCards.map((card, i) => (
//                 <div key={i} className="bg-[#1f1f1f] rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all shadow-lg group">
//                   <div className="mb-3 p-2 w-fit bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">{card.icon}</div>
//                   <h2 className="font-semibold text-gray-200">{card.title}</h2>
//                   <p className="text-sm text-gray-400">{card.subtitle}</p>
//                   <div className="mt-2 text-xs font-bold text-blue-500">{card.status}</div>
//                 </div>
//               ))}
//             </div>

//             <div className="p-6 bg-[#1f1f1f] rounded-xl shadow-lg border border-white/5">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-lg font-bold flex items-center gap-2">
//                   <Calendar size={20} className="text-blue-500" /> Sprint Timeline
//                 </h2>
//                 <div className="flex items-center gap-3">
//                   <button onClick={prevMonth} className="p-1.5 rounded-md hover:bg-[#2a2a2a] bg-[#121212] border border-white/5"><ChevronLeft size={18}/></button>
//                   <span className="text-sm font-medium w-32 text-center text-gray-300">{monthYear}</span>
//                   <button onClick={nextMonth} className="p-1.5 rounded-md hover:bg-[#2a2a2a] bg-[#121212] border border-white/5"><ChevronRight size={18}/></button>
//                 </div>
//               </div>

//               <div className="grid grid-cols-7 text-center text-[10px] mb-3 font-bold text-gray-500 uppercase tracking-widest">
//                 {daysOfWeek.map((day) => <div key={day}>{day}</div>)}
//               </div>

//               <div className="grid grid-cols-7 gap-2">
//                 {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
//                 {Array.from({ length: daysInMonth }, (_, i) => {
//                   const day = i + 1;
//                   const event = tasks.find(e => e.date === day);
//                   const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth.getMonth();

//                   return (
//                     <div key={i} className={`min-h-[90px] p-2 rounded-lg border transition-all ${isToday ? "border-blue-500 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]" : "border-white/5 bg-[#262626] hover:bg-[#2a2a2a]"}`}>
//                       <span className={`text-xs font-bold ${isToday ? "text-blue-400" : "text-gray-500"}`}>{day}</span>
//                       {event && (
//                         <div className="mt-1 bg-blue-600/20 border border-blue-500/30 rounded p-1.5 text-[10px] text-blue-100">
//                           <p className="font-bold truncate">{event.title}</p>
//                           <p className="opacity-70 truncate text-[9px]">{event.status}</p>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* Right Side Focus Area */}
//           <aside className="w-80 bg-[#1b1b1b] border-l border-gray-700 p-6 hidden xl:flex flex-col gap-6 overflow-y-auto">
//             <div>
//               <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Focus Task</h3>
//               <div className="bg-[#2a2a2a] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all">
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
//                   <span className="text-[10px] font-bold text-orange-400 uppercase">In Progress</span>
//                 </div>
//                 <p className="text-sm font-semibold mb-1">Fix Navigation Overlap</p>
//                 <p className="text-xs text-gray-400 mb-4 italic">Sprint Ticket: #SCRUM-102</p>
//                 <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
//                   <div className="bg-blue-500 h-full w-[65%] transition-all duration-1000" />
//                 </div>
//                 <div className="flex justify-between items-center mt-2">
//                    <span className="text-[10px] text-gray-500">Progress</span>
//                    <span className="text-[10px] font-bold text-blue-400">65%</span>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Sprint Pulse</h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center p-3 bg-[#2a2a2a] rounded-lg border border-white/5">
//                   <span className="text-xs text-gray-300">PRs Approved</span>
//                   <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded">2</span>
//                 </div>
//                 <div className="flex justify-between items-center p-3 bg-[#2a2a2a] rounded-lg border border-white/5">
//                   <span className="text-xs text-gray-300">Active Blockers</span>
//                   <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded">1</span>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-auto bg-gradient-to-br from-blue-600/20 to-indigo-700/20 border border-blue-500/30 p-5 rounded-xl">
//               <div className="flex gap-3 items-start">
//                 <CheckCircle size={18} className="text-blue-400 shrink-0" />
//                 <div>
//                   <p className="text-sm font-bold text-white">Standup Ready</p>
//                   <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">Your bot report is drafted. Ready to sync with the team?</p>
//                   <button className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold py-2 rounded-lg uppercase tracking-wider transition-colors">
//                     Review & Submit
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </aside>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default DeveloperDashboard;
import React, { useState, useEffect } from "react";
import { Search, Bell, Calendar, CheckCircle, Layout, Flame, Zap, ChevronLeft, ChevronRight, MessageSquare, Clock } from "lucide-react";
import SideBar from "../components/SideBar";
import { useSelector } from "react-redux";
import axios from "axios";
import SummaryApi from "../common";
import { NavLink } from "react-router-dom";

const DeveloperDashboard = () => {
  // 1. REDUX STATE
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const user = useSelector((state) => state?.user?.user);

  // 2. COMPONENT STATE
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 3. CALENDAR CALCULATIONS (Defined inside the component scope)
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const daysInMonth = endOfMonth.getDate();
  const startDay = startOfMonth.getDay();

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const monthYear = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // 4. DATABASE FETCH
  useEffect(() => {
    if (user?._id) {
        fetchDevData();
    }
  }, [user, currentMonth]); // Refetch if month changes

  const fetchDevData = async () => {
    try {
      // Note: Replace with your actual endpoint from SummaryApi
      const res = await axios.get(`${SummaryApi.dev_stats.url}/${user._id}`);
      if (res.data.success) {
        setDbData(res.data.data);
      }
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 5. DATA MAPPING
  const topCards = [
    { 
      title: "Active Sprint", 
      subtitle: dbData?.activeSprint?.sprintName || "Sprint #14", 
      status: "4 Days Left", 
      icon: <Zap className="text-yellow-400" /> 
    },
    { 
      title: "My Tasks", 
      subtitle: "Sprint Allocation", 
      status: `${dbData?.stats?.totalTasks || 0} Tasks Total`, 
      icon: <Layout className="text-blue-400" /> 
    },
    { 
      title: "Blockers", 
      subtitle: "Action Required", 
      status: `${dbData?.stats?.blockers || 0} Active`, 
      icon: <Flame className="text-red-400" /> 
    },
    { 
        title: "Velocity", 
        subtitle: "Last 3 Sprints", 
        status: "Avg: 12pts", 
        icon: <CheckCircle className="text-green-400" /> 
    },
  ];

  if (loading) return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-blue-500 font-bold tracking-widest animate-pulse text-xs uppercase">Initialising Mission Control...</div>;

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <SideBar />

      <main className={`flex-1 flex flex-col transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"}`}>
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-[#1b1b1b] border-b border-gray-700">
          <div>
            <h1 className="text-2xl font-bold">Developer Mission Control</h1>
            <p className="text-xs text-gray-400 uppercase tracking-tighter">Viewing as: {user?.role?.replace('_', ' ') || "Developer"}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute top-2.5 left-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-9 pr-4 py-2 rounded-md bg-[#2a2a2a] text-sm text-white focus:outline-none border border-transparent focus:border-blue-500/50"
              />
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {topCards.map((card, i) => (
                <div key={i} className="bg-[#1f1f1f] rounded-xl p-5 border border-white/5 group hover:bg-white/[0.02] transition-all shadow-lg">
                  <div className="mb-3 p-2 w-fit bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">{card.icon}</div>
                  <h2 className="font-semibold text-gray-200">{card.title}</h2>
                  <p className="text-sm text-gray-400">{card.subtitle}</p>
                  <div className="mt-2 text-xs font-bold text-blue-500">{card.status}</div>
                </div>
              ))}
            </div>

            {/* Calendar */}
            <div className="p-6 bg-[#1f1f1f] rounded-xl shadow-lg border border-white/5">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Calendar size={20} className="text-blue-500" /> Sprint Timeline
                </h2>
                <div className="flex items-center gap-3">
                  <button onClick={prevMonth} className="p-1.5 rounded-md hover:bg-[#2a2a2a] bg-[#121212] border border-white/5"><ChevronLeft size={18}/></button>
                  <span className="text-sm font-medium w-32 text-center text-gray-300">{monthYear}</span>
                  <button onClick={nextMonth} className="p-1.5 rounded-md hover:bg-[#2a2a2a] bg-[#121212] border border-white/5"><ChevronRight size={18}/></button>
                </div>
              </div>

              <div className="grid grid-cols-7 text-center text-[10px] mb-3 font-bold text-gray-500 uppercase tracking-widest">
                {daysOfWeek.map((day) => <div key={day}>{day}</div>)}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const dayEvents = dbData?.monthlyTasks?.filter(t => new Date(t.dueDate).getDate() === day);
                  const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth.getMonth();

                  return (
                    <div key={i} className={`min-h-[90px] p-2 rounded-lg border transition-all ${isToday ? "border-blue-500 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]" : "border-white/5 bg-[#262626]"}`}>
                      <span className={`text-xs font-bold ${isToday ? "text-blue-400" : "text-gray-500"}`}>{day}</span>
                      {dayEvents?.map((event, idx) => (
                        <div key={idx} className="mt-1 bg-blue-600/20 border border-blue-500/30 rounded p-1.5 text-[9px] text-blue-100 truncate">
                          {event.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="w-80 bg-[#1b1b1b] border-l border-gray-700 p-6 hidden xl:flex flex-col gap-8 overflow-y-auto custom-scrollbar">
            {/* 1. FOCUS TASK & TRACKER */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Focus Task</h3>
                <span className="text-[10px] font-bold text-blue-500 px-2 py-0.5 bg-blue-500/10 rounded-full">ACTIVE</span>
              </div>
              
              {dbData?.stats?.focusTask ? (
                <div className="bg-[#2a2a2a] p-4 rounded-2xl border border-white/5 shadow-inner">
                  <p className="text-sm font-bold text-white mb-1">{dbData.stats.focusTask.title}</p>
                  <p className="text-[10px] text-gray-500 mb-4 flex items-center gap-1">
                    <Clock size={10} /> 2h 15m logged today
                  </p>
                  
                  <div className="space-y-2">
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-[65%] shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-bold">
                      <span className="text-gray-500">PROGRESS</span>
                      <span className="text-blue-400">65%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-white/5 rounded-2xl">
                  <p className="text-xs text-gray-500 italic">No task in focus</p>
                  <button className="mt-2 text-[10px] text-blue-500 font-bold hover:underline">Pick a task</button>
                </div>
              )}
            </div>

            {/* 2. PULL REQUESTS MONITOR */}
            <div>
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Pull Requests</h3>
              <div className="space-y-3">
                {[
                  { id: 'PR-102', title: 'Auth Fix', status: 'Reviewing', color: 'text-yellow-500' },
                  { id: 'PR-105', title: 'Nav UI', status: 'Approved', color: 'text-green-500' }
                ].map((pr) => (
                  <div key={pr.id} className="group flex items-center justify-between p-3 bg-[#232323] hover:bg-[#2a2a2a] rounded-xl border border-white/5 transition-colors cursor-pointer">
                    <div>
                      <p className="text-[11px] font-bold text-gray-200 group-hover:text-white">{pr.id}</p>
                      <p className="text-[10px] text-gray-500">{pr.title}</p>
                    </div>
                    <span className={`text-[9px] font-black uppercase ${pr.color}`}>{pr.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. UPCOMING MILESTONES */}
            <div>
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Upcoming</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                    <div className="w-px h-full bg-gray-800" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-300">Sprint Demo</p>
                    <p className="text-[10px] text-gray-500">Tomorrow, 10:00 AM</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-600 mt-1.5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-300">Code Freeze</p>
                    <p className="text-[10px] text-gray-500">Friday, Jan 12</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. QUICK ACTIONS UTILITY */}
            <div className="mt-4">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Utilities</h3>
              <div className="grid grid-cols-2 gap-2">
                
                {/* Updated Team Chat Button */}
                <NavLink 
                  to="/TeamMembers" 
                  className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all group"
                >
                  <MessageSquare size={16} className="text-gray-400 group-hover:text-blue-400 mb-1 transition-colors" />
                  <span className="text-[9px] font-bold text-gray-400 group-hover:text-gray-200">TEAM CHAT</span>
                </NavLink>

                <button className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all group">
                  <Layout size={16} className="text-gray-400 group-hover:text-purple-400 mb-1" />
                  <span className="text-[9px] font-bold text-gray-400 group-hover:text-gray-200">DOCS</span>
                </button>
                
              </div>
            </div>

            {/* 5. STANDUP BOT ACTION (Sticky Bottom) */}
            <div className="mt-auto bg-gradient-to-br from-indigo-600 to-blue-700 p-5 rounded-2xl shadow-xl shadow-blue-900/20 relative overflow-hidden group">
              <Zap className="absolute -right-4 -top-4 w-20 h-20 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={16} className="text-blue-200" />
                  <p className="text-xs font-black text-white uppercase tracking-wider">Standup Ready</p>
                </div>
                <p className="text-[10px] text-blue-100/80 leading-relaxed mb-4">
                  We've compiled your 2 PRs and 1 resolved blocker into a draft.
                </p>
                <button className="w-full bg-white text-blue-700 text-[10px] font-black py-2.5 rounded-lg uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-lg">
                  Sync with Bot
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

// CRITICAL: Ensure this is at the bottom
export default DeveloperDashboard;