import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Send, Hash, Search, Plus, User, 
  MoreVertical, Phone, Video, Info, 
  Smile, Paperclip, Zap
} from 'lucide-react';
import SideBar from '../components/SideBar';

const STeamChat = () => {
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const [message, setMessage] = useState("");

  // Dummy Data
  const channels = ["General", "Sprint-Planning", "Bug-Reports", "Retro-Discussion"];
  const directMessages = [
    { name: "Aashish Gupta", status: "online", role: "Lead" },
    { name: "Siddharth R.", status: "away", role: "Dev" },
    { name: "Jane Smith", status: "online", role: "Design" }
  ];

  const dummyMessages = [
    { id: 1, user: "Siddharth R.", time: "10:30 AM", text: "Has anyone reviewed the PR for the new sidebar toggle?", role: "Developer" },
    { id: 2, user: "Aashish Gupta", time: "10:32 AM", text: "I'm looking at it now. The Redux state logic looks solid.", role: "Lead" },
    { id: 3, user: "Jane Smith", time: "10:35 AM", text: "Don't forget to update the Figma file with the new blue hex codes! 🎨", role: "Designer" },
  ];

  return (
    <div className="flex h-screen bg-[#0b0f1a] text-gray-200 overflow-hidden">
      <SideBar />

      {/* Main Content Area */}
      <main className={`flex-1 flex transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"}`}>
        
        {/* LEFT: Channels & DMs Sidebar */}
        <div className="w-72 border-r border-white/5 bg-[#111827]/30 flex flex-col">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-500" size={14} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-8">
            {/* Channels Section */}
            <div>
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-4 px-2">
                <span>Channels</span>
                <Plus size={14} className="cursor-pointer hover:text-white" />
              </div>
              <div className="space-y-1">
                {channels.map((ch) => (
                  <div key={ch} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 cursor-pointer group transition-all">
                    <Hash size={16} className="text-gray-500 group-hover:text-blue-400" />
                    <span className="text-sm font-medium text-gray-400 group-hover:text-white">{ch}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Messages Section */}
            <div>
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-4 px-2">
                <span>Direct Messages</span>
              </div>
              <div className="space-y-1">
                {directMessages.map((dm) => (
                  <div key={dm.name} className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 cursor-pointer group transition-all">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center text-[10px] font-bold">
                          {dm.name[0]}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0b0f1a] ${dm.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-300 group-hover:text-white leading-none">{dm.name}</p>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">{dm.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Chat Window */}
        <div className="flex-1 flex flex-col bg-[#0b0f1a]">
          {/* Chat Header */}
          <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#111827]/20 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-blue-600/10 rounded-xl text-blue-400 border border-blue-500/20">
                <Hash size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white">Sprint-Planning</h3>
                <p className="text-xs text-gray-500">Coordination for Sprint 24 Development</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <Phone size={18} className="cursor-pointer hover:text-white" />
              <Video size={18} className="cursor-pointer hover:text-white" />
              <div className="w-px h-6 bg-white/5 mx-2"></div>
              <Info size={18} className="cursor-pointer hover:text-white" />
            </div>
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            {dummyMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center font-bold text-blue-500">
                  {msg.user[0]}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-white text-sm">{msg.user}</span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded uppercase">{msg.role}</span>
                    <span className="text-[10px] text-gray-600">{msg.time}</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-2xl bg-white/[0.02] p-3 rounded-2xl border border-white/5 group-hover:border-white/10 transition-all">
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Area */}
          <div className="p-8">
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-2 focus-within:border-blue-500/50 transition-all shadow-2xl">
              <div className="flex items-center px-4 py-2 border-b border-white/5 mb-2 gap-2">
                <button className="p-1.5 hover:bg-white/5 rounded-lg text-gray-500 hover:text-blue-400 transition-colors"><Zap size={16}/></button>
                <div className="w-px h-4 bg-white/10 mx-1"></div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Type / for shortcuts</span>
              </div>
              <div className="flex items-end gap-2 px-4 pb-2">
                <button className="p-2 text-gray-500 hover:text-white transition-colors"><Paperclip size={20} /></button>
                <textarea 
                  rows="1"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message #Sprint-Planning..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 placeholder:text-gray-600 resize-none scrollbar-hide"
                />
                <button className="p-2 text-gray-500 hover:text-white transition-colors"><Smile size={20} /></button>
                <button className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-900/40">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default STeamChat;