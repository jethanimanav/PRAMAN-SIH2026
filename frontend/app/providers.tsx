"use client";

import { PramanProvider } from "@/lib/PramanContext";
import { I18nProvider } from "@/lib/i18n";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <PramanProvider>{children}</PramanProvider>
    </I18nProvider>
  );
}
