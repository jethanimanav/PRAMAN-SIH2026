"use client";

import { usePraman } from "@/lib/PramanContext";
import { AlertBanner, Panel } from "@/components/ui";
import { Cpu, GitMerge, FileCheck2, Scale, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function TransparencyPage() {
  const { modelVersions, error } = usePraman();

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Intelligence</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Model Versioning & Transparency</h1>
        <p className="mt-1 text-sm text-slate-500">Track AI model drift, bias assessments, and algorithmic governance over time.</p>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      <Panel title="Matching Engine Registry" icon={<Cpu size={16} />}>
         <div className="overflow-x-auto">
           <table className="w-full text-sm">
             <thead>
               <tr className="border-b border-slate-200 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                 <th className="py-3 pr-4">Version</th>
                 <th className="py-3 pr-4">Deployed Date</th>
                 <th className="py-3 pr-4">Changes</th>
                 <th className="py-3 pr-4 text-center">Bias Score</th>
                 <th className="py-3 text-right">Audit Report</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {modelVersions?.map((v: any, idx: number) => (
                 <tr key={idx} className="hover:bg-slate-50 transition">
                   <td className="py-4 pr-4">
                     <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${v.status === 'Active' ? 'bg-[#168675]/10 text-[#168675] border border-[#168675]/20' : 'bg-slate-100 text-slate-600'}`}>
                       <GitMerge size={12} /> {v.version}
                       {v.status === 'Active' && <span className="ml-1 uppercase text-[10px] tracking-wider">Active</span>}
                     </span>
                   </td>
                   <td className="py-4 pr-4 font-medium text-slate-700">{v.date}</td>
                   <td className="py-4 pr-4 text-slate-600 max-w-xs">{v.changes}</td>
                   <td className="py-4 pr-4 text-center">
                     <span className={`font-black ${v.bias_score < 3 ? 'text-emerald-600' : 'text-amber-600'}`}>
                       {v.bias_score}/100
                     </span>
                   </td>
                   <td className="py-4 text-right">
                     <button className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline">
                       <FileCheck2 size={14} /> Report
                     </button>
                   </td>
                 </tr>
               ))}
               {!modelVersions && (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-500 font-medium">No model registry data available.</td></tr>
               )}
             </tbody>
           </table>
         </div>
      </Panel>

      <div className="grid md:grid-cols-2 gap-5 mt-4">
        <Panel title="Algorithmic Accountability Framework" icon={<Scale size={16}/>}>
           <div className="space-y-4 text-sm text-slate-700">
             <p>
               PRAMAN's AI Matching Engine operates under the National Framework for Algorithmic Accountability. 
             </p>
             <ul className="list-disc pl-5 space-y-2">
               <li><strong>Continuous Bias Testing:</strong> Models are evaluated monthly for demographic and regional bias.</li>
               <li><strong>Human-in-the-Loop:</strong> AI recommendations are strictly advisory. Human officers retain ultimate procurement authority.</li>
               <li><strong>Explainability:</strong> All matching scores include deterministic trace evidence mapped back to original requirements.</li>
             </ul>
           </div>
        </Panel>
        
        <Panel title="Governance Metrics">
           <div className="grid grid-cols-2 gap-4">
              <div className="rounded border border-slate-100 bg-slate-50 p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Override Rate</p>
                <p className="mt-2 text-3xl font-black text-slate-900">14.2%</p>
                <p className="mt-1 text-[10px] text-slate-500">Human selections differing from top AI rank</p>
              </div>
              <div className="rounded border border-slate-100 bg-slate-50 p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Drift Detection</p>
                <p className="mt-2 text-3xl font-black text-emerald-600">Stable</p>
                <p className="mt-1 text-[10px] text-slate-500">Last checked 48 hours ago</p>
              </div>
           </div>
        </Panel>
      </div>
    </div>
  );
}
