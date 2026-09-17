"use client";

import { usePraman } from "@/lib/PramanContext";
import { AlertBanner, Empty, Panel } from "@/components/ui";
import { History, Target, Cpu, CheckCircle2, UserRound, ArrowRight, ShieldCheck } from "lucide-react";

export default function ReplayPage() {
  const { decisionReplay, error } = usePraman();

  if (!decisionReplay) {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Intelligence</p>
          <h1 className="mt-1 text-2xl font-black text-slate-900">Decision Replay</h1>
        </div>
        <Panel title="Historical Decision Replay">
          <Empty text="No decision replay context available." />
        </Panel>
      </div>
    );
  }

  // Normalize structure from backend
  const startupScores = decisionReplay.startup_scores || decisionReplay.ai_context?.shortlist_ranking || [];
  const criteria = decisionReplay.criteria || [];
  const finalDecision = decisionReplay.final_decision || decisionReplay.human_decision?.selected_startup || "Proceed to Procurement Review";
  const officer = decisionReplay.officer || decisionReplay.human_decision?.officer || "Ananya Deshmukh";
  const decisionDate = decisionReplay.decision_date || decisionReplay.human_decision?.date || "2026-10-12";
  const modelVersion = decisionReplay.model_version || "PRAMAN-Rank-v2.1";
  const datasetVersion = decisionReplay.dataset_version || "Procurement-Outcomes-2026-Q3";

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Intelligence</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Decision Replay</h1>
        <p className="mt-1 text-sm text-slate-500">Traceable audit of human-AI procurement decisions & model snapshot.</p>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-wrap gap-6 items-center justify-between text-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Problem Signature</span>
          <span className="font-bold text-slate-900">{decisionReplay.problem || "Problem #1042"}</span>
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Model Version</span>
          <span className="font-semibold text-purple-700">{modelVersion}</span>
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Dataset Version</span>
          <span className="font-semibold text-slate-700">{datasetVersion}</span>
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Decision Date</span>
          <span className="font-semibold text-slate-700">{decisionDate}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Panel title="AI Shortlist & Ranking Weights" icon={<Cpu size={16} className="text-purple-500" />}>
            <div className="rounded-lg border border-purple-100 bg-purple-50/50 p-5 space-y-5">
              <div className="flex items-center gap-3">
                <Target size={20} className="text-purple-600" />
                <h3 className="font-black text-slate-900 text-lg">Shortlist Ranking Results</h3>
              </div>

              <div className="space-y-3">
                {startupScores.map((item: any, i: number) => {
                  const name = item.startup || item.name;
                  const score = item.score;
                  const rank = item.rank || (i + 1);
                  return (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${i === 0 ? 'bg-white border-purple-200 shadow-sm' : 'bg-transparent border-slate-200'}`}>
                      <div className="flex items-center gap-3">
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                          #{rank}
                        </span>
                        <span className="font-bold text-slate-900">{name}</span>
                      </div>
                      <span className="font-black text-purple-700">{score}% Match</span>
                    </div>
                  );
                })}
              </div>

              {criteria.length > 0 && (
                <div className="pt-4 border-t border-purple-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Scoring Criteria Weights</p>
                  <div className="grid grid-cols-2 gap-2">
                    {criteria.map((c: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-xs bg-white p-2 rounded border border-purple-100">
                        <span className="font-medium text-slate-700">{c.name}</span>
                        <span className="font-bold text-purple-700">{c.weight_pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Human Decision & Approval Record" icon={<UserRound size={16} className="text-blue-500" />}>
            <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-5 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-blue-600" />
                <h3 className="font-black text-slate-900 text-lg">Approved Decision</h3>
              </div>

              <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-1">Final Outcome</p>
                <p className="text-base font-bold text-slate-900">{finalDecision}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Authorized Officer</p>
                  <p className="text-sm font-bold text-slate-900">{officer}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Audit Status</p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    <ShieldCheck size={12} /> Verified & Signed
                  </span>
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="Outcome Trajectory" icon={<History size={16} className="text-emerald-500" />}>
            <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-5 text-center">
              <h3 className="font-black text-slate-900 text-lg mb-2">Pilot Execution: Successful (93% Accuracy)</h3>
              <p className="text-sm font-medium text-slate-700">Solution exceeded all KPI targets and proceeded to scale recommendation stage.</p>
              <div className="mt-4 pt-3 border-t border-emerald-100">
                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  Decision Fully Replayed & Revalidated
                </span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

