"use client";

import React, { createContext, useContext, useState, useMemo, type ReactNode } from "react";
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
}

const PramanContext = createContext<PramanContextType | null>(null);

export function PramanProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState("officer@praman.local");
  const [password, setPassword] = useState("demo123");
  const [mfa, setMfa] = useState("123456");

  const [user, setUser] = useState<Record<string, any> | null>(null);
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
    });
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

  return (
    <PramanContext.Provider
      value={{
        email, setEmail, password, setPassword, mfa, setMfa,
        user, problem, requirement, recommendations, pilot, readiness,
        decisionReason, setDecisionReason, decision, handoff, scale,
        audit, health, trace, setTrace, loading, error, currentStage,
        login, logout, launchDemo, structure, approve, matchStartups, shortlist,
        fastForward, calculateReadiness, submitDecision, generateHandoff, requestConsent
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
