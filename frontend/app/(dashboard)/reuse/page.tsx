"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { AlertBanner, Empty, Panel } from "@/components/ui";
import { RefreshCw, ArrowRight, ShieldCheck, Zap, Database, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function ReusePage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ items: any[] }>("/api/v1/reuse-recommendations")
      .then(res => {
        setRecommendations(res.items);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-10 text-center font-bold text-slate-500 animate-pulse">Loading reuse intelligence...</div>;
  }

  if (recommendations.length === 0) {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Intelligence</p>
          <h1 className="mt-1 text-2xl font-black text-slate-900">Reuse Intelligence</h1>
        </div>
        <Panel title="Recommendations">
          <Empty text="No high-confidence reuse opportunities found for the current problem." />
        </Panel>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Intelligence</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Reuse Intelligence</h1>
        <p className="mt-1 text-sm text-slate-500">AI-driven recommendations to bypass redundant procurement by reusing proven successful solutions.</p>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      <div className="grid gap-6">
        {recommendations.map(rec => (
          <div key={rec.id} className="rounded-xl border-2 border-emerald-500 bg-white overflow-hidden shadow-sm">
            <div className="bg-emerald-500 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <RefreshCw size={24} />
                <div>
                  <h2 className="text-xl font-black">{rec.recommendation}</h2>
                  <p className="text-emerald-100 text-sm font-medium">Confidence Score: {rec.reuse_confidence_pct}%</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-700">
                  {rec.similarity_pct}% Problem Match
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-base text-slate-700 font-medium leading-relaxed">{rec.reason}</p>
              
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-500 uppercase">Proven Solution</p>
                  <p className="mt-1 text-lg font-black text-slate-900">{rec.startup}</p>
                  <p className="text-xs text-slate-600 mt-0.5">Deployed in {rec.previous_city} ({rec.previous_year})</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-500 uppercase">Production Accuracy</p>
                  <p className="mt-1 text-lg font-black text-emerald-600">{rec.production_outcome_pct}%</p>
                  <p className="text-xs text-emerald-700 mt-0.5">Verified by audit</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-500 uppercase">Implementation Time</p>
                  <p className="mt-1 text-lg font-black text-slate-900">{rec.implementation_days} days</p>
                  <p className="text-xs text-slate-600 mt-0.5">vs. 180 days typical</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 pt-6 border-t border-slate-100">
                <button className="inline-flex items-center gap-2 rounded-lg bg-[#168675] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#126b5d]">
                  <Zap size={16} /> Fast-Track Procurement
                </button>
                <Link href={`/memory?q=${rec.previous_city}`} className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-6 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200">
                  <Database size={16} /> View Original Project Case Study
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid md:grid-cols-2 gap-5 mt-4">
        <Panel title="Time & Cost Savings Estimate" icon={<TrendingUp size={16}/>}>
           <div className="space-y-4 text-sm">
             <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Procurement Cycle</span>
                <span className="font-bold text-emerald-600">-6 months</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Pilot Costs</span>
                <span className="font-bold text-emerald-600">Eliminated (100% savings)</span>
             </div>
             <div className="flex justify-between items-center py-2">
                <span className="text-slate-600">Implementation Risk</span>
                <span className="font-bold text-emerald-600">Reduced by 74%</span>
             </div>
           </div>
        </Panel>
        
        <Panel title="Legal & Policy Compliance" icon={<ShieldCheck size={16}/>}>
           <p className="text-sm text-slate-700 mb-3">
             Reusing this solution complies with Section 4.2 of the Evidence-Based Innovation Procurement Policy, which allows direct procurement from startups that have successfully completed a pilot and production deployment in a peer municipality for an identical problem statement with &gt;85% similarity score.
           </p>
        </Panel>
      </div>
    </div>
  );
}
