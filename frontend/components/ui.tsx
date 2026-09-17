"use client";

import React from "react";
import {
  ArrowRight, Sparkles, AlertTriangle, CheckCircle2, XCircle,
  Clock, AlertCircle, ChevronRight,
} from "lucide-react";
import type { TracePayload } from "./EvidenceTrace";

/* ═══════════════════════════════════════════════════════════════
   GOV PAGE HEADER
   Standard top-of-page header for all dashboard pages.
   ═══════════════════════════════════════════════════════════════ */
export function GovPageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  recordId,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  recordId?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 20,
        paddingBottom: 16,
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div>
        {eyebrow && (
          <p
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--saffron)",
              margin: "0 0 4px",
            }}
          >
            {eyebrow}
          </p>
        )}
        <h1 className="gov-page-title">{title}</h1>
        {subtitle && (
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--ink-soft)",
              marginTop: 4,
              marginBottom: 0,
            }}
          >
            {subtitle}
          </p>
        )}
        {recordId && (
          <p
            className="record-id"
            style={{ marginTop: 4, display: "block" }}
          >
            {recordId}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          {actions}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   WORKFLOW BREADCRUMB (pipeline progress bar)
   ═══════════════════════════════════════════════════════════════ */
export function WorkflowBreadcrumb({
  stages,
  currentStage,
}: {
  stages: { label: string; href: string }[];
  currentStage: number;
}) {
  return (
    <div
      style={{
        background: "var(--white)",
        border: "1px solid var(--line)",
        borderRadius: 4,
        padding: "14px 20px",
        marginBottom: 20,
        overflowX: "auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", minWidth: "max-content", gap: 0 }}>
        {stages.map((stage, i) => {
          const isDone = currentStage > i;
          const isActive = currentStage === i;
          return (
            <div
              key={stage.label}
              className={`pipeline-step ${isDone ? "done" : isActive ? "active" : ""}`}
              style={{ minWidth: 80 }}
            >
              <div className="pipeline-dot">
                {isDone ? <CheckCircle2 size={12} /> : i + 1}
              </div>
              <p
                style={{
                  fontSize: "0.6rem",
                  fontWeight: isDone || isActive ? 700 : 500,
                  color: isDone
                    ? "var(--gov-blue)"
                    : isActive
                    ? "var(--gov-blue)"
                    : "var(--ink-muted)",
                  textAlign: "center",
                  margin: 0,
                  lineHeight: 1.3,
                  maxWidth: 72,
                }}
              >
                {stage.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PANEL
   ═══════════════════════════════════════════════════════════════ */
export function Panel({
  title, icon, children, className = "", action, badge, accent,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  accent?: "blue" | "saffron" | "success" | "critical";
}) {
  const accentColors = {
    blue:     "var(--gov-blue)",
    saffron:  "var(--saffron)",
    success:  "var(--success)",
    critical: "var(--critical)",
  };
  const leftBorder = accent
    ? `3px solid ${accentColors[accent]}`
    : undefined;

  return (
    <div
      className={`gov-card ${className}`}
      style={leftBorder ? { borderLeft: leftBorder } : undefined}
    >
      <div className="gov-card-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {icon && (
            <span
              style={{
                display: "flex",
                width: 26,
                height: 26,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 4,
                background: "var(--gov-blue-light)",
                color: "var(--gov-blue)",
                flexShrink: 0,
              }}
            >
              {icon}
            </span>
          )}
          <h2
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--ink-mid)",
              margin: 0,
            }}
          >
            {title}
          </h2>
          {badge && <div>{badge}</div>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="gov-card-body">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ACTION BUTTON
   ═══════════════════════════════════════════════════════════════ */
export function Action({
  label, onClick, icon, disabled, muted, size = "md", variant = "primary",
}: {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  muted?: boolean;
  size?: "sm" | "md";
  variant?: "primary" | "secondary" | "saffron" | "danger" | "ghost";
}) {
  const sizeStyle: React.CSSProperties = size === "sm"
    ? { padding: "6px 12px", fontSize: "0.7rem", gap: 6 }
    : { padding: "8px 16px", fontSize: "0.8rem", gap: 8 };

  const getStyle = (): React.CSSProperties => {
    if (disabled) return { background: "var(--mist)", color: "var(--ink-muted)", border: "1px solid var(--line)" };
    if (muted || variant === "ghost") return { background: "var(--white)", color: "var(--ink-mid)", border: "1px solid var(--line)" };
    if (variant === "secondary") return { background: "var(--white)", color: "var(--gov-blue)", border: "1.5px solid var(--gov-blue-border)" };
    if (variant === "saffron") return { background: "var(--saffron)", color: "white", border: "none" };
    if (variant === "danger") return { background: "var(--critical)", color: "white", border: "none" };
    return { background: "var(--gov-blue)", color: "white", border: "none" };
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background 0.15s, transform 0.1s",
        whiteSpace: "nowrap",
        ...sizeStyle,
        ...getStyle(),
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {icon}
      {label}
      {!muted && !disabled && variant !== "ghost" && variant !== "secondary" && (
        <ArrowRight size={11} />
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INFO CARD
   ═══════════════════════════════════════════════════════════════ */
export function Info({ label, value, trace }: { label: string; value: string; trace?: () => void }) {
  return (
    <div
      style={{
        borderRadius: 4,
        padding: "8px 12px",
        border: "1px solid var(--line)",
        background: "var(--surface)",
      }}
    >
      <p
        style={{
          fontSize: "0.6rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--ink-soft)",
          margin: "0 0 2px",
        }}
      >
        {label}
      </p>
      {trace ? (
        <button className="trace-link" style={{ fontSize: "0.8rem" }} onClick={trace}>
          {value}
        </button>
      ) : (
        <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600, color: "var(--ink)" }}>
          {value}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════════════════════════════ */
export function Empty({ text, action }: { text: string; action?: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        border: "1px dashed var(--line)",
        padding: "32px 24px",
        textAlign: "center",
        background: "var(--surface)",
      }}
    >
      <Sparkles size={20} style={{ color: "var(--ink-muted)", marginBottom: 10 }} />
      <p style={{ fontSize: "0.8rem", color: "var(--ink-soft)", maxWidth: 280, margin: 0, lineHeight: 1.6 }}>
        {text}
      </p>
      {action && (
        <p
          style={{
            marginTop: 8,
            fontSize: "0.65rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--gov-blue)",
          }}
        >
          → {action}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STATUS BADGE
   ═══════════════════════════════════════════════════════════════ */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; border: string }> = {
    Approved:         { bg: "var(--success-light)",   color: "var(--success)",   border: "var(--success-border)" },
    Generated:        { bg: "var(--info-light)",       color: "var(--info)",      border: "var(--info-border)" },
    Draft:            { bg: "var(--mist)",             color: "var(--ink-soft)",  border: "var(--line)" },
    PASS:             { bg: "var(--success-light)",   color: "var(--success)",   border: "var(--success-border)" },
    FAIL:             { bg: "var(--critical-light)",  color: "var(--critical)",  border: "var(--critical-border)" },
    Pending:          { bg: "var(--warning-light)",   color: "var(--warning)",   border: "var(--warning-border)" },
    Blocked:          { bg: "var(--critical-light)",  color: "var(--critical)",  border: "var(--critical-border)" },
    Completed:        { bg: "var(--success-light)",   color: "var(--success)",   border: "var(--success-border)" },
    Active:           { bg: "var(--gov-blue-light)",  color: "var(--gov-blue)",  border: "var(--gov-blue-border)" },
    "In Progress":    { bg: "var(--gov-blue-light)",  color: "var(--gov-blue)",  border: "var(--gov-blue-border)" },
    "Not Started":    { bg: "var(--mist)",             color: "var(--ink-soft)",  border: "var(--line)" },
    "Under Review":   { bg: "var(--warning-light)",   color: "var(--warning)",   border: "var(--warning-border)" },
    READY:            { bg: "var(--success-light)",   color: "var(--success)",   border: "var(--success-border)" },
    HIGH:             { bg: "var(--critical-light)",  color: "var(--critical)",  border: "var(--critical-border)" },
    MEDIUM:           { bg: "var(--warning-light)",   color: "var(--warning)",   border: "var(--warning-border)" },
    LOW:              { bg: "var(--info-light)",       color: "var(--info)",      border: "var(--info-border)" },
    SIMULATED:        { bg: "var(--saffron-light)",   color: "var(--saffron)",   border: "var(--saffron-border)" },
  };
  const s = map[status] ?? { bg: "var(--mist)", color: "var(--ink-soft)", border: "var(--line)" };
  return (
    <span
      className="status-pill"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {status}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VERIFICATION BADGE (Evidence Locker)
   ═══════════════════════════════════════════════════════════════ */
type VerificationLevel = "VERIFIED" | "PARTIALLY VERIFIED" | "SELF-DECLARED" | "REJECTED" | "PENDING";
export function VerificationBadge({ level }: { level: VerificationLevel }) {
  const map: Record<VerificationLevel, { icon: React.ReactNode; style: React.CSSProperties }> = {
    "VERIFIED":           { icon: <CheckCircle2 size={9} />, style: { background: "var(--success-light)", color: "var(--success)", border: "1px solid var(--success-border)" } },
    "PARTIALLY VERIFIED": { icon: <AlertCircle size={9} />, style: { background: "var(--warning-light)", color: "var(--warning)", border: "1px solid var(--warning-border)" } },
    "SELF-DECLARED":      { icon: <Clock size={9} />,       style: { background: "var(--mist)",          color: "var(--ink-soft)", border: "1px solid var(--line)" } },
    "REJECTED":           { icon: <XCircle size={9} />,     style: { background: "var(--critical-light)", color: "var(--critical)", border: "1px solid var(--critical-border)" } },
    "PENDING":            { icon: <Clock size={9} />,       style: { background: "var(--info-light)",    color: "var(--info)",     border: "1px solid var(--info-border)" } },
  };
  const { icon, style } = map[level];
  return <span className="status-pill" style={style}>{icon} {level}</span>;
}

/* ═══════════════════════════════════════════════════════════════
   ALERT BANNER
   ═══════════════════════════════════════════════════════════════ */
export function AlertBanner({
  type, message, dismissible,
}: {
  type: "warning" | "error" | "info" | "success";
  message: string;
  dismissible?: boolean;
}) {
  const [dismissed, setDismissed] = React.useState(false);
  if (dismissed) return null;

  const styles: Record<string, React.CSSProperties> = {
    warning: { background: "var(--warning-light)", borderColor: "var(--warning-border)", color: "var(--warning)", borderLeft: "3px solid var(--warning)" },
    error:   { background: "var(--critical-light)", borderColor: "var(--critical-border)", color: "var(--critical)", borderLeft: "3px solid var(--critical)" },
    info:    { background: "var(--gov-blue-light)", borderColor: "var(--gov-blue-border)", color: "var(--gov-blue)", borderLeft: "3px solid var(--gov-blue)" },
    success: { background: "var(--success-light)", borderColor: "var(--success-border)", color: "var(--success)", borderLeft: "3px solid var(--success)" },
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        borderRadius: 4,
        border: "1px solid",
        padding: "10px 14px",
        fontSize: "0.8rem",
        ...styles[type],
      }}
    >
      <AlertTriangle size={14} style={{ marginTop: 1, flexShrink: 0 }} />
      <span style={{ fontWeight: 500, flex: 1 }}>{message}</span>
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0, opacity: 0.6 }}
        >
          ×
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   OFFICIAL RECORD HEADER
   ═══════════════════════════════════════════════════════════════ */
export function OfficialRecordHeader({
  recordId, department, state = "Maharashtra", createdDate, owner, status, auditCount, children,
}: {
  recordId: string; department: string; state?: string; createdDate: string;
  owner?: string; status: string; auditCount?: number; children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        borderRadius: 4,
        border: "1px solid var(--gov-blue-border)",
        marginBottom: 16,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          padding: "8px 16px",
          background: "var(--gov-blue)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="record-id" style={{ color: "white" }}>{recordId}</span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem" }}>·</span>
          <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {department}
          </span>
          {state && (
            <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)" }}>{state}</span>
          )}
        </div>
        <StatusBadge status={status} />
      </div>
      <div
        style={{
          padding: "8px 16px",
          background: "var(--gov-blue-light)",
          display: "flex",
          flexWrap: "wrap",
          gap: "4px 20px",
        }}
      >
        <RecordMeta label="Created" value={createdDate} />
        {owner && <RecordMeta label="Officer" value={owner} />}
        {auditCount !== undefined && <RecordMeta label="Audit Events" value={`${auditCount} recorded`} />}
        {children}
      </div>
    </div>
  );
}

export function RecordMeta({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-soft)" }}>
        {label}:
      </span>
      <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--ink)" }}>{value}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   KPI ROW (Pilot monitoring)
   ═══════════════════════════════════════════════════════════════ */
export function KpiRow({ name, target, actual, met }: { name: string; target: string; actual: string; met: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--ink-mid)" }}>{name}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: "0.7rem" }}>
        <span style={{ color: "var(--ink-soft)" }}>
          Target: <strong style={{ color: "var(--ink)" }}>{target}</strong>
        </span>
        <span style={{ color: "var(--ink)" }}>
          Actual: <strong>{actual}</strong>
        </span>
        <span
          className="status-pill"
          style={
            met
              ? { background: "var(--success-light)", color: "var(--success)", border: "1px solid var(--success-border)" }
              : { background: "var(--critical-light)", color: "var(--critical)", border: "1px solid var(--critical-border)" }
          }
        >
          {met ? <><CheckCircle2 size={9} /> PASSED</> : <><XCircle size={9} /> FAILED</>}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STAT CARD
   ═══════════════════════════════════════════════════════════════ */
export function StatCard({
  label, value, sub, accent, icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: "blue" | "amber" | "green" | "red";
  icon?: React.ReactNode;
}) {
  const accents = {
    blue:  { bg: "var(--gov-blue-light)",  border: "var(--gov-blue-border)",  color: "var(--gov-blue)" },
    amber: { bg: "var(--saffron-light)",   border: "var(--saffron-border)",   color: "var(--saffron)" },
    green: { bg: "var(--success-light)",   border: "var(--success-border)",   color: "var(--success)" },
    red:   { bg: "var(--critical-light)",  border: "var(--critical-border)",  color: "var(--critical)" },
  };
  const a = accent ? accents[accent] : { bg: "var(--white)", border: "var(--line)", color: "var(--ink)" };
  return (
    <div
      style={{
        borderRadius: 4,
        border: `1px solid ${a.border}`,
        background: a.bg,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
        <p style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: a.color, margin: 0 }}>
          {label}
        </p>
        {icon && (
          <span style={{ color: a.color, opacity: 0.6 }}>{icon}</span>
        )}
      </div>
      <p style={{ fontSize: "1.6rem", fontWeight: 900, color: a.color, margin: 0, lineHeight: 1 }}>
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: "0.6rem", color: "var(--ink-soft)", margin: 0 }}>{sub}</p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BLOCKER ALERT
   ═══════════════════════════════════════════════════════════════ */
export function BlockerAlert({ title, impact, authority, onNotify }: {
  title: string; impact: string[]; authority: string; onNotify?: () => void;
}) {
  return (
    <div
      style={{
        borderRadius: 4,
        border: "1px solid var(--critical-border)",
        background: "var(--critical-light)",
        borderLeft: "4px solid var(--critical)",
        padding: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
        <AlertTriangle size={15} style={{ color: "var(--critical)", marginTop: 1, flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--critical)", margin: "0 0 2px" }}>
            ⚠ Blocker Detected
          </p>
          <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ink)", margin: 0 }}>{title}</p>
        </div>
      </div>

      {impact.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <p style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-soft)", margin: "0 0 4px" }}>
            Cascade Impact:
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 2 }}>
            {impact.map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--critical)" }}>
                <ChevronRight size={10} style={{ flexShrink: 0 }} /> {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div>
          <p style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-soft)", margin: "0 0 2px" }}>
            Responsible Authority:
          </p>
          <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--ink)", margin: 0 }}>{authority}</p>
        </div>
        {onNotify && (
          <button
            onClick={onNotify}
            style={{
              borderRadius: 4,
              padding: "6px 14px",
              fontSize: "0.75rem",
              fontWeight: 600,
              background: "var(--critical)",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Notify Owner
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   KPI CARD (4-Column Government Portal Reference Format)
   ═══════════════════════════════════════════════════════════════ */
export function KpiCard({
  label,
  value,
  icon,
  trend,
  trendPositive,
  sublabel,
  onClick,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
  sublabel?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`gov-kpi-card transition-shadow ${onClick ? "cursor-pointer hover:shadow-md" : ""}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#5E6B7E]">
          {label}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded bg-[#EEF5FC] flex items-center justify-center text-[#0B2A5B] shrink-0 border border-[#D9E1EA]">
            {icon}
          </div>
        )}
      </div>

      <div className="my-1">
        <p className="text-2xl sm:text-3xl font-black text-[#0B2A5B] tracking-tight leading-none">
          {value}
        </p>
      </div>

      {(trend || sublabel) && (
        <div className="mt-2 pt-2 border-t border-[#D9E1EA] flex items-center justify-between text-[10px]">
          {trend && (
            <span className={`font-bold ${trendPositive ? "text-[#16834B]" : "text-[#B45309]"}`}>
              {trend}
            </span>
          )}
          {sublabel && (
            <span className="text-[#8A96A8] font-medium">{sublabel}</span>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROCUREMENT CASE CARD (2-Column Responsive Reference Card)
   ═══════════════════════════════════════════════════════════════ */
export function ProcurementCaseCard({
  status = "In Progress",
  statusTone = "blue",
  valueMetric,
  title,
  description,
  department,
  referenceId,
  location,
  deadline,
  stage,
  category,
  estimatedBudget,
  primaryActionLabel = "View Details",
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
}: {
  status?: string;
  statusTone?: "green" | "amber" | "red" | "blue";
  valueMetric?: string;
  title: string;
  description: string;
  department: string;
  referenceId: string;
  location: string;
  deadline?: string;
  stage: string;
  category: string;
  estimatedBudget?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}) {
  const statusStyles = {
    green: "bg-[#DCFCE7] text-[#16834B] border-[#86EFAC]",
    amber: "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]",
    red: "bg-[#FEE2E2] text-[#D92D20] border-[#FCA5A5]",
    blue: "bg-[#EEF5FC] text-[#0B2A5B] border-[#D9E1EA]",
  };

  return (
    <div className="bg-white border border-[#D9E1EA] rounded-md p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-w-0">
      <div>
        {/* Top Header: Status & Value Metric */}
        <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#D9E1EA]">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${statusStyles[statusTone]}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {status}
          </span>
          {valueMetric && (
            <span className="text-xs font-black text-[#0B2A5B] bg-[#EEF5FC] px-2 py-0.5 rounded border border-[#D9E1EA]">
              {valueMetric}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold text-[#0B2A5B] hover:text-[#1236B8] cursor-pointer transition-colors leading-snug line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs text-[#5E6B7E] mt-1.5 leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Metadata Rows */}
        <div className="mt-3.5 space-y-1.5 text-[11px] text-[#172033]">
          <div className="flex items-center gap-2">
            <span className="text-[#8A96A8] shrink-0 font-medium">Department:</span>
            <span className="font-semibold text-[#172033] truncate">{department}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#8A96A8] shrink-0 font-medium">Reference ID:</span>
            <span className="record-id">{referenceId}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#8A96A8] shrink-0 font-medium">Location / Scope:</span>
            <span className="font-semibold text-[#172033]">{location}</span>
          </div>
          {deadline && (
            <div className="flex items-center gap-2 text-[#E07B1F] font-bold">
              <Clock size={12} className="shrink-0" />
              <span>{deadline}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-[#8A96A8] shrink-0 font-medium">Current Stage:</span>
            <span className="font-bold text-[#0B2A5B]">{stage}</span>
          </div>
        </div>

        {/* Financial Info Box */}
        {estimatedBudget && (
          <div className="financial-box mt-3 flex items-center justify-between text-xs">
            <span className="text-[#5E6B7E] font-medium">Estimated Budget:</span>
            <span className="font-black text-[#172033]">{estimatedBudget}</span>
          </div>
        )}

        {/* Category Tag */}
        <div className="mt-3">
          <span className="category-tag">{category}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-[#D9E1EA] flex flex-wrap items-center gap-2">
        {onPrimaryAction && (
          <button
            onClick={onPrimaryAction}
            className="flex-1 min-w-[120px] bg-[#0B2A5B] hover:bg-[#1236B8] text-white text-xs font-bold py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <span>{primaryActionLabel}</span>
            <ArrowRight size={13} />
          </button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="bg-white hover:bg-[#EEF5FC] text-[#0B2A5B] border border-[#D9E1EA] text-xs font-bold py-2 px-3 rounded flex items-center justify-center gap-1 transition-colors"
          >
            <span>{secondaryActionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FILTER TOOLBAR & VIEW CONTROLS
   ═══════════════════════════════════════════════════════════════ */
export function FilterToolbar({
  stages = ["All Stages", "Intake", "Structuring", "Matching", "Pilot", "Readiness", "Handoff"],
  selectedStage,
  onSelectStage,
  departments = ["All Departments", "PWD Maharashtra", "Urban Development", "Transport Authority"],
  selectedDepartment,
  onSelectDepartment,
  viewMode = "grid",
  onViewModeChange,
}: {
  stages?: string[];
  selectedStage?: string;
  onSelectStage?: (stage: string) => void;
  departments?: string[];
  selectedDepartment?: string;
  onSelectDepartment?: (dept: string) => void;
  viewMode?: "grid" | "list" | "table";
  onViewModeChange?: (mode: "grid" | "list" | "table") => void;
}) {
  return (
    <div className="bg-white border border-[#D9E1EA] rounded p-3 mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-bold text-[#0B2A5B] uppercase tracking-wider text-[11px]">
          Filter By:
        </span>

        {/* Stage Filter */}
        <select
          value={selectedStage}
          onChange={(e) => onSelectStage?.(e.target.value)}
          className="bg-[#F5F7FA] border border-[#D9E1EA] text-[#172033] font-medium rounded px-2.5 py-1.5 outline-none focus:border-[#0B2A5B]"
        >
          {stages.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Department Filter */}
        <select
          value={selectedDepartment}
          onChange={(e) => onSelectDepartment?.(e.target.value)}
          className="bg-[#F5F7FA] border border-[#D9E1EA] text-[#172033] font-medium rounded px-2.5 py-1.5 outline-none focus:border-[#0B2A5B]"
        >
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* View Switcher Controls */}
      {onViewModeChange && (
        <div className="flex items-center gap-1 bg-[#F5F7FA] p-0.5 rounded border border-[#D9E1EA]">
          <span className="text-[10px] font-bold text-[#5E6B7E] uppercase px-2">View:</span>
          {(["grid", "list", "table"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold capitalize transition-all ${
                viewMode === mode
                  ? "bg-[#0B2A5B] text-white shadow-sm"
                  : "text-[#5E6B7E] hover:text-[#172033]"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGINATION COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export function Pagination({
  totalItems,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
}: {
  totalItems: number;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="bg-white border border-[#D9E1EA] rounded px-4 py-2.5 mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#5E6B7E]">
      <div>
        Showing <strong className="text-[#172033]">{start}-{end}</strong> of <strong className="text-[#172033]">{totalItems}</strong> results
      </div>

      <div className="flex items-center gap-1.5">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          className="px-2.5 py-1 border border-[#D9E1EA] rounded font-semibold text-[#172033] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
        >
          &lt; Previous
        </button>
        <span className="px-3 py-1 bg-[#0B2A5B] text-white font-bold rounded">
          {currentPage}
        </span>
        <button
          disabled={end >= totalItems}
          onClick={() => onPageChange?.(currentPage + 1)}
          className="px-2.5 py-1 border border-[#D9E1EA] rounded font-semibold text-[#172033] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   KPI TRACE HELPER
   ═══════════════════════════════════════════════════════════════ */
export function kpiTrace(title: string, source: string, value: string): TracePayload {
  return {
    title,
    why: `${value} is derived from the simulated hero scenario evidence trail for Problem #1042.`,
    how: "PRAMAN's deterministic demo engine simulates the same trace contract used across the platform.",
    source,
    who: "PRAMAN local demo engine",
    when: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    dataClass: "SIMULATED",
  };
}

