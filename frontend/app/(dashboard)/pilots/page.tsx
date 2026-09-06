"use client";

import { usePraman } from "@/lib/PramanContext";
import { Panel, AlertBanner, Action, Empty, KpiRow, OfficialRecordHeader, RecordMeta } from "@/components/ui";
import { Badge } from "@/components/Badge";
import { TestTube2, CheckCircle2, TrendingUp, MapPin, Wallet, ArrowRight, CalendarDays } from "lucide-react";
import { kpiTrace } from "@/components/ui";
import Link from "next/link";

export default function PilotsPage() {
  const { pilot, fastForward, loading, error, setTrace } = usePraman();

  const timelineCompleted = pilot ? pilot.timeline.indexOf(pilot.status) : -1;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--saffron)" }}>
          Validation
        </p>
        <h1 className="mt-0.5 text-xl font-black" style={{ color: "var(--ink)" }}>Pilot Monitoring</h1>
        <p className="mt-0.5 text-[11px]" style={{ color: "var(--ink-soft)" }}>
          Controlled pilot workspace · milestone tracking · KPI performance verification
        </p>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      {pilot ? (
        <div className="space-y-5">
          {/* Official Record */}
          <OfficialRecordHeader
            recordId="PIL-MH-2026-022"
            department={pilot.department}
            createdDate="01 Oct 2026"
            owner="Ananya Deshmukh"
            status={pilot.success ? "Completed" : pilot.status === "Pilot Created" ? "Active" : "Active"}
          >
            <RecordMeta label="Startup" value={pilot.startup} />
            <RecordMeta label="Location" value={pilot.location} />
            <RecordMeta label="Budget" value={pilot.budget} />
          </OfficialRecordHeader>

          <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
            <div className="space-y-4">
              {/* Pilot Overview Card */}
              <div className="rounded border bg-white" style={{ borderColor: "var(--line)" }}>
                <div
                  className="px-4 py-2.5 border-b"
                  style={{ borderColor: "var(--line)", background: "var(--gov-blue)" }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white">Pilot Record</p>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-[15px] font-bold" style={{ color: "var(--ink)" }}>{pilot.name}</h2>
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--ink-soft)" }}>{pilot.startup} · {pilot.department}</p>
                      <div className="mt-2 flex flex-wrap gap-3">
                        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ink-mid)" }}>
                          <MapPin size={11} /> {pilot.location}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ink-mid)" }}>
                          <Wallet size={11} /> {pilot.budget}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ink-mid)" }}>
                          <CalendarDays size={11} /> 90-day pilot duration
                        </div>
                      </div>
                    </div>
                    {pilot.success && (
                      <div className="text-right shrink-0">
                        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>Overall Score</p>
                        <button
                          className="text-3xl font-black hover:underline"
                          style={{ color: "var(--gov-blue)" }}
                          onClick={() => setTrace(kpiTrace("Pilot Success Score", "KPI evaluation engine", `${pilot.success?.score}/100`))}
                        >
                          {pilot.success?.score}
                        </button>
                        <p className="text-[10px]" style={{ color: "var(--ink-soft)" }}>/100</p>
                      </div>
                    )}
                  </div>

                  {/* Milestone Timeline */}
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--ink-soft)" }}>
                      Pilot Milestones
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {pilot.timeline.map((stage: string, i: number) => {
                        const done   = i <= timelineCompleted;
                        const active = stage === pilot.status;
                        return (
                          <div
                            key={stage}
                            className="flex shrink-0 flex-col items-center gap-1.5 rounded border px-3 py-2 text-center min-w-[90px]"
                            style={done
                              ? { borderColor: "var(--gov-blue-border)", background: "var(--gov-blue-light)" }
                              : { borderColor: "var(--line)", background: "var(--mist)" }
                            }
                          >
                            {done
                              ? <CheckCircle2 size={14} style={{ color: "var(--gov-blue)" }} />
                              : <div className="h-3.5 w-3.5 rounded-full border-2" style={{ borderColor: "var(--line)" }} />
                            }
                            <p className="text-[9px] font-semibold" style={{ color: done ? "var(--gov-blue)" : "var(--ink-soft)" }}>
                              {stage}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {!pilot.success && (
                    <div className="mt-4">
                      <Action onClick={fastForward} label="Fast-Forward to Final Evaluation" icon={<TrendingUp size={13} />} disabled={loading === "Fast-forwarding pilot"} />
                    </div>
                  )}
                </div>
              </div>

              {/* KPI Performance */}
              {pilot.kpis?.length > 0 && (
                <div className="rounded border bg-white" style={{ borderColor: "var(--line)" }}>
                  <div
                    className="px-4 py-2.5 border-b"
                    style={{ borderColor: "var(--line)", background: "var(--gov-blue)" }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white">KPI Performance — Target vs. Actual</p>
                    <p className="text-[9px] text-white/60 mt-0.5">Independently verified pilot results · PIL-MH-2026-022</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="gov-table">
                      <thead>
                        <tr>
                          <th>KPI</th>
                          <th>Baseline</th>
                          <th>Target</th>
                          <th>Actual Result</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pilot.kpis.map((kpi: any) => (
                          <tr key={kpi.name}>
                            <td className="font-semibold text-[12px]">{kpi.name}</td>
                            <td className="text-[11px]">{kpi.baseline ?? "—"}</td>
                            <td className="text-[11px] font-semibold">{kpi.target}</td>
                            <td>
                              <button
                                className="text-[12px] font-bold hover:underline"
                                style={{ color: "var(--gov-blue)" }}
                                onClick={() => setTrace(kpiTrace(kpi.name, "KPI_Summary_May.xlsx", kpi.actual))}
                              >
                                {kpi.actual}
                              </button>
                            </td>
                            <td>
                              <span
                                className="status-pill"
                                style={
                                  kpi.met
                                    ? { background: "var(--success-light)", color: "var(--success)", border: "1px solid #bbf7d0" }
                                    : { background: "var(--critical-light)", color: "var(--critical)", border: "1px solid #fecaca" }
                                }
                              >
                                <CheckCircle2 size={9} /> {kpi.met ? "PASSED" : "NOT MET"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {pilot.success && (
                    <div
                      className="flex items-center gap-2 px-4 py-3 border-t text-[11px] font-semibold"
                      style={{ borderColor: "var(--line)", color: "var(--success)", background: "var(--success-light)" }}
                    >
                      <CheckCircle2 size={13} />
                      {pilot.success.label} · {pilot.success.summary}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Objectives + Next Steps */}
            <div className="space-y-4">
              <div className="rounded border bg-white" style={{ borderColor: "var(--line)" }}>
                <div className="px-4 py-2.5 border-b" style={{ borderColor: "var(--line)" }}>
                  <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-mid)" }}>Pilot Objectives</p>
                </div>
                <div className="px-4 py-3">
                  <ul className="space-y-2">
                    {pilot.objectives?.map((obj: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-[11px]" style={{ color: "var(--ink-mid)" }}>
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--gov-blue)" }} />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {pilot.success && (
                <div
                  className="rounded border p-4 text-center"
                  style={{ background: "var(--success-light)", borderColor: "#bbf7d0" }}
                >
                  <CheckCircle2 size={24} className="mx-auto mb-2" style={{ color: "var(--success)" }} />
                  <p className="text-[13px] font-bold" style={{ color: "var(--success)" }}>Pilot Successful</p>
                  <p className="text-[10px] mt-1" style={{ color: "var(--ink-soft)" }}>Procurement Readiness Assessment can now be initiated</p>
                  <Link
                    href="/readiness"
                    className="mt-3 inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-[11px] font-semibold text-white"
                    style={{ background: "var(--gov-blue)" }}
                  >
                    Calculate Readiness <ArrowRight size={11} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Panel title="Pilot Workspace" icon={<TestTube2 size={13} />}>
          <Empty
            text="Shortlist a startup from the Startup Evaluation page to create a controlled pilot workspace."
            action="Go to Startup Evaluation"
          />
        </Panel>
      )}
    </div>
  );
}
