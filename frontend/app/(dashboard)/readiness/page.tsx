"use client";

import { usePraman } from "@/lib/PramanContext";
import { Panel, Empty, Action, AlertBanner, kpiTrace } from "@/components/ui";
import { Badge } from "@/components/Badge";
import { Gauge, TrendingUp, ShieldAlert, CheckCircle2, Sparkles } from "lucide-react";

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
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Decision</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Procurement Readiness</h1>
        <p className="mt-1 text-sm text-slate-500">Explainable readiness assessment before human decision gate</p>
      </div>

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
          <div className="space-y-5">
            {/* Score card */}
            <Panel title="Readiness Score" icon={<Gauge size={15} />}>
              <div className="flex items-end gap-6">
                <div>
                  <button
                    className="text-6xl font-black text-[#168675] leading-none hover:text-[#116f62] transition"
                    onClick={() => setTrace(kpiTrace("Procurement Readiness Score", "PRAMAN Readiness Engine", `${readiness.score}/100`))}
                  >
                    {readiness.score}
                  </button>
                  <span className="text-2xl font-black text-slate-400">/100</span>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge tone="signal">{readiness.band}</Badge>
                    <span className="text-sm text-slate-500">Procurement Readiness</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#168675] transition-all duration-700"
                      style={{ width: `${readiness.score}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-slate-400">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              </div>

              {/* Blocker */}
              <div className="mt-5 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <ShieldAlert size={18} className="shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-800">Active Blocker</p>
                  <p className="text-sm text-amber-700 mt-0.5">{readiness.blocker}</p>
                  <p className="text-xs text-amber-600 mt-1">Suggested action: {readiness.suggested_action}</p>
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400 italic">{readiness.disclaimer}</p>
            </Panel>

            {/* Dimension breakdown */}
            {readiness.dimensions && (
              <Panel title="Readiness Dimensions" icon={<TrendingUp size={15} />}>
                <div className="space-y-3">
                  {Object.entries(readiness.dimensions).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="w-44 shrink-0 text-sm font-medium text-slate-700">{key}</span>
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${Number(val) >= 80 ? "bg-emerald-500" : Number(val) >= 60 ? "bg-amber-400" : "bg-red-400"}`}
                          style={{ width: `${val}%` }}
                        />
                      </div>
                      <button
                        className="w-10 shrink-0 text-right text-sm font-bold text-[#168675] hover:underline"
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
          <Panel title="Assessment Criteria" icon={<CheckCircle2 size={15} />}>
            <div className="space-y-3">
              {CRITERIA.map(c => {
                const val = readiness.dimensions?.[c.key];
                const met = val !== undefined ? Number(val) >= 70 : true;
                return (
                  <div key={c.key} className="flex items-start gap-2.5">
                    {met
                      ? <CheckCircle2 size={15} className="shrink-0 text-emerald-500 mt-0.5" />
                      : <ShieldAlert size={15} className="shrink-0 text-amber-500 mt-0.5" />
                    }
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{c.key}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{c.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
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
