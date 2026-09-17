"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePraman } from "@/lib/PramanContext";
import { api } from "@/lib/api";
import {
  GovPageHeader, Panel, Action, AlertBanner, Empty,
} from "@/components/ui";
import { Badge } from "@/components/Badge";
import Link from "next/link";
import type { HubChallenge, HubSolution, HubReviewQueueItem } from "@/types/praman";
import {
  Search, Lightbulb, FileText, ClipboardCheck, Building2,
  MapPin, Clock, Users, ChevronRight, CheckCircle2, AlertTriangle,
  ArrowRight, Sparkles, Shield, Target, BookOpen, GitBranch,
  RefreshCw, X, Plus, Send, ShieldCheck, Info,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   LIFECYCLE STAGES STRIP
   ═══════════════════════════════════════════════════════════════ */
const LIFECYCLE_STAGES = ["PROBLEM", "DISCOVER", "VALIDATE", "DECIDE", "SCALE"] as const;

function LifecycleStrip({ activeStage }: { activeStage?: string }) {
  return (
    <div className="flex items-center gap-0 overflow-x-auto">
      {LIFECYCLE_STAGES.map((stage, i) => {
        const isActive = stage === activeStage;
        return (
          <div key={stage} className="flex items-center shrink-0">
            <div
              className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm ${
                isActive
                  ? "bg-[#0B2A5B] text-white"
                  : "bg-[#F1F5F9] text-[#8A96A8]"
              }`}
            >
              {stage}
            </div>
            {i < LIFECYCLE_STAGES.length - 1 && (
              <ChevronRight size={12} className="text-[#D9E1EA] shrink-0 mx-0.5" />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   URGENCY BADGE HELPER
   ═══════════════════════════════════════════════════════════════ */
function UrgencyBadge({ urgency }: { urgency: string }) {
  const styles: Record<string, string> = {
    High: "bg-red-50 text-red-700 border-red-200",
    Critical: "bg-red-100 text-red-800 border-red-300",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    Low: "bg-green-50 text-green-700 border-green-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wide ${
        styles[urgency] ?? "bg-[#F1F5F9] text-[#5E6B7E] border-[#D9E1EA]"
      }`}
    >
      {urgency}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EVIDENCE CONFIDENCE BADGE
   ═══════════════════════════════════════════════════════════════ */
function EvidenceBadge({ confidence, validation }: { confidence: string; validation: string }) {
  const isVerified = validation === "Government Verified";
  return (
    <div
      className="rounded border p-2 text-[10px] space-y-1"
      style={{
        background: isVerified ? "var(--success-light)" : "var(--mist)",
        borderColor: isVerified ? "var(--success-border)" : "var(--line)",
      }}
    >
      <div className="flex items-center gap-1 font-bold" style={{ color: isVerified ? "var(--success)" : "var(--ink-soft)" }}>
        {isVerified ? <CheckCircle2 size={11} /> : <Shield size={11} />}
        <span>CLAIM</span>
      </div>
      <div className="font-semibold" style={{ color: "var(--ink)" }}>{validation}</div>
      <div style={{ color: "var(--ink-soft)" }}>Confidence: <strong>{confidence}</strong></div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHALLENGE CARD (list view)
   ═══════════════════════════════════════════════════════════════ */
function ChallengeCard({
  challenge,
  onSelect,
  onSubmit,
}: {
  challenge: HubChallenge;
  onSelect: (c: HubChallenge) => void;
  onSubmit: (c: HubChallenge) => void;
}) {
  return (
    <div
      className="rounded border bg-white divide-y"
      style={{ borderColor: "var(--line)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
    >
      {/* Card header */}
      <div className="px-4 py-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded"
              style={{ background: "var(--gov-blue-light)", color: "var(--gov-blue)", border: "1px solid var(--gov-blue-border)" }}
            >
              {challenge.display_id}
            </span>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded border"
              style={{ background: "var(--mist)", color: "var(--ink-soft)", borderColor: "var(--line)" }}
            >
              {challenge.domain}
            </span>
            <UrgencyBadge urgency={challenge.urgency} />
          </div>
          <h3
            className="text-sm font-bold leading-tight cursor-pointer hover:underline"
            style={{ color: "var(--ink)" }}
            onClick={() => onSelect(challenge)}
          >
            {challenge.title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px]" style={{ color: "var(--ink-soft)" }}>
            <span className="flex items-center gap-1">
              <Building2 size={11} /> {challenge.department}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={11} /> {challenge.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} /> {challenge.days_remaining} days remaining
            </span>
            <span className="flex items-center gap-1">
              <Users size={11} /> {challenge.submission_count} submissions
            </span>
          </div>
        </div>
        <LifecycleStrip activeStage={challenge.stage} />
      </div>

      {/* Brief description */}
      <div className="px-4 py-2.5">
        <p className="text-[11px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          {challenge.description}
        </p>
      </div>

      {/* Meta row */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3" style={{ background: "var(--mist)" }}>
        <div className="flex flex-wrap gap-3 text-[10px]" style={{ color: "var(--ink-soft)" }}>
          <span>
            <strong style={{ color: "var(--ink)" }}>Budget:</strong> {challenge.budget}
          </span>
          <span>
            <strong style={{ color: "var(--ink)" }}>Technology:</strong> {challenge.technology}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelect(challenge)}
            className="px-3 py-1.5 rounded border text-[11px] font-semibold transition-colors"
            style={{ borderColor: "var(--gov-blue-border)", color: "var(--gov-blue)", background: "var(--white)" }}
          >
            View Challenge
          </button>
          <button
            onClick={() => onSubmit(challenge)}
            className="px-3 py-1.5 rounded text-[11px] font-bold text-white transition-colors"
            style={{ background: "var(--gov-blue)" }}
          >
            Submit Solution
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHALLENGE DETAIL PANEL
   ═══════════════════════════════════════════════════════════════ */
function ChallengeDetail({
  challenge,
  onClose,
  onSubmit,
}: {
  challenge: HubChallenge;
  onClose: () => void;
  onSubmit: (c: HubChallenge) => void;
}) {
  return (
    <div className="rounded border bg-white divide-y" style={{ borderColor: "var(--line)" }}>
      {/* Header */}
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--saffron)" }}>
              Government Innovation Challenge
            </p>
            <p className="text-[10px] font-mono mt-0.5" style={{ color: "var(--ink-soft)" }}>
              {challenge.display_id}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#F1F5F9] text-[#8A96A8]">
            <X size={16} />
          </button>
        </div>
        <h2 className="text-lg font-black leading-snug mb-2" style={{ color: "var(--ink)" }}>
          {challenge.title}
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-[11px] mb-3" style={{ color: "var(--ink-soft)" }}>
          <span className="flex items-center gap-1"><Building2 size={11} /> {challenge.department}</span>
          <span className="flex items-center gap-1"><MapPin size={11} /> {challenge.location}</span>
          <span className="flex items-center gap-1"><Clock size={11} /> {challenge.days_remaining} days remaining</span>
          <UrgencyBadge urgency={challenge.urgency} />
        </div>
        <LifecycleStrip activeStage={challenge.stage} />
      </div>

      {/* THE PUBLIC PROBLEM */}
      <div className="px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--gov-blue)" }}>
          THE PUBLIC PROBLEM
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: "Problem", value: challenge.description },
            { label: "Context", value: challenge.context },
            { label: "Affected Area", value: challenge.affected_area },
            { label: "Current Process", value: challenge.current_process },
            { label: "Current Limitations", value: challenge.current_limitations },
            { label: "Expected Impact", value: challenge.expected_impact },
          ].map(({ label, value }) => (
            <div key={label} className="rounded border p-3" style={{ borderColor: "var(--line)", background: "var(--mist)" }}>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--ink-soft)" }}>{label}</p>
              <p className="text-[11px] leading-relaxed" style={{ color: "var(--ink)" }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* WHAT GOVERNMENT NEEDS */}
      <div className="px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--gov-blue)" }}>
          WHAT GOVERNMENT NEEDS
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--ink-soft)" }}>
              Functional Requirements
            </p>
            <ul className="space-y-1">
              {challenge.functional_requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px]" style={{ color: "var(--ink)" }}>
                  <CheckCircle2 size={11} className="mt-0.5 shrink-0" style={{ color: "var(--success)" }} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--ink-soft)" }}>
              Technical Requirements
            </p>
            <ul className="space-y-1">
              {challenge.technical_requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px]" style={{ color: "var(--ink)" }}>
                  <Target size={11} className="mt-0.5 shrink-0" style={{ color: "var(--gov-blue)" }} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* KPIs */}
        <div className="mt-3 rounded border" style={{ borderColor: "var(--line)" }}>
          <div className="px-3 py-2 border-b text-[9px] font-bold uppercase tracking-wider" style={{ borderColor: "var(--line)", background: "var(--gov-blue)", color: "white" }}>
            Key Performance Indicators
          </div>
          <div className="divide-y" style={{ borderColor: "var(--line)" }}>
            {challenge.kpis.map((kpi, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2">
                <span className="text-[11px] font-semibold" style={{ color: "var(--ink)" }}>{kpi.name}</span>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded"
                  style={{ background: "var(--gov-blue-light)", color: "var(--gov-blue)" }}
                >
                  {kpi.target}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHO CAN RESPOND + TIMELINE */}
      <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--gov-blue)" }}>
            WHO CAN RESPOND
          </p>
          <ul className="space-y-1">
            {challenge.eligible_categories.map((cat, i) => (
              <li key={i} className="flex items-center gap-2 text-[11px] rounded border px-2 py-1.5"
                style={{ borderColor: "var(--line)", background: "var(--mist)", color: "var(--ink)" }}
              >
                <ShieldCheck size={11} style={{ color: "var(--success)" }} />
                {cat}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--gov-blue)" }}>
            TIMELINE
          </p>
          <p className="text-[11px] leading-relaxed rounded border px-3 py-2"
            style={{ borderColor: "var(--line)", background: "var(--mist)", color: "var(--ink)" }}
          >
            {challenge.timeline}
          </p>

          <p className="text-[10px] font-bold uppercase tracking-wider mt-3 mb-2" style={{ color: "var(--gov-blue)" }}>
            DEPLOYMENT
          </p>
          <p className="text-[11px] leading-relaxed rounded border px-3 py-2"
            style={{ borderColor: "var(--line)", background: "var(--mist)", color: "var(--ink)" }}
          >
            {challenge.deployment}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-3 flex items-center justify-between gap-3" style={{ background: "var(--mist)" }}>
        <button onClick={onClose} className="px-3 py-1.5 rounded border text-[11px] font-semibold" style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}>
          ← Back to Challenges
        </button>
        <button
          onClick={() => onSubmit(challenge)}
          className="px-4 py-2 rounded text-[12px] font-bold text-white flex items-center gap-2"
          style={{ background: "var(--gov-blue)" }}
        >
          <Send size={13} /> Submit Solution
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SOLUTION SUBMISSION FORM
   ═══════════════════════════════════════════════════════════════ */
function SolutionSubmitForm({
  challenges,
  preselectedChallengeId,
  onSuccess,
  onCancel,
}: {
  challenges: HubChallenge[];
  preselectedChallengeId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { user } = usePraman();
  const [form, setForm] = useState({
    challenge_id: preselectedChallengeId ?? (challenges[0]?.id ?? ""),
    solution_name: "",
    company: user?.name ?? "",
    category: "",
    short_description: "",
    technical_capabilities: "",
    technology_stack: "",
    deployment_model: "",
    previous_deployments: "",
    government_experience: "",
    evidence_summary: "",
    implementation_timeline: "",
    contact_email: user?.email ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function fieldRow(label: string, key: keyof typeof form, placeholder: string, required = false, multiline = false) {
    return (
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--ink-soft)" }}>
          {label} {required && <span style={{ color: "var(--critical)" }}>*</span>}
        </label>
        {multiline ? (
          <textarea
            className="w-full rounded border px-3 py-2 text-[12px] outline-none transition-colors resize-none"
            style={{ borderColor: "var(--line)", color: "var(--ink)", background: "var(--white)", minHeight: 72 }}
            placeholder={placeholder}
            value={form[key] as string}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            onFocus={e => (e.target.style.borderColor = "var(--gov-blue)")}
            onBlur={e => (e.target.style.borderColor = "var(--line)")}
          />
        ) : (
          <input
            type="text"
            className="w-full rounded border px-3 py-2 text-[12px] outline-none transition-colors"
            style={{ borderColor: "var(--line)", color: "var(--ink)", background: "var(--white)" }}
            placeholder={placeholder}
            value={form[key] as string}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            onFocus={e => (e.target.style.borderColor = "var(--gov-blue)")}
            onBlur={e => (e.target.style.borderColor = "var(--line)")}
          />
        )}
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.solution_name.trim() || !form.company.trim() || !form.category.trim() || !form.short_description.trim() || !form.technical_capabilities.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      await api(`/innovation-hub/challenges/${form.challenge_id}/solutions`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      setSuccess(true);
      setTimeout(onSuccess, 2000);
    } catch (err: any) {
      setError(err?.message ?? "Failed to submit solution.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded border bg-white p-8 flex flex-col items-center gap-3 text-center" style={{ borderColor: "var(--line)" }}>
        <CheckCircle2 size={40} style={{ color: "var(--success)" }} />
        <p className="text-base font-bold" style={{ color: "var(--ink)" }}>Solution Submitted Successfully</p>
        <p className="text-[12px]" style={{ color: "var(--ink-soft)" }}>
          Your solution has been submitted for government review. Evidence claims will be validated through the PRAMAN evidence process.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded border bg-white divide-y" style={{ borderColor: "var(--line)" }}>
      {/* Form header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--saffron)" }}>
            Innovation Hub
          </p>
          <h3 className="text-base font-black" style={{ color: "var(--ink)" }}>Submit a Solution</h3>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--ink-soft)" }}>
            All claims are self-submitted and will be validated through the PRAMAN evidence process.
          </p>
        </div>
        <button type="button" onClick={onCancel} className="p-1 rounded hover:bg-[#F1F5F9] text-[#8A96A8]">
          <X size={16} />
        </button>
      </div>

      {/* Challenge selector */}
      <div className="px-5 py-4">
        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--ink-soft)" }}>
          Government Challenge <span style={{ color: "var(--critical)" }}>*</span>
        </label>
        <select
          className="w-full rounded border px-3 py-2 text-[12px] outline-none"
          style={{ borderColor: "var(--line)", color: "var(--ink)", background: "var(--white)" }}
          value={form.challenge_id}
          onChange={e => setForm(f => ({ ...f, challenge_id: e.target.value }))}
        >
          {challenges.map(c => (
            <option key={c.id} value={c.id}>{c.display_id} — {c.title}</option>
          ))}
        </select>
      </div>

      {/* Basic details */}
      <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <p className="col-span-full text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--gov-blue)" }}>
          Solution Identity
        </p>
        {fieldRow("Solution Name", "solution_name", "e.g. SmartRoute Vision v2.1", true)}
        {fieldRow("Company / Startup", "company", "e.g. SkylineAI Solutions", true)}
        {fieldRow("Solution Category", "category", "e.g. Computer Vision, IoT, NLP", true)}
        {fieldRow("Contact Email", "contact_email", "startup@example.com")}
      </div>

      {/* Description & capabilities */}
      <div className="px-5 py-4 grid grid-cols-1 gap-4">
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--gov-blue)" }}>
          Solution Details
        </p>
        {fieldRow("Short Description", "short_description", "One paragraph describing what your solution does and how it addresses this challenge.", true, true)}
        {fieldRow("Technical Capabilities", "technical_capabilities", "List the specific technical capabilities relevant to this challenge.", true, true)}
        {fieldRow("Technology Stack", "technology_stack", "e.g. PyTorch, OpenCV, AWS IoT, FastAPI, PostgreSQL", true)}
        {fieldRow("Deployment Model", "deployment_model", "e.g. On-premise, Cloud (AWS/Azure), Edge + Cloud hybrid", true)}
      </div>

      {/* Experience & evidence */}
      <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <p className="col-span-full text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--gov-blue)" }}>
          Experience & Evidence
        </p>
        {fieldRow("Previous Deployments", "previous_deployments", "Describe any previous deployments of this solution.", false, true)}
        {fieldRow("Government Experience", "government_experience", "Any prior government or public sector work.", false, true)}
        {fieldRow("Evidence Summary", "evidence_summary", "Summarize available evidence: pilot results, accuracy metrics, certifications.", false, true)}
        {fieldRow("Implementation Timeline", "implementation_timeline", "Estimated timeline for deployment in this context.", false)}
      </div>

      {/* Evidence disclaimer */}
      <div className="px-5 py-3">
        <div className="rounded border p-3 flex items-start gap-2" style={{ background: "var(--warning-light)", borderColor: "var(--warning-border)" }}>
          <Info size={13} className="shrink-0 mt-0.5" style={{ color: "var(--warning-amber)" }} />
          <p className="text-[11px]" style={{ color: "var(--ink)" }}>
            <strong>Evidence Note:</strong> All claims in this submission are self-submitted and will be independently validated through the PRAMAN Evidence Engine before being used in government evaluation. Unverified claims will be clearly marked.
          </p>
        </div>
      </div>

      {error && <div className="px-5 py-3"><AlertBanner type="error" message={error} /></div>}

      {/* Actions */}
      <div className="px-5 py-3 flex items-center justify-end gap-3" style={{ background: "var(--mist)" }}>
        <button type="button" onClick={onCancel} className="px-3 py-1.5 rounded border text-[11px] font-semibold" style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}>
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded text-[12px] font-bold text-white flex items-center gap-2 disabled:opacity-50"
          style={{ background: "var(--gov-blue)" }}
        >
          {submitting ? <><RefreshCw size={13} className="animate-spin" /> Submitting…</> : <><Send size={13} /> Submit Solution</>}
        </button>
      </div>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GOVERNMENT REVIEW QUEUE
   ═══════════════════════════════════════════════════════════════ */
function ReviewQueue({ isOfficer }: { isOfficer: boolean }) {
  const [queue, setQueue] = useState<HubReviewQueueItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionResult, setActionResult] = useState<Record<string, string>>({});

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api<{ items: HubReviewQueueItem[]; total: number }>("/innovation-hub/review-queue");
      setQueue(data.items ?? []);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load review queue.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchQueue(); }, [fetchQueue]);

  async function handleShortlist(solutionId: string) {
    try {
      await api(`/innovation-hub/solutions/${solutionId}/shortlist`, {
        method: "POST",
        body: JSON.stringify({ reason: "Meets challenge requirements based on initial review." }),
      });
      setActionResult(r => ({ ...r, [solutionId]: "shortlisted" }));
      fetchQueue();
    } catch (err: any) {
      setError(err?.message ?? "Failed to shortlist.");
    }
  }

  async function handleMoveToValidation(solutionId: string) {
    try {
      await api(`/innovation-hub/solutions/${solutionId}/move-to-validation`, {
        method: "POST",
        body: JSON.stringify({ reason: "Solution shortlisted and approved for PRAMAN validation pipeline.", link_to_existing_case: true }),
      });
      setActionResult(r => ({ ...r, [solutionId]: "validation" }));
      fetchQueue();
    } catch (err: any) {
      setError(err?.message ?? "Failed to move to validation.");
    }
  }

  if (!isOfficer) {
    return (
      <div className="rounded border bg-white p-6" style={{ borderColor: "var(--line)" }}>
        <Empty text="Government-only: The review queue is visible to Government officers and evaluators only." />
      </div>
    );
  }

  return (
    <div className="rounded border bg-white divide-y" style={{ borderColor: "var(--line)" }}>
      <div className="px-4 py-3 flex items-center justify-between" style={{ background: "var(--gov-blue)" }}>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-white">Government Review Queue</p>
          <p className="text-[10px] text-white/60 mt-0.5">Innovation Hub submissions awaiting government evaluation</p>
        </div>
        <button onClick={fetchQueue} className="p-1.5 rounded hover:bg-white/10 text-white" title="Refresh">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {error && <div className="px-4 py-3"><AlertBanner type="error" message={error} /></div>}

      {queue.length === 0 ? (
        <div className="px-4 py-8">
          <Empty text="No submissions yet. Startup solutions will appear here once submitted. Encourage innovators to submit via the Innovation Hub." />
        </div>
      ) : (
        <>
          {/* Column headers */}
          <div className="grid grid-cols-6 gap-3 px-4 py-2 text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-soft)", background: "var(--mist)" }}>
            <span className="col-span-2">Solution / Company</span>
            <span>Challenge</span>
            <span>Evidence</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--line)" }}>
            {queue.map(item => {
              const result = actionResult[item.solution_id];
              return (
                <div key={item.solution_id} className="grid grid-cols-6 gap-3 px-4 py-3 items-start">
                  <div className="col-span-2">
                    <p className="text-[12px] font-bold" style={{ color: "var(--ink)" }}>{item.solution_name}</p>
                    <p className="text-[10px]" style={{ color: "var(--ink-soft)" }}>{item.company}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--ink-muted)" }}>by {item.submitted_by}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold" style={{ color: "var(--gov-blue)" }}>{item.challenge_display_id}</p>
                    <p className="text-[10px] leading-tight" style={{ color: "var(--ink-soft)" }}>{item.challenge_title.substring(0, 40)}…</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded border" style={{ background: "var(--mist)", borderColor: "var(--line)", color: "var(--ink-soft)" }}>
                      {item.evidence_confidence}
                    </span>
                  </div>
                  <div>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded"
                      style={{
                        background: item.review_status === "Shortlisted" ? "var(--success-light)"
                          : item.review_status === "Validation Candidate" ? "var(--gov-blue-light)"
                          : "var(--mist)",
                        color: item.review_status === "Shortlisted" ? "var(--success)"
                          : item.review_status === "Validation Candidate" ? "var(--gov-blue)"
                          : "var(--ink-soft)",
                      }}
                    >
                      {item.review_status}
                    </span>
                    {item.praman_case_id && (
                      <Link href="/requirements" className="block text-[10px] mt-1 hover:underline" style={{ color: "var(--gov-blue)" }}>
                        PRAMAN Case #{item.praman_case_id} →
                      </Link>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    {result === "validation" ? (
                      <Link
                        href="/requirements"
                        className="text-[10px] font-bold px-2 py-1 rounded text-center"
                        style={{ background: "var(--gov-blue)", color: "white" }}
                      >
                        → Open PRAMAN Case
                      </Link>
                    ) : result === "shortlisted" ? (
                      <button
                        onClick={() => handleMoveToValidation(item.solution_id)}
                        className="text-[10px] font-bold px-2 py-1 rounded text-white text-center"
                        style={{ background: "var(--gov-blue)" }}
                      >
                        Move to Validation
                      </button>
                    ) : item.review_status === "Validation Candidate" ? (
                      <Link
                        href="/requirements"
                        className="text-[10px] font-bold px-2 py-1 rounded text-center"
                        style={{ background: "var(--gov-blue)", color: "white" }}
                      >
                        → Open PRAMAN Case
                      </Link>
                    ) : item.review_status === "Shortlisted" ? (
                      <button
                        onClick={() => handleMoveToValidation(item.solution_id)}
                        className="text-[10px] font-bold px-2 py-1 rounded text-white text-center"
                        style={{ background: "var(--gov-blue)" }}
                      >
                        Move to Validation
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleShortlist(item.solution_id)}
                          className="text-[10px] font-semibold px-2 py-1 rounded border text-center"
                          style={{ borderColor: "var(--gov-blue-border)", color: "var(--gov-blue)", background: "var(--white)" }}
                        >
                          Shortlist
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* AI Governance Note */}
      <div className="px-4 py-3" style={{ background: "var(--mist)" }}>
        <div className="flex items-start gap-2 text-[11px]" style={{ color: "var(--ink-soft)" }}>
          <Sparkles size={12} className="shrink-0 mt-0.5" style={{ color: "var(--gov-blue)" }} />
          <span>
            <strong style={{ color: "var(--ink)" }}>PRAMAN AI provides decision support — not procurement decisions.</strong>{" "}
            Government officers retain final authority on all shortlisting and validation decisions. No automatic selection or award occurs.
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TARGETED DISCOVERY PANEL (reuses existing matching engine)
   ═══════════════════════════════════════════════════════════════ */
function TargetedDiscovery() {
  return (
    <div className="rounded border bg-white divide-y" style={{ borderColor: "var(--line)" }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: "var(--line)", background: "var(--gov-blue)" }}>
        <p className="text-[10px] font-bold uppercase tracking-wider text-white">Targeted Discovery</p>
        <p className="text-[10px] text-white/60 mt-0.5">Search the existing startup ecosystem for relevant capabilities</p>
      </div>
      <div className="px-4 py-5">
        <div className="flex items-start gap-3 p-3 rounded border" style={{ background: "var(--gov-blue-light)", borderColor: "var(--gov-blue-border)" }}>
          <Sparkles size={16} className="shrink-0 mt-0.5" style={{ color: "var(--gov-blue)" }} />
          <div>
            <p className="text-[12px] font-bold mb-1" style={{ color: "var(--gov-blue)" }}>PRAMAN AI Matching Engine</p>
            <p className="text-[11px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
              For structured startup discovery against an approved government requirement, use the full PRAMAN matching engine.
              It applies BM25 lexical ranking, dense vector similarity, Reciprocal Rank Fusion (RRF), and TOPSIS multi-criteria scoring
              across registered startups.
            </p>
            <Link
              href="/matching"
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded text-[11px] font-bold text-white"
              style={{ background: "var(--gov-blue)" }}
            >
              Open Startup Discovery & Matching <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Why this solution explanation pattern */}
        <div className="mt-4 rounded border divide-y" style={{ borderColor: "var(--line)" }}>
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider" style={{ background: "var(--mist)", color: "var(--ink-soft)" }}>
            AI Explanation Format
          </div>
          <div className="px-3 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--saffron)" }}>
              WHY THIS SOLUTION?
            </p>
            <p className="text-[12px] font-bold mb-1" style={{ color: "var(--ink)" }}>91% requirement match</p>
            <p className="text-[11px] mb-2" style={{ color: "var(--ink-soft)" }}>because:</p>
            <ul className="space-y-1">
              {["Real-time prediction capability", "15-minute forecasting horizon", "Government API integration experience", "Relevant deployment evidence in Maharashtra"].map((r, i) => (
                <li key={i} className="flex items-center gap-2 text-[11px]" style={{ color: "var(--ink)" }}>
                  <CheckCircle2 size={11} style={{ color: "var(--success)" }} />
                  {r}
                </li>
              ))}
            </ul>
            <p className="text-[10px] mt-2 italic" style={{ color: "var(--ink-muted)" }}>
              PRAMAN AI provides decision support only. Government retains final authority.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN INNOVATION HUB PAGE
   ═══════════════════════════════════════════════════════════════ */
type PageMode = "challenges" | "detail" | "submit" | "review";

export default function InnovationHubPage() {
  const { user } = usePraman();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [challenges, setChallenges] = useState<HubChallenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [filterDomain, setFilterDomain] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterUrgency, setFilterUrgency] = useState("");
  const [discoveryMode, setDiscoveryMode] = useState<"open" | "targeted">("open");
  const [selectedChallenge, setSelectedChallenge] = useState<HubChallenge | null>(null);
  const [submitChallenge, setSubmitChallenge] = useState<HubChallenge | null>(null);

  const isOfficer = ["officer", "evaluator", "msins_admin", "auditor", "ciso"].includes(user?.role ?? "");

  // Determine mode from URL query param
  const urlMode = searchParams.get("mode");
  const [pageMode, setPageMode] = useState<PageMode>(
    urlMode === "review" ? "review" : urlMode === "submit" ? "submit" : "challenges"
  );

  useEffect(() => {
    if (urlMode === "review") setPageMode("review");
    else if (urlMode === "submit") setPageMode("submit");
  }, [urlMode]);

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (searchQ) params.set("q", searchQ);
      if (filterDomain) params.set("domain", filterDomain);
      if (filterLocation) params.set("location", filterLocation);
      if (filterUrgency) params.set("urgency", filterUrgency);
      const data = await api<{ items: HubChallenge[]; total: number }>(`/innovation-hub/challenges?${params.toString()}`);
      setChallenges(data.items ?? []);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load challenges.");
    } finally {
      setLoading(false);
    }
  }, [searchQ, filterDomain, filterLocation, filterUrgency]);

  useEffect(() => { fetchChallenges(); }, [fetchChallenges]);

  function handleSelectChallenge(c: HubChallenge) {
    setSelectedChallenge(c);
    setPageMode("detail");
  }

  function handleSubmitForChallenge(c: HubChallenge) {
    setSubmitChallenge(c);
    setPageMode("submit");
  }

  function handleSubmitSuccess() {
    setPageMode("challenges");
    setSubmitChallenge(null);
    fetchChallenges();
  }

  // TABS
  const tabs: Array<{ key: PageMode; label: string; icon: React.ReactNode; govOnly?: boolean }> = [
    { key: "challenges", label: "Government Challenges", icon: <FileText size={13} /> },
    { key: "submit", label: "Submit a Solution", icon: <Send size={13} /> },
    { key: "review", label: "Review Queue", icon: <ClipboardCheck size={13} />, govOnly: true },
  ];

  const DOMAIN_OPTIONS = ["Urban Infrastructure", "Water Management", "Citizen Services", "Transport", "Healthcare"];
  const LOCATION_OPTIONS = ["Pune", "Nashik", "Nagpur", "Mumbai", "Aurangabad"];
  const URGENCY_OPTIONS = ["High", "Critical", "Medium", "Low"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Page Header */}
      <GovPageHeader
        eyebrow="Innovation Hub"
        title="Government Innovation Hub"
        subtitle="Where government problems meet the innovation ecosystem. Discover public challenges, explore solution opportunities, and contribute ideas that can move from discovery to evidence-backed government pilots."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setSubmitChallenge(null); setPageMode("submit"); }}
              className="px-3 py-2 rounded text-[12px] font-bold text-white flex items-center gap-2"
              style={{ background: "var(--gov-blue)" }}
            >
              <Plus size={13} /> Submit an Innovation
            </button>
            <button
              onClick={() => setPageMode("challenges")}
              className="px-3 py-2 rounded border text-[12px] font-semibold flex items-center gap-2"
              style={{ borderColor: "var(--gov-blue-border)", color: "var(--gov-blue)", background: "var(--white)" }}
            >
              <Lightbulb size={13} /> Explore Problems
            </button>
          </div>
        }
      />

      {/* Lifecycle flow explainer */}
      <div className="rounded border bg-white px-4 py-3" style={{ borderColor: "var(--line)" }}>
        <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--ink-soft)" }}>
          Innovation Hub → PRAMAN Lifecycle
        </p>
        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
          {["Government Problem", "Open Discovery", "Startup / Innovator", "Solution Submission", "Evaluation", "Validation", "PRAMAN Case", "PRAMAN 9-Stage Workflow"].map((step, i, arr) => (
            <div key={step} className="flex items-center gap-1.5">
              <span
                className="px-2 py-1 rounded font-semibold"
                style={{
                  background: step === "PRAMAN Case" || step === "PRAMAN 9-Stage Workflow" ? "var(--gov-blue-light)" : "var(--mist)",
                  color: step === "PRAMAN Case" || step === "PRAMAN 9-Stage Workflow" ? "var(--gov-blue)" : "var(--ink-soft)",
                  border: "1px solid var(--line)",
                }}
              >
                {step}
              </span>
              {i < arr.length - 1 && <ArrowRight size={11} style={{ color: "var(--ink-muted)" }} />}
            </div>
          ))}
        </div>
        <p className="text-[10px] mt-2" style={{ color: "var(--ink-muted)" }}>
          Innovation Hub is a discovery layer — it feeds qualified opportunities INTO the existing PRAMAN procurement lifecycle. Innovation Hub does not directly award procurement.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-0 border-b overflow-x-auto" style={{ borderColor: "var(--line)" }}>
        {tabs.filter(t => !t.govOnly || isOfficer).map(tab => (
          <button
            key={tab.key}
            onClick={() => {
              setPageMode(tab.key);
              if (tab.key !== "detail") setSelectedChallenge(null);
            }}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
              pageMode === tab.key
                ? "border-[#0B2A5B] text-[#0B2A5B] bg-[#EEF5FC] font-bold"
                : "border-transparent text-[#5E6B7E] hover:text-[#0B2A5B] hover:border-[#D9E1EA]"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: CHALLENGES ── */}
      {pageMode === "challenges" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Discovery mode toggle */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>Discovery Mode:</span>
            {(["open", "targeted"] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setDiscoveryMode(mode)}
                className={`px-3 py-1 rounded border text-[11px] font-semibold transition-all ${
                  discoveryMode === mode
                    ? "bg-[#0B2A5B] text-white border-[#0B2A5B]"
                    : "bg-white text-[#5E6B7E] border-[#D9E1EA] hover:border-[#0B2A5B]"
                }`}
              >
                {mode === "open" ? "Open Innovation" : "Targeted Discovery"}
              </button>
            ))}
          </div>

          {discoveryMode === "targeted" ? (
            <TargetedDiscovery />
          ) : (
            <>
              {/* Search + Filters */}
              <div className="rounded border bg-white px-4 py-3 flex flex-wrap items-center gap-3" style={{ borderColor: "var(--line)" }}>
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8A96A8]" />
                  <input
                    type="text"
                    placeholder="Search challenges by title, domain, technology…"
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded border text-[12px] outline-none"
                    style={{ borderColor: "var(--line)", color: "var(--ink)", background: "var(--mist)" }}
                  />
                </div>
                <select
                  value={filterDomain}
                  onChange={e => setFilterDomain(e.target.value)}
                  className="rounded border px-2.5 py-1.5 text-[12px] outline-none"
                  style={{ borderColor: "var(--line)", color: "var(--ink)", background: "var(--white)" }}
                >
                  <option value="">All Domains</option>
                  {DOMAIN_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select
                  value={filterLocation}
                  onChange={e => setFilterLocation(e.target.value)}
                  className="rounded border px-2.5 py-1.5 text-[12px] outline-none"
                  style={{ borderColor: "var(--line)", color: "var(--ink)", background: "var(--white)" }}
                >
                  <option value="">All Locations</option>
                  {LOCATION_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <select
                  value={filterUrgency}
                  onChange={e => setFilterUrgency(e.target.value)}
                  className="rounded border px-2.5 py-1.5 text-[12px] outline-none"
                  style={{ borderColor: "var(--line)", color: "var(--ink)", background: "var(--white)" }}
                >
                  <option value="">All Urgency</option>
                  {URGENCY_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                {(filterDomain || filterLocation || filterUrgency || searchQ) && (
                  <button
                    onClick={() => { setFilterDomain(""); setFilterLocation(""); setFilterUrgency(""); setSearchQ(""); }}
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded border"
                    style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}
                  >
                    <X size={11} /> Clear
                  </button>
                )}
              </div>

              {error && <AlertBanner type="error" message={error} />}

              {loading && (
                <div className="flex items-center gap-2 p-3 rounded border text-[12px]" style={{ background: "var(--gov-blue-light)", borderColor: "var(--gov-blue-border)", color: "var(--gov-blue)" }}>
                  <RefreshCw size={13} className="animate-spin" /> Loading challenges…
                </div>
              )}

              {!loading && challenges.length === 0 && (
                <div className="rounded border bg-white p-8" style={{ borderColor: "var(--line)" }}>
                  <Empty text="No challenges found. Try clearing your filters or search query." />
                </div>
              )}

              {challenges.map(c => (
                <ChallengeCard
                  key={c.id}
                  challenge={c}
                  onSelect={handleSelectChallenge}
                  onSubmit={handleSubmitForChallenge}
                />
              ))}
            </>
          )}
        </div>
      )}

      {/* ── TAB: CHALLENGE DETAIL ── */}
      {pageMode === "detail" && selectedChallenge && (
        <ChallengeDetail
          challenge={selectedChallenge}
          onClose={() => setPageMode("challenges")}
          onSubmit={handleSubmitForChallenge}
        />
      )}

      {/* ── TAB: SUBMIT SOLUTION ── */}
      {pageMode === "submit" && (
        <SolutionSubmitForm
          challenges={challenges}
          preselectedChallengeId={submitChallenge?.id}
          onSuccess={handleSubmitSuccess}
          onCancel={() => setPageMode("challenges")}
        />
      )}

      {/* ── TAB: REVIEW QUEUE (gov only) ── */}
      {pageMode === "review" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <ReviewQueue isOfficer={isOfficer} />

          {/* Institutional Memory connection */}
          <div className="rounded border bg-white divide-y" style={{ borderColor: "var(--line)" }}>
            <div className="px-4 py-2.5 border-b" style={{ borderColor: "var(--line)", background: "var(--mist)" }}>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>
                Institutional Memory Connection
              </p>
            </div>
            <div className="px-4 py-4 flex items-start gap-3">
              <BookOpen size={20} className="shrink-0 mt-0.5" style={{ color: "var(--gov-blue)" }} />
              <div>
                <p className="text-[12px] font-bold mb-1" style={{ color: "var(--ink)" }}>
                  Validated solutions feed into PRAMAN Institutional Memory
                </p>
                <p className="text-[11px] leading-relaxed mb-3" style={{ color: "var(--ink-soft)" }}>
                  When an Innovation Hub solution completes a PRAMAN pilot and is validated, its outcomes are automatically captured in Institutional Memory — enabling future government challenges to reuse validated solutions without repeating discovery.
                </p>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  {["Innovation Hub", "→ PRAMAN Case", "→ Pilot", "→ Outcome", "→ Institutional Memory", "→ Future Reuse"].map((step, i) => (
                    <span key={i} className="px-2 py-1 rounded font-semibold"
                      style={{ background: "var(--gov-blue-light)", color: "var(--gov-blue)", border: "1px solid var(--gov-blue-border)" }}
                    >
                      {step}
                    </span>
                  ))}
                </div>
                <Link
                  href="/memory"
                  className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-bold hover:underline"
                  style={{ color: "var(--gov-blue)" }}
                >
                  <GitBranch size={12} /> Open Institutional Memory Bank →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
