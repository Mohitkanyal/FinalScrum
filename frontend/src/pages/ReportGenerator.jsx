// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Loader2 } from "lucide-react";
// import { useSelector } from "react-redux";
// import Sidebar from "../components/SideBar";

// export default function ReportGeneration() {
//   const isOpen = useSelector((state) => state.sidebar.isOpen);

//   const [reportType, setReportType] = useState("sprint");
//   const [loading, setLoading] = useState(false);
//   const [report, setReport] = useState("");
//   const [error, setError] = useState("");

//   const [sprints, setSprints] = useState([]);
//   const [selectedId, setSelectedId] = useState("");

//   // Fetch sprints for dropdown
//   useEffect(() => {
//     if (reportType === "sprint") {
//       axios.get("http://localhost:5000/get_sprints").then((res) => {
//         setSprints(res.data.sprints);
//       });
//     }
//   }, [reportType]);

//   const handleGenerate = async () => {
//     if (!selectedId) {
//       setError("Please select a valid ID");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setReport("");

//     try {
//       const res = await axios.post(
//         "http://localhost:5000/generate_report",
//         {
//           type: reportType,
//           id: selectedId,
//         }
//       );

//       setReport(res.data.report);
//     } catch (err) {
//       setError(err.response?.data?.error || "Report generation failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-[#121212] text-white">
//       <Sidebar />

//       <main
//         className={`flex-1 transition-all duration-300 ${
//           isOpen ? "ml-64" : "ml-20"
//         }`}
//       >
//         {/* Header */}
//         <header className="px-8 py-5 border-b border-white/10 bg-[#141414]">
//           <h2 className="text-2xl font-semibold text-blue-400">
//             📊 AI Report Generator
//           </h2>
//         </header>

//         {/* Content */}
//         <div className="p-8 flex justify-center">
//           <div className="w-full max-w-4xl bg-[#1c1c1c] border border-white/10 rounded-2xl shadow-xl p-8">

//             {/* Report Type */}
//             <div className="mb-6">
//               <label className="block mb-2 text-sm text-gray-300">
//                 Report Type
//               </label>
//               <select
//                 value={reportType}
//                 onChange={(e) => {
//                   setReportType(e.target.value);
//                   setSelectedId("");
//                 }}
//                 className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-gray-600"
//               >
//                 <option value="sprint">Sprint</option>
//                 <option value="standup">Standup</option>
//               </select>
//             </div>

//             {/* Sprint Dropdown */}
//             {reportType === "sprint" && (
//               <div className="mb-6">
//                 <label className="block mb-2 text-sm text-gray-300">
//                   Select Sprint
//                 </label>
//                 <select
//                   value={selectedId}
//                   onChange={(e) => setSelectedId(e.target.value)}
//                   className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-gray-600"
//                 >
//                   <option value="">-- Select Sprint --</option>
//                   {sprints.map((s) => (
//                     <option key={s._id} value={s._id}>
//                       {s.name} — {s.status}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}

//             {/* Standup ID */}
//             {reportType === "standup" && (
//               <div className="mb-6">
//                 <label className="block mb-2 text-sm text-gray-300">
//                   Standup ID
//                 </label>
//                 <input
//                   value={selectedId}
//                   onChange={(e) => setSelectedId(e.target.value)}
//                   placeholder="MongoDB ObjectId"
//                   className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-gray-600"
//                 />
//               </div>
//             )}

//             {/* Button */}
//             <button
//               onClick={handleGenerate}
//               disabled={loading}
//               className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
//             >
//               {loading ? (
//                 <Loader2 className="animate-spin mx-auto" />
//               ) : (
//                 "Generate AI Report"
//               )}
//             </button>

//             {/* Error */}
//             {error && <p className="text-red-400 mt-4">{error}</p>}

//             {/* Report Output */}
//             {report && (
//               <pre className="mt-6 bg-[#2a2a2a] p-5 rounded-xl text-sm whitespace-pre-wrap max-h-96 overflow-auto">
//                 {report}
//               </pre>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import Sidebar from "../components/SideBar";

export default function ReportGeneration() {
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  const [reportType, setReportType] = useState("sprint");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");
  const [error, setError] = useState("");
  const [sprints, setSprints] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    if (reportType === "sprint") {
      axios.get("http://localhost:5000/get_sprints").then((res) => {
        setSprints(res.data.sprints);
      });
    }
  }, [reportType]);

  const handleGenerate = async () => {
    if (!selectedId) {
      setError("Please select a valid identifier");
      return;
    }

    setLoading(true);
    setError("");
    setReport("");

    try {
      const res = await axios.post("http://localhost:5000/generate_report", {
        type: reportType,
        id: selectedId,
      });
      setReport(res.data.report);
    } catch (err) {
      setError("Report generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-200">
      <Sidebar />
      <main className={`flex-1 ${isOpen ? "ml-64" : "ml-20"} p-8`}>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold">AI Report Generator</h1>
          <p className="text-slate-400 mt-1">
            Generate structured sprint and standup summaries
          </p>
        </div>

        <div className="max-w-4xl bg-[#111827] border border-slate-700 rounded-xl p-8">
          <div className="mb-6">
            <label className="text-sm text-slate-400">Report Type</label>
            <select
              className="w-full mt-2 p-3 bg-[#1e293b] border border-slate-600 rounded-lg"
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
                setSelectedId("");
              }}
            >
              <option value="sprint">Sprint Report</option>
              <option value="standup">Standup Report</option>
            </select>
          </div>

          {reportType === "sprint" && (
            <div className="mb-6">
              <label className="text-sm text-slate-400">Sprint</label>
              <select
                className="w-full mt-2 p-3 bg-[#1e293b] border border-slate-600 rounded-lg"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                <option value="">Select Sprint</option>
                {sprints.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} — {s.status}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 transition p-3 rounded-lg font-semibold"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Generate Report"}
          </button>

          {error && <p className="text-red-400 mt-4">{error}</p>}

          {report && (
            <pre className="mt-6 bg-[#1e293b] p-5 rounded-lg text-sm max-h-96 overflow-auto">
              {report}
            </pre>
          )}
        </div>
      </main>
    </div>
  );
}
