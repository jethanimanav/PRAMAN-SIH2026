"use client";

import { usePraman } from "@/lib/PramanContext";
import { GovPageHeader, Panel, Empty, Action, AlertBanner } from "@/components/ui";
import { Badge } from "@/components/Badge";
import { ShieldCheck, CheckCircle2, AlertTriangle, UserRound } from "lucide-react";

export default function DecisionsPage() {
  const { readiness, decision, pilot, decisionReason, setDecisionReason, submitDecision, loading, error } = usePraman();

  const DECISION_OPTIONS = [
    { value: "Proceed to Procurement Review", label: "Proceed to Procurement Review", tone: "Recommended based on readiness score" },
    { value: "Defer Pending Security", label: "Defer — Pending Security Clearance", tone: "Address security blocker first" },
    { value: "Reject", label: "Reject — Does not meet procurement standards", tone: "Evidence insufficient" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <GovPageHeader
        eyebrow="Decision"
        title="Human Decision Gate"
        subtitle="Final procurement decision by authorized government official"
        recordId="PRB-MH-2026-1042 · Awaiting Officer Decision"
      />

      {error && <AlertBanner type="error" message={error} />}

      {/* Governance notice */}
      <div
        style={{
          borderRadius: 4,
          border: "1px solid var(--gov-blue-border)",
          borderLeft: "4px solid var(--gov-blue)",
          background: "var(--gov-blue-light)",
          padding: "14px 16px",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <AlertTriangle size={16} style={{ color: "var(--gov-blue)", flexShrink: 0, marginTop: 1 }} />
        <div>
          <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--gov-blue)", margin: "0 0 4px" }}>
            Decision Support Only · Not Autonomous Procurement
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--ink-mid)", margin: 0, lineHeight: 1.6 }}>
            PRAMAN provides evidence-based decision support. The final procurement decision is made exclusively
            by the authorized government officer. No AI system in PRAMAN approves, rejects or bypasses government
            procurement policy.
          </p>
        </div>
      </div>

      {readiness ? (
        decision ? (
          /* Decision submitted view */
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                borderRadius: 4,
                border: "1px solid var(--success-border)",
                borderLeft: "4px solid var(--success)",
                background: "var(--success-light)",
                padding: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <CheckCircle2 size={26} style={{ color: "var(--success)", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--success)", margin: "0 0 2px" }}>
                    Decision Submitted Successfully
                  </p>
                  <p style={{ fontSize: "1rem", fontWeight: 800, color: "var(--ink)", margin: 0 }}>{decision.status}</p>
                </div>
              </div>
              <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", marginBottom: 12 }}>
                {[
                  ["Officer", decision.officer_identity],
                  ["Decision", decision.decision],
                  ["Data Class", decision.data_class],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{ borderRadius: 4, background: "var(--white)", border: "1px solid var(--success-border)", padding: "8px 12px" }}
                  >
                    <p className="gov-section-label" style={{ marginBottom: 3 }}>{label}</p>
                    <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--ink)", margin: 0 }}>{value}</p>
                  </div>
                ))}
              </div>
              <div style={{ borderRadius: 4, background: "var(--white)", border: "1px solid var(--success-border)", padding: "10px 14px" }}>
                <p className="gov-section-label" style={{ marginBottom: 4 }}>Justification</p>
                <p style={{ fontSize: "0.8rem", color: "var(--ink-mid)", margin: 0, lineHeight: 1.7 }}>{decision.reason}</p>
              </div>
            </div>
          </div>
        ) : (
          /* Decision input form */
          <div style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr 300px" }} className="max-lg:!grid-cols-1 min-w-0">
            <Panel title="Officer Decision" icon={<UserRound size={14} />}>
              {/* Readiness summary */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  borderRadius: 4,
                  border: "1px solid var(--line)",
                  background: "var(--mist)",
                  padding: "12px 16px",
                  marginBottom: 20,
                }}
              >
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <p style={{ fontSize: "2rem", fontWeight: 900, color: "var(--gov-blue)", margin: 0, lineHeight: 1 }}>
                    {readiness.score}
                  </p>
                  <p className="gov-section-label" style={{ marginTop: 4 }}>/100 Readiness</p>
                </div>
                <div style={{ borderLeft: "1px solid var(--line)", paddingLeft: 16 }}>
                  <Badge tone="success">{readiness.band}</Badge>
                  <p style={{ fontSize: "0.7rem", color: "var(--ink-soft)", margin: "6px 0 0", lineHeight: 1.5 }}>
                    Based on pilot evidence for Problem #1042
                    <br />SkylineAI Solutions · AI Road Damage Detection
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label className="gov-input-label">Decision</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {DECISION_OPTIONS.map(opt => (
                      <label
                        key={opt.value}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 12,
                          borderRadius: 4,
                          border: "1.5px solid var(--line)",
                          padding: "10px 14px",
                          cursor: "pointer",
                          transition: "border-color 0.15s, background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "var(--gov-blue-border)";
                          e.currentTarget.style.background = "var(--gov-blue-light)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "var(--line)";
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <input
                          type="radio"
                          name="decision"
                          value={opt.value}
                          defaultChecked={opt.value === "Proceed to Procurement Review"}
                          style={{ marginTop: 2, accentColor: "var(--gov-blue)" }}
                        />
                        <div>
                          <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--ink)", margin: 0 }}>{opt.label}</p>
                          <p style={{ fontSize: "0.65rem", color: "var(--ink-soft)", margin: "2px 0 0" }}>{opt.tone}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="gov-input-label">
                    Officer Justification <span style={{ color: "var(--critical)" }}>*</span>
                  </label>
                  <textarea
                    style={{
                      width: "100%",
                      borderRadius: 4,
                      border: "1.5px solid var(--line)",
                      background: "var(--white)",
                      padding: "10px 14px",
                      fontSize: "0.8rem",
                      color: "var(--ink)",
                      outline: "none",
                      minHeight: 100,
                      resize: "vertical",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                      lineHeight: 1.6,
                      transition: "border-color 0.15s, box-shadow 0.15s",
                    }}
                    value={decisionReason}
                    onChange={e => setDecisionReason(e.target.value)}
                    placeholder="Provide your decision justification..."
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "var(--gov-blue)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,58,92,0.08)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "var(--line)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                <Action
                  onClick={submitDecision}
                  label="Submit Human Decision"
                  icon={<ShieldCheck size={14} />}
                  disabled={!decisionReason.trim() || loading === "Submitting human decision"}
                />
              </div>
            </Panel>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Panel title="PRAMAN AI Recommendation" icon={<ShieldCheck size={14} />}>
                <div
                  style={{
                    borderRadius: 4,
                    background: "var(--gov-blue-light)",
                    border: "1px solid var(--gov-blue-border)",
                    padding: "12px 14px",
                    marginBottom: 10,
                  }}
                >
                  <p className="gov-section-label" style={{ color: "var(--gov-blue)", marginBottom: 4 }}>AI Suggests</p>
                  <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--gov-blue)", margin: 0 }}>
                    Proceed to Procurement Review
                  </p>
                  <p style={{ fontSize: "0.7rem", color: "var(--ink-mid)", margin: "6px 0 0", lineHeight: 1.5 }}>
                    Readiness score {readiness.score}/100 with {readiness.band} band. Security blocker identified — officer review recommended.
                  </p>
                </div>
                <div
                  style={{
                    borderRadius: 4,
                    background: "var(--warning-light)",
                    border: "1px solid var(--warning-border)",
                    padding: "8px 12px",
                    fontSize: "0.7rem",
                    color: "var(--warning)",
                  }}
                >
                  <strong>Blocker:</strong> {readiness.blocker}
                </div>
              </Panel>

              <div className="gov-card">
                <div className="gov-card-header">
                  <h2 style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-mid)", margin: 0 }}>
                    Pre-Decision Checklist
                  </h2>
                </div>
                <div style={{ padding: "10px 16px" }}>
                  {[
                    { label: "Pilot KPIs verified", done: true },
                    { label: "Evidence locker reviewed", done: true },
                    { label: "Readiness calculated", done: !!readiness },
                    { label: "Security review (partial)", done: false },
                    { label: "Officer justification", done: decisionReason.trim().length > 20 },
                  ].map(item => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid var(--line)" }}>
                      {item.done
                        ? <CheckCircle2 size={14} style={{ color: "var(--success)", flexShrink: 0 }} />
                        : <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--line)", flexShrink: 0 }} />
                      }
                      <span style={{ fontSize: "0.8rem", color: item.done ? "var(--ink)" : "var(--ink-muted)" }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <Panel title="Human Decision Gate" icon={<ShieldCheck size={14} />}>
          <Empty
            text="Procurement Readiness must be calculated before the officer decision gate becomes available."
            action="Go to Procurement Readiness"
          />
        </Panel>
      )}
    </div>
  );
}
