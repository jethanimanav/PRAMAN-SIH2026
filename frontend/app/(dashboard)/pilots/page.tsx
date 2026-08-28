"use client";

import { usePraman } from "@/lib/PramanContext";
import { Panel, Empty, Action, AlertBanner, kpiTrace } from "@/components/ui";
import { Badge } from "@/components/Badge";
import { TestTube2, CheckCircle2, Sparkles, TrendingUp, Clock, MapPin, Wallet } from "lucide-react";

export default function PilotsPage() {
  const { pilot, fastForward, loading, error, setTrace } = usePraman();

  const timelineCompleted = pilot ? pilot.timeline.indexOf(pilot.status) : -1;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Problem to Pilot</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Pilots</h1>
        <p className="mt-1 text-sm text-slate-500">Controlled pilot workspace with milestone tracking and KPI evidence</p>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      {pilot ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            {/* Pilot overview */}
            <Panel title="Pilot Overview" icon={<TestTube2 size={15} />}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{pilot.name}</h2>
                  <p className="text-sm text-slate-500 mt-1">{pilot.startup} · {pilot.department}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <MapPin size={13} /> {pilot.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Wallet size={13} /> {pilot.budget}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge tone={pilot.success ? "signal" : "amber"}>{pilot.status}</Badge>
                  {pilot.success && (
                    <div className="mt-2">
                      <button
                        className="text-3xl font-black text-[#168675]"
                        onClick={() => setTrace(kpiTrace("Pilot Success Score", "KPI evaluation engine", `${pilot.success?.score}/100`))}
                      >
                        {pilot.success?.score}
                      </button>
                      <p className="text-xs text-slate-400">/100 success</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Pilot Milestones</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {pilot.timeline.map((stage: string, i: number) => {
                    const done = i <= timelineCompleted;
                    const active = stage === pilot.status;
                    return (
                      <div key={stage} className={`flex shrink-0 flex-col items-center gap-1.5 rounded-lg border px-3 py-2 text-center ${
                        done ? "border-[#168675] bg-emerald-50" : "border-slate-200 bg-slate-50"
                      }`}>
                        {done ? (
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                        )}
                        <p className={`text-[10px] font-semibold ${done ? "text-emerald-700" : "text-slate-400"}`}>{stage}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {!pilot.success && (
                <div className="mt-4 flex gap-2">
                  <Action onClick={fastForward} label="Fast-Forward to Final Evaluation" icon={<TrendingUp size={14} />} disabled={loading === "Fast-forwarding pilot"} />
                </div>
              )}
            </Panel>

            {/* KPI Results */}
            {pilot.kpis?.length > 0 && (
              <Panel title="KPI Results" icon={<TrendingUp size={15} />}>
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-left">
                        <th className="border-b border-slate-200 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">KPI</th>
                        <th className="border-b border-slate-200 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">Baseline</th>
                        <th className="border-b border-slate-200 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">Target</th>
                        <th className="border-b border-slate-200 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">Actual</th>
                        <th className="border-b border-slate-200 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pilot.kpis.map((kpi: any) => (
                        <tr key={kpi.name} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-3 font-semibold text-slate-800">{kpi.name}</td>
                          <td className="px-4 py-3 text-slate-500">{kpi.baseline}</td>
                          <td className="px-4 py-3 text-slate-500">{kpi.target}</td>
                          <td className="px-4 py-3">
                            <button
                              className="font-bold text-[#168675] hover:underline"
                              onClick={() => setTrace(kpiTrace(kpi.name, "KPI_Summary_May.xlsx", kpi.actual))}
                            >
                              {kpi.actual}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <Badge tone={kpi.met ? "signal" : "critical"}>{kpi.met ? "Met" : "Not Met"}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {pilot.success && (
                  <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-emerald-800">{pilot.success.label}</p>
                        <p className="text-xs text-emerald-600 mt-0.5">{pilot.success.summary}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Panel>
            )}
          </div>

          {/* Right panel */}
          <div className="space-y-5">
            <Panel title="Objectives">
              <ul className="space-y-2">
                {pilot.objectives?.map((obj: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#168675]" />
                    {obj}
                  </li>
                ))}
              </ul>
            </Panel>

            {pilot.success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                <CheckCircle2 size={28} className="mx-auto text-emerald-500 mb-2" />
                <p className="text-base font-bold text-emerald-800">Pilot Successful</p>
                <p className="text-xs text-emerald-600 mt-1">Procurement Readiness can now be calculated</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Panel title="Pilot Workspace" icon={<TestTube2 size={15} />}>
          <Empty text="Shortlist a startup from the Matching & Ranking page to create a pilot workspace." action="Go to Matching & Ranking" />
        </Panel>
      )}
    </div>
  );
}
