"use client";

import { usePraman } from "@/lib/PramanContext";
import { Panel, Empty, Action, AlertBanner, GovPageHeader } from "@/components/ui";
import { Badge } from "@/components/Badge";
import { Package, Download, CheckCircle2, FileText } from "lucide-react";

export default function HandoffPage() {
  const { decision, handoff, pilot, generateHandoff, loading, error } = usePraman();

  return (
    <div className="space-y-5">
      <GovPageHeader
        eyebrow="Decision"
        title="Handoff Pack"
        subtitle="Procurement handoff package for authorized officials"
        recordId="PRB-MH-2026-1042 · Export Ready"
      />

      {error && <AlertBanner type="error" message={error} />}

      <Action
        onClick={generateHandoff}
        label="Generate Handoff Pack"
        icon={<Package size={14} />}
        disabled={!decision || !!handoff || loading === "Generating handoff pack"}
      />

      {handoff ? (
        <div className="space-y-5">
          <div className="rounded border px-5 py-4" style={{ background: "var(--success-light)", borderColor: "var(--success-border)" }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} className="shrink-0" style={{ color: "var(--success)" }} />
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--success)" }}>Handoff Pack Generated</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--success)" }}>Ready for authorized procurement officer review</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge tone="amber">{handoff.data_class || "SIMULATED"}</Badge>
                <Badge tone="signal">READY</Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="min-w-0">
              <Panel title="Package Details" icon={<Package size={15} />}>
                <div className="space-y-3">
                  <div className="rounded bg-white border px-3 py-2.5" style={{ borderColor: "var(--line)" }}>
                    <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: "var(--ink-soft)" }}>Title</p>
                    <p className="text-[13px] font-bold mt-0.5" style={{ color: "var(--ink)" }}>{handoff.title}</p>
                  </div>
                  {handoff.watermark && (
                    <div className="rounded bg-white border px-3 py-2.5" style={{ borderColor: "var(--line)" }}>
                      <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: "var(--ink-soft)" }}>Watermark</p>
                      <p className="font-mono text-xs mt-0.5" style={{ color: "var(--ink-mid)" }}>{handoff.watermark}</p>
                    </div>
                  )}
                  {handoff.summary && (
                    <div className="rounded bg-white border px-3 py-2.5" style={{ borderColor: "var(--line)" }}>
                      <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: "var(--ink-soft)" }}>Summary</p>
                      <p className="text-[13px] mt-0.5 leading-relaxed" style={{ color: "var(--ink-mid)" }}>{handoff.summary}</p>
                    </div>
                  )}
                </div>
              </Panel>
            </div>

            <div className="min-w-0">
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
                  <li key={item} className="flex items-center gap-2 text-[13px]" style={{ color: "var(--ink-mid)" }}>
                    <CheckCircle2 size={13} className="shrink-0" style={{ color: "var(--success)" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </Panel>
            </div>
          </div>

          <Panel title="Package Preview" icon={<FileText size={15} />}>
            <div className="overflow-auto rounded border p-4 max-h-80" style={{ background: "var(--ink)", borderColor: "var(--line)" }}>
              <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap" style={{ color: "var(--white)" }}>
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
                className="inline-flex items-center gap-2 rounded border px-4 py-2 text-sm font-semibold transition"
                style={{ background: "var(--white)", borderColor: "var(--line)", color: "var(--ink)" }}
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
