"use client";

import { usePraman } from "@/lib/PramanContext";
import { GovPageHeader, Panel, Info, Empty, Action, AlertBanner, StatusBadge, kpiTrace } from "@/components/ui";
import { Badge } from "@/components/Badge";
import { ListChecks, CheckCircle2, Sparkles, ShieldAlert } from "lucide-react";

export default function RequirementsPage() {
  const { problem, requirement, structure, approve, loading, error, setTrace } = usePraman();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <GovPageHeader
        eyebrow="Problem to Pilot"
        title="Requirements"
        subtitle="AI-structured procurement requirements for review and officer approval"
        actions={
          <>
            <Action
              onClick={structure}
              label="Structure with PRAMAN AI"
              icon={<Sparkles size={14} />}
              disabled={!problem || !!requirement || loading === "Structuring problem"}
              size="sm"
            />
            <Action
              onClick={approve}
              label="Approve Requirements"
              icon={<CheckCircle2 size={14} />}
              disabled={!requirement || requirement.status === "Approved" || loading === "Approving requirement"}
              muted={requirement?.status === "Approved"}
              size="sm"
            />
          </>
        }
      />

      {error && <AlertBanner type="error" message={error} />}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, borderRadius: 4, padding: "10px 14px", background: "var(--gov-blue-light)", border: "1px solid var(--gov-blue-border)", borderLeft: "3px solid var(--gov-blue)" }}>
          <Sparkles size={13} style={{ color: "var(--gov-blue)" }} className="animate-pulse" />
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--gov-blue)" }}>{loading}…</span>
        </div>
      )}

      {requirement ? (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,300px)] gap-5 min-w-0">
          {/* Main requirement detail */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Panel title="Structured Requirements" icon={<ListChecks size={14} />}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p className="gov-section-label" style={{ marginBottom: 3 }}>Requirement ID</p>
                    <p style={{ fontFamily: "monospace", fontSize: "0.8rem", fontWeight: 700, color: "var(--ink)", margin: 0 }}>
                      {requirement.id}
                    </p>
                  </div>
                  <StatusBadge status={requirement.status} />
                </div>

                <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
                  <Info label="Domain" value={requirement.domain} trace={() => setTrace(kpiTrace("Domain", "Problem narrative + PRAMAN AI", requirement.domain))} />
                  <Info label="Technology" value={requirement.technology} trace={() => setTrace(kpiTrace("Technology", "AI structuring engine", requirement.technology))} />
                  <Info label="Problem Type" value={requirement.problem_type} />
                  <Info label="Geography" value={requirement.geography} />
                  <Info label="Budget Range" value={requirement.budget} trace={() => setTrace(kpiTrace("Budget", "Problem statement", requirement.budget))} />
                  <Info label="Timeline" value={requirement.timeline} />
                </div>

                <div>
                  <p className="gov-section-label" style={{ marginBottom: 8 }}>Deployment Context</p>
                  <p style={{ borderRadius: 4, background: "var(--mist)", border: "1px solid var(--line)", padding: "10px 12px", fontSize: "0.8rem", color: "var(--ink-mid)", margin: 0, lineHeight: 1.6 }}>
                    {requirement.deployment}
                  </p>
                </div>

                <div>
                  <p className="gov-section-label" style={{ marginBottom: 8 }}>Data Requirements</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {requirement.data_requirements?.map((d: string) => (
                      <span
                        key={d}
                        style={{ borderRadius: 3, background: "var(--gov-blue-light)", border: "1px solid var(--gov-blue-border)", padding: "3px 10px", fontSize: "0.7rem", fontWeight: 600, color: "var(--gov-blue)" }}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>

            {/* KPIs */}
            <Panel title="Key Performance Indicators" icon={<CheckCircle2 size={14} />}>
              <div>
                {requirement.kpis?.map((kpi: any) => (
                  <div
                    key={kpi.name}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--line)" }}
                  >
                    <div>
                      <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--ink)", margin: 0 }}>{kpi.name}</p>
                      <p style={{ fontSize: "0.65rem", color: "var(--ink-soft)", margin: "2px 0 0" }}>Target: <strong>{kpi.target}</strong></p>
                    </div>
                    <Badge tone={kpi.confidence === "HIGH" ? "success" : "amber"}>{kpi.confidence}</Badge>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* Right panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Panel title="Security Requirements" icon={<ShieldAlert size={14} />} accent="saffron">
              <p style={{ fontSize: "0.8rem", color: "var(--ink-mid)", lineHeight: 1.6, margin: "0 0 10px" }}>{requirement.security}</p>
              <div style={{ borderRadius: 4, background: "var(--warning-light)", border: "1px solid var(--warning-border)", padding: "8px 12px", fontSize: "0.7rem", color: "var(--warning)", fontWeight: 500 }}>
                Security questionnaire + deployment review required before procurement.
              </div>
            </Panel>

            <Panel title="Constraints">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {requirement.constraints?.map((c: string) => (
                  <div
                    key={c}
                    style={{ display: "flex", alignItems: "flex-start", gap: 8, borderRadius: 4, background: "var(--critical-light)", border: "1px solid var(--critical-border)", padding: "8px 12px", fontSize: "0.75rem", color: "var(--critical)" }}
                  >
                    <ShieldAlert size={13} style={{ marginTop: 1, flexShrink: 0 }} />
                    {c}
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="AI Confidence">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(requirement.confidence?.fields || {}).map(([field, conf]: [string, any]) => (
                  <div key={field} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.8rem", textTransform: "capitalize", color: "var(--ink-mid)" }}>{field}</span>
                    <Badge tone={conf === "HIGH" ? "success" : "amber"}>{conf}</Badge>
                  </div>
                ))}
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--ink)" }}>Overall</span>
                  <Badge tone={requirement.confidence?.overall === "HIGH" ? "success" : "amber"}>
                    {requirement.confidence?.overall}
                  </Badge>
                </div>
              </div>
            </Panel>

            {requirement.status === "Approved" && (
              <div
                style={{
                  borderRadius: 4,
                  background: "var(--success-light)",
                  border: "1px solid var(--success-border)",
                  borderLeft: "4px solid var(--success)",
                  padding: "14px 16px",
                  textAlign: "center",
                }}
              >
                <CheckCircle2 size={22} style={{ color: "var(--success)", margin: "0 auto 8px" }} />
                <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--success)", margin: 0 }}>Requirements Approved</p>
                <p style={{ fontSize: "0.7rem", color: "var(--success)", margin: "4px 0 0", opacity: 0.8 }}>Matching engine is now unlocked</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Panel title="Requirement Structuring" icon={<ListChecks size={14} />}>
          <Empty
            text={problem ? "Click 'Structure with PRAMAN AI' to extract structured requirements from the problem narrative." : "Load Hero Scenario from Dashboard first."}
            action={problem ? "Structure with PRAMAN AI" : "Go to Dashboard → Load Hero Scenario"}
          />
        </Panel>
      )}
    </div>
  );
}
