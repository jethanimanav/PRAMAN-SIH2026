"use client";

import { usePraman } from "@/lib/PramanContext";
import { Panel, Empty, Action, AlertBanner, kpiTrace, GovPageHeader } from "@/components/ui";
import { Badge } from "@/components/Badge";
import { Gauge, TrendingUp, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function ReadinessPage() {
  const { pilot, readiness, calculateReadiness, loading, error, setTrace } = usePraman();

  const CRITERIA = [
    { key: "Technical Validation", desc: "Detection recall and accuracy verified against pilot KPIs" },
    { key: "Pilot Performance", desc: "Overall pilot success score above threshold" },
    { key: "Evidence Completeness", desc: "Audit-backed evidence locker with verified documents" },
    { key: "Compliance", desc: "DPIIT eligibility + regulatory checks passed" },
    { key: "Budget Alignment", desc: "Pilot spend within approved range" },
    { key: "Documentation", desc: "Requirement, pilot and decision documents complete" },
    { key: "Risk Assessment", desc: "Security blocker identified and partially addressed" },
  ];

  return (
    <div className="space-y-5">
      <GovPageHeader
        eyebrow="Decision"
        title="Procurement Readiness"
        subtitle="Explainable readiness assessment before human decision gate"
        recordId="PRB-MH-2026-1042 · Readiness Evaluation"
      />

      {error && <AlertBanner type="error" message={error} />}

      <div className="flex gap-2">
        <Action
          onClick={calculateReadiness}
          label="Calculate Procurement Readiness"
          icon={<Gauge size={14} />}
          disabled={!pilot?.success || !!readiness || loading === "Calculating readiness"}
        />
      </div>

      {readiness ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5 min-w-0">
            {/* Score card */}
            <Panel title="Readiness Score" icon={<Gauge size={15} />}>
              <div className="flex items-end gap-6">
                <div>
                  <button
                    className="text-6xl font-black leading-none transition"
                    style={{ color: "var(--gov-blue)" }}
                    onClick={() => setTrace(kpiTrace("Procurement Readiness Score", "PRAMAN Readiness Engine", `${readiness.score}/100`))}
                  >
                    {readiness.score}
                  </button>
                  <span className="text-2xl font-black" style={{ color: "var(--ink-muted)" }}>/100</span>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge tone="signal">{readiness.band}</Badge>
                    <span className="text-sm font-medium" style={{ color: "var(--ink-soft)" }}>Procurement Readiness</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--mist)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${readiness.score}%`, background: "var(--gov-blue)" }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs font-semibold" style={{ color: "var(--ink-muted)" }}>
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              </div>

              {/* Blocker */}
              <div className="mt-5 flex items-start gap-3 rounded border px-4 py-3" style={{ background: "var(--warning-light)", borderColor: "var(--warning-border)", borderLeft: "3px solid var(--warning)" }}>
                <ShieldAlert size={18} className="shrink-0 mt-0.5" style={{ color: "var(--warning)" }} />
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--warning)" }}>Active Blocker</p>
                  <p className="text-sm mt-0.5" style={{ color: "var(--warning)" }}>{readiness.blocker}</p>
                  <p className="text-xs font-semibold mt-1" style={{ color: "var(--warning)" }}>Suggested action: {readiness.suggested_action}</p>
                </div>
              </div>

              <p className="mt-4 text-[11px] italic" style={{ color: "var(--ink-soft)" }}>{readiness.disclaimer}</p>
            </Panel>

            {/* Dimension breakdown */}
            {readiness.dimensions && (
              <Panel title="Readiness Dimensions" icon={<TrendingUp size={15} />}>
                <div className="space-y-3">
                  {Object.entries(readiness.dimensions).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-3 min-w-0">
                      <span className="w-44 shrink-0 text-[13px] font-bold" style={{ color: "var(--ink)" }}>{key}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--mist)" }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${val}%`,
                            background: Number(val) >= 80 ? "var(--success)" : Number(val) >= 60 ? "var(--warning)" : "var(--critical)"
                          }}
                        />
                      </div>
                      <button
                        className="w-10 shrink-0 text-right text-sm font-black hover:underline"
                        style={{ color: "var(--gov-blue)" }}
                        onClick={() => setTrace(kpiTrace(key, "Readiness engine", String(val)))}
                      >
                        {val}
                      </button>
                    </div>
                  ))}
                </div>
              </Panel>
            )}
          </div>

          {/* Criteria explanation */}
          <div className="min-w-0">
            <Panel title="Assessment Criteria" icon={<CheckCircle2 size={15} />}>
              <div className="space-y-4">
                {CRITERIA.map(c => {
                  const val = readiness.dimensions?.[c.key];
                  const met = val !== undefined ? Number(val) >= 70 : true;
                  return (
                    <div key={c.key} className="flex items-start gap-3">
                      {met
                        ? <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: "var(--success)" }} />
                        : <ShieldAlert size={15} className="shrink-0 mt-0.5" style={{ color: "var(--warning)" }} />
                      }
                      <div>
                        <p className="text-[13px] font-bold" style={{ color: "var(--ink)" }}>{c.key}</p>
                        <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "var(--ink-soft)" }}>{c.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>
        </div>
      ) : (
        <Panel title="Procurement Readiness" icon={<Gauge size={15} />}>
          <Empty
            text={pilot?.success ? "Click 'Calculate Procurement Readiness' to assess pilot evidence and generate a readiness score." : "Complete the pilot (Fast-Forward) to generate KPI evidence first."}
            action={pilot?.success ? "Calculate Procurement Readiness" : "Go to Pilots → Fast-Forward"}
          />
        </Panel>
      )}
    </div>
  );
}
