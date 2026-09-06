"use client";

import { usePraman } from "@/lib/PramanContext";
import { AlertBanner, Empty, Panel } from "@/components/ui";
import { ArrowDown, AlertTriangle, CheckCircle2, Play, Clock, ShieldAlert } from "lucide-react";
import type { ImplementationTask } from "@/types/praman";
import Link from "next/link";

export default function DependencyGraphPage() {
  const { implementation, loading, error, resolveBlocker } = usePraman();

  if (!implementation) {
    return (
      <div className="space-y-5">
        <Panel title="Dependency Graph">
          <Empty text="No active implementation plan." action="Initialize Implementation Plan" />
        </Panel>
      </div>
    );
  }

  const tasks: ImplementationTask[] = implementation.tasks;
  const isBlocked = tasks.some(t => t.status === "Blocked");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return <CheckCircle2 size={16} className="text-emerald-500" />;
      case "In Progress": return <Play size={16} className="text-blue-500" />;
      case "Blocked": return <AlertTriangle size={16} className="text-red-500" />;
      default: return <Clock size={16} className="text-slate-400" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Completed": return "border-emerald-200 bg-emerald-50";
      case "In Progress": return "border-blue-200 bg-blue-50";
      case "Blocked": return "border-red-400 bg-red-50 shadow-md ring-2 ring-red-100";
      default: return "border-slate-200 bg-slate-50 opacity-70";
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Post-Procurement</p>
          <h1 className="mt-1 text-2xl font-black text-slate-900">Dependency Graph</h1>
          <p className="mt-1 text-sm text-slate-500">Visual cascade of task dependencies and blockers.</p>
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Left: Graph */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 flex flex-col items-center">
          {tasks.map((task, index) => (
            <div key={task.id} className="flex flex-col items-center w-full max-w-lg">
              {/* Node */}
              <div className={`w-full rounded-xl border p-4 transition-all ${getStatusClass(task.status)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(task.status)}
                    <div>
                      <h3 className={`font-bold ${task.status === 'Blocked' ? 'text-red-900' : 'text-slate-900'}`}>{task.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{task.owner} · {task.deadline}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${task.status === 'Blocked' ? 'text-red-600' : 'text-slate-500'}`}>
                    {task.status}
                  </span>
                </div>
              </div>
              
              {/* Edge */}
              {index < tasks.length - 1 && (
                <div className="flex flex-col items-center py-2">
                  <div className={`h-6 w-0.5 ${task.status === 'Blocked' ? 'bg-red-300' : 'bg-slate-300'}`} />
                  <ArrowDown size={16} className={`${task.status === 'Blocked' ? 'text-red-400' : 'text-slate-400'}`} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right: Insights */}
        <div className="space-y-5">
          {isBlocked && !implementation.blocker_resolved ? (
            <Panel title="Critical Blocker" icon={<ShieldAlert size={16} className="text-red-500" />}>
              <div className="space-y-4">
                <p className="text-sm text-slate-700">A blockage at <strong>Government API Integration</strong> is preventing execution of 3 downstream tasks.</p>
                <div className="rounded border border-red-100 bg-red-50 p-3 text-xs text-red-800 font-medium">
                  Impact: Schedule overrun risk is HIGH. Field testing cannot begin.
                </div>
                <button
                  onClick={() => resolveBlocker("task-02")}
                  disabled={loading === "Resolving blocker"}
                  className="w-full flex items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {loading === "Resolving blocker" ? "Recovering..." : "Resolve Blocker"}
                </button>
              </div>
            </Panel>
          ) : (
            <Panel title="Status">
              <div className="rounded border border-emerald-100 bg-emerald-50 p-3 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" size={16} />
                <p className="text-sm font-medium text-emerald-800">No active blockers. Critical path is clear.</p>
              </div>
            </Panel>
          )}

          <Panel title="Legend">
             <div className="space-y-2 text-sm text-slate-600">
               <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-emerald-400" /> Completed</div>
               <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-blue-400" /> In Progress</div>
               <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-red-400" /> Blocked</div>
               <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-slate-300" /> Not Started</div>
             </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
