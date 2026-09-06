"use client";

import { usePraman } from "@/lib/PramanContext";
import { Panel, Empty, Action, AlertBanner, kpiTrace, OfficialRecordHeader, RecordMeta } from "@/components/ui";
import { Badge } from "@/components/Badge";
import {
  Target, Sparkles, CheckCircle2, Users, ShieldCheck, ArrowRight,
} from "lucide-react";

const CRITERIA = [
  { label: "Requirement Match",    weight: "30%", desc: "Alignment to structured government requirement" },
  { label: "Evidence Strength",    weight: "25%", desc: "Independently verified pilot evidence quality" },
  { label: "Pilot Performance",    weight: "20%", desc: "Demonstrated performance against KPI targets" },
  { label: "Implementation Risk",  weight: "15%", desc: "Integration complexity & dependency assessment" },
  { label: "Historical Performance",weight: "10%", desc: "Track record from institutional memory" },
];

export default function MatchingPage() {
  const { requirement, recommendations, pilot, matchStartups, shortlist, loading, error, setTrace } = usePraman();

  const canMatch = requirement?.status === "Approved";
  const canShortlist = recommendations.length > 0 && !pilot;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--saffron)" }}>
          Procurement Intelligence
        </p>
        <h1 className="mt-0.5 text-xl font-black" style={{ color: "var(--ink)" }}>
          AI-Assisted Startup Evaluation
        </h1>
        <p className="mt-0.5 text-[11px]" style={{ color: "var(--ink-soft)" }}>
          Eligibility checks + evidence-weighted ranking for Government Requirement REQ-MH-2026-1042
        </p>
      </div>

      {error && <AlertBanner type="error" message={error} />}
      {loading && (
        <div className="flex items-center gap-2 rounded border px-4 py-2.5 text-[12px]"
          style={{ background: "var(--gov-blue-light)", borderColor: "var(--gov-blue-border)", color: "var(--gov-blue)" }}>
          <Sparkles size={13} className="animate-pulse" />{loading}…
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Action onClick={matchStartups} label="Run Eligibility & Matching" icon={<Target size={13} />} disabled={!canMatch || !!recommendations.length} />
        <Action onClick={shortlist} label="Shortlist Top-Ranked Startup" icon={<Users size={13} />} disabled={!canShortlist} muted={!canShortlist} />
      </div>

      {/* Evaluation Criteria */}
      <div className="rounded border bg-white" style={{ borderColor: "var(--line)" }}>
        <div className="px-4 py-2.5 border-b" style={{ borderColor: "var(--line)", background: "var(--gov-blue)" }}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-white">
            Evaluation Criteria · Government Requirement REQ-MH-2026-1042
          </p>
          <p className="text-[10px] text-white/60 mt-0.5">Smart Road Condition Monitoring · PWD Maharashtra</p>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--line)" }}>
          {CRITERIA.map(c => (
            <div key={c.label} className="flex items-center gap-4 px-4 py-2.5">
              <div className="w-28 shrink-0">
                <span className="text-[11px] font-bold" style={{ color: "var(--ink)" }}>{c.label}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px]" style={{ color: "var(--ink-soft)" }}>{c.desc}</p>
              </div>
              <div
                className="shrink-0 rounded px-2.5 py-1 text-[11px] font-bold"
                style={{ background: "var(--gov-blue-light)", color: "var(--gov-blue)", border: "1px solid var(--gov-blue-border)" }}
              >
                {c.weight}
              </div>
            </div>
          ))}
        </div>
        {/* Pipeline */}
        <div className="px-4 py-2.5 border-t" style={{ borderColor: "var(--line)", background: "var(--mist)" }}>
          <p className="text-[9px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--ink-soft)" }}>
            PRAMAN Matching Pipeline
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {["Hard Eligibility Filters", "BM25 Keyword Match", "Dense Embedding Similarity", "RRF Fusion", "TOPSIS Ranking"].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-1.5">
                <span className="rounded px-2 py-0.5 text-[10px] font-semibold"
                  style={{ background: "var(--gov-blue-light)", color: "var(--gov-blue)", border: "1px solid var(--gov-blue-border)" }}>
                  {step}
                </span>
                {i < arr.length - 1 && <ArrowRight size={10} style={{ color: "var(--ink-soft)" }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {recommendations.length > 0 ? (
        <div className="space-y-4">
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              ["124", "Startups Discovered"],
              ["36",  "Passed Hard Eligibility"],
              ["12",  "Capability Matched"],
              [String(recommendations.length), "Final Recommendations"],
            ].map(([val, label]) => (
              <div key={label} className="rounded border bg-white px-4 py-3 text-center" style={{ borderColor: "var(--line)" }}>
                <p className="text-2xl font-black" style={{ color: "var(--gov-blue)" }}>{val}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--ink-soft)" }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Evaluation Table */}
          <div className="rounded border bg-white overflow-hidden" style={{ borderColor: "var(--line)" }}>
            <div className="px-4 py-2.5 border-b" style={{ borderColor: "var(--line)" }}>
              <h2 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-mid)" }}>
                Recommended Startups — Evaluation Results
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Startup</th>
                    <th>Eligibility</th>
                    <th>Req. Match</th>
                    <th>Evidence</th>
                    <th>Pilot Score</th>
                    <th>Overall Score</th>
                    <th>Band</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendations.map((rec: any) => (
                    <tr key={rec.id}>
                      <td>
                        <span className="font-black text-[13px]" style={{ color: "var(--gov-blue)" }}>#{rec.rank}</span>
                      </td>
                      <td>
                        <p className="font-semibold text-[12px]" style={{ color: "var(--ink)" }}>{rec.startup?.name}</p>
                        <p className="text-[10px]" style={{ color: "var(--ink-soft)" }}>{rec.startup?.capabilities?.slice(0, 2).join(" · ")}</p>
                      </td>
                      <td>
                        <span className="status-pill" style={
                          rec.eligibility?.status === "PASS"
                            ? { background: "var(--success-light)", color: "var(--success)", border: "1px solid #bbf7d0" }
                            : { background: "var(--critical-light)", color: "var(--critical)", border: "1px solid #fecaca" }
                        }>
                          <CheckCircle2 size={9} />{rec.eligibility?.status ?? "PASS"}
                        </span>
                      </td>
                      <td className="font-semibold text-[12px]">{rec.dimensions?.["Requirement Match"] ?? "—"}</td>
                      <td className="font-semibold text-[12px]">{rec.dimensions?.["Evidence Strength"] ?? "—"}</td>
                      <td className="font-semibold text-[12px]">{rec.dimensions?.["Pilot Performance"] ?? "—"}</td>
                      <td>
                        <button
                          className="text-[15px] font-black hover:underline"
                          style={{ color: "var(--gov-blue)" }}
                          onClick={() => setTrace(kpiTrace(`${rec.startup?.name} · Score ${rec.score}/100`, "PRAMAN matching engine", String(rec.score)))}
                        >
                          {rec.score}
                        </button>
                        <span className="text-[10px] ml-0.5" style={{ color: "var(--ink-soft)" }}>/100</span>
                      </td>
                      <td>
                        <Badge tone={rec.rank === 1 ? "gov" : "neutral"}>{rec.band}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top recommendation detail */}
          {recommendations[0] && (
            <div className="grid lg:grid-cols-[1fr_280px] gap-4">
              {/* Eligibility checks */}
              {recommendations[0].eligibility?.checks && (
                <div className="rounded border bg-white" style={{ borderColor: "var(--line)" }}>
                  <div className="px-4 py-2.5 border-b" style={{ borderColor: "var(--line)" }}>
                    <h2 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-mid)" }}>
                      Eligibility Verification — {recommendations[0].startup?.name}
                    </h2>
                  </div>
                  <div className="divide-y" style={{ borderColor: "var(--line)" }}>
                    {recommendations[0].eligibility.checks.map((check: any) => (
                      <div key={check.code} className="flex items-start gap-3 px-4 py-2.5">
                        {check.status === "PASS"
                          ? <CheckCircle2 size={13} className="mt-0.5 shrink-0" style={{ color: "var(--success)" }} />
                          : <ShieldCheck size={13} className="mt-0.5 shrink-0" style={{ color: "var(--critical)" }} />
                        }
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold" style={{ color: "var(--ink)" }}>{check.name}</p>
                          <p className="text-[10px]" style={{ color: "var(--ink-soft)" }}>{check.reason}</p>
                        </div>
                        <Badge tone={check.status === "PASS" ? "success" : "critical"}>{check.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Why ranked #1 */}
              <div className="rounded border" style={{ borderColor: "var(--gov-blue-border)", background: "var(--gov-blue-light)" }}>
                <div className="px-4 py-2.5 border-b" style={{ borderColor: "var(--gov-blue-border)", background: "var(--gov-blue)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white">
                    Why Ranked #1? · {recommendations[0].startup?.name}
                  </p>
                </div>
                <div className="px-4 py-3 space-y-2">
                  {[
                    "Strong requirement alignment with government KPIs",
                    "Government pilot evidence — independently validated",
                    "High-confidence KPI metrics exceeding targets",
                    "Lower implementation risk vs. alternatives",
                    "Positive historical institutional memory outcome",
                    "DPIIT-verified startup with demonstrated capability",
                  ].map((reason, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px]" style={{ color: "var(--gov-blue)" }}>
                      <CheckCircle2 size={11} className="mt-0.5 shrink-0" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
                {!pilot && (
                  <div className="px-4 pb-4">
                    <Action onClick={shortlist} label="Shortlist for Pilot" icon={<Users size={12} />} size="sm" />
                  </div>
                )}
                {pilot && (
                  <div className="px-4 pb-4 flex items-center gap-2 text-[11px] font-semibold" style={{ color: "var(--success)" }}>
                    <CheckCircle2 size={13} /> Shortlisted · Pilot Workspace Created
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Panel title="Startup Evaluation" icon={<Target size={13} />}>
          <Empty
            text={canMatch
              ? "Click 'Run Eligibility & Matching' to rank eligible startups against the approved requirement."
              : "Requirements must be approved before the matching engine can run."}
            action={canMatch ? "Run Eligibility & Matching" : "Approve Requirements first"}
          />
        </Panel>
      )}
    </div>
  );
}
