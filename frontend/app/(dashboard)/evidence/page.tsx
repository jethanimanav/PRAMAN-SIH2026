"use client";

import { usePraman } from "@/lib/PramanContext";
import { Panel, Empty } from "@/components/ui";
import { Badge } from "@/components/Badge";
import { FileCheck2, ShieldCheck, CheckCircle2, ExternalLink } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  Technical: "bg-blue-50 text-blue-700 border-blue-200",
  Performance: "bg-purple-50 text-purple-700 border-purple-200",
  Commercial: "bg-green-50 text-green-700 border-green-200",
  Security: "bg-amber-50 text-amber-700 border-amber-200",
  "User Feedback": "bg-pink-50 text-pink-700 border-pink-200",
};

export default function EvidencePage() {
  const { pilot } = usePraman();
  const evidence = (pilot as any)?.evidence_items || [];

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Problem to Pilot</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Evidence Locker</h1>
        <p className="mt-1 text-sm text-slate-500">Verifiable pilot evidence supporting procurement decisions</p>
      </div>

      {pilot?.kpis?.length > 0 ? (
        <div className="space-y-5">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 flex items-start gap-3">
            <ShieldCheck size={20} className="shrink-0 text-emerald-600 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-emerald-800">Evidence verification active</p>
              <p className="text-xs text-emerald-600 mt-0.5">All evidence is simulated for SIH demonstration. In production, files would be cryptographically hashed and audit-logged.</p>
            </div>
            <Badge tone="amber">SIMULATED</Badge>
          </div>

          <div className="grid gap-3">
            {[
              { name: "Detection_Report_May.pdf", category: "Technical", type: "PDF", uploader: "Pilot Evaluator", date: "2026-05-28", verification: "Checked", kpi: "Detection Recall", hash: "AUD-SIM-001" },
              { name: "Field_Photos_Sample.zip", category: "Performance", type: "ZIP", uploader: "Field Team", date: "2026-05-29", verification: "Sampled", kpi: "False Positive Rate", hash: "AUD-SIM-002" },
              { name: "KPI_Summary_May.xlsx", category: "Commercial", type: "XLSX", uploader: "Evaluator", date: "2026-05-30", verification: "Recomputed", kpi: "Cost Efficiency", hash: "AUD-SIM-003" },
              { name: "Security_Assessment.pdf", category: "Security", type: "PDF", uploader: "CISO", date: "2026-05-30", verification: "80% complete", kpi: "Security", hash: "AUD-SIM-004" },
              { name: "User_Feedback.pdf", category: "User Feedback", type: "PDF", uploader: "Field Supervisor", date: "2026-05-31", verification: "Reviewed", kpi: "User Satisfaction", hash: "AUD-SIM-005" },
            ].map(item => (
              <div key={item.name} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <FileCheck2 size={18} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{item.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Uploaded by {item.uploader} · {item.date} · KPI: {item.kpi}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${CATEGORY_COLORS[item.category] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                    {item.category}
                  </span>
                  <Badge tone="signal">{item.verification}</Badge>
                  <div className="text-[10px] font-mono text-slate-400">{item.hash}</div>
                </div>
              </div>
            ))}
          </div>

          <Panel title="Verification Summary" icon={<CheckCircle2 size={15} />}>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Documents Uploaded", value: "5" },
                { label: "Fully Verified", value: "4" },
                { label: "Partial (Security)", value: "1" },
              ].map(item => (
                <div key={item.label} className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-center">
                  <p className="text-2xl font-black text-slate-900">{item.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <strong>Security assessment</strong> is 80% complete — outstanding items must be resolved before final procurement approval.
            </div>
          </Panel>
        </div>
      ) : (
        <Panel title="Evidence Locker" icon={<FileCheck2 size={15} />}>
          <Empty
            text="Evidence is populated when the pilot is fast-forwarded to Final Evaluation. Go to Pilots and click 'Fast-Forward'."
            action="Go to Pilots → Fast-Forward"
          />
        </Panel>
      )}
    </div>
  );
}
