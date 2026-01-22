import React from "react";
import SideBar from "../components/SideBar";
import { useSelector } from "react-redux";
import {
  Target,
  TrendingUp,
  Clock,
  Users,
  AlertTriangle,
  BarChart3,
  Activity
} from "lucide-react";

export default function SprintIntelligenceWrap() {
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  /* ---- Intelligence Output (Derived from Schema) ---- */
  const intelligence = {
    sprint: {
      name: "Sprint 1 - Login Feature",
      duration: "14 days",
      goal: "Enable secure login and password recovery",
      plannedSP: 20,
      deliveredSP: 17,
      scopeCreep: 15
    },
    predictability: {
      reliability: 85,
      carryover: 12,
      volatility: "Moderate"
    },
    effort: {
      estimatedHours: 120,
      actualHours: 138,
      overrun: 15
    },
    workload: [
      { dev: "Alice Johnson", hours: 42, deviation: "+24%" },
      { dev: "Bob Smith", hours: 33, deviation: "+2%" },
      { dev: "Carol White", hours: 25, deviation: "-18%" }
    ],
    blockers: {
      count: 3,
      mttr: "1.9 days",
      dominantCause: "External API dependency"
    },
    standups: {
      consistency: 91,
      actionable: 82,
      vague: 18
    },
    stability: {
      green: 8,
      amber: 4,
      red: 2
    },
    conclusions: [
      "Sprint commitment reliability improved but remains sensitive to late-stage scope changes",
      "Backend-related blockers disproportionately impacted delivery predictability",
      "Workload distribution indicates early signs of contributor saturation",
      "Standup NLP quality remained stable, supporting reliable automation"
    ]
  };

  return (
    <div className="flex min-h-screen bg-[#0b0f1a] text-gray-200">
      <SideBar />

      <main className={`flex-1 transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-10 max-w-7xl mx-auto space-y-14">

          {/* HEADER */}
          <header>
            <p className="text-[10px] uppercase tracking-[0.3em] text-blue-400 font-black">
              Sprint Intelligence Wrap
            </p>
            <h1 className="text-3xl font-black text-white mt-2">
              {intelligence.sprint.name}
            </h1>
            <p className="text-gray-400 mt-1 max-w-3xl">
              {intelligence.sprint.goal}
            </p>
          </header>

          {/* SCOPE REALITY */}
          <Section title="Sprint Scope Reality" icon={<Target />}>
            <Grid>
              <Metric label="Planned Story Points" value={intelligence.sprint.plannedSP} />
              <Metric label="Delivered Story Points" value={intelligence.sprint.deliveredSP} />
              <Metric label="Scope Creep" value={`${intelligence.sprint.scopeCreep}%`} />
              <Metric label="Sprint Duration" value={intelligence.sprint.duration} />
            </Grid>
          </Section>

          {/* PREDICTABILITY */}
          <Section title="Commitment & Predictability" icon={<TrendingUp />}>
            <Grid>
              <Metric label="Commitment Reliability" value={`${intelligence.predictability.reliability}%`} />
              <Metric label="Carryover Ratio" value={`${intelligence.predictability.carryover}%`} />
              <Metric label="Execution Volatility" value={intelligence.predictability.volatility} />
            </Grid>
          </Section>

          {/* EFFORT */}
          <Section title="Time & Effort Forensics" icon={<Clock />}>
            <Grid>
              <Metric label="Estimated Hours" value={`${intelligence.effort.estimatedHours}h`} />
              <Metric label="Actual Hours" value={`${intelligence.effort.actualHours}h`} />
              <Metric label="Overrun" value={`${intelligence.effort.overrun}%`} />
            </Grid>
          </Section>

          {/* WORKLOAD */}
          <Section title="Developer Load Distribution" icon={<Users />}>
            <div className="space-y-4">
              {intelligence.workload.map((w, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="font-bold text-gray-300">{w.dev}</span>
                  <span className="font-mono text-gray-400">
                    {w.hours}h ({w.deviation})
                  </span>
                </div>
              ))}
            </div>
          </Section>

          {/* BLOCKERS */}
          <Section title="Blocker Impact Analysis" icon={<AlertTriangle />}>
            <Grid>
              <Metric label="Total Blockers" value={intelligence.blockers.count} />
              <Metric label="Mean Resolution Time" value={intelligence.blockers.mttr} />
              <Metric label="Dominant Cause" value={intelligence.blockers.dominantCause} />
            </Grid>
          </Section>

          {/* STANDUPS */}
          <Section title="Standup Signal Quality" icon={<Activity />}>
            <Grid>
              <Metric label="Consistency Score" value={`${intelligence.standups.consistency}%`} />
              <Metric label="Actionable Updates" value={`${intelligence.standups.actionable}%`} />
              <Metric label="Vague Updates" value={`${intelligence.standups.vague}%`} />
            </Grid>
          </Section>

          {/* STABILITY */}
          <Section title="Sprint Stability Timeline" icon={<BarChart3 />}>
            <Grid>
              <Metric label="Stable Days" value={intelligence.stability.green} />
              <Metric label="Warning Days" value={intelligence.stability.amber} />
              <Metric label="Critical Days" value={intelligence.stability.red} />
            </Grid>
          </Section>

          {/* CONCLUSIONS */}
          <Section title="System-Level Conclusions">
            <ul className="space-y-3 text-sm text-gray-400">
              {intelligence.conclusions.map((c, i) => (
                <li key={i}>• {c}</li>
              ))}
            </ul>
          </Section>

        </div>
      </main>
    </div>
  );
}

/* ---------- UI Primitives ---------- */

const Section = ({ title, icon, children }) => (
  <section className="bg-[#111827] border border-white/5 rounded-[2rem] p-8">
    <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-3 mb-6">
      {icon} {title}
    </h2>
    {children}
  </section>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {children}
  </div>
);

const Metric = ({ label, value }) => (
  <div className="bg-black/30 border border-white/10 rounded-xl p-5">
    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-black">
      {label}
    </p>
    <p className="text-2xl font-black text-white mt-1">{value}</p>
  </div>
);
