import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// Fixed: Removed duplicate X import and added missing icons
import { Menu, X, Robot, History, Layers } from "lucide-react"; 
import { setUserDetails } from "../store/userSlice";
import { toggleSidebar } from "../store/sidebarSlice";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import {
  FaClipboardList, FaComments, FaUsers,
  FaBan, FaChartLine, FaTasks,
  FaCog, FaSignOutAlt, FaHistory, FaRobot, FaLayerGroup, Fawindturbine,
  FaPlus
} from "react-icons/fa";

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux State
  const user = useSelector((state) => state?.user?.user);
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  // User details logic
  const userName = user?.name || "Guest User";
  const userEmail = user?.email || "guest@email.com";
  const userRole = user?.role || "DEVELOPER"; 
  
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    try {
      const fetchData = await fetch(SummaryApi.logout_user.url, {
        method: SummaryApi.logout_user.method,
        credentials: "include",
      });
      const data = await fetchData.json();

      if (data.success) {
        toast.success(data.message);
        dispatch(setUserDetails(null));
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-[#1E1E1E] text-white flex flex-col justify-between px-3 py-6 shadow-lg z-50 transition-all duration-300
        ${isOpen ? "w-64" : "w-20"} `}
    >
      <div>
        {/* Top Section with Profile */}
        <div className={`flex items-center mb-8 px-2 ${!isOpen && "justify-center"}`}>
          <div className="w-10 h-10 rounded-full bg-green-600 flex-shrink-0 flex items-center justify-center font-bold text-sm border-2 border-gray-700">
            {userInitials}
          </div>
          {isOpen && (
            <div className="ml-3 overflow-hidden">
              <p className="font-semibold truncate">{userName}</p>
              <p className="text-xs text-gray-400 truncate">{userRole.replace('_', ' ')}</p>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          className="p-2 mb-6 rounded-md hover:bg-gray-700 flex items-center justify-center transition-colors mx-auto lg:ml-1"
          onClick={() => dispatch(toggleSidebar())}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Navigation based on role */}
        <nav className="flex flex-col space-y-2">
          {userRole === "SCRUM_MASTER" ? (
            <>
              <SidebarLink to="/ScrumMaster/Dashboard" icon={<FaClipboardList />} label="Dashboard" isOpen={isOpen} />
              <SidebarLink to="/STeamChat" icon={<FaComments />} label="Team Chat" isOpen={isOpen} />
              <SidebarLink to="/ScrumTeams" icon={<FaUsers />} label="Team Performance" isOpen={isOpen} />
              <SidebarLink to="/Retrospectives" icon={<FaHistory />} label="Retrospectives" isOpen={isOpen} />
              <SidebarLink to="/ReportGenerator" icon={<FaChartLine />} label="Insights & Reports" isOpen={isOpen} />
              <SidebarLink to="/SprintGenerator" icon={<FaPlus />} label="Sprint Generation" isOpen={isOpen} />
            </>
          ) : (
            <>
              <SidebarLink to="/Developer/Dashboard" icon={<FaClipboardList />} label="My Dashboard" isOpen={isOpen} />
              <SidebarLink to="/ChatBot" icon={<FaRobot />} label="Daily Bot Check-in" isOpen={isOpen} />
              <SidebarLink to="/MyTasks" icon={<FaTasks />} label="Task Board" isOpen={isOpen} />
              <SidebarLink to="/Sprints" icon={<FaLayerGroup />} label="Current Sprint" isOpen={isOpen} />
              <SidebarLink to="/TeamMembers" icon={<FaUsers />} label="My Team" isOpen={isOpen} />
            </>
          )}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 pt-4 px-2">
        <SidebarLink to="/Preferences" icon={<FaCog />} label="Settings" isOpen={isOpen} />
        <button
          onClick={handleLogout}
          className={`w-full mt-2 px-3 py-2 rounded-md text-red-400 hover:bg-red-900/20 flex items-center transition-all ${isOpen ? "gap-3 text-left" : "justify-center"}`}
        >
          <FaSignOutAlt className="flex-shrink-0" /> 
          {isOpen && <span className="font-medium">Log Out</span>}
        </button>
      </div>
    </aside>
  );
};

// Sub-component for cleaner code
const SidebarLink = ({ to, icon, label, isOpen }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center rounded-md transition-all py-2.5 px-3 ${
        isOpen ? "gap-3" : "justify-center"
      } ${
        isActive ? "bg-blue-600 text-white shadow-md" : "hover:bg-gray-800 text-gray-300 hover:text-white"
      }`
    }
  >
    <div className="text-lg flex-shrink-0">{icon}</div>
    {isOpen && <span className="font-medium text-sm whitespace-nowrap">{label}</span>}
  </NavLink>
);

export default SideBar;