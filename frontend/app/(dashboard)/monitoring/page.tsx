"use client";

import { usePraman } from "@/lib/PramanContext";
import { AlertBanner, Empty, Panel, kpiTrace } from "@/components/ui";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, ArrowUpRight, ArrowDownRight, CheckCircle2 } from "lucide-react";
import type { MonitoringRecord, KPIMeasurement } from "@/types/praman";

export default function MonitoringPage() {
  const { monitoring, error, setTrace } = usePraman();

  if (!monitoring || monitoring.length === 0) {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Post-Procurement</p>
          <h1 className="mt-1 text-2xl font-black text-slate-900">Post-Procurement Monitoring</h1>
        </div>
        <Panel title="Monitoring Dashboard">
          <Empty text="No monitoring records found for this project." action="Check Handoff Data" />
        </Panel>
      </div>
    );
  }

  // Map data for chart
  const chartData = monitoring.map(m => ({
    name: m.month,
    Accuracy: m.accuracy_pct,
    Uptime: m.uptime_pct,
  }));

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Post-Procurement</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Post-Procurement Monitoring</h1>
        <p className="mt-1 text-sm text-slate-500">Track production KPIs, SLA compliance, and operational cost.</p>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Accuracy Trend" icon={<Activity size={16} />}>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[80, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="Accuracy" stroke="#168675" strokeWidth={3} dot={{ r: 4, fill: "#168675" }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Uptime" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-6 text-xs font-bold text-slate-500">
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-[#168675]"></div>Detection Recall (%)</div>
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-blue-500"></div>System Uptime (%)</div>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title="Current Status (Month 3)">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Avg Uptime</p>
                <p className="mt-2 text-3xl font-black text-slate-900">97.3%</p>
                <p className="mt-1 flex items-center justify-center gap-1 text-xs font-bold text-emerald-600">
                  <ArrowUpRight size={14} /> Exceeds 95% SLA
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Avg Cost</p>
                <p className="mt-2 text-3xl font-black text-slate-900">₹1.83L</p>
                <p className="mt-1 flex items-center justify-center gap-1 text-xs font-bold text-emerald-600">
                  <ArrowDownRight size={14} /> Below ₹2.5L limit
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Monthly Records</h2>
        {monitoring.map((record) => (
          <Panel key={record.id} title={`${record.month} (${record.period})`} badge={record.issues_count === 0 ? "Zero Issues" : `${record.issues_count} Issues`}>
             <div className="overflow-x-auto">
               <table className="w-full text-sm">
                 <thead>
                   <tr className="border-b border-slate-200 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                     <th className="py-3 pr-4">KPI Metric</th>
                     <th className="py-3 pr-4">Promised Target</th>
                     <th className="py-3 pr-4">Actual Performance</th>
                     <th className="py-3 pr-4">Variance</th>
                     <th className="py-3">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {record.kpis.map((kpi: KPIMeasurement, idx: number) => (
                     <tr key={idx}>
                       <td className="py-3 pr-4 font-semibold text-slate-900">{kpi.name}</td>
                       <td className="py-3 pr-4 text-slate-500">{kpi.promised}</td>
                       <td className="py-3 pr-4 font-bold text-slate-900">{kpi.actual}</td>
                       <td className={`py-3 pr-4 font-bold ${kpi.met ? 'text-emerald-600' : 'text-red-600'}`}>
                         {kpi.variance}
                       </td>
                       <td className="py-3">
                         {kpi.met ? (
                           <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                             <CheckCircle2 size={12} /> Met
                           </span>
                         ) : (
                           <span className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-1 text-xs font-bold text-red-700">
                             Missed
                           </span>
                         )}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
             
             {record.notes && (
               <div className="mt-4 rounded bg-slate-50 p-3 text-sm text-slate-600">
                 <span className="font-bold text-slate-800">Notes:</span> {record.notes}
               </div>
             )}
             
             <div className="mt-4">
                <button
                  className="text-xs font-bold text-[#168675] hover:underline"
                  onClick={() => setTrace(kpiTrace(record.month, "monitoring_report.pdf", record.evidence_ref))}
                >
                  View Evidence ({record.evidence_ref})
                </button>
             </div>
          </Panel>
        ))}
      </div>

    </div>
  );
}
