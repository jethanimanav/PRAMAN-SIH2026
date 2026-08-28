"use client";

import { usePraman } from "@/lib/PramanContext";
import { Panel, Empty, Action, AlertBanner } from "@/components/ui";
import { Badge } from "@/components/Badge";
import { ShieldCheck, CheckCircle2, AlertTriangle, UserRound } from "lucide-react";

export default function DecisionsPage() {
  const { readiness, decision, pilot, decisionReason, setDecisionReason, submitDecision, loading, error } = usePraman();

  const DECISION_OPTIONS = [
    { value: "Proceed to Procurement Review", label: "Proceed to Procurement Review", tone: "Recommended based on readiness score" },
    { value: "Defer Pending Security", label: "Defer — Pending Security Clearance", tone: "Address security blocker first" },
    { value: "Reject", label: "Reject — Does not meet procurement standards", tone: "Evidence insufficient" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Decision</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Human Decision Gate</h1>
        <p className="mt-1 text-sm text-slate-500">Final procurement decision by authorized government official</p>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      {/* Governance notice */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="shrink-0 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-blue-800">Decision Support Only · Not Autonomous Procurement</p>
            <p className="text-sm text-blue-700 mt-1">
              PRAMAN provides evidence-based decision support. The final procurement decision is made exclusively by the authorized government officer. 
              No AI system in PRAMAN approves, rejects or bypasses government procurement policy.
            </p>
          </div>
        </div>
      </div>

      {readiness ? (
        decision ? (
          <div className="space-y-5">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={28} className="text-emerald-500 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-800">Decision Submitted Successfully</p>
                  <p className="text-base font-black text-emerald-900 mt-0.5">{decision.status}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-white border border-emerald-100 px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Officer</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{decision.officer_identity}</p>
                </div>
                <div className="rounded-lg bg-white border border-emerald-100 px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Decision</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{decision.decision}</p>
                </div>
                <div className="rounded-lg bg-white border border-emerald-100 px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Data Class</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{decision.data_class}</p>
                </div>
              </div>
              <div className="mt-3 rounded-lg bg-white border border-emerald-100 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Justification</p>
                <p className="text-sm text-slate-700 mt-0.5 leading-relaxed">{decision.reason}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <Panel title="Officer Decision" icon={<UserRound size={15} />}>
              {/* Readiness summary */}
              <div className="mb-5 flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-center">
                  <p className="text-3xl font-black text-[#168675]">{readiness.score}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">/100 Readiness</p>
                </div>
                <div className="border-l border-slate-200 pl-4">
                  <Badge tone="signal">{readiness.band}</Badge>
                  <p className="text-xs text-slate-600 mt-1">Based on pilot evidence for Problem #1042<br />SkylineAI Solutions · AI Road Damage Detection</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Decision</label>
                  <div className="space-y-2">
                    {DECISION_OPTIONS.map(opt => (
                      <label key={opt.value} className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 px-4 py-3 hover:border-[#168675] hover:bg-emerald-50 transition has-[:checked]:border-[#168675] has-[:checked]:bg-emerald-50">
                        <input
                          type="radio"
                          name="decision"
                          value={opt.value}
                          defaultChecked={opt.value === "Proceed to Procurement Review"}
                          className="mt-0.5 accent-[#168675]"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{opt.tone}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Officer Justification <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#168675] focus:bg-white focus:ring-2 focus:ring-[#168675]/20 transition min-h-[100px]"
                    value={decisionReason}
                    onChange={e => setDecisionReason(e.target.value)}
                    placeholder="Provide your decision justification..."
                  />
                </div>

                <Action
                  onClick={submitDecision}
                  label="Submit Human Decision"
                  icon={<ShieldCheck size={14} />}
                  disabled={!decisionReason.trim() || loading === "Submitting human decision"}
                />
              </div>
            </Panel>

            <div className="space-y-5">
              <Panel title="PRAMAN AI Recommendation" icon={<ShieldCheck size={15} />}>
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">AI Suggests</p>
                  <p className="text-sm font-bold text-emerald-800">Proceed to Procurement Review</p>
                  <p className="text-xs text-emerald-600 mt-1">Readiness score {readiness.score}/100 with {readiness.band} band. Security blocker identified — officer review recommended.</p>
                </div>
                <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 text-xs text-amber-700">
                  <strong>Blocker:</strong> {readiness.blocker}
                </div>
              </Panel>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Checklist</p>
                {[
                  { label: "Pilot KPIs verified", done: true },
                  { label: "Evidence locker reviewed", done: true },
                  { label: "Readiness calculated", done: !!readiness },
                  { label: "Security review (partial)", done: false },
                  { label: "Officer justification", done: decisionReason.trim().length > 20 },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 py-1.5">
                    {item.done
                      ? <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      : <div className="h-3.5 w-3.5 rounded-full border-2 border-slate-300 shrink-0" />
                    }
                    <span className={`text-sm ${item.done ? "text-slate-700" : "text-slate-400"}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      ) : (
        <Panel title="Human Decision Gate" icon={<ShieldCheck size={15} />}>
          <Empty
            text="Procurement Readiness must be calculated before the officer decision gate becomes available."
            action="Go to Procurement Readiness"
          />
        </Panel>
      )}
    </div>
  );
}
