"use client";

import { usePraman } from "@/lib/PramanContext";
import { Panel, Action, AlertBanner, kpiTrace, Empty, BlockerAlert, StatCard, OfficialRecordHeader, RecordMeta } from "@/components/ui";
import { Badge } from "@/components/Badge";
import { GitBranch, Play, CheckCircle2, AlertTriangle, Clock, CalendarDays, ArrowRight } from "lucide-react";
import type { ImplementationTask } from "@/types/praman";
import Link from "next/link";

export default function ImplementationPage() {
  const { implementation, initImplementation, resolveBlocker, loading, error, setTrace } = usePraman();

  if (!implementation) {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--saffron)" }}>
            Implementation
          </p>
          <h1 className="mt-0.5 text-xl font-black" style={{ color: "var(--ink)" }}>Implementation Command Center</h1>
          <p className="mt-0.5 text-[11px]" style={{ color: "var(--ink-soft)" }}>Initialize the implementation tracking workspace from the procurement handoff.</p>
        </div>
        <Panel title="Implementation Workspace">
          <Empty text="No active implementation plan. Initialize from the handoff data to begin tracking." action="Initialize Implementation Plan" />
          <div className="mt-4">
            <Action onClick={initImplementation} label="Initialize Implementation Plan" icon={<Play size={13} />} />
          </div>
        </Panel>
      </div>
    );
  }

  const tasks: ImplementationTask[] = implementation.tasks;
  const completed  = tasks.filter(t => t.status === "Completed").length;
  const inProgress = tasks.filter(t => t.status === "In Progress").length;
  const blocked    = tasks.filter(t => t.status === "Blocked").length;
  const notStarted = tasks.filter(t => t.status === "Not Started").length;
  const overallPct = Math.round(tasks.reduce((a, t) => a + (t.completion_pct ?? 0), 0) / tasks.length);
  const isBlocked  = blocked > 0 && !implementation.blocker_resolved;

  const primaryBlocker = tasks.find(t => t.status === "Blocked" && t.priority === "Critical");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--saffron)" }}>
            Implementation
          </p>
          <h1 className="mt-0.5 text-xl font-black" style={{ color: "var(--ink)" }}>Implementation Command Center</h1>
          <p className="mt-0.5 text-[11px]" style={{ color: "var(--ink-soft)" }}>
            {implementation.name} · {implementation.startup} · {implementation.department}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/implementation/dependencies"
            className="inline-flex items-center gap-2 rounded px-3 py-1.5 text-[11px] font-semibold text-white transition"
            style={{ background: "var(--gov-blue)" }}
          >
            <GitBranch size={13} /> Dependency Graph
          </Link>
          <Link
            href="/implementation/responsibilities"
            className="inline-flex items-center gap-2 rounded border px-3 py-1.5 text-[11px] font-semibold transition"
            style={{ borderColor: "var(--line)", color: "var(--ink-mid)", background: "var(--white)" }}
          >
            Responsibility Matrix
          </Link>
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      {/* Official Record Header */}
      <OfficialRecordHeader
        recordId="IMPL-MH-2026-1042"
        department="Urban Development / PWD"
        createdDate="01 Oct 2026"
        owner="Ananya Deshmukh"
        status={isBlocked ? "Blocked" : completed === tasks.length ? "Completed" : "Active"}
      >
        <RecordMeta label="Startup" value={implementation.startup} />
        <RecordMeta label="Overall Progress" value={`${overallPct}%`} />
      </OfficialRecordHeader>

      {/* Implementation Status Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Completed Tasks"  value={completed}  sub={`of ${tasks.length}`} accent="green" />
        <StatCard label="In Progress"      value={inProgress} sub="Active tasks"           accent="blue" />
        <StatCard label="Blocked"          value={blocked}    sub="Needs attention"         accent={blocked > 0 ? "red" : "green"} />
        <StatCard label="Not Started"      value={notStarted} sub="Pending"                 accent="blue" />
      </div>

      {/* Overall Health */}
      <div className="rounded border bg-white px-5 py-4" style={{ borderColor: "var(--line)" }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>
            Implementation Health
          </p>
          <p className="text-[13px] font-black" style={{ color: isBlocked ? "var(--critical)" : "var(--gov-blue)" }}>
            {overallPct}% · {isBlocked ? "AT RISK" : "On Track"}
          </p>
        </div>
        <div className="h-2.5 rounded-full" style={{ background: "var(--mist)" }}>
          <div
            className="h-2.5 rounded-full transition-all"
            style={{ width: `${overallPct}%`, background: isBlocked ? "var(--critical)" : "var(--gov-blue)" }}
          />
        </div>
      </div>

      {/* Blocker Alert */}
      {isBlocked && primaryBlocker && (
        <BlockerAlert
          title="Government API Integration — Not Ready"
          impact={[
            "Deploy SkylineAI Platform → Blocked",
            "Field Testing → Blocked",
            "Final Acceptance → Blocked",
          ]}
          authority="IT Department — IT Lead"
          onNotify={() => resolveBlocker(primaryBlocker.id)}
        />
      )}

      {/* Task Table */}
      <div className="rounded border bg-white overflow-hidden" style={{ borderColor: "var(--line)" }}>
        <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: "var(--line)" }}>
          <h2 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-mid)" }}>
            Task Register
          </h2>
          <span className="text-[10px]" style={{ color: "var(--ink-soft)" }}>{tasks.length} tasks · PIL-MH-2026-022</span>
        </div>
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Owner</th>
                <th>Dept.</th>
                <th>Deadline</th>
                <th>Progress</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} style={task.status === "Blocked" ? { background: "#fff5f5" } : {}}>
                  <td>
                    <p className="font-semibold text-[12px]" style={{ color: "var(--ink)" }}>{task.name}</p>
                    <p className="text-[10px] line-clamp-1" style={{ color: "var(--ink-soft)" }}>{task.description.slice(0, 60)}…</p>
                    {task.notes && task.status === "Blocked" && (
                      <p className="text-[10px] mt-0.5 font-medium" style={{ color: "var(--critical)" }}>
                        ⚠ {task.notes.slice(0, 70)}
                      </p>
                    )}
                  </td>
                  <td className="text-[11px]">{task.owner}</td>
                  <td className="text-[11px]">{task.department}</td>
                  <td className="text-[11px] font-mono">{task.deadline}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full" style={{ background: "var(--mist)" }}>
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${task.completion_pct}%`,
                            background: task.status === "Completed" ? "var(--success)" : task.status === "Blocked" ? "var(--critical)" : "var(--gov-blue)"
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold" style={{ color: "var(--ink-soft)" }}>{task.completion_pct}%</span>
                    </div>
                  </td>
                  <td>
                    <Badge tone={task.priority === "Critical" ? "critical" : task.priority === "High" ? "amber" : "neutral"}>
                      {task.priority}
                    </Badge>
                  </td>
                  <td>
                    <span
                      className="status-pill"
                      style={
                        task.status === "Completed"  ? { background: "var(--success-light)", color: "var(--success)", border: "1px solid #bbf7d0" } :
                        task.status === "In Progress"? { background: "var(--info-light)", color: "var(--info)", border: "1px solid #bfdbfe" } :
                        task.status === "Blocked"    ? { background: "var(--critical-light)", color: "var(--critical)", border: "1px solid #fecaca" } :
                                                       { background: "var(--mist)", color: "var(--ink-soft)", border: "1px solid var(--line)" }
                      }
                    >
                      {task.status === "Completed" && <CheckCircle2 size={9} />}
                      {task.status === "Blocked" && <AlertTriangle size={9} />}
                      {task.status}
                    </span>
                  </td>
                  <td>
                    {task.evidence ? (
                      <button
                        className="text-[10px] font-semibold hover:underline"
                        style={{ color: "var(--gov-blue)" }}
                        onClick={() => setTrace(kpiTrace(task.name, "task_evidence.pdf", task.evidence ?? ""))}
                      >
                        {task.evidence}
                      </button>
                    ) : (
                      <span className="text-[10px]" style={{ color: "var(--ink-soft)" }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
