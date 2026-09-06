"use client";

import { usePraman } from "@/lib/PramanContext";
import { Panel, Empty, VerificationBadge } from "@/components/ui";
import { Badge } from "@/components/Badge";
import { FileCheck2, ShieldCheck, CheckCircle2, AlertTriangle, Hash } from "lucide-react";

const EVIDENCE_DATA = [
  {
    recordId: "EVID-MH-2026-001",
    name: "Detection_Report_May.pdf",
    category: "Technical",
    type: "PDF",
    source: "PWD Maharashtra / Pilot Evaluator",
    uploader: "Pilot Evaluator",
    date: "2026-05-28",
    verificationLevel: "VERIFIED" as const,
    verificationNote: "Independently checked by designated evaluator",
    confidence: "94%",
    kpi: "Detection Recall",
    hash: "8F3A...001",
  },
  {
    recordId: "EVID-MH-2026-002",
    name: "Field_Photos_Sample.zip",
    category: "Performance",
    type: "ZIP",
    source: "SkylineAI Field Team",
    uploader: "Field Team",
    date: "2026-05-29",
    verificationLevel: "PARTIALLY VERIFIED" as const,
    verificationNote: "Sample of 200 photos reviewed; full dataset not audited",
    confidence: "78%",
    kpi: "False Positive Rate",
    hash: "2C1B...002",
  },
  {
    recordId: "EVID-MH-2026-003",
    name: "KPI_Summary_May.xlsx",
    category: "Commercial",
    type: "XLSX",
    source: "PWD Evaluator",
    uploader: "Evaluator",
    date: "2026-05-30",
    verificationLevel: "VERIFIED" as const,
    verificationNote: "KPI figures independently recomputed from raw logs",
    confidence: "96%",
    kpi: "Cost Efficiency",
    hash: "A4F7...003",
  },
  {
    recordId: "EVID-MH-2026-004",
    name: "Security_Assessment.pdf",
    category: "Security",
    type: "PDF",
    source: "CISO / IT Security",
    uploader: "CISO",
    date: "2026-05-30",
    verificationLevel: "PARTIALLY VERIFIED" as const,
    verificationNote: "80% complete — penetration testing outstanding",
    confidence: "80%",
    kpi: "Security",
    hash: "D9E2...004",
  },
  {
    recordId: "EVID-MH-2026-005",
    name: "User_Feedback.pdf",
    category: "User Feedback",
    type: "PDF",
    source: "Field Supervisor",
    uploader: "Field Supervisor",
    date: "2026-05-31",
    verificationLevel: "VERIFIED" as const,
    verificationNote: "Reviewed by independent evaluator",
    confidence: "88%",
    kpi: "User Satisfaction",
    hash: "F1C5...005",
  },
];

const CAT_STYLES: Record<string, React.CSSProperties> = {
  Technical:      { background: "var(--info-light)", color: "var(--info)", borderColor: "#bfdbfe" },
  Performance:    { background: "#faf5ff", color: "#7c3aed", borderColor: "#ddd6fe" },
  Commercial:     { background: "var(--success-light)", color: "var(--success)", borderColor: "#bbf7d0" },
  Security:       { background: "var(--warning-light)", color: "var(--warning)", borderColor: "#fde68a" },
  "User Feedback":{ background: "#fdf2f8", color: "#be185d", borderColor: "#fbcfe8" },
};

export default function EvidencePage() {
  const { pilot } = usePraman();
  const hasEvidence = (pilot?.kpis?.length ?? 0) > 0;

  const verified = EVIDENCE_DATA.filter(e => e.verificationLevel === "VERIFIED").length;
  const partial  = EVIDENCE_DATA.filter(e => e.verificationLevel === "PARTIALLY VERIFIED").length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--saffron)" }}>
          Validation · Evidence Repository
        </p>
        <h1 className="mt-0.5 text-xl font-black" style={{ color: "var(--ink)" }}>Evidence Locker</h1>
        <p className="mt-0.5 text-[11px]" style={{ color: "var(--ink-soft)" }}>
          Official evidence records supporting procurement decisions · PIL-MH-2026-022
        </p>
      </div>

      {hasEvidence ? (
        <div className="space-y-5">
          {/* Verification Notice */}
          <div
            className="flex items-start gap-3 rounded border px-4 py-3"
            style={{ background: "var(--gov-blue-light)", borderColor: "var(--gov-blue-border)", borderLeft: "3px solid var(--gov-blue)" }}
          >
            <ShieldCheck size={15} className="mt-0.5 shrink-0" style={{ color: "var(--gov-blue)" }} />
            <div className="flex-1">
              <p className="text-[11px] font-bold" style={{ color: "var(--gov-blue)" }}>
                Evidence Verification Active — Official Records Repository
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: "var(--ink-soft)" }}>
                All evidence records are cryptographically hashed and immutably audit-logged. Verification status reflects independent evaluation. SIMULATED DATA for SIH 2026 demonstration.
              </p>
            </div>
            <Badge tone="amber">SIMULATED</Badge>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: EVIDENCE_DATA.length, label: "Records Uploaded", style: { background: "var(--gov-blue-light)", borderColor: "var(--gov-blue-border)", color: "var(--gov-blue)" } },
              { val: verified, label: "Fully Verified", style: { background: "var(--success-light)", borderColor: "#bbf7d0", color: "var(--success)" } },
              { val: partial,  label: "Partially Verified", style: { background: "var(--warning-light)", borderColor: "#fde68a", color: "var(--warning)" } },
            ].map(s => (
              <div key={s.label} className="rounded border px-4 py-3 text-center" style={s.style}>
                <p className="text-2xl font-black">{s.val}</p>
                <p className="text-[10px] mt-0.5 font-semibold">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Security warning */}
          <div
            className="flex items-start gap-2 rounded border px-4 py-3"
            style={{ background: "var(--warning-light)", borderColor: "#fde68a", borderLeft: "3px solid var(--warning)" }}
          >
            <AlertTriangle size={13} className="mt-0.5 shrink-0" style={{ color: "var(--warning)" }} />
            <p className="text-[11px] font-medium" style={{ color: "var(--warning)" }}>
              <strong>Security Assessment (EVID-MH-2026-004)</strong> is 80% complete — penetration testing and data residency confirmation outstanding. Final procurement approval requires 100% completion.
            </p>
          </div>

          {/* Evidence Records */}
          <div className="space-y-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--ink-soft)" }}>
              Evidence Records
            </p>
            {EVIDENCE_DATA.map(item => (
              <div
                key={item.recordId}
                className="rounded border bg-white overflow-hidden"
                style={{ borderColor: "var(--line)" }}
              >
                {/* Record Header */}
                <div
                  className="flex items-center justify-between px-4 py-2 border-b"
                  style={{ borderColor: "var(--line)", background: "var(--mist)" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="record-id">{item.recordId}</span>
                    <span
                      className="status-pill"
                      style={{ ...CAT_STYLES[item.category], border: `1px solid ${CAT_STYLES[item.category]?.borderColor ?? "var(--line)"}` }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <VerificationBadge level={item.verificationLevel} />
                </div>

                {/* Record Body */}
                <div className="px-4 py-3">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-[13px] font-bold" style={{ color: "var(--ink)" }}>{item.name}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--ink-soft)" }}>
                        Source: {item.source} · {item.date} · Related KPI: {item.kpi}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>Confidence</p>
                      <p className="text-[15px] font-black" style={{ color: "var(--gov-blue)" }}>{item.confidence}</p>
                    </div>
                  </div>
                  <p className="text-[10px] italic" style={{ color: "var(--ink-soft)" }}>{item.verificationNote}</p>
                  <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 text-[10px] font-mono" style={{ color: "var(--ink-soft)" }}>
                      <Hash size={10} /> {item.hash}
                    </div>
                    <button
                      className="inline-flex items-center gap-1 rounded px-2.5 py-1 text-[10px] font-semibold transition"
                      style={{ background: "var(--gov-blue-light)", color: "var(--gov-blue)", border: "1px solid var(--gov-blue-border)" }}
                    >
                      View Evidence Record
                    </button>
                    <button
                      className="inline-flex items-center gap-1 rounded px-2.5 py-1 text-[10px] font-semibold transition"
                      style={{ background: "var(--mist)", color: "var(--ink-mid)", border: "1px solid var(--line)" }}
                    >
                      Audit History
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Verification Legend */}
          <div className="rounded border bg-white px-4 py-3" style={{ borderColor: "var(--line)" }}>
            <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--ink-soft)" }}>
              Verification Status Legend
            </p>
            <div className="flex flex-wrap gap-3">
              {(["VERIFIED", "PARTIALLY VERIFIED", "SELF-DECLARED", "REJECTED", "PENDING"] as const).map(l => (
                <VerificationBadge key={l} level={l} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Panel title="Evidence Locker" icon={<FileCheck2 size={13} />}>
          <Empty
            text="Evidence records are populated when the pilot is fast-forwarded to Final Evaluation. Navigate to Pilot Management and click 'Fast-Forward'."
            action="Go to Pilot Management → Fast-Forward"
          />
        </Panel>
      )}
    </div>
  );
}
