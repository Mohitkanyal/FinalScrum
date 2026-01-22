// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { Users, UserCheck, Calendar, ClipboardCheck, Star } from "lucide-react";
// import SideBar from "../components/Sidebar"; 
// import SummaryApi from "../common";
// import { useSelector } from "react-redux";

// const TeamMembers = () => {
//   const [teamData, setTeamData] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   // 2. Get the Sidebar state from Redux instead of local useState
//   const isOpen = useSelector((state) => state.sidebar.isOpen);
//   const user = useSelector((state) => state?.user?.user);

//   useEffect(() => {
//     const fetchTeamData = async () => {
//       try {
//         const res = await axios.post(
//           SummaryApi.teamdetail.url,
//           { memberId: user._id },
//           { withCredentials: true }
//         );

//         if (res.data?.success) {
//           setTeamData(res.data.data);
//         } else {
//           toast.error(res.data?.message || "Failed to fetch team data");
//         }
//       } catch (err) {
//         console.error("Error fetching team:", err);
//         toast.error(err.response?.data?.message || "Failed to fetch team data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user?._id) fetchTeamData();
//   }, [user]);

//   if (loading)
//     return (
//       <div className="flex bg-[#1E1E1E] min-h-screen text-white">
//         <SideBar />
//         <div className={`flex-1 p-6 transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"}`}>
//           Loading team details...
//         </div>
//       </div>
//     );

//   if (!teamData)
//     return (
//       <div className="flex bg-[#1E1E1E] min-h-screen text-white">
//         <SideBar />
//         <div className={`flex-1 p-6 transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"}`}>
//           No team data available.
//         </div>
//       </div>
//     );

//   return (
//     <div className="flex min-h-screen bg-[#121212] text-white">
//       {/* 3. The Sidebar handles its own isOpen internally via Redux */}
//       <SideBar />

//       <main
//         className={`flex-1 transition-all duration-300 ${
//           isOpen ? "ml-64" : "ml-20"
//         } p-8`}
//       >
//         {/* Header */}
//         <h1 className="text-3xl font-bold mb-8 text-blue-400 flex items-center gap-3 animate-fade-in">
//           <Users size={32} /> My Team
//         </h1>

//         {/* Project Card */}
//         <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-xl p-8 mb-10 overflow-hidden">
//           <div className="absolute top-0 right-0 p-4 opacity-10">
//              <ClipboardCheck size={120} />
//           </div>
          
//           <div className="relative z-10">
//             <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
//                Project: <span className="text-blue-300">{teamData.projectName || "N/A"}</span>
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <p className="flex items-center gap-3 text-gray-300 text-lg">
//                 <Calendar className="text-blue-400" size={20} /> 
//                 <span>Deadline: <b className="text-white">{teamData.completionDate ? new Date(teamData.completionDate).toLocaleDateString() : "N/A"}</b></span>
//               </p>

//               <p className="flex items-center gap-3 text-gray-300 text-lg">
//                 <UserCheck className="text-green-400" size={20} /> 
//                 <span>Lead: <b className="text-white">{teamData.teamLeader?.name || "N/A"}</b></span>
//                 <Star className="text-yellow-400 fill-yellow-400" size={16} />
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Team Members Grid */}
//         <h3 className="text-xl font-semibold mb-6 text-gray-400 uppercase tracking-widest text-sm">Members ({teamData.members?.length || 0})</h3>
        
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {teamData.members?.length > 0 ? (
//             teamData.members.map((member) => {
//               const isLeader = member._id === teamData.teamLeader?._id;

//               return (
//                 <div
//                   key={member._id}
//                   className={`relative group rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 border ${
//                     isLeader ? "border-blue-500/50 bg-blue-500/5" : "border-white/10 bg-white/5"
//                   } hover:bg-white/10 hover:border-white/20`}
//                 >
//                   {/* Leader Badge */}
//                   {isLeader && (
//                     <span className="absolute top-3 right-3 bg-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
//                       Lead
//                     </span>
//                   )}

//                   {/* Avatar */}
//                   <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-inner ${
//                     isLeader ? "bg-blue-600" : "bg-gray-700"
//                   }`}>
//                     {member.name?.charAt(0) || "U"}
//                   </div>

//                   {/* Info */}
//                   <h3 className="font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors">
//                     {member.name}
//                   </h3>
//                   <p className="text-xs text-gray-500 mb-3 truncate w-full">{member.email}</p>
                  
//                   <div className="mt-auto pt-4 w-full border-t border-white/5 space-y-1">
//                     <p className="text-[11px] uppercase text-gray-400 font-bold tracking-tighter">
//                       {member.role || "Developer"}
//                     </p>
//                     <p className="text-[10px] text-gray-600">
//                       Since {member.joinDate ? new Date(member.joinDate).toLocaleDateString() : "N/A"}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <p className="text-gray-500 italic">No members found in this team.</p>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default TeamMembers;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Users, UserCheck, Calendar, ClipboardCheck, Star, MessageSquare } from "lucide-react";
import SideBar from "../components/SideBar"; 
import SummaryApi from "../common";
import { useSelector } from "react-redux";
import TeamChat from "./TeamChat";
// Import your TeamChat component here
// import TeamChat from "../components/TeamChat"; 

const TeamMembers = () => {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("members"); // "members" or "chat"
  
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const user = useSelector((state) => state?.user?.user);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const res = await axios.post(
          SummaryApi.teamdetail.url,
          { memberId: user._id },
          { withCredentials: true }
        );

        if (res.data?.success) {
          setTeamData(res.data.data);
        } else {
          toast.error(res.data?.message || "Failed to fetch team data");
        }
      } catch (err) {
        console.error("Error fetching team:", err);
        toast.error(err.response?.data?.message || "Failed to fetch team data");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchTeamData();
  }, [user]);

  if (loading)
    return (
      <div className="flex bg-[#121212] min-h-screen text-white">
        <SideBar />
        <div className={`flex-1 p-6 transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"}`}>
          <div className="animate-pulse flex space-x-4">
             <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-slate-700 rounded"></div>
                <div className="h-10 bg-slate-700 rounded w-1/4"></div>
             </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <SideBar />

      <main className={`flex-1 transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"} p-8`}>
        
        {/* Header Section with Tab Switcher */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-blue-400 flex items-center gap-3">
            {activeTab === "members" ? <Users size={32} /> : <MessageSquare size={32} />}
            {activeTab === "members" ? "My Team" : "Team Chat"}
          </h1>

          {/* Tab Switcher */}
          <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl backdrop-blur-md">
            <button
              onClick={() => setActiveTab("members")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === "members" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                : "text-gray-400 hover:text-white"
              }`}
            >
              <Users size={18} />
              <span className="text-sm font-semibold">Members</span>
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === "chat" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                : "text-gray-400 hover:text-white"
              }`}
            >
              <MessageSquare size={18} />
              <span className="text-sm font-semibold">Chat</span>
            </button>
          </div>
        </div>

        {/* Conditional Rendering based on activeTab */}
        {activeTab === "members" ? (
          <div className="animate-fade-in">
            {/* Project Card */}
            <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-xl p-8 mb-10 overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <ClipboardCheck size={120} />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-slate-100">
                   Project: <span className="text-blue-300">{teamData?.projectName || "N/A"}</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="flex items-center gap-3 text-gray-300 text-lg">
                    <Calendar className="text-blue-400" size={20} /> 
                    <span>Deadline: <b className="text-white">{teamData?.completionDate ? new Date(teamData.completionDate).toLocaleDateString() : "N/A"}</b></span>
                  </p>

                  <p className="flex items-center gap-3 text-gray-300 text-lg">
                    <UserCheck className="text-green-400" size={20} /> 
                    <span>Lead: <b className="text-white">{teamData?.teamLeader?.name || "N/A"}</b></span>
                    <Star className="text-yellow-400 fill-yellow-400 ml-1" size={16} />
                  </p>
                </div>
              </div>
            </div>

            {/* Team Members Grid */}
            <h3 className="text-xs font-semibold mb-6 text-gray-400 uppercase tracking-[0.2em]">
                Members ({teamData?.members?.length || 0})
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teamData?.members?.length > 0 ? (
                teamData.members.map((member) => {
                  const isLeader = member._id === teamData.teamLeader?._id;

                  return (
                    <div
                      key={member._id}
                      className={`relative group rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 border ${
                        isLeader ? "border-blue-500/50 bg-blue-500/10" : "border-white/10 bg-white/5"
                      } hover:bg-white/10 hover:border-white/20 hover:-translate-y-1`}
                    >
                      {isLeader && (
                        <span className="absolute top-3 right-3 bg-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Lead
                        </span>
                      )}

                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-xl ${
                        isLeader ? "bg-blue-600 ring-4 ring-blue-500/20" : "bg-gray-700"
                      }`}>
                        {member.name?.charAt(0) || "U"}
                      </div>

                      <h3 className="font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-3 truncate w-full px-2">{member.email}</p>
                      
                      <div className="mt-auto pt-4 w-full border-t border-white/5 space-y-1">
                        <p className="text-[11px] uppercase text-gray-400 font-bold tracking-wider">
                          {member.role || "Developer"}
                        </p>
                        <p className="text-[10px] text-gray-600">
                          Since {member.joinDate ? new Date(member.joinDate).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-10 text-center bg-white/5 rounded-xl border border-dashed border-white/10">
                    <p className="text-gray-500 italic">No members found in this team.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Team Chat Section */
          <div className="animate-fade-in h-[calc(100vh-220px)] mt-2">
            <TeamChat teamId={teamData?._id} user={user} />
          </div>
        )}
      </main>
    </div>
  );
};

export default TeamMembers;