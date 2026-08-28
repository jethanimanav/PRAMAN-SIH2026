"use client";

import { usePraman } from "@/lib/PramanContext";
import { Panel, Empty, Action, AlertBanner, kpiTrace } from "@/components/ui";
import { Badge } from "@/components/Badge";
import { TrendingUp, CheckCircle2, MapPin, Clock } from "lucide-react";

export default function ScalePage() {
  const { handoff, scale, requestConsent, loading, error, setTrace } = usePraman();
  const items: any[] = scale?.items || [];

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Decision</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Scale & Reuse</h1>
        <p className="mt-1 text-sm text-slate-500">Recommendations to replicate successful pilots across similar departments</p>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      {scale ? (
        <div className="space-y-5">
          {/* Why scale */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Why Scale?</p>
            <p className="text-sm text-blue-800">{scale.reason}</p>
          </div>

          {/* Scale targets */}
          <div className="grid gap-4">
            {items.map((item: any) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={14} className="text-slate-400" />
                      <h3 className="text-base font-bold text-slate-900">{item.department}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={item.status === "PENDING DEPARTMENT CONSENT" ? "amber" : "signal"}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <button
                      className="text-4xl font-black text-[#168675] hover:text-[#116f62] leading-none"
                      onClick={() => setTrace(kpiTrace(`${item.department} · Similarity`, "PRAMAN scale similarity engine", `${item.similarity}%`))}
                    >
                      {item.similarity}%
                    </button>
                    <p className="text-xs text-slate-400">problem similarity</p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5 text-sm text-slate-600">
                  Similar urban infrastructure problem with comparable deployment requirements. PRAMAN recommends consent-based scale with adapted SLA.
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Action
                    onClick={() => requestConsent(item.id)}
                    label="Request Department Consent"
                    icon={<CheckCircle2 size={13} />}
                    size="sm"
                    disabled={loading === "Requesting consent"}
                  />
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} />
                    Scale requires explicit department consent — never automatic
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
            <strong>Governance note:</strong> Scaling requires each target department to independently consent, evaluate, and approve. PRAMAN provides the recommendation; departments make independent decisions.
          </div>
        </div>
      ) : (
        <Panel title="Scale & Reuse Recommendations" icon={<TrendingUp size={15} />}>
          <Empty
            text="Scale recommendations are available from the moment you load the hero scenario. Ensure the handoff pack has been generated."
            action={handoff ? "Scale data is loading…" : "Generate Handoff Pack first"}
          />
        </Panel>
      )}
    </div>
  );
}
