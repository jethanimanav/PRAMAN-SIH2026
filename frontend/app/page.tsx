"use client";

import { useMemo, useState } from "react";
import { Activity, CheckCircle2, Download, FileCheck2, LockKeyhole, Play, RotateCcw, ShieldAlert } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/Badge";
import { EvidenceGraph } from "@/components/EvidenceGraph";
import { EvidenceTrace, TracePayload } from "@/components/EvidenceTrace";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";
import type { AuditEvent, Problem, Recommendation } from "@/types/praman";

type Requirement = Record<string, any>;
type Pilot = Record<string, any>;
type Readiness = { score: number; band: string; dimensions: Record<string, number>; blocker: string; suggested_action: string; disclaimer: string; data_class: string };

const stages = ["Problem #1042", "Structuring", "Matching", "Pilot", "Readiness", "Handoff", "Scale"];

export default function Home() {
  const [email, setEmail] = useState("officer@praman.local");
  const [password, setPassword] = useState("demo123");
  const [mfa, setMfa] = useState("123456");
  const [user, setUser] = useState<Record<string, any> | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [pilot, setPilot] = useState<Pilot | null>(null);
  const [readiness, setReadiness] = useState<Readiness | null>(null);
  const [decisionReason, setDecisionReason] = useState("SkylineAI retained because simulated KPI evidence supports human procurement review, while security questionnaire completion remains a visible blocker.");
  const [decision, setDecision] = useState<Record<string, any> | null>(null);
  const [handoff, setHandoff] = useState<Record<string, any> | null>(null);
  const [scale, setScale] = useState<Record<string, any> | null>(null);
  const [audit, setAudit] = useState<AuditEvent[]>([]);
  const [health, setHealth] = useState<Record<string, any> | null>(null);
  const [trace, setTrace] = useState<TracePayload | null>(null);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  const currentStage = useMemo(() => {
    if (scale && handoff) return 6;
    if (handoff) return 5;
    if (readiness) return 4;
    if (pilot) return 3;
    if (recommendations.length) return 2;
    if (requirement) return 1;
    return 0;
  }, [handoff, pilot, readiness, recommendations.length, requirement, scale]);

  async function run<T>(label: string, action: () => Promise<T>) {
    setLoading(label);
    setError("");
    try {
      return await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      return null;
    } finally {
      setLoading("");
      refreshAudit();
    }
  }

  async function refreshAudit() {
    const result = await api<{ items: AuditEvent[] }>("/api/v1/audit/1042").catch(() => null);
    if (result) setAudit(result.items);
  }

  async function login() {
    await run("Verifying MFA", async () => {
      await api("/api/v1/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      const result = await api<{ user: Record<string, any> }>("/api/v1/auth/mfa/verify", { method: "POST", body: JSON.stringify({ email, code: mfa }) });
      setUser(result.user);
    });
  }

  async function launchDemo() {
    await run("Launching judge demo", async () => {
      await api("/api/v1/demo/reset", { method: "POST" });
      const h = await api<Record<string, any>>("/api/v1/health");
      const problems = await api<{ items: Problem[] }>("/api/v1/problems");
      setHealth(h);
      setProblem(problems.items[0]);
      setRequirement(null);
      setRecommendations([]);
      setPilot(null);
      setReadiness(null);
      setDecision(null);
      setHandoff(null);
      const scaleResult = await api<Record<string, any>>("/api/v1/scale-recommendations/startup-skyline");
      setScale(scaleResult);
    });
  }

  async function structure() {
    const result = await run("Structuring problem", () => api<Requirement>("/api/v1/problems/1042/structure", { method: "POST" }));
    if (result) setRequirement(result);
  }

  async function approve() {
    const result = await run("Approving requirement", () => api<Requirement>("/api/v1/problems/1042/requirements/approve", { method: "POST" }));
    if (result) setRequirement(result);
  }

  async function matchStartups() {
    const result = await run("Running matching engine", () => api<{ results: Recommendation[] }>("/api/v1/match", { method: "POST" }));
    if (result) setRecommendations(result.results);
  }

  async function shortlist() {
    const result = await run("Creating pilot workspace", () => api<{ pilot: Pilot }>("/api/v1/recommendations/rec-startup-skyline/shortlist", { method: "POST" }));
    if (result) setPilot(result.pilot);
  }

  async function fastForward() {
    if (!pilot) return;
    const result = await run("Fast-forwarding pilot", () => api<Pilot>(`/api/v1/pilots/${pilot.id}/fast-forward`, { method: "POST" }));
    if (result) setPilot(result);
  }

  async function calculateReadiness() {
    if (!pilot) return;
    const result = await run("Calculating readiness", () => api<Readiness>(`/api/v1/procurement-readiness/${pilot.id}/calculate`, { method: "POST" }));
    if (result) setReadiness(result);
  }

  async function submitDecision() {
    if (!pilot) return;
    const result = await run("Submitting human decision", () =>
      api<Record<string, any>>("/api/v1/decisions", {
        method: "POST",
        body: JSON.stringify({ pilot_id: pilot.id, decision: "Proceed to Procurement Review", reason: decisionReason, comment: "Decision support only." }),
      }),
    );
    if (result) setDecision(result);
  }

  async function generateHandoff() {
    if (!pilot) return;
    const result = await run("Generating handoff pack", () => api<Record<string, any>>(`/api/v1/export/handoff/${pilot.id}`, { method: "POST" }));
    if (result) setHandoff(result);
  }

  async function requestConsent(id: string) {
    await run("Requesting consent", () => api(`/api/v1/scale-recommendations/${id}/request-consent`, { method: "POST" }));
  }

  const readinessChart = readiness ? Object.entries(readiness.dimensions).map(([name, value]) => ({ name, value })) : [];

  return (
    <Shell>
      <div className="min-h-dvh p-5 lg:p-8">
        {!user ? (
          <section className="mx-auto mt-16 max-w-md border border-line bg-mist p-6">
            <div className="flex items-center gap-3">
              <LockKeyhole className="text-signal" />
              <div>
                <p className="font-mono text-xs uppercase text-signal">Simulated MFA</p>
                <h2 className="font-display text-3xl">Officer Login</h2>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <input className="w-full border border-line bg-paper px-3 py-2" value={email} onChange={(event) => setEmail(event.target.value)} aria-label="Email" />
              <input className="w-full border border-line bg-paper px-3 py-2" value={password} onChange={(event) => setPassword(event.target.value)} aria-label="Password" type="password" />
              <input className="w-full border border-line bg-paper px-3 py-2" value={mfa} onChange={(event) => setMfa(event.target.value)} aria-label="MFA code" />
              <button onClick={login} className="flex w-full items-center justify-center gap-2 rounded-dossier bg-signal px-4 py-3 font-semibold text-white">
                <CheckCircle2 size={18} /> Verify and Enter
              </button>
            </div>
          </section>
        ) : (
          <div className="space-y-6">
            <header className="border-b border-line pb-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase text-signal">Evidence-Driven Innovation Procurement</p>
                  <h1 className="font-display text-5xl">From Government Problem to Evidence-Ready Procurement</h1>
                  <p className="mt-3 max-w-3xl text-sm text-ink/70">Decision support only — final procurement remains with authorized government officials.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="amber">DEMO MODE</Badge>
                  <Badge>SIMULATED DATA</Badge>
                  <Badge tone="signal">{health?.status || "READY CHECK PENDING"}</Badge>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {stages.map((stage, index) => (
                  <span key={stage} className={`rounded border px-3 py-2 font-mono text-xs ${index < currentStage ? "border-signal bg-signal text-white" : index === currentStage ? "border-ink bg-ink text-paper" : "border-line bg-mist text-ink/60"}`}>
                    {stage}
                  </span>
                ))}
              </div>
            </header>

            {error && <div className="border border-critical bg-critical/10 p-3 text-sm text-critical">{error}</div>}
            {loading && <div className="border border-line bg-mist p-3 font-mono text-xs uppercase">Processing: {loading}</div>}

            <section className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
              <Panel title="Launch Judge Demo" icon={<Play size={18} />}>
                <div className="flex flex-wrap gap-3">
                  <Action onClick={launchDemo} label="Load Hero Scenario" icon={<Play size={16} />} />
                  <Action onClick={launchDemo} label="Reset Hero Demo" icon={<RotateCcw size={16} />} muted />
                  <Action onClick={structure} label="Structure with PRAMAN AI" disabled={!problem} />
                  <Action onClick={approve} label="Approve Requirement" disabled={!requirement} />
                  <Action onClick={matchStartups} label="Run Match" disabled={requirement?.status !== "Approved"} />
                  <Action onClick={shortlist} label="Shortlist SkylineAI" disabled={!recommendations.length} />
                  <Action onClick={fastForward} label="Fast-forward Pilot" disabled={!pilot} />
                  <Action onClick={calculateReadiness} label="Calculate Readiness" disabled={!pilot?.success} />
                </div>
                {health && (
                  <div className="mt-4 grid gap-2 md:grid-cols-2">
                    {Object.entries(health.checks).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between border border-line bg-paper p-3 text-sm">
                        <span>{key.replaceAll("_", " ")}</span>
                        <Badge tone="signal">{String(value)}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>

              <Panel title="Problem Intake" icon={<FileCheck2 size={18} />}>
                {problem ? (
                  <div className="space-y-3 text-sm">
                    <h2 className="font-display text-3xl">{problem.title}</h2>
                    <p className="leading-6">{problem.narrative}</p>
                    <div className="grid gap-2 md:grid-cols-2">
                      <Info label="Department" value={problem.department} />
                      <Info label="Location" value={problem.location} />
                      <Info label="Budget" value={problem.budget} />
                      <Info label="Core KPI" value={problem.core_kpi} trace={() => setTrace(kpiTrace("Core KPI", "Requirement narrative", problem.core_kpi))} />
                    </div>
                  </div>
                ) : (
                  <Empty text="No hero problem loaded yet." action="Load Hero Scenario" />
                )}
              </Panel>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
              <Panel title="Requirement Structuring">
                {requirement ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="border border-line bg-mist p-4 text-sm leading-6">{problem?.narrative}</div>
                    <div className="space-y-2">
                      {["domain", "technology", "problem_type", "deployment", "budget", "timeline", "security"].map((key) => (
                        <Info key={key} label={key.replaceAll("_", " ")} value={String(requirement[key])} trace={() => setTrace(kpiTrace(key, "AI-generated requirement object", String(requirement[key])))} />
                      ))}
                      <Badge tone={requirement.status === "Approved" ? "signal" : "amber"}>{requirement.status}</Badge>
                    </div>
                  </div>
                ) : (
                  <Empty text="We could not confidently structure this problem yet." action="Structure with PRAMAN AI" />
                )}
              </Panel>

              <Panel title="Eligibility + Matching Engine">
                {recommendations.length ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-2 text-center text-sm">
                      {["124 discovered", "36 eligible", "12 capability matches", "3 recommended"].map((item) => (
                        <div key={item} className="border border-line bg-mist p-3 font-mono text-xs uppercase">{item}</div>
                      ))}
                    </div>
                    <p className="font-mono text-xs uppercase">Requirement → Hard Filters → BM25 + Dense Embeddings → RRF → TOPSIS → Explainable Ranking</p>
                    {recommendations.map((rec) => (
                      <div key={rec.id} className="border border-line bg-paper p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-mono text-xs uppercase">Rank #{rec.rank}</p>
                            <h3 className="font-display text-2xl">{rec.startup.name}</h3>
                            <p className="text-sm text-ink/70">{rec.startup.capabilities.join(" · ")}</p>
                          </div>
                          <div className="text-right">
                            <button className="trace-link font-display text-3xl" onClick={() => setTrace({ title: `${rec.startup.name} ${rec.score}/100`, why: "SkylineAI ranks first because computer vision, GPS, edge deployment, geography, budget, and simulated ITS evidence align with Problem #1042.", how: "BM25 and dense retrieval rankings are fused with RRF, then TOPSIS applies the approved weight profile.", source: "Requirement req-1042-v1, eligibility checks, simulated startup capability records.", who: "PRAMAN local demo engine", when: "Demo session timestamp", dataClass: rec.data_class, details: rec.dimensions })}>
                              {rec.score}/100
                            </button>
                            <div className="mt-2"><Badge tone={rec.rank === 1 ? "signal" : "neutral"}>{rec.band}</Badge></div>
                          </div>
                        </div>
                        <div className="mt-3 grid gap-2 md:grid-cols-3">
                          {rec.eligibility.checks.slice(0, 3).map((check) => <Info key={check.code} label={check.code} value={`${check.name}: ${check.status}`} />)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty text="No eligible startup currently satisfies all mandatory constraints until matching runs." action="Run Match" />
                )}
              </Panel>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
              <Panel title="Controlled Pilot Workspace">
                {pilot ? (
                  <div className="space-y-4">
                    <div className="grid gap-2 md:grid-cols-3">
                      <Info label="Pilot" value={pilot.name} />
                      <Info label="Startup" value={pilot.startup} />
                      <Info label="Budget" value={pilot.budget} />
                    </div>
                    <div className="flex flex-wrap gap-2">{pilot.timeline.map((item: string) => <Badge key={item} tone={pilot.status === item ? "signal" : "neutral"}>{item}</Badge>)}</div>
                    {pilot.kpis?.length ? (
                      <table className="w-full border-collapse text-sm">
                        <thead><tr className="bg-mist text-left"><th className="border border-line p-2">KPI</th><th className="border border-line p-2">Baseline</th><th className="border border-line p-2">Target</th><th className="border border-line p-2">Actual</th></tr></thead>
                        <tbody>{pilot.kpis.map((kpi: any) => <tr key={kpi.name}><td className="border border-line p-2">{kpi.name}</td><td className="border border-line p-2">{kpi.baseline}</td><td className="border border-line p-2">{kpi.target}</td><td className="border border-line p-2"><button className="trace-link" onClick={() => setTrace(kpiTrace(kpi.name, "KPI_Summary_May.xlsx", kpi.actual))}>{kpi.actual}</button></td></tr>)}</tbody>
                      </table>
                    ) : <Empty text="Pilot has not started." action="Create Pilot" />}
                  </div>
                ) : <Empty text="Pilot has not started." action="Shortlist SkylineAI" />}
              </Panel>

              <Panel title="Evidence Locker">
                {pilot?.kpis?.length ? (
                  <div className="grid gap-2">
                    {["Detection_Report_May.pdf", "Field_Photos_Sample.zip", "KPI_Summary_May.xlsx", "Security_Assessment.pdf", "User_Feedback.pdf"].map((name) => (
                      <div key={name} className="flex items-center justify-between border border-line bg-mist p-3 text-sm">
                        <span>{name}</span>
                        <div className="flex items-center gap-2"><Badge>SIMULATED</Badge><Badge tone="signal">Verified</Badge></div>
                      </div>
                    ))}
                  </div>
                ) : <Empty text="No evidence uploaded yet." action="Generate Evidence" />}
              </Panel>
            </section>

            <section className="grid gap-4 xl:grid-cols-[.9fr_1.1fr]">
              <Panel title="Procurement Readiness">
                {readiness ? (
                  <div className="space-y-4">
                    <div className="flex items-end justify-between border border-line bg-mist p-5">
                      <div>
                        <p className="font-mono text-xs uppercase">Procurement Readiness</p>
                        <button className="trace-link font-display text-6xl" onClick={() => setTrace({ title: "Why 91?", why: "Pilot success, reliability, cost, documentation, and compliance are strong, while security remains an explicit blocker.", how: "Transparent readiness dimensions are aggregated from pilot evidence and policy gates.", source: "KPI results, evidence locker, Security_Assessment.pdf, audit log.", who: "PRAMAN readiness engine + human reviewer", when: "Demo session timestamp", dataClass: readiness.data_class, details: readiness.dimensions })}>{readiness.score}/100</button>
                      </div>
                      <Badge tone="signal">{readiness.band}</Badge>
                    </div>
                    <div className="flex gap-2 border border-amber bg-amber/10 p-3 text-sm"><ShieldAlert className="shrink-0 text-amber" size={20} />{readiness.blocker} {readiness.suggested_action}</div>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={readinessChart} layout="vertical" margin={{ left: 60 }}>
                          <CartesianGrid stroke="#D8D3C7" />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#1B7A6E" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : <Empty text="Readiness has not been calculated." action="Calculate Readiness" />}
              </Panel>

              <Panel title="Evidence Graph">
                <EvidenceGraph onTrace={setTrace} />
              </Panel>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
              <Panel title="Human Decision Gate">
                {readiness ? (
                  <div className="space-y-3">
                    <p className="font-semibold">AI recommendation: Proceed to Human Procurement Review.</p>
                    <p className="text-sm text-ink/70">Human approval required. PRAMAN never approves procurement.</p>
                    <textarea className="min-h-28 w-full border border-line bg-paper p-3" value={decisionReason} onChange={(event) => setDecisionReason(event.target.value)} aria-label="Decision reason" />
                    <Action onClick={submitDecision} label="Proceed to Procurement Review" icon={<CheckCircle2 size={16} />} />
                    {decision && <div className="border border-signal bg-signal/10 p-3 text-sm">{decision.status}</div>}
                  </div>
                ) : <Empty text="Human decision appears after readiness." action="Calculate Readiness" />}
              </Panel>

              <Panel title="Handoff Pack">
                <div className="space-y-3">
                  <Action onClick={generateHandoff} label="Generate Handoff Pack" icon={<Download size={16} />} disabled={!decision} />
                  {handoff ? (
                    <div className="border border-line bg-mist p-4 text-sm">
                      <h3 className="font-display text-2xl">{handoff.title}</h3>
                      <p className="mt-2 font-mono text-xs uppercase">{handoff.watermark}</p>
                      <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap bg-paper p-3 text-xs">{JSON.stringify(handoff, null, 2)}</pre>
                    </div>
                  ) : <Empty text="Handoff requires human decision first." action="Submit Decision" />}
                </div>
              </Panel>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
              <Panel title="Scale & Reuse">
                {scale ? (
                  <div className="space-y-3">
                    <p className="text-sm">{scale.reason}</p>
                    {scale.items.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between border border-line bg-mist p-3">
                        <div><p className="font-semibold">{item.department}</p><p className="font-mono text-xs">{item.status}</p></div>
                        <div className="flex items-center gap-3">
                          <button className="trace-link font-display text-2xl" onClick={() => setTrace(kpiTrace(item.department, "Scale similarity engine", `${item.similarity}`))}>{item.similarity}</button>
                          <Action onClick={() => requestConsent(item.id)} label="Request Consent" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <Empty text="Scale recommendations appear after hero scenario load." action="Load Hero Scenario" />}
              </Panel>

              <Panel title="Audit Log">
                <div className="max-h-96 overflow-auto">
                  <table className="w-full border-collapse text-xs">
                    <thead><tr className="bg-ink text-left text-paper"><th className="p-2">Timestamp</th><th className="p-2">Actor</th><th className="p-2">Action</th><th className="p-2">Reason</th><th className="p-2">Data</th></tr></thead>
                    <tbody>{audit.map((event) => <tr key={event.id}><td className="border border-line p-2">{new Date(event.timestamp).toLocaleString()}</td><td className="border border-line p-2">{event.actor}</td><td className="border border-line p-2">{event.action}</td><td className="border border-line p-2">{event.reason}</td><td className="border border-line p-2">{event.data_class}</td></tr>)}</tbody>
                  </table>
                </div>
              </Panel>
            </section>
          </div>
        )}
      </div>
      <EvidenceTrace trace={trace} onClose={() => setTrace(null)} />
    </Shell>
  );
}

function Panel({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="border border-line bg-paper p-5">
      <div className="mb-4 flex items-center gap-2 border-b border-line pb-3">
        {icon || <Activity size={18} className="text-signal" />}
        <h2 className="font-display text-2xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Action({ label, onClick, icon, disabled, muted }: { label: string; onClick: () => void; icon?: React.ReactNode; disabled?: boolean; muted?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className={`inline-flex items-center gap-2 rounded-dossier border px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${muted ? "border-line bg-paper" : "border-signal bg-signal text-white"}`}>
      {icon}
      {label}
    </button>
  );
}

function Info({ label, value, trace }: { label: string; value: string; trace?: () => void }) {
  return (
    <div className="border border-line bg-mist p-3">
      <p className="font-mono text-[11px] uppercase text-ink/60">{label}</p>
      {trace ? <button className="trace-link mt-1 text-left text-sm font-semibold" onClick={trace}>{value}</button> : <p className="mt-1 text-sm font-semibold">{value}</p>}
    </div>
  );
}

function Empty({ text, action }: { text: string; action: string }) {
  return (
    <div className="border border-dashed border-line bg-mist p-5 text-sm">
      <p>{text}</p>
      <p className="mt-2 font-mono text-xs uppercase text-signal">{action}</p>
    </div>
  );
}

function kpiTrace(title: string, source: string, value: string): TracePayload {
  return {
    title,
    why: `${value} is shown because it is part of the simulated hero scenario evidence trail.`,
    how: "The local deterministic demo engine exposes the same trace contract used across PRAMAN.",
    source,
    who: "PRAMAN local demo engine",
    when: "Demo session timestamp",
    dataClass: "SIMULATED",
  };
}
