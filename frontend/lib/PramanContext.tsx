"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
import { api } from "./api";
import type { AuditEvent, Problem, Recommendation } from "@/types/praman";
import type { TracePayload } from "@/components/EvidenceTrace";

type Requirement = Record<string, any>;
type Pilot = Record<string, any>;
type Readiness = {
  score: number;
  band: string;
  dimensions: Record<string, number>;
  blocker: string;
  suggested_action: string;
  disclaimer: string;
  data_class: string;
};

interface PramanContextType {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  mfa: string;
  setMfa: (v: string) => void;
  user: Record<string, any> | null;
  problem: Problem | null;
  requirement: Requirement | null;
  recommendations: Recommendation[];
  pilot: Pilot | null;
  readiness: Readiness | null;
  decisionReason: string;
  setDecisionReason: (v: string) => void;
  decision: Record<string, any> | null;
  handoff: Record<string, any> | null;
  scale: Record<string, any> | null;
  audit: AuditEvent[];
  health: Record<string, any> | null;
  trace: TracePayload | null;
  setTrace: (v: TracePayload | null) => void;
  loading: string;
  error: string;
  currentStage: number;
  // New state slices
  implementation: Record<string, any> | null;
  monitoring: Record<string, any>[];
  outcome: Record<string, any> | null;
  lessons: Record<string, any>[];
  memory: Record<string, any>[];
  memorySearchQuery: string;
  setMemorySearchQuery: (v: string) => void;
  riskRadar: Record<string, any>[];
  decisionReplay: Record<string, any> | null;
  modelVersions: Record<string, any>[];
  // Existing actions
  login: () => Promise<void>;
  launchDemo: () => Promise<void>;
  structure: () => Promise<void>;
  approve: () => Promise<void>;
  matchStartups: () => Promise<void>;
  shortlist: () => Promise<void>;
  fastForward: () => Promise<void>;
  calculateReadiness: () => Promise<void>;
  submitDecision: () => Promise<void>;
  generateHandoff: () => Promise<void>;
  requestConsent: (id: string) => Promise<void>;
  logout: () => void;
  // New actions
  initImplementation: () => Promise<void>;
  resolveBlocker: (taskId: string) => Promise<void>;
  updateTaskStatus: (taskId: string, status: string) => Promise<void>;
  addMonitoringRecord: (record: any) => Promise<void>;
  searchMemory: (q: string) => Promise<void>;
  loadAllModuleData: () => Promise<void>;
  authInitialized: boolean;
}

const PramanContext = createContext<PramanContextType | null>(null);

export function PramanProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState("officer@praman.local");
  const [password, setPassword] = useState("demo123");
  const [mfa, setMfa] = useState("123456");

  const [user, setUserState] = useState<Record<string, any> | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("praman_user");
    if (savedUser) {
      try {
        setUserState(JSON.parse(savedUser));
      } catch (e) { }
    }
    setAuthInitialized(true);
  }, []);

  function setUser(newUser: Record<string, any> | null) {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem("praman_user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("praman_user");
    }
  }

  const [problem, setProblem] = useState<Problem | null>(null);
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [pilot, setPilot] = useState<Pilot | null>(null);
  const [readiness, setReadiness] = useState<Readiness | null>(null);
  const [decisionReason, setDecisionReason] = useState(
    "SkylineAI retained because simulated KPI evidence supports human procurement review, while security questionnaire completion remains a visible blocker."
  );
  const [decision, setDecision] = useState<Record<string, any> | null>(null);
  const [handoff, setHandoff] = useState<Record<string, any> | null>(null);
  const [scale, setScale] = useState<Record<string, any> | null>(null);
  const [audit, setAudit] = useState<AuditEvent[]>([]);
  const [health, setHealth] = useState<Record<string, any> | null>(null);
  const [trace, setTrace] = useState<TracePayload | null>(null);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  // ── New state slices ──────────────────────────────────────────────────────
  const [implementation, setImplementation] = useState<Record<string, any> | null>(null);
  const [monitoring, setMonitoring] = useState<Record<string, any>[]>([]);
  const [outcome, setOutcome] = useState<Record<string, any> | null>(null);
  const [lessons, setLessons] = useState<Record<string, any>[]>([]);
  const [memory, setMemory] = useState<Record<string, any>[]>([]);
  const [memorySearchQuery, setMemorySearchQuery] = useState("");
  const [riskRadar, setRiskRadar] = useState<Record<string, any>[]>([]);
  const [decisionReplay, setDecisionReplay] = useState<Record<string, any> | null>(null);
  const [modelVersions, setModelVersions] = useState<Record<string, any>[]>([]);

  const currentStage = useMemo(() => {
    if (memory.length > 0) return 9;
    if (outcome) return 8;
    if (implementation) return 7;
    if (scale && handoff) return 6;
    if (handoff) return 5;
    if (readiness) return 4;
    if (pilot) return 3;
    if (recommendations.length) return 2;
    if (requirement) return 1;
    return 0;
  }, [handoff, implementation, memory.length, outcome, pilot, readiness, recommendations.length, requirement, scale]);

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
      await api("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const result = await api<{ user: Record<string, any> }>("/api/v1/auth/mfa/verify", {
        method: "POST",
        body: JSON.stringify({ email, code: mfa }),
      });
      setUser(result.user);
    });
  }

  function logout() {
    setUser(null);
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
      // Load all new module data
      await loadAllModuleDataInternal();
    });
  }

  async function loadAllModuleDataInternal() {
    const [implResult, monResult, outcomeResult, lessonsResult, memResult, riskResult, replayResult, modelsResult] = await Promise.allSettled([
      api<Record<string, any>>("/api/v1/implementation/1042"),
      api<{ items: Record<string, any>[] }>("/api/v1/monitoring/1042"),
      api<Record<string, any>>("/api/v1/outcomes/1042"),
      api<{ items: Record<string, any>[] }>("/api/v1/lessons/1042"),
      api<{ items: Record<string, any>[] }>("/api/v1/institutional-memory"),
      api<{ items: Record<string, any>[] }>("/api/v1/risk-radar/1042"),
      api<Record<string, any>>("/api/v1/decision-replay/replay-1042"),
      api<{ items: Record<string, any>[] }>("/api/v1/model-versions"),
    ]);
    if (implResult.status === "fulfilled") setImplementation(implResult.value);
    if (monResult.status === "fulfilled") setMonitoring(monResult.value.items);
    if (outcomeResult.status === "fulfilled") setOutcome(outcomeResult.value);
    if (lessonsResult.status === "fulfilled") setLessons(lessonsResult.value.items);
    if (memResult.status === "fulfilled") setMemory(memResult.value.items);
    if (riskResult.status === "fulfilled") setRiskRadar(riskResult.value.items);
    if (replayResult.status === "fulfilled") setDecisionReplay(replayResult.value);
    if (modelsResult.status === "fulfilled") setModelVersions(modelsResult.value.items);
  }

  async function loadAllModuleData() {
    await run("Loading PRAMAN intelligence modules", loadAllModuleDataInternal);
  }

  async function structure() {
    const result = await run("Structuring problem", () =>
      api<Requirement>("/api/v1/problems/1042/structure", { method: "POST" })
    );
    if (result) setRequirement(result);
  }

  async function approve() {
    const result = await run("Approving requirement", () =>
      api<Requirement>("/api/v1/problems/1042/requirements/approve", { method: "POST" })
    );
    if (result) setRequirement(result);
  }

  async function matchStartups() {
    const result = await run("Running matching engine", () =>
      api<{ results: Recommendation[] }>("/api/v1/match", { method: "POST" })
    );
    if (result) setRecommendations(result.results);
  }

  async function shortlist() {
    const result = await run("Creating pilot workspace", () =>
      api<{ pilot: Pilot }>("/api/v1/recommendations/rec-startup-skyline/shortlist", { method: "POST" })
    );
    if (result) setPilot(result.pilot);
  }

  async function fastForward() {
    if (!pilot) return;
    const result = await run("Fast-forwarding pilot", () =>
      api<Pilot>(`/api/v1/pilots/${pilot.id}/fast-forward`, { method: "POST" })
    );
    if (result) setPilot(result);
  }

  async function calculateReadiness() {
    if (!pilot) return;
    const result = await run("Calculating readiness", () =>
      api<Readiness>(`/api/v1/procurement-readiness/${pilot.id}/calculate`, { method: "POST" })
    );
    if (result) setReadiness(result);
  }

  async function submitDecision() {
    if (!pilot) return;
    const result = await run("Submitting human decision", () =>
      api<Record<string, any>>("/api/v1/decisions", {
        method: "POST",
        body: JSON.stringify({
          pilot_id: pilot.id,
          decision: "Proceed to Procurement Review",
          reason: decisionReason,
          comment: "Decision support only.",
        }),
      })
    );
    if (result) setDecision(result);
  }

  async function generateHandoff() {
    if (!pilot) return;
    const result = await run("Generating handoff pack", () =>
      api<Record<string, any>>(`/api/v1/export/handoff/${pilot.id}`, { method: "POST" })
    );
    if (result) setHandoff(result);
  }

  async function requestConsent(id: string) {
    await run("Requesting consent", () =>
      api(`/api/v1/scale-recommendations/${id}/request-consent`, { method: "POST" })
    );
  }

  // ── New actions ───────────────────────────────────────────────────────────

  async function initImplementation() {
    const result = await run("Initializing implementation plan", () =>
      api<Record<string, any>>("/api/v1/implementation/1042", { method: "POST" })
    );
    if (result) setImplementation(result);
  }

  async function resolveBlocker(taskId: string) {
    const result = await run("Resolving blocker", () =>
      api<Record<string, any>>(`/api/v1/implementation/1042/tasks/${taskId}/resolve-blocker`, { method: "PATCH" })
    );
    if (result) {
      // Reload implementation to get updated task statuses
      const updated = await api<Record<string, any>>("/api/v1/implementation/1042").catch(() => null);
      if (updated) setImplementation(updated);
    }
  }

  async function updateTaskStatus(taskId: string, status: string) {
    const result = await run("Updating task", () =>
      api<Record<string, any>>(`/api/v1/implementation/1042/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })
    );
    if (result) {
      const updated = await api<Record<string, any>>("/api/v1/implementation/1042").catch(() => null);
      if (updated) setImplementation(updated);
    }
  }

  async function addMonitoringRecord(record: any) {
    const result = await run("Adding monitoring record", () =>
      api<Record<string, any>>("/api/v1/monitoring/1042", {
        method: "POST",
        body: JSON.stringify(record),
      })
    );
    if (result) {
      const updated = await api<{ items: Record<string, any>[] }>("/api/v1/monitoring/1042").catch(() => null);
      if (updated) setMonitoring(updated.items);
    }
  }

  async function searchMemory(q: string) {
    setMemorySearchQuery(q);
    const result = await run("Searching institutional memory", () =>
      api<{ items: Record<string, any>[]; has_failed_match?: boolean }>(`/api/v1/institutional-memory/search?q=${encodeURIComponent(q)}`)
    );
    if (result) setMemory(result.items);
  }

  return (
    <PramanContext.Provider
      value={{
        email, setEmail, password, setPassword, mfa, setMfa,
        user, problem, requirement, recommendations, pilot, readiness,
        decisionReason, setDecisionReason, decision, handoff, scale,
        audit, health, trace, setTrace, loading, error, currentStage,
        authInitialized,
        // New state
        implementation, monitoring, outcome, lessons, memory,
        memorySearchQuery, setMemorySearchQuery,
        riskRadar, decisionReplay, modelVersions,
        // Existing actions
        login, logout, launchDemo, structure, approve, matchStartups, shortlist,
        fastForward, calculateReadiness, submitDecision, generateHandoff, requestConsent,
        // New actions
        initImplementation, resolveBlocker, updateTaskStatus,
        addMonitoringRecord, searchMemory, loadAllModuleData,
      }}
    >
      {children}
    </PramanContext.Provider>
  );
}

export function usePraman() {
  const context = useContext(PramanContext);
  if (!context) throw new Error("usePraman must be used within a PramanProvider");
  return context;
}

