"use client";

import { usePraman } from "@/lib/PramanContext";
import { AlertBanner, Panel, Empty } from "@/components/ui";
import { Users2 } from "lucide-react";

export default function ResponsibilityMatrixPage() {
  const { error } = usePraman();
  const responsibilities = [
    { id: "resp-01", activity: "Problem Requirement Definition", role: "Government Officer", name: "Ananya Deshmukh", dept: "Urban Development / PWD", deadline: "2026-09-20", status: "Completed", blocked_by: null },
    { id: "resp-02", activity: "Startup Evaluation", role: "Pilot Evaluator", name: "Pilot Evaluator", dept: "Independent Evaluation", deadline: "2026-09-30", status: "Completed", blocked_by: null },
    { id: "resp-03", activity: "Evidence Validation", role: "Independent Expert", name: "Pilot Evaluator", dept: "Independent Evaluation", deadline: "2026-10-05", status: "Completed", blocked_by: null },
    { id: "resp-04", activity: "Security Review", role: "CISO", name: "Security Reviewer", dept: "IT Security", deadline: "2026-10-10", status: "In Progress", blocked_by: null },
    { id: "resp-05", activity: "Pilot Execution", role: "Startup", name: "SkylineAI CTO", dept: "SkylineAI Solutions", deadline: "2026-10-25", status: "Blocked", blocked_by: "Government API Integration" },
    { id: "resp-06", activity: "API Integration", role: "IT Lead", name: "IT Lead", dept: "IT Department", deadline: "2026-10-15", status: "Blocked", blocked_by: "API Spec Review" },
    { id: "resp-07", activity: "Field Deployment", role: "Startup + Dept", name: "SkylineAI + Field Team", dept: "PWD", deadline: "2026-10-30", status: "Blocked", blocked_by: "API Integration" },
    { id: "resp-08", activity: "Final Acceptance", role: "Government Officer", name: "Ananya Deshmukh", dept: "Urban Development", deadline: "2026-11-05", status: "Not Started", blocked_by: null },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "text-emerald-700 bg-emerald-50";
      case "In Progress": return "text-blue-700 bg-blue-50";
      case "Blocked": return "text-red-700 bg-red-50";
      default: return "text-slate-600 bg-slate-50";
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Post-Procurement</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Responsibility Matrix</h1>
        <p className="mt-1 text-sm text-slate-500">Cross-departmental ownership and status tracking.</p>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      <Panel title="RACI & Status Matrix" icon={<Users2 size={16} />}>
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="border-b border-slate-200 px-4 py-3 font-bold uppercase tracking-wider text-slate-500 text-xs">Activity</th>
                <th className="border-b border-slate-200 px-4 py-3 font-bold uppercase tracking-wider text-slate-500 text-xs">Role / Owner</th>
                <th className="border-b border-slate-200 px-4 py-3 font-bold uppercase tracking-wider text-slate-500 text-xs">Department</th>
                <th className="border-b border-slate-200 px-4 py-3 font-bold uppercase tracking-wider text-slate-500 text-xs">Deadline</th>
                <th className="border-b border-slate-200 px-4 py-3 font-bold uppercase tracking-wider text-slate-500 text-xs">Status</th>
                <th className="border-b border-slate-200 px-4 py-3 font-bold uppercase tracking-wider text-slate-500 text-xs">Blocked By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {responsibilities.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-semibold text-slate-900">{r.activity}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.role}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{r.dept}</td>
                  <td className="px-4 py-3 text-slate-600 font-medium">{r.deadline}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded px-2 py-1 text-xs font-bold ${getStatusColor(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-red-600 text-xs font-medium">
                    {r.blocked_by || "-"}
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
