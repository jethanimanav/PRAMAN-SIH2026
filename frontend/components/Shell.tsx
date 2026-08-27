import type { ReactNode } from "react";

import { Badge } from "./Badge";

const nav = [
  ["COMMAND CENTER", "Dashboard"],
  ["PROBLEM TO PILOT", "Problems", "Problem Intake", "Requirements", "Matching & Ranking", "Pilots", "Evidence"],
  ["DECISION", "Procurement Readiness", "Decisions", "Handoff Pack", "Scale & Reuse"],
  ["GOVERNANCE", "Audit Log", "Analytics", "Settings"],
];

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-r border-line bg-ink p-6 text-paper">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center border border-signal font-display text-xl text-signal">P</div>
          <div>
            <h1 className="font-display text-2xl">PRAMAN</h1>
            <p className="text-xs text-paper/70">Government of Maharashtra · Urban Development Dept.</p>
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <Badge tone="amber">Demo Mode</Badge>
          <Badge>Simulated Data</Badge>
        </div>
        <nav className="mt-8 space-y-6" aria-label="Primary">
          {nav.map(([section, ...items]) => (
            <div key={section}>
              <p className="font-mono text-[11px] uppercase text-paper/50">{section}</p>
              <div className="mt-2 space-y-1">
                {items.map((item) => (
                  <div key={item} className="rounded px-3 py-2 text-sm text-paper/80">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}
