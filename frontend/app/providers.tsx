"use client";

import { PramanProvider } from "@/lib/PramanContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <PramanProvider>{children}</PramanProvider>;
}
