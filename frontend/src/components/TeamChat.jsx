import React, { useState, useEffect, useRef } from 'react';
import { Send, Hash, MessageSquare, User } from 'lucide-react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

// Ensure this matches your backend PORT
const SOCKET_URL = "http://localhost:8080"; 

const TeamChat = ({ teamId, user }) => {
    const [chat, setchat] = useState("");
    const [chats, setchats] = useState([]);
    const [loading, setLoading] = useState(true);
    const socket = useRef(null);
    const scrollRef = useRef();

    // 1. Fetch Chat History from MongoDB via API
    const fetchChatHistory = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${SummaryApi.getTeamchats.url}/${teamId}`, {
                withCredentials: true
            });
            if (response.data.success) {
                setchats(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
            toast.error("Failed to load chat history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Load old chats
        if (teamId) fetchChatHistory();

        // 2. Initialize Socket Connection
        socket.current = io(SOCKET_URL, { 
            withCredentials: true,
            transports: ['websocket'] 
        });

        // Join the specific team room
        socket.current.emit("join-team", teamId);

        // Listen for incoming chats from others
        socket.current.on("receive-chat", (newchat) => {
            setchats((prev) => [...prev, newchat]);
        });

        // Cleanup on unmount
        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [teamId]);

    // 3. Auto-scroll to bottom whenever chats update
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chats]);

    // 4. Handle Sending chat
    const handleSendchat = (e) => {
        e.preventDefault();
        
        if (!chat.trim()) return;

        const chatData = {
            teamId,
            senderId: user._id,
            senderName: user.name,
            text: chat,
            timestamp: new Date()
        };

        // Emit to server
        socket.current.emit("send-chat", chatData);
        
        // Update local UI immediately for the sender
        setchats((prev) => [...prev, chatData]);
        setchat("");
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#181818] rounded-2xl border border-white/10 overflow-hidden shadow-2xl text-white">
            
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Hash size={20} className="text-blue-400" />
                    <div>
                        <span className="font-bold text-gray-100 block text-sm">Team Discussion</span>
                        <span className="text-[10px] text-green-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                        </span>
                    </div>
                </div>
            </div>

            {/* chats Display Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#121212]">
                {loading ? (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                        Loading chats...
                    </div>
                ) : chats.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20">
                        <chatSquare size={60} />
                        <p className="mt-2 font-medium">No chats in this team yet.</p>
                    </div>
                ) : (
                    chats.map((msg, index) => {
                        const isMe = msg.senderId === user._id;
                        return (
                            <div key={index} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                {/* Sender Info */}
                                <div className="flex items-center gap-2 mb-1 px-1">
                                    {!isMe && <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{msg.senderName}</span>}
                                    <span className="text-[9px] text-gray-600">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                {/* chat Bubble */}
                                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[13.5px] leading-relaxed shadow-sm ${
                                    isMe 
                                    ? "bg-blue-600 text-white rounded-tr-none" 
                                    : "bg-white/10 text-gray-200 rounded-tl-none border border-white/5"
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        );
                    })
                )}
                {/* Reference for auto-scroll */}
                <div ref={scrollRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendchat} className="p-4 bg-[#181818] border-t border-white/10">
                <div className="relative flex items-center gap-3">
                    <input
                        type="text"
                        value={chat}
                        onChange={(e) => setchat(e.target.value)}
                        placeholder="Type your chat here..."
                        className="flex-1 bg-[#252525] border border-white/10 rounded-xl py-3 px-5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-white placeholder:text-gray-600"
                    />
                    <button 
                        type="submit"
                        disabled={!chat.trim()}
                        className={`p-3 rounded-xl transition-all shadow-lg ${
                            !chat.trim() 
                            ? "bg-gray-700 text-gray-500 cursor-not-allowed" 
                            : "bg-blue-600 hover:bg-blue-500 text-white active:scale-90"
                        }`}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TeamChat;


// import React, { useState, useEffect, useRef } from 'react';
// import { Send, Hash, MessageSquare } from 'lucide-react';
// import { io } from 'socket.io-client';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import SummaryApi from '../common';

// const SOCKET_URL = "http://localhost:8080"; 

// const TeamChat = ({ teamId, user }) => {
//     const [chat, setchat] = useState("");
//     const [chats, setchats] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const socket = useRef(null);
//     const scrollRef = useRef();

//     const fetchChatHistory = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(`${SummaryApi.getTeamchats.url}/${teamId}`, {
//                 withCredentials: true
//             });
//             if (response.data.success) {
//                 setchats(response.data.data);
//             }
//         } catch (error) {
//             console.error("Error fetching history:", error);
//             toast.error("Failed to load chats");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (teamId) fetchChatHistory();

//         socket.current = io(SOCKET_URL, { 
//             withCredentials: true,
//             transports: ['websocket'] 
//         });

//         socket.current.emit("join-team", teamId);

//         socket.current.on("receive-chat", (newchat) => {
//             setchats((prev) => [...prev, newchat]);
//         });

//         return () => {
//             if (socket.current) socket.current.disconnect();
//         };
//     }, [teamId]);

//     useEffect(() => {
//         scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [chats]);

//     const handleSendchat = (e) => {
//         e.preventDefault();
//         if (!chat.trim()) return;

//         const chatData = {
//             teamId,
//             senderId: user._id,
//             senderName: user.name,
//             text: chat,
//             timestamp: new Date()
//         };

//         socket.current.emit("send-chat", chatData);
//         setchats((prev) => [...prev, chatData]);
//         setchat("");
//     };

//     return (
//         <div className="flex flex-col h-full w-full bg-[#0b141a] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            
//             {/* Header */}
//             <div className="p-4 bg-[#202c33] border-b border-white/5 flex items-center gap-3">
//                 <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white">
//                     <Hash size={20} />
//                 </div>
//                 <div>
//                     <span className="font-bold text-gray-100 block">Team Group Chat</span>
//                     <span className="text-[11px] text-gray-400">Online members</span>
//                 </div>
//             </div>

//             {/* Chat Area - WhatsApp Background Style */}
//             <div className="flex-1 overflow-y-auto p-6 space-y-2 bg-[#0b141a] bg-opacity-95 scrollbar-thin">
//                 {loading ? (
//                     <div className="h-full flex items-center justify-center text-gray-500">Loading...</div>
//                 ) : (
//                     chats.map((msg, index) => {
//                         const isMe = msg.senderId === user._id;
                        
//                         return (
//                             <div key={index} className={`flex w-full ${isMe ? "justify-end" : "justify-start"} mb-2`}>
//                                 <div className={`relative max-w-[70%] px-3 py-2 rounded-lg shadow-md ${
//                                     isMe 
//                                     ? "bg-[#005c4b] text-white rounded-tr-none" 
//                                     : "bg-[#202c33] text-white rounded-tl-none"
//                                 }`}>
//                                     {/* Name for others only */}
//                                     {!isMe && (
//                                         <div className="text-[11px] font-bold text-orange-400 mb-1">
//                                             {msg.senderName}
//                                         </div>
//                                     )}
                                    
//                                     <div className="text-[14px] leading-relaxed pr-10">
//                                         {msg.text}
//                                     </div>

//                                     {/* Timestamp at bottom right of bubble */}
//                                     <div className="text-[9px] text-gray-400 absolute bottom-1 right-2">
//                                         {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                     </div>
//                                 </div>
//                             </div>
//                         );
//                     })
//                 )}
//                 <div ref={scrollRef} />
//             </div>

//             {/* Input Bar */}
//             <form onSubmit={handleSendchat} className="p-3 bg-[#202c33] flex items-center gap-3">
//                 <input
//                     type="text"
//                     value={chat}
//                     onChange={(e) => setchat(e.target.value)}
//                     placeholder="Type a chat"
//                     className="flex-1 bg-[#2a3942] text-white border-none rounded-lg py-2.5 px-4 focus:ring-0 outline-none text-sm placeholder:text-gray-500"
//                 />
//                 <button 
//                     type="submit"
//                     disabled={!chat.trim()}
//                     className="bg-[#00a884] hover:bg-[#008f6f] text-black p-2.5 rounded-full transition-all active:scale-90 disabled:opacity-50"
//                 >
//                     <Send size={20} />
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default TeamChat;