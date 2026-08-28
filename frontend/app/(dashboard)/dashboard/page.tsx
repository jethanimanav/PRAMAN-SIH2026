"use client";

import { usePraman } from "@/lib/PramanContext";
import { Action, AlertBanner } from "@/components/ui";
import { Badge } from "@/components/Badge";
import {
  Play, RotateCcw, Sparkles, CheckCircle2, Target, Users, TestTube2,
  TrendingUp, FileText, ListChecks, ShieldCheck, Package, Circle,
  ArrowRight, ChevronRight, Clock
} from "lucide-react";
import Link from "next/link";

const STAGES = [
  { label: "Problem", key: 0 },
  { label: "Requirements", key: 1 },
  { label: "Matching", key: 2 },
  { label: "Pilot", key: 3 },
  { label: "Readiness", key: 4 },
  { label: "Handoff", key: 5 },
  { label: "Scale", key: 6 },
];

export default function DashboardPage() {
  const {
    problem, requirement, recommendations, pilot, readiness, decision, handoff, scale,
    health, loading, error, currentStage, audit,
    launchDemo, structure, approve, matchStartups, shortlist, fastForward, calculateReadiness,
  } = usePraman();

  // Determine what action to do next
  const nextAction = !problem
    ? { label: "Load Hero Scenario", step: "Start here" }
    : !requirement
    ? { label: "Structure Requirements with AI", step: "Step 1" }
    : requirement.status !== "Approved"
    ? { label: "Approve Requirements", step: "Step 2" }
    : !recommendations.length
    ? { label: "Run Eligibility & Matching", step: "Step 3" }
    : !pilot
    ? { label: "Shortlist a Startup", step: "Step 4" }
    : !pilot.success
    ? { label: "Fast-forward Pilot to Completion", step: "Step 5" }
    : !readiness
    ? { label: "Calculate Procurement Readiness", step: "Step 6" }
    : !decision
    ? { label: "Submit Human Decision", step: "Step 7" }
    : !handoff
    ? { label: "Generate Handoff Pack", step: "Step 8" }
    : { label: "Review Scale & Reuse", step: "Step 9" };

  const recentAudit = audit.slice(-3).reverse();

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Command Center</p>
          <h1 className="mt-1 text-2xl font-black text-slate-900 tracking-tight">PRAMAN Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Evidence-based innovation procurement · SIH 2026 · PS 26136</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="amber">DEMO MODE</Badge>
          <Badge tone="signal">{health?.status || "READY"}</Badge>
          <Action onClick={launchDemo} label="Load Hero Scenario" icon={<Play size={14} />} size="sm" />
          <Action onClick={launchDemo} label="Reset" icon={<RotateCcw size={14} />} muted size="sm" />
        </div>
      </div>

      {/* Error banner */}
      {error && <AlertBanner type="error" message={error} />}

      {/* Loading bar */}
      {loading && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Sparkles size={16} className="animate-pulse shrink-0" />
          <span className="font-semibold">{loading}…</span>
          <span className="ml-auto text-xs text-emerald-500">PRAMAN Intelligence</span>
        </div>
      )}

      {/* Lifecycle Progress */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">Procurement Lifecycle</h2>
          <span className="text-xs text-slate-400">Problem #1042 · AI Road Damage Detection</span>
        </div>
        <div className="px-5 py-4 overflow-x-auto">
          <div className="flex min-w-max items-center gap-1">
            {STAGES.map((stage, i) => {
              const done = currentStage > stage.key;
              const active = currentStage === stage.key;
              return (
                <div key={stage.key} className="flex items-center gap-1">
                  <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    done ? "bg-[#168675] text-white" : active ? "bg-emerald-50 text-[#168675] border border-[#168675]" : "bg-slate-50 text-slate-400 border border-slate-200"
                  }`}>
                    {done ? <CheckCircle2 size={12} /> : <span className="h-3 w-3 rounded-full border-2 border-current flex items-center justify-center text-[8px]">{i + 1}</span>}
                    {stage.label}
                  </div>
                  {i < STAGES.length - 1 && <ChevronRight size={14} className="text-slate-300 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* Left: Problem + Next Action */}
        <div className="space-y-5">
          {/* Next Action Card */}
          <div className="rounded-xl border border-[#168675]/30 bg-gradient-to-r from-emerald-50 to-white shadow-sm">
            <div className="px-5 py-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#168675] shadow">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">{nextAction.step} · What to do next</p>
                  <p className="mt-0.5 text-base font-bold text-slate-900">{nextAction.label}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Action onClick={structure} label="Structure" icon={<Sparkles size={13} />} disabled={!problem || !!requirement} size="sm" />
                <Action onClick={approve} label="Approve Req" icon={<CheckCircle2 size={13} />} disabled={!requirement || requirement.status === "Approved"} size="sm" />
                <Action onClick={matchStartups} label="Run Match" icon={<Target size={13} />} disabled={requirement?.status !== "Approved"} size="sm" />
                <Action onClick={shortlist} label="Shortlist" icon={<Users size={13} />} disabled={!recommendations.length || !!pilot} size="sm" />
                <Action onClick={fastForward} label="FF Pilot" icon={<TestTube2 size={13} />} disabled={!pilot || !!pilot.success} size="sm" />
                <Action onClick={calculateReadiness} label="Readiness" icon={<TrendingUp size={13} />} disabled={!pilot?.success || !!readiness} size="sm" />
                <Link href="/decisions" className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold gap-1.5 transition ${
                  readiness && !decision ? "bg-[#168675] text-white hover:bg-[#116f62] shadow-sm" : "bg-slate-100 text-slate-400 pointer-events-none cursor-not-allowed"
                }`}>
                  <ShieldCheck size={13} />Decision
                </Link>
                <Link href="/handoff" className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold gap-1.5 transition ${
                  decision && !handoff ? "bg-[#168675] text-white hover:bg-[#116f62] shadow-sm" : "bg-slate-100 text-slate-400 pointer-events-none cursor-not-allowed"
                }`}>
                  <Package size={13} />Handoff
                </Link>
              </div>
            </div>
          </div>

          {/* Current Problem */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-[#168675]">
                  <FileText size={14} />
                </span>
                <h2 className="text-sm font-bold text-slate-800">Active Problem</h2>
              </div>
              {problem && <Link href="/problems" className="text-xs font-semibold text-[#168675] hover:underline">View details →</Link>}
            </div>
            <div className="p-5">
              {problem ? (
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge tone="neutral">#{problem.display_id || "1042"}</Badge>
                      <h3 className="mt-2 text-base font-bold text-slate-900 leading-snug">{problem.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{problem.department} · {problem.location}</p>
                    </div>
                    <Badge tone={problem.status === "Draft" ? "amber" : "signal"}>{problem.status}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3">{problem.narrative}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      ["Budget", problem.budget],
                      ["Timeline", `${problem.timeline_days} days`],
                      ["Domain", problem.domain],
                      ["Core KPI", problem.core_kpi],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{k}</p>
                        <p className="mt-0.5 text-xs font-semibold text-slate-700">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Sparkles size={28} className="text-slate-300 mb-3" />
                  <p className="text-sm font-semibold text-slate-600">No hero problem loaded</p>
                  <p className="mt-1 text-xs text-slate-400">Click "Load Hero Scenario" to begin the demo</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Status Cards + Recent Audit */}
        <div className="space-y-5">
          {/* Status Summary */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-3.5">
              <h2 className="text-sm font-bold text-slate-800">Workflow Status</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { label: "Problem", status: problem ? "Loaded" : "Not started", done: !!problem, href: "/problems" },
                { label: "Requirements", status: requirement ? requirement.status : "Pending", done: requirement?.status === "Approved", href: "/requirements" },
                { label: "Matching", status: recommendations.length ? `${recommendations.length} startups ranked` : "Not run", done: recommendations.length > 0, href: "/matching" },
                { label: "Pilot", status: pilot ? pilot.status : "Not created", done: pilot?.success, href: "/pilots" },
                { label: "Evidence", status: pilot?.kpis?.length ? `${pilot.kpis.length} KPIs recorded` : "Awaiting pilot", done: pilot?.kpis?.length > 0, href: "/evidence" },
                { label: "Readiness", status: readiness ? `${readiness.score}/100 · ${readiness.band}` : "Not calculated", done: !!readiness, href: "/readiness" },
                { label: "Decision", status: decision ? "Submitted" : "Awaiting readiness", done: !!decision, href: "/decisions" },
                { label: "Handoff", status: handoff ? "Generated" : "Awaiting decision", done: !!handoff, href: "/handoff" },
              ].map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between px-5 py-2.5 hover:bg-slate-50 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    {item.done
                      ? <CheckCircle2 size={15} className="shrink-0 text-emerald-500" />
                      : <Circle size={15} className="shrink-0 text-slate-300" />
                    }
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs ${item.done ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>{item.status}</span>
                    <ChevronRight size={13} className="text-slate-300 group-hover:text-slate-400 transition" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Audit */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
              <h2 className="text-sm font-bold text-slate-800">Recent Activity</h2>
              <Link href="/audit" className="text-xs font-semibold text-[#168675] hover:underline">View all →</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {recentAudit.length ? recentAudit.map(e => (
                <div key={e.id} className="px-5 py-3">
                  <div className="flex items-start gap-2">
                    <Clock size={13} className="mt-0.5 shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{e.action}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {e.actor} · {new Date(e.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="px-5 py-6 text-center text-xs text-slate-400">
                  Actions will appear here as you proceed through the workflow.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
