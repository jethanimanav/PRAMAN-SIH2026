"use client";

import { usePraman } from "@/lib/PramanContext";
import { AlertBanner, Empty, Panel, kpiTrace } from "@/components/ui";
import { Trophy, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";

export default function OutcomesPage() {
  const { outcome, error, setTrace } = usePraman();

  if (!outcome) {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Post-Procurement</p>
          <h1 className="mt-1 text-2xl font-black text-slate-900">Outcome Tracking</h1>
        </div>
        <Panel title="Final Outcome">
          <Empty text="No outcome recorded yet. Project must complete implementation and monitoring." />
        </Panel>
      </div>
    );
  }

  const getResultColor = (result: string) => {
    if (result.includes("Exceeded")) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (result.includes("Met")) return "bg-blue-100 text-blue-800 border-blue-200";
    if (result.includes("Partial")) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Post-Procurement</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Outcome Tracking</h1>
        <p className="mt-1 text-sm text-slate-500">Final evaluation against procurement targets.</p>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      <div className="rounded-xl border-2 border-[#168675] bg-white overflow-hidden shadow-sm">
        <div className="bg-[#168675] px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Trophy size={24} />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">Project Result</p>
              <h2 className="text-xl font-black">{outcome.result}</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-emerald-100">Completed On</p>
            <p className="text-sm font-bold">{outcome.completion_date}</p>
          </div>
        </div>
        <div className="p-6">
          <p className="text-base text-slate-700 leading-relaxed font-medium">{outcome.reason}</p>
          
          <div className="mt-6 flex flex-wrap gap-4">
             <button
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 border border-emerald-200"
                onClick={() => setTrace(kpiTrace("Final Evaluation", "acceptance_certificate.pdf", outcome.related_evidence))}
              >
                <CheckCircle2 size={16} /> View Acceptance Certificate
              </button>
              {outcome.related_dependency && (
                <div className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 border border-amber-200">
                  <AlertTriangle size={16} /> Key Delay: {outcome.related_dependency}
                </div>
              )}
          </div>
        </div>
      </div>

      <Panel title="Outcome Dimensions" icon={<TrendingUp size={16} />}>
         <div className="overflow-x-auto">
           <table className="w-full text-sm">
             <thead>
               <tr className="border-b border-slate-200 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                 <th className="py-3 pr-4">Dimension</th>
                 <th className="py-3 pr-4">Expected Target</th>
                 <th className="py-3 pr-4">Actual Result</th>
                 <th className="py-3 pr-4">Variance</th>
                 <th className="py-3 text-right">Evaluation</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {outcome.dimensions.map((dim: any, idx: number) => (
                 <tr key={idx} className="hover:bg-slate-50 transition">
                   <td className="py-4 pr-4 font-bold text-slate-900">{dim.name}</td>
                   <td className="py-4 pr-4 text-slate-500">{dim.expected}</td>
                   <td className="py-4 pr-4 font-bold text-slate-900">{dim.actual}</td>
                   <td className={`py-4 pr-4 font-bold ${dim.variance.startsWith('+') && dim.name !== 'Implementation Time' ? 'text-emerald-600' : dim.name === 'Implementation Time' && dim.variance.startsWith('+') ? 'text-red-600' : 'text-slate-600'}`}>
                     {dim.variance}
                   </td>
                   <td className="py-4 text-right">
                     <span className={`inline-flex rounded px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide border ${getResultColor(dim.result)}`}>
                       {dim.result}
                     </span>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </Panel>
    </div>
  );
}
