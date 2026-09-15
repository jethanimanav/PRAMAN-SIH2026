"use client";

import React from "react";
import { ArrowRight, Sparkles, AlertTriangle, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import type { TracePayload } from "./EvidenceTrace";

/* ── Panel ── */
export function Panel({
  title, icon, children, className = "", action, badge,
}: {
  title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string; badge?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className={`rounded border bg-white ${className}`} style={{ borderColor: "var(--line)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: "var(--line)" }}>
        <div className="flex items-center gap-2">
          {icon && (
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded"
              style={{ background: "var(--gov-blue-light)", color: "var(--gov-blue)" }}
            >
              {icon}
            </span>
          )}
          <h2 className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-mid)" }}>{title}</h2>
        </div>
        {action && <div>{action}</div>}{badge && <div>{badge}</div>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* ── Action Button ── */
export function Action({
  label, onClick, icon, disabled, muted, size = "md",
}: {
  label: string; onClick: () => void; icon?: React.ReactNode;
  disabled?: boolean; muted?: boolean; size?: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "px-3 py-1.5 text-[11px] gap-1.5" : "px-4 py-2 text-[12px] gap-2";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${sizeClass}`}
      style={
        muted
          ? { border: "1px solid var(--line)", background: "var(--white)", color: "var(--ink-mid)" }
          : disabled
            ? { background: "var(--gov-blue)", color: "white", opacity: 0.4 }
            : { background: "var(--gov-blue)", color: "white" }
      }
    >
      {icon}
      {label}
      {!muted && !disabled && <ArrowRight size={11} className="ml-auto" />}
    </button>
  );
}

/* ── Info Card ── */
export function Info({ label, value, trace }: { label: string; value: string; trace?: () => void }) {
  return (
    <div className="rounded px-3 py-2" style={{ border: "1px solid var(--line)", background: "var(--surface)" }}>
      <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>{label}</p>
      {trace ? (
        <button className="mt-0.5 text-left text-[12px] font-semibold hover:underline transition-colors" style={{ color: "var(--gov-blue)" }} onClick={trace}>
          {value}
        </button>
      ) : (
        <p className="mt-0.5 text-[12px] font-semibold" style={{ color: "var(--ink)" }}>{value}</p>
      )}
    </div>
  );
}

/* ── Empty State ── */
export function Empty({ text, action }: { text: string; action?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded border border-dashed py-8 px-6 text-center" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
      <Sparkles size={20} className="mb-3" style={{ color: "var(--ink-soft)" }} />
      <p className="text-[12px] max-w-xs" style={{ color: "var(--ink-soft)" }}>{text}</p>
      {action && <p className="mt-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--gov-blue)" }}>→ {action}</p>}
    </div>
  );
}

/* ── Status Badge ── */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; border: string }> = {
    Approved:   { bg: "var(--success-light)", color: "var(--success)", border: "#bbf7d0" },
    Generated:  { bg: "var(--info-light)", color: "var(--info)", border: "#bfdbfe" },
    Draft:      { bg: "var(--mist)", color: "var(--ink-soft)", border: "var(--line)" },
    PASS:       { bg: "var(--success-light)", color: "var(--success)", border: "#bbf7d0" },
    FAIL:       { bg: "var(--critical-light)", color: "var(--critical)", border: "#fecaca" },
    Pending:    { bg: "var(--warning-light)", color: "var(--warning)", border: "#fde68a" },
    Blocked:    { bg: "var(--critical-light)", color: "var(--critical)", border: "#fecaca" },
    Completed:  { bg: "var(--success-light)", color: "var(--success)", border: "#bbf7d0" },
    Active:     { bg: "var(--gov-blue-light)", color: "var(--gov-blue)", border: "var(--gov-blue-border)" },
  };
  const s = map[status] ?? { bg: "var(--mist)", color: "var(--ink-soft)", border: "var(--line)" };
  return (
    <span className="status-pill" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {status}
    </span>
  );
}

/* ── Verification Badge (Evidence Locker) ── */
type VerificationLevel = "VERIFIED" | "PARTIALLY VERIFIED" | "SELF-DECLARED" | "REJECTED" | "PENDING";
export function VerificationBadge({ level }: { level: VerificationLevel }) {
  const map: Record<VerificationLevel, { icon: React.ReactNode; style: React.CSSProperties }> = {
    "VERIFIED":           { icon: <CheckCircle2 size={10} />, style: { background: "var(--success-light)", color: "var(--success)", border: "1px solid #bbf7d0" } },
    "PARTIALLY VERIFIED": { icon: <AlertCircle size={10} />, style: { background: "var(--warning-light)", color: "var(--warning)", border: "1px solid #fde68a" } },
    "SELF-DECLARED":      { icon: <Clock size={10} />, style: { background: "var(--mist)", color: "var(--ink-soft)", border: "1px solid var(--line)" } },
    "REJECTED":           { icon: <XCircle size={10} />, style: { background: "var(--critical-light)", color: "var(--critical)", border: "1px solid #fecaca" } },
    "PENDING":            { icon: <Clock size={10} />, style: { background: "var(--info-light)", color: "var(--info)", border: "1px solid #bfdbfe" } },
  };
  const { icon, style } = map[level];
  return (
    <span className="status-pill" style={style}>
      {icon} {level}
    </span>
  );
}

/* ── Alert Banner ── */
export function AlertBanner({ type, message }: { type: "warning" | "error" | "info" | "success"; message: string }) {
  const styles: Record<string, React.CSSProperties> = {
    warning: { background: "var(--warning-light)", borderColor: "#fde68a", color: "var(--warning)" },
    error:   { background: "var(--critical-light)", borderColor: "#fecaca", color: "var(--critical)" },
    info:    { background: "var(--gov-blue-light)", borderColor: "var(--gov-blue-border)", color: "var(--gov-blue)" },
    success: { background: "var(--success-light)", borderColor: "#bbf7d0", color: "var(--success)" },
  };
  return (
    <div className="flex items-start gap-3 rounded border px-4 py-3 text-[12px]" style={styles[type]}>
      <AlertTriangle size={14} className="mt-0.5 shrink-0" />
      <span className="font-medium">{message}</span>
    </div>
  );
}

/* ── Official Record Header ── */
export function OfficialRecordHeader({
  recordId, department, state = "Maharashtra", createdDate, owner, status, auditCount, children,
}: {
  recordId: string; department: string; state?: string; createdDate: string;
  owner?: string; status: string; auditCount?: number; children?: React.ReactNode;
}) {
  return (
    <div
      className="rounded border mb-4"
      style={{ borderColor: "var(--gov-blue-border)", background: "var(--gov-blue-light)" }}
    >
      <div
        className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b"
        style={{ borderColor: "var(--gov-blue-border)", background: "var(--gov-blue)", borderRadius: "calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0" }}
      >
        <div className="flex items-center gap-3">
          <span className="record-id text-white">{recordId}</span>
          <span className="text-white/40 text-[10px]">·</span>
          <span className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">{department}</span>
          {state && <span className="text-[10px] text-white/40">{state}</span>}
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="px-4 py-2.5 flex flex-wrap gap-x-6 gap-y-1">
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
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>{label}:</span>
      <span className="text-[11px] font-semibold" style={{ color: "var(--ink)" }}>{value}</span>
    </div>
  );
}

/* ── KPI Row (Pilot monitoring) ── */
export function KpiRow({ name, target, actual, met }: { name: string; target: string; actual: string; met: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: "var(--line)" }}>
      <span className="text-[12px] font-medium" style={{ color: "var(--ink-mid)" }}>{name}</span>
      <div className="flex items-center gap-4 text-[11px]">
        <span style={{ color: "var(--ink-soft)" }}>Target: <strong>{target}</strong></span>
        <span style={{ color: "var(--ink)" }}>Actual: <strong>{actual}</strong></span>
        <span className="status-pill" style={
          met
            ? { background: "var(--success-light)", color: "var(--success)", border: "1px solid #bbf7d0" }
            : { background: "var(--critical-light)", color: "var(--critical)", border: "1px solid #fecaca" }
        }>
          {met ? <><CheckCircle2 size={9} /> PASSED</> : <><XCircle size={9} /> FAILED</>}
        </span>
      </div>
    </div>
  );
}

/* ── Metric Stat Card ── */
export function StatCard({ label, value, sub, accent }: {
  label: string; value: string | number; sub?: string; accent?: "blue" | "amber" | "green" | "red";
}) {
  const accents = {
    blue:  { bg: "var(--gov-blue-light)", border: "var(--gov-blue-border)", color: "var(--gov-blue)" },
    amber: { bg: "var(--saffron-light)",  border: "var(--saffron-border)",  color: "var(--saffron)" },
    green: { bg: "var(--success-light)",  border: "#bbf7d0",                color: "var(--success)" },
    red:   { bg: "var(--critical-light)", border: "#fecaca",                color: "var(--critical)" },
  };
  const a = accent ? accents[accent] : { bg: "var(--white)", border: "var(--line)", color: "var(--ink)" };
  return (
    <div className="rounded border p-4 text-center" style={{ background: a.bg, borderColor: a.border }}>
      <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: a.color }}>{label}</p>
      <p className="text-2xl font-black" style={{ color: a.color }}>{value}</p>
      {sub && <p className="text-[9px] mt-0.5" style={{ color: "var(--ink-soft)" }}>{sub}</p>}
    </div>
  );
}

/* ── Blocker Alert ── */
export function BlockerAlert({ title, impact, authority, onNotify }: {
  title: string; impact: string[]; authority: string; onNotify?: () => void;
}) {
  return (
    <div className="rounded border p-4" style={{ background: "#fff5f5", borderColor: "#fecaca", borderLeft: "4px solid var(--critical)" }}>
      <div className="flex items-start gap-2 mb-2">
        <AlertTriangle size={15} style={{ color: "var(--critical)" }} className="mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--critical)" }}>⚠ BLOCKER DETECTED</p>
          <p className="text-[13px] font-bold mt-0.5" style={{ color: "var(--ink)" }}>{title}</p>
        </div>
      </div>
      {impact.length > 0 && (
        <div className="mt-2 mb-2">
          <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--ink-soft)" }}>Cascade Impact:</p>
          <ul className="space-y-0.5">
            {impact.map((i, idx) => (
              <li key={idx} className="text-[11px] flex items-center gap-1.5" style={{ color: "var(--critical)" }}>
                <span className="font-bold">→</span> {i}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex items-center justify-between mt-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>Responsible Authority:</p>
          <p className="text-[12px] font-semibold" style={{ color: "var(--ink)" }}>{authority}</p>
        </div>
        {onNotify && (
          <button
            onClick={onNotify}
            className="rounded px-3 py-1.5 text-[11px] font-semibold text-white transition"
            style={{ background: "var(--critical)" }}
          >
            Notify Owner
          </button>
        )}
      </div>
    </div>
  );
}

/* ── KPI Trace helper ── */
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
