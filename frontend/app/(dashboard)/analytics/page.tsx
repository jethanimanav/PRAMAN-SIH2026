"use client";

import { Panel } from "@/components/ui";
import { BarChart3, TrendingUp, Users, TestTube2, CheckCircle2, Clock } from "lucide-react";

const METRICS = [
  { label: "Problems Submitted", value: "20", sub: "FY 2025-26", icon: <TrendingUp size={18} />, color: "bg-blue-50 text-blue-600" },
  { label: "Eligible Startups", value: "100+", sub: "DPIIT Verified", icon: <Users size={18} />, color: "bg-violet-50 text-violet-600" },
  { label: "Active Pilots", value: "8", sub: "In progress", icon: <TestTube2 size={18} />, color: "bg-amber-50 text-amber-700" },
  { label: "Successful Pilots", value: "5", sub: "Moved to procurement", icon: <CheckCircle2 size={18} />, color: "bg-emerald-50 text-emerald-600" },
  { label: "Avg Readiness Score", value: "87", sub: "Across pilots", icon: <BarChart3 size={18} />, color: "bg-pink-50 text-pink-600" },
  { label: "Avg Pilot Duration", value: "76 days", sub: "vs 90 day target", icon: <Clock size={18} />, color: "bg-slate-100 text-slate-600" },
];

const DOMAIN_DATA = [
  { domain: "Urban Infrastructure", count: 6, pct: 30 },
  { domain: "Healthcare", count: 4, pct: 20 },
  { domain: "Agriculture", count: 3, pct: 15 },
  { domain: "Transportation", count: 3, pct: 15 },
  { domain: "Education", count: 2, pct: 10 },
  { domain: "Environment", count: 2, pct: 10 },
];

const TIMELINE = [
  { month: "Jan 26", problems: 2, pilots: 1 },
  { month: "Feb 26", problems: 3, pilots: 2 },
  { month: "Mar 26", problems: 4, pilots: 2 },
  { month: "Apr 26", problems: 3, pilots: 1 },
  { month: "May 26", problems: 5, pilots: 2 },
  { month: "Jun 26", problems: 3, pilots: 0 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Governance</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">Procurement pipeline metrics · Simulated data for SIH 2026</p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {METRICS.map(m => (
          <div key={m.label} className="rounded-xl border border-slate-200 bg-white shadow-sm px-4 py-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${m.color} mb-3`}>
              {m.icon}
            </div>
            <p className="text-2xl font-black text-slate-900">{m.value}</p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">{m.label}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Domain breakdown */}
        <Panel title="Problems by Domain" icon={<BarChart3 size={15} />}>
          <div className="space-y-3">
            {DOMAIN_DATA.map(d => (
              <div key={d.domain} className="flex items-center gap-3">
                <span className="w-36 shrink-0 text-sm text-slate-700">{d.domain}</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-[#168675]" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="w-6 shrink-0 text-right text-sm font-bold text-slate-800">{d.count}</span>
              </div>
            ))}
          </div>
        </Panel>

        {/* Monthly activity */}
        <Panel title="Monthly Activity" icon={<TrendingUp size={15} />}>
          <div className="space-y-2">
            <div className="grid grid-cols-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
              <span>Month</span>
              <span className="text-center">Problems</span>
              <span className="text-center">Pilots Started</span>
            </div>
            {TIMELINE.map(t => (
              <div key={t.month} className="grid grid-cols-3 items-center py-1.5">
                <span className="text-sm font-medium text-slate-700">{t.month}</span>
                <div className="flex justify-center">
                  <div className="flex items-center gap-1">
                    <div className="h-2 rounded-full bg-blue-400" style={{ width: `${t.problems * 8}px` }} />
                    <span className="text-xs text-slate-600">{t.problems}</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="flex items-center gap-1">
                    <div className="h-2 rounded-full bg-[#168675]" style={{ width: `${t.pilots * 14}px` }} />
                    <span className="text-xs text-slate-600">{t.pilots}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Hero Demo: Problem #1042 Pipeline">
        <div className="overflow-x-auto">
          <div className="flex min-w-max items-center gap-3">
            {[
              { stage: "Problem Identified", status: "✓", detail: "#1042 · AI Road Detection" },
              { stage: "Requirements", status: "✓", detail: "AI-structured · Approved" },
              { stage: "Matching", status: "✓", detail: "3 ranked · SkylineAI #1" },
              { stage: "Pilot", status: "✓", detail: "90 days · Final Eval" },
              { stage: "Readiness", status: "91/100", detail: "HIGH band" },
              { stage: "Decision", status: "→", detail: "Officer gate" },
              { stage: "Handoff", status: "→", detail: "Procurement pack" },
              { stage: "Scale", status: "→", detail: "3 departments" },
            ].map((item, i) => (
              <div key={item.stage} className="flex items-center gap-2">
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm text-center min-w-[110px]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.stage}</p>
                  <p className="text-sm font-black text-[#168675] mt-0.5">{item.status}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">{item.detail}</p>
                </div>
                {i < 7 && <span className="text-slate-300 font-bold">→</span>}
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}
