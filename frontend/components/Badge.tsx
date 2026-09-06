import type { ReactNode } from "react";

type Tone = "neutral" | "signal" | "amber" | "critical" | "blue" | "gov" | "saffron" | "success";

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  const styles: Record<Tone, React.CSSProperties> = {
    neutral: { background: "var(--mist)", color: "var(--ink-soft)", borderColor: "var(--line)" },
    signal:  { background: "var(--success-light)", color: "var(--success)", borderColor: "#bbf7d0" },
    success: { background: "var(--success-light)", color: "var(--success)", borderColor: "#bbf7d0" },
    amber:   { background: "var(--warning-light)", color: "var(--warning)", borderColor: "#fde68a" },
    critical:{ background: "var(--critical-light)", color: "var(--critical)", borderColor: "#fecaca" },
    blue:    { background: "var(--info-light)", color: "var(--info)", borderColor: "#bfdbfe" },
    gov:     { background: "var(--gov-blue-light)", color: "var(--gov-blue)", borderColor: "var(--gov-blue-border)" },
    saffron: { background: "var(--saffron-light)", color: "var(--saffron)", borderColor: "var(--saffron-border)" },
  };
  return (
    <span
      className="inline-flex items-center rounded border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
      style={styles[tone]}
    >
      {children}
    </span>
  );
}
