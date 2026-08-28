"use client";

import { usePraman } from "@/lib/PramanContext";
import { Panel } from "@/components/ui";
import { Activity, Clock, User, Tag } from "lucide-react";
import { Badge } from "@/components/Badge";

export default function AuditPage() {
  const { audit } = usePraman();

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Governance</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Audit Log</h1>
        <p className="mt-1 text-sm text-slate-500">Append-only governance record of all procurement actions · SIMULATED</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={15} className="text-[#168675]" />
            <h2 className="text-sm font-bold text-slate-800">All Events · {audit.length} entries</h2>
          </div>
          <Badge tone="amber">APPEND-ONLY</Badge>
        </div>

        {audit.length > 0 ? (
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {[...audit].reverse().map((event) => (
              <div key={event.id} className="px-5 py-4 hover:bg-slate-50 transition">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200">
                    <Activity size={13} className="text-[#168675]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-slate-900">{event.action}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 shrink-0">
                        <Clock size={10} />
                        {new Date(event.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <User size={11} /> {event.actor}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Tag size={11} /> {event.entity}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{event.reason}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Badge tone="neutral">{event.data_class}</Badge>
                      <span className="font-mono text-[9px] text-slate-300">{event.system_version}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-12 text-center text-slate-400">
            <Activity size={32} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold">No audit events yet</p>
            <p className="text-xs mt-1">Load the Hero Scenario and proceed through the workflow to generate audit entries.</p>
          </div>
        )}
      </div>
    </div>
  );
}
