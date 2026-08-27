"use client";

import { X } from "lucide-react";
import { Badge } from "./Badge";

export type TracePayload = {
  title: string;
  why: string;
  how: string;
  source: string;
  who: string;
  when: string;
  dataClass: string;
  details?: Record<string, string | number>;
};

export function EvidenceTrace({ trace, onClose }: { trace: TracePayload | null; onClose: () => void }) {
  if (!trace) return null;
  return (
    <aside className="fixed right-0 top-0 z-50 h-dvh w-full max-w-[440px] border-l border-line bg-paper p-6 shadow-2xl" aria-label="Evidence Trace drawer">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase text-signal">WHY? HOW? FROM WHAT?</p>
          <h2 className="mt-2 font-display text-3xl">{trace.title}</h2>
        </div>
        <button onClick={onClose} className="rounded border border-line p-2" aria-label="Close evidence trace">
          <X size={18} />
        </button>
      </div>
      <div className="mt-6 space-y-4 text-sm">
        <TraceRow label="Why" value={trace.why} />
        <TraceRow label="How" value={trace.how} />
        <TraceRow label="From what" value={trace.source} />
        <TraceRow label="Who" value={trace.who} />
        <TraceRow label="When" value={trace.when} />
        <div className="flex items-center justify-between border-t border-line pt-4">
          <span className="font-mono text-xs uppercase">Data class</span>
          <Badge tone="amber">{trace.dataClass}</Badge>
        </div>
        {trace.details && (
          <div className="border-t border-line pt-4">
            <p className="font-mono text-xs uppercase">Inputs</p>
            <dl className="mt-3 grid grid-cols-2 gap-3">
              {Object.entries(trace.details).map(([key, value]) => (
                <div key={key} className="border border-line bg-mist p-3">
                  <dt className="font-mono text-[11px] uppercase text-ink/60">{key}</dt>
                  <dd className="mt-1 font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </aside>
  );
}

function TraceRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase text-ink/60">{label}</p>
      <p className="mt-1 leading-6">{value}</p>
    </div>
  );
}
