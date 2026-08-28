"use client";

import { usePraman } from "@/lib/PramanContext";
import { Panel, Empty, Action, AlertBanner } from "@/components/ui";
import { Badge } from "@/components/Badge";
import { Package, Download, CheckCircle2, FileText } from "lucide-react";

export default function HandoffPage() {
  const { decision, handoff, pilot, generateHandoff, loading, error } = usePraman();

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Decision</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Handoff Pack</h1>
        <p className="mt-1 text-sm text-slate-500">Procurement handoff package for authorized officials</p>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      <Action
        onClick={generateHandoff}
        label="Generate Handoff Pack"
        icon={<Package size={14} />}
        disabled={!decision || !!handoff || loading === "Generating handoff pack"}
      />

      {handoff ? (
        <div className="space-y-5">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-800">Handoff Pack Generated</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Ready for authorized procurement officer review</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge tone="amber">{handoff.data_class || "SIMULATED"}</Badge>
                <Badge tone="signal">READY</Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Panel title="Package Details" icon={<Package size={15} />}>
              <div className="space-y-3">
                <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Title</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{handoff.title}</p>
                </div>
                {handoff.watermark && (
                  <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Watermark</p>
                    <p className="font-mono text-xs text-slate-600 mt-0.5">{handoff.watermark}</p>
                  </div>
                )}
                {handoff.summary && (
                  <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Summary</p>
                    <p className="text-sm text-slate-700 mt-0.5 leading-relaxed">{handoff.summary}</p>
                  </div>
                )}
              </div>
            </Panel>

            <Panel title="Included Sections" icon={<FileText size={15} />}>
              <ul className="space-y-2">
                {[
                  "Government Problem Statement",
                  "Structured Requirements",
                  "Eligibility & Matching Results",
                  "Pilot Evidence Summary",
                  "KPI Verification Report",
                  "Procurement Readiness Assessment",
                  "Officer Decision & Justification",
                  "Audit Trail (Append-Only)",
                ].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <Panel title="Package Preview" icon={<FileText size={15} />}>
            <div className="overflow-auto rounded-lg border border-slate-200 bg-slate-900 p-4 max-h-80">
              <pre className="text-xs text-slate-200 font-mono leading-relaxed whitespace-pre-wrap">
                {JSON.stringify({ ...handoff, audit: "..." }, null, 2)}
              </pre>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(handoff, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url; a.download = "praman_handoff_1042.json"; a.click();
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <Download size={14} /> Download JSON
              </button>
            </div>
          </Panel>
        </div>
      ) : (
        <Panel title="Handoff Pack" icon={<Package size={15} />}>
          <Empty
            text={decision ? "Click 'Generate Handoff Pack' to compile all evidence, requirements, pilot results and decision into a procurement handoff document." : "Submit the Human Decision first to unlock handoff generation."}
            action={decision ? "Generate Handoff Pack" : "Go to Decisions"}
          />
        </Panel>
      )}
    </div>
  );
}
