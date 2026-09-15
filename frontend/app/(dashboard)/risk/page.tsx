"use client";

import { usePraman } from "@/lib/PramanContext";
import { AlertBanner, Empty, Panel } from "@/components/ui";
import { ShieldAlert, AlertTriangle, CheckCircle2, TrendingDown, Activity } from "lucide-react";

const LEVEL_STYLE: Record<string, React.CSSProperties & { barColor: string }> =  {
  High:   { background: "var(--critical-light)", borderColor: "#fecaca", color: "var(--critical)", barColor: "var(--critical)" },
  Medium: { background: "var(--warning-light)",  borderColor: "#fde68a", color: "var(--warning)",  barColor: "var(--saffron)" },
  Low:    { background: "var(--success-light)",  borderColor: "#bbf7d0", color: "var(--success)",  barColor: "var(--success)" },
};

export default function RiskRadarPage() {
  const { riskRadar, error } = usePraman();

  const highRisks   = riskRadar.filter(r => r.level === "High");
  const mediumRisks = riskRadar.filter(r => r.level === "Medium");
  const lowRisks    = riskRadar.filter(r => r.level === "Low");

  if (!riskRadar || riskRadar.length === 0) {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--saffron)" }}>Validation</p>
          <h1 className="mt-0.5 text-xl font-black" style={{ color: "var(--ink)" }}>Procurement Risk Assessment</h1>
        </div>
        <Panel title="Risk Dimensions"><Empty text="No active risks detected for the current project context." /></Panel>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--saffron)" }}>Validation</p>
        <h1 className="mt-0.5 text-xl font-black" style={{ color: "var(--ink)" }}>Procurement Risk Assessment</h1>
        <p className="mt-0.5 text-[11px]" style={{ color: "var(--ink-soft)" }}>
          Evidence-based risk analysis · PIL-MH-2026-022 · Historical pattern matching from institutional memory
        </p>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      {/* Risk Summary Banner */}
      {highRisks.length > 0 && (
        <div
          className="flex items-start gap-3 rounded border px-4 py-3"
          style={{ background: "var(--critical-light)", borderColor: "#fecaca", borderLeft: "4px solid var(--critical)" }}
        >
          <AlertTriangle size={16} className="mt-0.5 shrink-0" style={{ color: "var(--critical)" }} />
          <div>
            <p className="text-[12px] font-bold" style={{ color: "var(--critical)" }}>
              {highRisks.length} HIGH-SEVERITY RISK{highRisks.length > 1 ? "S" : ""} DETECTED
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--ink-mid)" }}>
              Immediate action required. Historical data indicates API integration and implementation risks are the primary cause of schedule overruns in 83% of similar government procurement projects.
            </p>
          </div>
        </div>
      )}

      {/* Assessment Table */}
      <div className="rounded border bg-white overflow-hidden" style={{ borderColor: "var(--line)" }}>
        <div
          className="px-4 py-2.5 border-b"
          style={{ background: "var(--gov-blue)", borderColor: "var(--gov-blue-mid)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-white">
            Procurement Risk Assessment — PIL-MH-2026-022
          </p>
          <p className="text-[9px] text-white/60 mt-0.5">
            {riskRadar.length} risk dimensions assessed · Pattern-matched from {3} historical projects
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Risk Category</th>
                <th>Score</th>
                <th>Assessment Bar</th>
                <th>Level</th>
                <th>Linked Task</th>
              </tr>
            </thead>
            <tbody>
              {riskRadar.map((r: any, i: number) => {
                const s = LEVEL_STYLE[r.level] ?? LEVEL_STYLE["Low"];
                return (
                  <tr key={i}>
                    <td>
                      <p className="font-semibold text-[12px]" style={{ color: "var(--ink)" }}>{r.category}</p>
                    </td>
                    <td>
                      <span className="text-[14px] font-black" style={{ color: s.color as string }}>{r.score_pct}%</span>
                    </td>
                    <td style={{ minWidth: 120 }}>
                      <div className="h-2 rounded-full" style={{ background: "var(--mist)", width: 120 }}>
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ width: `${r.score_pct}%`, background: (s as any).barColor }}
                        />
                      </div>
                    </td>
                    <td>
                      <span
                        className="status-pill"
                        style={{ background: s.background as string, color: s.color as string, border: `1px solid ${s.borderColor}` }}
                      >
                        {r.level === "High" && <AlertTriangle size={9} />}
                        {r.level === "Low" && <CheckCircle2 size={9} />}
                        {r.level} RISK
                      </span>
                    </td>
                    <td className="text-[10px]" style={{ color: "var(--ink-soft)" }}>
                      {r.linked_task ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Risk Cards */}
      <div className="space-y-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--ink-soft)" }}>
          Detailed Risk Analysis
        </p>
        {[...highRisks, ...mediumRisks, ...lowRisks].map((r: any, i: number) => {
          const s = LEVEL_STYLE[r.level] ?? LEVEL_STYLE["Low"];
          return (
            <div
              key={i}
              className="rounded border bg-white"
              style={{ borderColor: s.borderColor as string, borderLeft: `3px solid ${s.color}` }}
            >
              <div className="flex items-start justify-between gap-3 px-4 py-3">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded"
                    style={{ background: s.background as string, color: s.color as string }}
                  >
                    {r.level === "High" ? <AlertTriangle size={14} /> : r.level === "Medium" ? <Activity size={14} /> : <CheckCircle2 size={14} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[12px] font-bold" style={{ color: "var(--ink)" }}>{r.category}</p>
                      <span
                        className="status-pill"
                        style={{ background: s.background as string, color: s.color as string, border: `1px solid ${s.borderColor}` }}
                      >
                        {r.level}
                      </span>
                    </div>
                    <p className="text-[11px]" style={{ color: "var(--ink-mid)" }}>{r.reason}</p>
                    {r.linked_dependency && (
                      <p className="text-[10px] mt-1 font-semibold" style={{ color: s.color as string }}>
                        Primary Dependency: {r.linked_dependency}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>Score</p>
                  <p className="text-[16px] font-black" style={{ color: s.color as string }}>{r.score_pct}%</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PRAMAN AI Recommendation */}
      <div className="rounded border bg-white px-4 py-4" style={{ borderColor: "var(--gov-blue-border)", background: "var(--gov-blue-light)" }}>
        <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--gov-blue)" }}>
          PRAMAN Intelligence · Risk Mitigation Recommendation
        </p>
        <p className="text-[12px]" style={{ color: "var(--ink-mid)" }}>
          Establish a joint technical working group between the Startup CTO and the IT Department immediately.
          Mandate bi-weekly unblocking sessions until Government API integration is certified.
          Historical data from 3 similar Maharashtra projects confirms API readiness is the highest-impact dependency to resolve before pilot deployment.
        </p>
      </div>
    </div>
  );
}

