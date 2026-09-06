"use client";

import { usePraman } from "@/lib/PramanContext";
import { Action, AlertBanner, StatCard, OfficialRecordHeader, RecordMeta } from "@/components/ui";
import { Badge } from "@/components/Badge";
import {
  Play, RotateCcw, Sparkles, CheckCircle2, Target, Users, TestTube2,
  TrendingUp, FileText, ListChecks, ShieldCheck, Package, Circle,
  ChevronRight, ArrowRight, AlertTriangle, Database, Activity,
} from "lucide-react";
import Link from "next/link";

const PIPELINE = [
  { label: "Problem",        href: "/problems" },
  { label: "Requirement",    href: "/requirements" },
  { label: "Matching",       href: "/matching" },
  { label: "Evidence",       href: "/evidence" },
  { label: "Pilot",          href: "/pilots" },
  { label: "Readiness",      href: "/readiness" },
  { label: "Decision",       href: "/decisions" },
  { label: "Implementation", href: "/implementation" },
  { label: "Outcome",        href: "/outcomes" },
];

export default function DashboardPage() {
  const {
    problem, requirement, recommendations, pilot, readiness, decision, handoff, scale,
    health, loading, error, currentStage, audit,
    launchDemo, structure, approve, matchStartups, shortlist, fastForward, calculateReadiness,
    implementation, monitoring, outcome, riskRadar,
  } = usePraman();

  const recentAudit = audit.slice(-4).reverse();

  const blockedTasks = (implementation?.tasks ?? []).filter((t: any) => t.status === "Blocked").length;
  const criticalRisks = riskRadar.filter((r: any) => r.level === "High").length;

  return (
    <div className="space-y-5">

      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--saffron)" }}>
            PRAMAN · Command Center
          </p>
          <h1 className="mt-0.5 text-xl font-black tracking-tight" style={{ color: "var(--ink)" }}>
            Government Innovation Procurement
          </h1>
          <p className="mt-0.5 text-[11px]" style={{ color: "var(--ink-soft)" }}>
            From Government Need → Verified Solution → Measurable Outcome · SIH 2026 · PS 26136
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="saffron">DEMO MODE</Badge>
          <Badge tone="gov">{health?.status ?? "READY FOR DEMO"}</Badge>
          <Action onClick={launchDemo} label="Load Hero Scenario" icon={<Play size={13} />} size="sm" />
          <Action onClick={launchDemo} label="Reset" icon={<RotateCcw size={13} />} muted size="sm" />
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} />}
      {loading && (
        <div className="flex items-center gap-3 rounded border px-4 py-2.5 text-[12px]"
          style={{ background: "var(--gov-blue-light)", borderColor: "var(--gov-blue-border)", color: "var(--gov-blue)" }}>
          <Sparkles size={14} className="animate-pulse shrink-0" />
          <span className="font-semibold">{loading}…</span>
          <span className="ml-auto text-[10px]" style={{ color: "var(--ink-soft)" }}>PRAMAN Intelligence Engine</span>
        </div>
      )}

      {/* ── Procurement Intelligence Overview ── */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: "var(--ink-soft)" }}>
          Procurement Intelligence Overview
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard label="Active Problems" value={problem ? 1 : 0} sub="Government Challenges" accent="blue" />
          <StatCard label="Under Evaluation" value={recommendations.length} sub="Startups Ranked" accent="blue" />
          <StatCard label="Pilots Running" value={pilot ? 1 : 0} sub="Active Pilots" accent={pilot ? "green" : "blue"} />
          <StatCard label="Blocked Tasks" value={blockedTasks} sub="Needs Attention" accent={blockedTasks > 0 ? "red" : "green"} />
          <StatCard label="Critical Risks" value={criticalRisks} sub="Risk Radar" accent={criticalRisks > 0 ? "amber" : "green"} />
          <StatCard label="Monitoring Records" value={monitoring.length} sub="Post-Deployment" accent="blue" />
        </div>
      </div>

      {/* ── Active Government Challenge ── */}
      {problem && (
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: "var(--ink-soft)" }}>
            Active Government Challenge
          </p>
          <OfficialRecordHeader
            recordId="PRB-MH-2026-1042"
            department="Public Works Department"
            createdDate="08 Aug 2026"
            owner="Ananya Deshmukh"
            status={requirement ? requirement.status === "Approved" ? "Approved" : "Generated" : "Draft"}
            auditCount={audit.length}
          >
            <RecordMeta label="Priority" value="HIGH" />
            <RecordMeta label="Domain" value={problem.domain} />
            <RecordMeta label="Location" value={problem.location} />
          </OfficialRecordHeader>

          <div className="rounded border bg-white p-4" style={{ borderColor: "var(--line)" }}>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <h2 className="text-[15px] font-bold" style={{ color: "var(--ink)" }}>{problem.title}</h2>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--ink-soft)" }}>{problem.department} · {problem.location}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/problems"
                  className="inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-[11px] font-semibold transition"
                  style={{ borderColor: "var(--gov-blue-border)", color: "var(--gov-blue)", background: "var(--gov-blue-light)" }}
                >
                  <FileText size={11} /> View Problem
                </Link>
                {recommendations.length > 0 && (
                  <Link
                    href="/matching"
                    className="inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-[11px] font-semibold text-white transition"
                    style={{ background: "var(--gov-blue)", borderColor: "var(--gov-blue)" }}
                  >
                    <Target size={11} /> View Matching <ArrowRight size={10} />
                  </Link>
                )}
              </div>
            </div>
            <p className="text-[12px] leading-relaxed line-clamp-2 mb-3" style={{ color: "var(--ink-mid)" }}>{problem.narrative}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                ["Budget", problem.budget],
                ["Timeline", `${problem.timeline_days} days`],
                ["Core KPI", problem.core_kpi],
                ["AI Matches", recommendations.length > 0 ? `${recommendations.length} startups ranked` : "Not run"],
              ].map(([k, v]) => (
                <div key={k} className="rounded px-3 py-2" style={{ background: "var(--mist)", border: "1px solid var(--line)" }}>
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>{k}</p>
                  <p className="mt-0.5 text-[11px] font-semibold" style={{ color: "var(--ink)" }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Procurement Lifecycle Pipeline ── */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: "var(--ink-soft)" }}>
          Procurement Lifecycle
        </p>
        <div className="rounded border bg-white p-4 overflow-x-auto" style={{ borderColor: "var(--line)" }}>
          <div className="flex items-center gap-1 min-w-max">
            {PIPELINE.map((stage, i) => {
              const stageIdx = PIPELINE.findIndex(s => s.label === stage.label);
              // Map pipeline stages to currentStage
              const stageMap: Record<string, number> = {
                "Problem": 0, "Requirement": 1, "Matching": 2, "Evidence": 3,
                "Pilot": 3, "Readiness": 4, "Decision": 5, "Implementation": 6, "Outcome": 7,
              };
              const thresh = stageMap[stage.label] ?? 99;
              const done = currentStage > thresh;
              const active = currentStage === thresh || (stage.label === "Problem" && currentStage === 0 && !!problem);
              return (
                <div key={stage.label} className="flex items-center gap-1">
                  <Link
                    href={stage.href}
                    className="flex items-center gap-1.5 rounded px-3 py-1.5 text-[11px] font-semibold transition"
                    style={
                      done
                        ? { background: "var(--gov-blue)", color: "white" }
                        : active
                          ? { background: "var(--gov-blue-light)", color: "var(--gov-blue)", border: "1px solid var(--gov-blue-border)" }
                          : { background: "var(--mist)", color: "var(--ink-soft)", border: "1px solid var(--line)" }
                    }
                  >
                    {done ? <CheckCircle2 size={11} /> : <Circle size={10} className="opacity-50" />}
                    {stage.label}
                  </Link>
                  {i < PIPELINE.length - 1 && <ChevronRight size={12} style={{ color: "var(--line)" }} className="shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* Left: Workflow Actions */}
        <div className="space-y-4">

          {/* Next Action */}
          <div className="rounded border p-4" style={{ background: "var(--gov-blue-light)", borderColor: "var(--gov-blue-border)", borderLeft: "4px solid var(--gov-blue)" }}>
            <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--gov-blue)" }}>
              Recommended Next Action
            </p>
            <p className="text-[14px] font-bold mb-3" style={{ color: "var(--ink)" }}>
              {!problem
                ? "Load Hero Scenario to Begin"
                : !requirement ? "Structure Requirements with PRAMAN AI"
                : requirement.status !== "Approved" ? "Approve Requirements"
                : !recommendations.length ? "Run Eligibility & Startup Matching"
                : !pilot ? "Shortlist Top-Ranked Startup"
                : !pilot.success ? "Fast-forward Pilot to Completion"
                : !readiness ? "Calculate Procurement Readiness"
                : !decision ? "Submit Human Decision"
                : !handoff ? "Generate Handoff Pack"
                : "Review Scale & Reuse Intelligence"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Action onClick={structure} label="Structure" icon={<Sparkles size={12} />} disabled={!problem || !!requirement} size="sm" />
              <Action onClick={approve} label="Approve Req" icon={<CheckCircle2 size={12} />} disabled={!requirement || requirement.status === "Approved"} size="sm" />
              <Action onClick={matchStartups} label="Run Matching" icon={<Target size={12} />} disabled={requirement?.status !== "Approved"} size="sm" />
              <Action onClick={shortlist} label="Shortlist" icon={<Users size={12} />} disabled={!recommendations.length || !!pilot} size="sm" />
              <Action onClick={fastForward} label="FF Pilot" icon={<TestTube2 size={12} />} disabled={!pilot || !!pilot.success} size="sm" />
              <Action onClick={calculateReadiness} label="Readiness" icon={<TrendingUp size={12} />} disabled={!pilot?.success || !!readiness} size="sm" />
              <Link
                href="/decisions"
                className="inline-flex items-center justify-center rounded px-3 py-1.5 text-[11px] font-semibold gap-1.5 transition"
                style={
                  readiness && !decision
                    ? { background: "var(--gov-blue)", color: "white" }
                    : { background: "var(--mist)", color: "var(--ink-soft)", pointerEvents: "none" }
                }
              >
                <ShieldCheck size={12} /> Decision
              </Link>
              <Link
                href="/handoff"
                className="inline-flex items-center justify-center rounded px-3 py-1.5 text-[11px] font-semibold gap-1.5 transition"
                style={
                  decision && !handoff
                    ? { background: "var(--gov-blue)", color: "white" }
                    : { background: "var(--mist)", color: "var(--ink-soft)", pointerEvents: "none" }
                }
              >
                <Package size={12} /> Handoff
              </Link>
            </div>
          </div>

          {/* Workflow Status */}
          <div className="rounded border bg-white" style={{ borderColor: "var(--line)" }}>
            <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: "var(--line)" }}>
              <h2 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-mid)" }}>
                Workflow Status
              </h2>
              <span className="text-[10px]" style={{ color: "var(--ink-soft)" }}>PRB-MH-2026-1042</span>
            </div>
            <div>
              {[
                { label: "Government Problem",   status: problem ? "Loaded" : "Not started",                     done: !!problem,                href: "/problems" },
                { label: "Requirements",         status: requirement ? requirement.status : "Pending",            done: requirement?.status === "Approved", href: "/requirements" },
                { label: "Startup Matching",     status: recommendations.length ? `${recommendations.length} ranked` : "Not run", done: recommendations.length > 0, href: "/matching" },
                { label: "Pilot Management",     status: pilot ? pilot.status : "Not created",                   done: !!pilot?.success,          href: "/pilots" },
                { label: "Evidence Locker",      status: pilot?.kpis?.length ? `${pilot.kpis.length} KPIs` : "Awaiting pilot", done: pilot?.kpis?.length > 0, href: "/evidence" },
                { label: "Readiness Assessment", status: readiness ? `${readiness.score}/100 · ${readiness.band}` : "Not calculated", done: !!readiness, href: "/readiness" },
                { label: "Decision Register",    status: decision ? "Decision Submitted" : "Awaiting readiness", done: !!decision,               href: "/decisions" },
                { label: "Handoff Pack",         status: handoff ? "Generated" : "Awaiting decision",            done: !!handoff,                href: "/handoff" },
                { label: "Implementation",       status: implementation ? `${(implementation.tasks ?? []).filter((t: any) => t.status === "Completed").length} tasks done` : "Not started", done: !!outcome, href: "/implementation" },
              ].map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-2.5 border-b last:border-0 transition group"
                  style={{ borderColor: "var(--line)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--mist)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "")}
                >
                  <div className="flex items-center gap-2.5">
                    {item.done
                      ? <CheckCircle2 size={14} className="shrink-0" style={{ color: "var(--success)" }} />
                      : <Circle size={14} className="shrink-0" style={{ color: "var(--line)" }} />
                    }
                    <span className="text-[12px] font-medium" style={{ color: "var(--ink-mid)" }}>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px]" style={{ color: item.done ? "var(--success)" : "var(--ink-soft)", fontWeight: item.done ? 600 : 400 }}>
                      {item.status}
                    </span>
                    <ChevronRight size={12} style={{ color: "var(--line)" }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Stats + Audit */}
        <div className="space-y-4">

          {/* Risk summary */}
          {criticalRisks > 0 && (
            <div className="rounded border p-3.5" style={{ background: "#fff5f5", borderColor: "#fecaca", borderLeft: "3px solid var(--critical)" }}>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={13} style={{ color: "var(--critical)" }} />
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--critical)" }}>
                  {criticalRisks} Critical Risk{criticalRisks > 1 ? "s" : ""} Detected
                </p>
              </div>
              {riskRadar.filter((r: any) => r.level === "High").slice(0, 2).map((r: any, i: number) => (
                <p key={i} className="text-[11px] mt-0.5" style={{ color: "var(--ink-mid)" }}>
                  · {r.category}: {r.reason.slice(0, 80)}…
                </p>
              ))}
              <Link href="/risk" className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold" style={{ color: "var(--critical)" }}>
                View Risk Radar <ArrowRight size={10} />
              </Link>
            </div>
          )}

          {/* Quick Links */}
          <div className="rounded border bg-white" style={{ borderColor: "var(--line)" }}>
            <div className="px-4 py-2.5 border-b" style={{ borderColor: "var(--line)" }}>
              <h2 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-mid)" }}>
                Intelligence Modules
              </h2>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--line)" }}>
              {[
                { icon: <Database size={13} />, label: "Institutional Memory", sub: "Historical project intelligence", href: "/memory" },
                { icon: <Activity size={13} />, label: "Audit Trail", sub: `${audit.length} events recorded`, href: "/audit" },
                { icon: <TrendingUp size={13} />, label: "Risk Radar", sub: `${riskRadar.length} risk dimensions`, href: "/risk" },
                { icon: <ShieldCheck size={13} />, label: "Transparency Portal", sub: "Public-safe view", href: "/transparency" },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 transition"
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--mist)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "")}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded shrink-0"
                    style={{ background: "var(--gov-blue-light)", color: "var(--gov-blue)" }}>
                    {item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold" style={{ color: "var(--ink)" }}>{item.label}</p>
                    <p className="text-[10px]" style={{ color: "var(--ink-soft)" }}>{item.sub}</p>
                  </div>
                  <ChevronRight size={12} style={{ color: "var(--line)" }} />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Audit */}
          <div className="rounded border bg-white" style={{ borderColor: "var(--line)" }}>
            <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: "var(--line)" }}>
              <h2 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-mid)" }}>
                Recent Audit Events
              </h2>
              <Link href="/audit" className="text-[10px] font-semibold" style={{ color: "var(--gov-blue)" }}>
                View all →
              </Link>
            </div>
            <div>
              {recentAudit.length ? recentAudit.map(e => (
                <div key={e.id} className="px-4 py-2.5 border-b last:border-0" style={{ borderColor: "var(--line)" }}>
                  <p className="text-[11px] font-semibold" style={{ color: "var(--ink)" }}>{e.action}</p>
                  <p className="text-[9px] mt-0.5" style={{ color: "var(--ink-soft)" }}>
                    {e.actor} · {new Date(e.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              )) : (
                <div className="px-4 py-6 text-center text-[11px]" style={{ color: "var(--ink-soft)" }}>
                  Audit events appear here as you proceed through the workflow.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
