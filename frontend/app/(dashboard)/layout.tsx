"use client";

import { Shell } from "@/components/Shell";
import { EvidenceTrace } from "@/components/EvidenceTrace";
import { usePraman } from "@/lib/PramanContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { trace, setTrace } = usePraman();
  
  return (
    <Shell>
      {children}
      <EvidenceTrace trace={trace} onClose={() => setTrace(null)} />
    </Shell>
  );
}
