"use client";

import { usePraman } from "@/lib/PramanContext";
import { AlertBanner, Empty, Panel } from "@/components/ui";
import { History, Target, Cpu, CheckCircle2, UserRound, ArrowRight } from "lucide-react";

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

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Intelligence</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Decision Replay</h1>
        <p className="mt-1 text-sm text-slate-500">Traceable audit of human-AI procurement decisions.</p>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Panel title="AI Recommendation Context" icon={<Cpu size={16} className="text-purple-500" />}>
            <div className="rounded-lg border border-purple-100 bg-purple-50/50 p-5">
              <div className="flex items-center gap-3 mb-4">
                <Target size={20} className="text-purple-600" />
                <h3 className="font-black text-slate-900 text-lg">AI Shortlist Ranking</h3>
              </div>
              
              <div className="space-y-4">
                {decisionReplay.ai_context.shortlist_ranking.map((item: any, i: number) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${i === 0 ? 'bg-white border-purple-200 shadow-sm' : 'bg-transparent border-slate-200'}`}>
                    <div className="flex items-center gap-3">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        {i + 1}
                      </span>
                      <span className="font-bold text-slate-900">{item.startup}</span>
                    </div>
                    <span className="font-black text-purple-700">{item.score}% Match</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-purple-100">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Key Factor</p>
                <p className="text-sm font-medium text-slate-800">{decisionReplay.ai_context.key_factor}</p>
              </div>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Human Decision Override" icon={<UserRound size={16} className="text-blue-500" />}>
            <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-5">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 size={20} className="text-blue-600" />
                <h3 className="font-black text-slate-900 text-lg">Final Selection: {decisionReplay.human_decision.selected_startup}</h3>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-2">Override Rationale</p>
                <p className="text-sm font-medium text-slate-700 leading-relaxed italic border-l-2 border-blue-400 pl-3">
                  "{decisionReplay.human_decision.rationale}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Decision Maker</p>
                   <p className="text-sm font-bold text-slate-900">{decisionReplay.human_decision.officer}</p>
                 </div>
                 <div>
                   <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Date</p>
                   <p className="text-sm font-bold text-slate-900">{decisionReplay.human_decision.date}</p>
                 </div>
              </div>
            </div>
          </Panel>

          <div className="flex justify-center py-2">
            <ArrowRight size={24} className="text-slate-300 rotate-90 lg:rotate-0" />
          </div>

          <Panel title="Outcome Trajectory" icon={<History size={16} className="text-emerald-500" />}>
            <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-5">
              <h3 className="font-black text-slate-900 text-lg mb-2 text-center">Result: {decisionReplay.outcome.result}</h3>
              <p className="text-sm font-medium text-slate-700 text-center">{decisionReplay.outcome.notes}</p>
              
              <div className="mt-4 pt-4 border-t border-emerald-100 text-center">
                 <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wide">
                   Decision Validated
                 </span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
