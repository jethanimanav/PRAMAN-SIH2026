import type { ReactNode } from "react";

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "signal" | "amber" | "critical" }) {
  const tones = {
    neutral: "border-line bg-mist text-ink",
    signal: "border-signal bg-signal text-white",
    amber: "border-amber bg-amber text-white",
    critical: "border-critical bg-critical text-white",
  };
  return <span className={`inline-flex items-center rounded px-2 py-1 font-mono text-[11px] uppercase tracking-normal ${tones[tone]}`}>{children}</span>;
}
