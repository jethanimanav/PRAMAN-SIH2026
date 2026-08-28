"use client";

import React from "react";
import { ArrowRight, Activity, Sparkles, AlertTriangle } from "lucide-react";
import type { TracePayload } from "./EvidenceTrace";

/* ── Panel ── */
export function Panel({
  title, icon, children, className = "",
}: {
  title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-3.5">
        {icon && (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#168675]">
            {icon}
          </span>
        )}
        <h2 className="text-sm font-bold text-slate-800">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ── Action Button ── */
export function Action({
  label, onClick, icon, disabled, muted, size = "md",
}: {
  label: string; onClick: () => void; icon?: React.ReactNode; disabled?: boolean; muted?: boolean; size?: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "px-3 py-1.5 text-xs gap-1.5" : "px-4 py-2.5 text-sm gap-2";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${sizeClass} ${
        muted
          ? "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          : "bg-[#168675] text-white hover:bg-[#116f62] active:scale-[0.98] shadow-sm"
      }`}
    >
      {icon}
      {label}
      {!muted && !disabled && <ArrowRight size={13} className="ml-auto" />}
    </button>
  );
}

/* ── Info Card ── */
export function Info({ label, value, trace }: { label: string; value: string; trace?: () => void }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      {trace ? (
        <button className="mt-0.5 text-left text-sm font-semibold text-slate-800 hover:text-[#168675] transition-colors" onClick={trace}>
          {value}
        </button>
      ) : (
        <p className="mt-0.5 text-sm font-semibold text-slate-800">{value}</p>
      )}
    </div>
  );
}

/* ── Empty State ── */
export function Empty({ text, action }: { text: string; action?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-10 px-6 text-center">
      <Sparkles size={24} className="text-slate-300 mb-3" />
      <p className="text-sm text-slate-500 max-w-xs">{text}</p>
      {action && (
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#168675]">
          → {action}
        </p>
      )}
    </div>
  );
}

/* ── Status Badge ── */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Generated: "bg-blue-100 text-blue-800 border-blue-200",
    Draft: "bg-slate-100 text-slate-600 border-slate-200",
    PASS: "bg-emerald-100 text-emerald-800 border-emerald-200",
    FAIL: "bg-red-100 text-red-800 border-red-200",
    Pending: "bg-amber-100 text-amber-800 border-amber-200",
  };
  const cls = map[status] || "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}

/* ── Alert Banner ── */
export function AlertBanner({ type, message }: { type: "warning" | "error" | "info" | "success"; message: string }) {
  const styles = {
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
  };
  return (
    <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${styles[type]}`}>
      <AlertTriangle size={16} className="mt-0.5 shrink-0" />
      <span>{message}</span>
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
