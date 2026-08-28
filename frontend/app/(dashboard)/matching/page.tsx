"use client";

import { usePraman } from "@/lib/PramanContext";
import { Panel, Empty, Action, AlertBanner, kpiTrace } from "@/components/ui";
import { Badge } from "@/components/Badge";
import { Target, Sparkles, CheckCircle2, Users, ShieldCheck, ArrowRight, Info } from "lucide-react";

export default function MatchingPage() {
  const { requirement, recommendations, pilot, matchStartups, shortlist, loading, error, setTrace } = usePraman();

  const canMatch = requirement?.status === "Approved";
  const canShortlist = recommendations.length > 0 && !pilot;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Problem to Pilot</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Matching & Ranking</h1>
        <p className="mt-1 text-sm text-slate-500">Eligibility checks + ranked recommendations for Problem #1042</p>
      </div>

      {error && <AlertBanner type="error" message={error} />}
      {loading && <div className="text-sm text-emerald-700 flex items-center gap-2"><Sparkles size={14} className="animate-pulse" />{loading}…</div>}

      <div className="flex flex-wrap gap-2">
        <Action onClick={matchStartups} label="Run Eligibility & Matching" icon={<Target size={14} />} disabled={!canMatch || !!recommendations.length} />
        <Action onClick={shortlist} label="Shortlist SkylineAI" icon={<Users size={14} />} disabled={!canShortlist} muted={!canShortlist} />
      </div>

      {/* Pipeline explanation */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">PRAMAN Matching Pipeline · Simulated</p>
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-blue-700">
          {["Hard Eligibility Filters", "BM25 Keyword Match", "Dense Embedding Similarity", "Reciprocal Rank Fusion (RRF)", "TOPSIS Ranking", "Explainable Output"].map((step, i, arr) => (
            <div key={step} className="flex items-center gap-2">
              <span className="rounded bg-blue-100 border border-blue-200 px-2 py-1">{step}</span>
              {i < arr.length - 1 && <ArrowRight size={12} className="text-blue-400" />}
            </div>
          ))}
        </div>
        <p className="mt-2 text-[10px] text-blue-500">This is a deterministic simulation demonstrating the PRAMAN pipeline concept. Final procurement decisions remain with authorized officials.</p>
      </div>

      {recommendations.length > 0 ? (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["124", "Startups Discovered"],
              ["36", "Passed Eligibility"],
              ["12", "Capability Matched"],
              [recommendations.length.toString(), "Recommended"],
            ].map(([val, label]) => (
              <div key={label} className="rounded-xl border border-slate-200 bg-white shadow-sm px-4 py-3 text-center">
                <p className="text-2xl font-black text-slate-900">{val}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Recommendation cards */}
          {recommendations.map((rec) => (
            <div key={rec.id} className={`rounded-xl border shadow-sm bg-white overflow-hidden ${rec.rank === 1 ? "border-[#168675]" : "border-slate-200"}`}>
              {rec.rank === 1 && (
                <div className="bg-[#168675] px-5 py-1.5 flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-white" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Top Recommendation · Highest Composite Score</span>
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge tone="neutral">Rank #{rec.rank}</Badge>
                      <Badge tone={rec.eligibility?.status === "PASS" ? "signal" : "critical"}>{rec.eligibility?.status || "PASS"}</Badge>
                      <Badge tone="neutral">{rec.data_class}</Badge>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{rec.startup?.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{rec.startup?.capabilities?.join(" · ")}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <button
                      className="text-4xl font-black text-[#168675] hover:text-[#116f62] transition leading-none"
                      onClick={() => setTrace(kpiTrace(`${rec.startup?.name} · Score ${rec.score}/100`, "PRAMAN matching engine", String(rec.score)))}
                    >
                      {rec.score}
                    </button>
                    <p className="text-xs text-slate-400 mt-0.5">/ 100 composite score</p>
                    <Badge tone={rec.rank === 1 ? "signal" : "neutral"}>{rec.band}</Badge>
                  </div>
                </div>

                {/* Dimension breakdown */}
                {rec.dimensions && (
                  <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {Object.entries(rec.dimensions).map(([key, val]) => (
                      <div key={key} className="rounded-lg bg-slate-50 border border-slate-100 px-2.5 py-2 text-center">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{key}</p>
                        <p className="text-sm font-black text-slate-800 mt-0.5">{val}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Eligibility checks */}
                {rec.eligibility?.checks && (
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Eligibility Checks</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {rec.eligibility.checks.map((check: any) => (
                        <div key={check.code} className="flex items-start gap-2 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
                          {check.status === "PASS" ? (
                            <CheckCircle2 size={14} className="shrink-0 text-emerald-500 mt-0.5" />
                          ) : (
                            <ShieldCheck size={14} className="shrink-0 text-red-500 mt-0.5" />
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-700">{check.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{check.reason}</p>
                          </div>
                          <Badge tone={check.status === "PASS" ? "signal" : "critical"} >{check.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {rec.rank === 1 && !pilot && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <Action onClick={shortlist} label="Shortlist this startup for Pilot" icon={<Users size={14} />} />
                  </div>
                )}
                {pilot && rec.rank === 1 && (
                  <div className="mt-4 pt-4 border-t border-emerald-100 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 size={16} /> Shortlisted · Pilot workspace created
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Panel title="Eligibility & Matching" icon={<Target size={15} />}>
          <Empty
            text={canMatch ? "Click 'Run Eligibility & Matching' to rank eligible startups for this problem." : "Requirements must be approved before matching can run."}
            action={canMatch ? "Run Eligibility & Matching" : "Approve Requirements first"}
          />
        </Panel>
      )}
    </div>
  );
}
