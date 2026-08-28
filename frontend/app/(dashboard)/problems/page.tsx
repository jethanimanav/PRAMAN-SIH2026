"use client";

import { usePraman } from "@/lib/PramanContext";
import { Panel, Info, Empty, Action } from "@/components/ui";
import { Badge } from "@/components/Badge";
import { FileText, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ProblemsPage() {
  const { problem } = usePraman();
  const [search, setSearch] = useState("");

  const problems = problem ? [problem] : [];
  const filtered = problems.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Problem to Pilot</p>
          <h1 className="mt-1 text-2xl font-black text-slate-900">Problems</h1>
          <p className="mt-1 text-sm text-slate-500">Government challenges submitted for startup solution procurement</p>
        </div>
        <Link
          href="/problems/intake"
          className="inline-flex items-center gap-2 rounded-lg bg-[#168675] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#116f62] shadow-sm transition"
        >
          <Plus size={15} /> New Problem
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-800 outline-none focus:border-[#168675] focus:ring-2 focus:ring-[#168675]/20 transition"
          placeholder="Search by title, department..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(p => (
            <div key={p.id} className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge tone="neutral">#{p.display_id || p.id}</Badge>
                    <Badge tone={p.status === "Draft" ? "amber" : "signal"}>{p.status}</Badge>
                    <Badge tone="blue">{p.domain}</Badge>
                  </div>
                  <h2 className="text-base font-bold text-slate-900">{p.title}</h2>
                  <p className="text-sm text-slate-500 mt-1">{p.department} · {p.location}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-2">{p.narrative}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Info label="Budget" value={p.budget} />
                <Info label="Timeline" value={`${p.timeline_days} days`} />
                <Info label="Technology" value={p.technology} />
                <Info label="Core KPI" value={p.core_kpi} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Panel title="No Problems Found" icon={<FileText size={15} />}>
          <Empty
            text={search ? `No problems matching "${search}".` : "Load the Hero Scenario from the Dashboard to see Problem #1042, or create a new problem using the intake form."}
            action={search ? "Clear search" : "Go to Dashboard → Load Hero Scenario"}
          />
        </Panel>
      )}
    </div>
  );
}
