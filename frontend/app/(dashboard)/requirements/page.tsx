"use client";

import { usePraman } from "@/lib/PramanContext";
import { Panel, Info, Empty, Action, AlertBanner, StatusBadge, kpiTrace } from "@/components/ui";
import { Badge } from "@/components/Badge";
import { ListChecks, CheckCircle2, Sparkles, ShieldAlert } from "lucide-react";

export default function RequirementsPage() {
  const { problem, requirement, structure, approve, loading, error, setTrace } = usePraman();

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Problem to Pilot</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Requirements</h1>
        <p className="mt-1 text-sm text-slate-500">AI-structured procurement requirements for review and approval</p>
      </div>

      {error && <AlertBanner type="error" message={error} />}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-emerald-700">
          <Sparkles size={15} className="animate-pulse" /> {loading}…
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Action
          onClick={structure}
          label="Structure with PRAMAN AI"
          icon={<Sparkles size={14} />}
          disabled={!problem || !!requirement || loading === "Structuring problem"}
        />
        <Action
          onClick={approve}
          label="Approve Requirements"
          icon={<CheckCircle2 size={14} />}
          disabled={!requirement || requirement.status === "Approved" || loading === "Approving requirement"}
          muted={requirement?.status === "Approved"}
        />
      </div>

      {requirement ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          {/* Main requirement detail */}
          <div className="space-y-5">
            <Panel title="Structured Requirements" icon={<ListChecks size={15} />}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Requirement ID</p>
                    <p className="font-mono text-sm font-bold text-slate-800 mt-0.5">{requirement.id}</p>
                  </div>
                  <StatusBadge status={requirement.status} />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Info label="Domain" value={requirement.domain} trace={() => setTrace(kpiTrace("Domain", "Problem narrative + PRAMAN AI", requirement.domain))} />
                  <Info label="Technology" value={requirement.technology} trace={() => setTrace(kpiTrace("Technology", "AI structuring engine", requirement.technology))} />
                  <Info label="Problem Type" value={requirement.problem_type} />
                  <Info label="Geography" value={requirement.geography} />
                  <Info label="Budget Range" value={requirement.budget} trace={() => setTrace(kpiTrace("Budget", "Problem statement", requirement.budget))} />
                  <Info label="Timeline" value={requirement.timeline} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Deployment Context</p>
                  <p className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5 text-sm text-slate-700">{requirement.deployment}</p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Data Requirements</p>
                  <div className="flex flex-wrap gap-2">
                    {requirement.data_requirements?.map((d: string) => (
                      <span key={d} className="rounded-md bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-semibold text-blue-700">{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>

            {/* KPIs */}
            <Panel title="Key Performance Indicators" icon={<CheckCircle2 size={15} />}>
              <div className="divide-y divide-slate-100">
                {requirement.kpis?.map((kpi: any) => (
                  <div key={kpi.name} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{kpi.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Target: <strong>{kpi.target}</strong></p>
                    </div>
                    <Badge tone={kpi.confidence === "HIGH" ? "signal" : "amber"}>{kpi.confidence}</Badge>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* Right panel: Security + Confidence */}
          <div className="space-y-5">
            <Panel title="Security Requirements" icon={<ShieldAlert size={15} />}>
              <p className="text-sm text-slate-600 leading-relaxed">{requirement.security}</p>
              <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 text-xs text-amber-700 font-medium">
                Security questionnaire + deployment review required before procurement.
              </div>
            </Panel>

            <Panel title="Constraints">
              <div className="space-y-2">
                {requirement.constraints?.map((c: string) => (
                  <div key={c} className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                    <ShieldAlert size={14} className="mt-0.5 shrink-0" />
                    {c}
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="AI Confidence">
              <div className="space-y-2">
                {Object.entries(requirement.confidence?.fields || {}).map(([field, conf]: [string, any]) => (
                  <div key={field} className="flex items-center justify-between">
                    <span className="text-sm capitalize text-slate-700">{field}</span>
                    <Badge tone={conf === "HIGH" ? "signal" : "amber"}>{conf}</Badge>
                  </div>
                ))}
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Overall</span>
                  <Badge tone={requirement.confidence?.overall === "HIGH" ? "signal" : "amber"}>
                    {requirement.confidence?.overall}
                  </Badge>
                </div>
              </div>
            </Panel>

            {requirement.status === "Approved" && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-2" />
                <p className="text-sm font-bold text-emerald-800">Requirements Approved</p>
                <p className="text-xs text-emerald-600 mt-1">Matching engine is now unlocked</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Panel title="Requirement Structuring" icon={<ListChecks size={15} />}>
          <Empty
            text={problem ? "Click 'Structure with PRAMAN AI' to extract structured requirements from the problem narrative." : "Load Hero Scenario from Dashboard first."}
            action={problem ? "Structure with PRAMAN AI" : "Go to Dashboard → Load Hero Scenario"}
          />
        </Panel>
      )}
    </div>
  );
}
