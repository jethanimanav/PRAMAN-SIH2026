"use client";

import { usePraman } from "@/lib/PramanContext";
import { AlertBanner, Panel, Empty } from "@/components/ui";
import { Search, Database, FileWarning, CheckCircle2, AlertTriangle, XCircle, ArrowRight, GitBranch, ShieldAlert } from "lucide-react";
import type { InstitutionalMemoryRecord } from "@/types/praman";
import Link from "next/link";

export default function MemoryPage() {
  const { memory, memorySearchQuery, searchMemory, error, loading } = usePraman();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    searchMemory(fd.get("q") as string);
  };

  const hasFailedMatch = memory.some(m => m.outcome === "Failed");

  const OUTCOME_STYLE: Record<string, React.CSSProperties> = {
    Successful:         { background: "var(--success-light)", color: "var(--success)", borderColor: "#bbf7d0" },
    "Partially Successful": { background: "var(--warning-light)", color: "var(--warning)", borderColor: "#fde68a" },
    Failed:             { background: "var(--critical-light)", color: "var(--critical)", borderColor: "#fecaca" },
  };
  const OUTCOME_ICON: Record<string, React.ReactNode> = {
    Successful:         <CheckCircle2 size={11} />,
    "Partially Successful": <AlertTriangle size={11} />,
    Failed:             <XCircle size={11} />,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--saffron)" }}>
          Institutional Memory
        </p>
        <h1 className="mt-0.5 text-xl font-black" style={{ color: "var(--ink)" }}>
          Government Innovation Memory
        </h1>
        <p className="mt-0.5 text-[11px]" style={{ color: "var(--ink-soft)" }}>
          Search historical government procurement outcomes · lessons learned · reuse intelligence
        </p>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-3 rounded border bg-white px-4 py-3"
        style={{ borderColor: "var(--line)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        <Search size={16} style={{ color: "var(--gov-blue)" }} className="shrink-0" />
        <input
          name="q"
          type="text"
          defaultValue={memorySearchQuery}
          placeholder='Search by problem, technology, city, domain… (Try: "road monitoring" or "computer vision")'
          className="flex-1 bg-transparent outline-none text-[12px]"
          style={{ color: "var(--ink)" }}
        />
        <button
          type="submit"
          disabled={loading === "Searching institutional memory"}
          className="rounded px-4 py-1.5 text-[11px] font-bold text-white transition disabled:opacity-50"
          style={{ background: "var(--gov-blue)" }}
        >
          {loading === "Searching institutional memory" ? "Searching…" : "Search Archive"}
        </button>
      </form>

      {/* Filters hint */}
      <div className="flex flex-wrap gap-2">
        {["All", "Urban Infrastructure", "Computer Vision", "IoT Sensors", "Maharashtra", "Successful", "Failed"].map(f => (
          <button
            key={f}
            className="rounded border px-2.5 py-1 text-[10px] font-semibold transition"
            style={f === "All" ? { background: "var(--gov-blue)", color: "white", borderColor: "var(--gov-blue)" } : { background: "var(--mist)", color: "var(--ink-soft)", borderColor: "var(--line)" }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Failed match warning */}
      {hasFailedMatch && (
        <div
          className="flex items-start gap-3 rounded border px-4 py-3"
          style={{ background: "var(--critical-light)", borderColor: "#fecaca", borderLeft: "3px solid var(--critical)" }}
        >
          <FileWarning size={15} className="mt-0.5 shrink-0" style={{ color: "var(--critical)" }} />
          <div>
            <p className="text-[12px] font-bold" style={{ color: "var(--critical)" }}>
              Failed Pilot Pattern Detected in Historical Archive
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--ink-mid)" }}>
              Your query matches a previously failed implementation pattern in this domain.
              Review the failure causes below before initiating a new procurement.
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {memory.length === 0 ? (
        <Panel title="Government Innovation Archive" icon={<Database size={13} />}>
          <Empty text="No historical records found. Search by technology domain, city, or problem type." />
        </Panel>
      ) : (
        <div className="space-y-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--ink-soft)" }}>
            Historical Project Records — {memory.length} found
          </p>
          {memory.map((record: InstitutionalMemoryRecord) => {
            const os = OUTCOME_STYLE[record.outcome] ?? OUTCOME_STYLE["Successful"];
            return (
              <div key={record.id} className="rounded border bg-white overflow-hidden" style={{ borderColor: "var(--line)" }}>
                {/* Record Header */}
                <div
                  className="flex flex-wrap items-start justify-between gap-3 px-4 py-3 border-b"
                  style={{ borderColor: "var(--line)", background: "var(--mist)" }}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="status-pill"
                        style={{ ...os, border: `1px solid ${os.borderColor}` }}
                      >
                        {OUTCOME_ICON[record.outcome]} {record.outcome.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-semibold" style={{ color: "var(--ink-soft)" }}>
                        {record.city} · {record.year} · {record.department}
                      </span>
                    </div>
                    <h2 className="text-[14px] font-bold" style={{ color: "var(--ink)" }}>{record.problem}</h2>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--ink-soft)" }}>
                      Domain: {record.domain} · Technology: {record.technology}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>Startup</p>
                    <p className="text-[13px] font-black" style={{ color: "var(--ink)" }}>{record.startup}</p>
                    <div className="mt-1 flex gap-3 justify-end text-[10px]">
                      <div className="text-right">
                        <p className="font-bold uppercase" style={{ color: "var(--ink-soft)" }}>Accuracy</p>
                        <p className="font-black" style={{ color: record.actual_accuracy_pct >= 90 ? "var(--success)" : "var(--warning)" }}>
                          {record.actual_accuracy_pct}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold uppercase" style={{ color: "var(--ink-soft)" }}>Duration</p>
                        <p className="font-black" style={{ color: "var(--ink)" }}>{record.implementation_days}d</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold uppercase" style={{ color: "var(--ink-soft)" }}>Pilot Score</p>
                        <p className="font-black" style={{ color: "var(--gov-blue)" }}>{record.pilot_score}/100</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Record Body */}
                <div className="p-4 grid gap-4 lg:grid-cols-2">
                  <div className="space-y-3">
                    {/* Failure Causes */}
                    {record.outcome === "Failed" && record.failure_causes.length > 0 && (
                      <div
                        className="rounded border px-3 py-2.5"
                        style={{ background: "var(--critical-light)", borderColor: "#fecaca" }}
                      >
                        <p className="text-[9px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--critical)" }}>
                          Core Failure Causes
                        </p>
                        <ul className="space-y-1">
                          {record.failure_causes.map((c, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[11px]" style={{ color: "var(--critical)" }}>
                              <AlertTriangle size={10} className="mt-0.5 shrink-0" /> {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Lessons */}
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--ink-soft)" }}>
                        Implementation Lessons
                      </p>
                      <ul className="space-y-1.5">
                        {record.lessons.map((lesson, i) => (
                          <li key={i} className="flex items-start gap-2 text-[11px] rounded border px-3 py-2"
                            style={{ background: "var(--mist)", borderColor: "var(--line)", color: "var(--ink-mid)" }}>
                            <span className="mt-0.5 font-bold shrink-0" style={{ color: "var(--gov-blue)" }}>→</span>
                            <span className="italic">&ldquo;{lesson}&rdquo;</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Known Dependencies */}
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: "var(--ink-soft)" }}>
                        <GitBranch size={10} /> Known Dependencies
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {record.known_dependencies.map((dep, i) => (
                          <span
                            key={i}
                            className="rounded border px-2.5 py-1 text-[10px] font-medium"
                            style={{ background: "var(--gov-blue-light)", borderColor: "var(--gov-blue-border)", color: "var(--gov-blue)" }}
                          >
                            {dep}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Risks */}
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: "var(--ink-soft)" }}>
                        <ShieldAlert size={10} /> Identified Risks
                      </p>
                      <ul className="space-y-1">
                        {record.known_risks.map((r, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[10px]" style={{ color: "var(--ink-mid)" }}>
                            <AlertTriangle size={9} className="mt-0.5 shrink-0" style={{ color: "var(--warning)" }} />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button
                        className="inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-[10px] font-semibold transition"
                        style={{ background: "var(--gov-blue-light)", borderColor: "var(--gov-blue-border)", color: "var(--gov-blue)" }}
                      >
                        View Full Record
                      </button>
                      <Link
                        href="/reuse"
                        className="inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-[10px] font-semibold transition"
                        style={{ background: "var(--white)", borderColor: "var(--line)", color: "var(--ink-mid)" }}
                      >
                        Reuse Intelligence <ArrowRight size={9} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
