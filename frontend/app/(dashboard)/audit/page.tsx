"use client";

import { usePraman } from "@/lib/PramanContext";
import { Panel, GovPageHeader } from "@/components/ui";
import { Activity, Clock, User, Tag } from "lucide-react";
import { Badge } from "@/components/Badge";

export default function AuditPage() {
  const { audit } = usePraman();

  return (
    <div className="space-y-5">
      <GovPageHeader
        eyebrow="Governance"
        title="Audit Log"
        subtitle="Append-only governance record of all procurement actions · SIMULATED"
      />

      <div className="rounded border bg-white shadow-sm overflow-hidden min-w-0" style={{ borderColor: "var(--line)" }}>
        <div className="border-b px-5 py-3.5 flex items-center justify-between min-w-0" style={{ borderColor: "var(--line)" }}>
          <div className="flex items-center gap-2 min-w-0">
            <Activity size={15} style={{ color: "var(--gov-blue)" }} />
            <h2 className="text-[13px] font-bold" style={{ color: "var(--ink)" }}>All Events · {audit.length} entries</h2>
          </div>
          <Badge tone="amber">APPEND-ONLY</Badge>
        </div>

        {audit.length > 0 ? (
          <div className="divide-y max-h-[600px] overflow-y-auto" style={{ borderColor: "var(--line)" }}>
            {[...audit].reverse().map((event) => (
              <div key={event.id} className="px-5 py-4 transition" style={{ background: "var(--white)" }} onMouseEnter={e => e.currentTarget.style.background = "var(--mist)"} onMouseLeave={e => e.currentTarget.style.background = "var(--white)"}>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border" style={{ background: "var(--gov-blue-light)", borderColor: "var(--gov-blue-border)" }}>
                    <Activity size={13} style={{ color: "var(--gov-blue)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 min-w-0">
                      <p className="text-[13px] font-bold truncate" style={{ color: "var(--ink)" }}>{event.action}</p>
                      <div className="flex items-center gap-1.5 text-[10px] shrink-0" style={{ color: "var(--ink-soft)" }}>
                        <Clock size={10} />
                        {new Date(event.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--ink-soft)" }}>
                        <User size={11} /> {event.actor}
                      </span>
                      <span style={{ color: "var(--line)" }}>·</span>
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--ink-soft)" }}>
                        <Tag size={11} /> {event.entity}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>{event.reason}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Badge tone="neutral">{event.data_class}</Badge>
                      <span className="font-mono text-[9px]" style={{ color: "var(--ink-muted)" }}>{event.system_version}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-12 text-center" style={{ color: "var(--ink-soft)" }}>
            <Activity size={32} className="mx-auto mb-3" style={{ color: "var(--line)" }} />
            <p className="text-[13px] font-semibold">No audit events yet</p>
            <p className="text-[11px] mt-1">Load the Hero Scenario and proceed through the workflow to generate audit entries.</p>
          </div>
        )}
      </div>
    </div>
  );
}
