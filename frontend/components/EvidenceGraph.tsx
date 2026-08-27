"use client";

import type { TracePayload } from "./EvidenceTrace";

const nodes = ["Government Problem", "Approved Requirement", "SkylineAI Solutions", "Pilot", "KPI Results", "Evidence", "Pilot Success Score", "Procurement Readiness", "Human Decision", "Handoff Pack", "Scale / Reuse"];

export function EvidenceGraph({ onTrace }: { onTrace: (trace: TracePayload) => void }) {
  return (
    <div className="border border-line bg-mist p-4">
      <div className="flex flex-wrap items-center gap-2" aria-label="Evidence graph">
        {nodes.map((node, index) => (
          <div key={node} className="flex items-center gap-2">
            <button
              className="rounded-dossier border border-line bg-paper px-3 py-2 text-left text-sm font-semibold hover:border-signal"
              onClick={() =>
                onTrace({
                  title: node,
                  why: "This node exists because the hero workflow created a traceable audit-backed state.",
                  how: "PRAMAN links lifecycle events through deterministic demo APIs and audit records.",
                  source: "Problem #1042, simulated evidence locker, KPI summary, and officer decision.",
                  who: index < 8 ? "PRAMAN demo engine + officer review" : "Authorized officer",
                  when: "Demo session timestamp",
                  dataClass: "SIMULATED",
                })
              }
            >
              {node}
            </button>
            {index < nodes.length - 1 && <span className="font-mono text-signal">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
