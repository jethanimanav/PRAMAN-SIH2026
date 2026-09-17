"use client";

import { useState } from "react";
import { usePraman } from "@/lib/PramanContext";
import {
  GovPageHeader, Action, AlertBanner, KpiCard,
  ProcurementCaseCard, FilterToolbar, Pagination,
  OfficialRecordHeader, RecordMeta, Panel, StatusBadge
} from "@/components/ui";
import { Badge } from "@/components/Badge";
import {
  Play, RotateCcw, Sparkles, CheckCircle2, Target, Users, TestTube2,
  TrendingUp, FileText, ListChecks, ShieldCheck, Package, Circle,
  ChevronRight, ArrowRight, AlertTriangle, Database, Activity,
  Gauge, GitBranch, LineChart, Award, Compass, ShieldAlert, ArrowUpRight,
  Layers, Clock, Filter, Grid, List, Table as TableIcon, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ─── 9-Stage PRAMAN Core Workflow ─── */
const WORKFLOW_STAGES = [
  { id: 0, label: "Problem Intake", href: "/problems" },
  { id: 1, label: "Requirement Structuring", href: "/requirements" },
  { id: 2, label: "Eligibility", href: "/matching" },
  { id: 3, label: "Startup Matching", href: "/matching" },
  { id: 4, label: "Explainable Ranking", href: "/matching" },
  { id: 5, label: "Sandbox Pilot", href: "/pilots" },
  { id: 6, label: "Evidence & KPI", href: "/evidence" },
  { id: 7, label: "Procurement Readiness", href: "/readiness" },
  { id: 8, label: "Decision / Handoff", href: "/decisions" },
];

export default function DashboardPage() {
  const router = useRouter();
  const {
    problem, requirement, recommendations, pilot, readiness, decision, handoff,
    health, loading, error, currentStage, audit,
    launchDemo, structure, approve, matchStartups, shortlist, fastForward, calculateReadiness,
    implementation, monitoring, riskRadar,
  } = usePraman();

  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const recentAudit = audit.slice(-5).reverse();
  const criticalRisks = (riskRadar || []).filter((r: any) => r.level === "High").length;

  /* Dynamic Next Best Step Decision Action */
  const actionRequired = !problem
    ? { title: "Load Hero Scenario to Begin Procurement", desc: "Initialize the Pune Road Damage AI procurement workflow.", cta: "Load Hero Scenario", action: launchDemo, href: null }
    : !requirement
    ? { title: "Structure Requirements for PRB-MH-2026-1042", desc: "Convert problem statement into measurable technical KPIs using PRAMAN AI engine.", cta: "Structure Requirements", action: structure, href: "/requirements" }
    : requirement.status !== "Approved"
    ? { title: "Approve Structured Requirements", desc: "Review and approve functional and non-functional requirement thresholds.", cta: "Approve Requirements", action: approve, href: "/requirements" }
    : !recommendations.length
    ? { title: "Run Eligibility & Startup Matching", desc: "Apply RRF + TOPSIS criteria algorithms against evaluated startups.", cta: "Run Startup Matching", action: matchStartups, href: "/matching" }
    : !pilot
    ? { title: "Shortlist Top Startup for Sandbox Pilot", desc: "Assign shortlisted startup to a 90-day controlled sandbox pilot environment.", cta: "Shortlist & Launch Pilot", action: shortlist, href: "/matching" }
    : !pilot.success
    ? { title: "Fast-Forward Sandbox Pilot Simulation", desc: "Simulate 90 days of telemetry collection and evidence generation.", cta: "Fast-Forward Pilot (90 Days)", action: fastForward, href: "/pilots" }
    : !readiness
    ? { title: "Calculate Procurement Readiness Score", desc: "Synthesize KPI evidence, technical performance, and risk audit.", cta: "Calculate Readiness Score", action: calculateReadiness, href: "/readiness" }
    : !decision
    ? { title: "Record Nodal Procurement Decision", desc: "Provide final human-in-the-loop justification and sign off.", cta: "Record Final Decision", href: "/decisions" }
    : !handoff
    ? { title: "Generate Handoff Procurement Pack", desc: "Compile complete verified audit trail and handoff documentation.", cta: "Generate Handoff Pack", href: "/handoff" }
    : { title: "Review Scale & Institutional Reuse", desc: "Examine multi-departmental deployment opportunities.", cta: "Explore Scale & Reuse", href: "/scale" };

  return (
    <div className="space-y-6 min-w-0">
      {/* ── Page Header ── */}
      <GovPageHeader
        eyebrow="Government Procurement Portal · Dashboard"
        title="Procurement Intelligence & Case Directory"
        subtitle="Monitor active challenges, structured requirements, evaluated solutions, sandbox pilots, and evidence-based readiness."
        actions={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#0B2A5B] bg-[#EEF5FC] px-2.5 py-1 rounded border border-[#D9E1EA]">
              <ShieldCheck size={13} />
              <span>{health?.status ?? "SYSTEM OPERATIONAL"}</span>
            </span>
            <Action onClick={launchDemo} label="Load Hero Scenario" icon={<Play size={13} />} size="sm" />
            <Action onClick={launchDemo} label="Reset" icon={<RotateCcw size={13} />} variant="ghost" size="sm" />
          </div>
        }
      />

      {/* ── Alerts & Loading ── */}
      {error && <AlertBanner type="error" message={error} />}
      {loading && (
        <div className="flex items-center gap-3 p-3 bg-[#EEF5FC] border border-[#D9E1EA] border-l-4 border-l-[#0B2A5B] rounded text-xs font-semibold text-[#0B2A5B]">
          <Sparkles size={16} className="animate-spin text-[#E07B1F]" />
          <span>{loading}…</span>
        </div>
      )}

      {/* ── 4 KPI Metrics Grid in One Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
        <KpiCard
          label="Active Procurement Cases"
          value={problem ? "1 Case Active" : "—"}
          icon={<FileText size={16} />}
          trend={problem ? "PRB-MH-2026-1042" : undefined}
          trendPositive={true}
          sublabel="PWD Maharashtra"
          onClick={() => router.push("/problems")}
        />
        <KpiCard
          label="Requirements Structured"
          value={requirement ? (requirement.status === "Approved" ? "1 Approved" : "1 In Draft") : "—"}
          icon={<ListChecks size={16} />}
          trend={requirement ? "REQ-1042-V1" : undefined}
          trendPositive={requirement?.status === "Approved"}
          sublabel="90-Day Timeline Target"
          onClick={() => router.push("/requirements")}
        />
        <KpiCard
          label="Matched Solutions"
          value={recommendations.length > 0 ? `${recommendations.length} Evaluated` : "—"}
          icon={<Target size={16} />}
          trend={recommendations.length > 0 ? "Top: SkylineAI (93/100)" : undefined}
          trendPositive={true}
          sublabel="RRF + TOPSIS Ranking"
          onClick={() => router.push("/matching")}
        />
        <KpiCard
          label="Procurement Readiness"
          value={readiness ? `${readiness.score}/100` : pilot?.success ? "Ready to Score" : "—"}
          icon={<Award size={16} />}
          trend={readiness ? readiness.band : undefined}
          trendPositive={readiness?.score ? readiness.score >= 80 : false}
          sublabel="Evidence-Backed Assessment"
          onClick={() => router.push("/readiness")}
        />
      </div>

      {/* ── Interactive 9-Stage PRAMAN Workflow Tracker ── */}
      <div className="gov-card p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#D9E1EA]">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-[#0B2A5B]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
              PRAMAN 9-Stage Innovation Procurement Workflow
            </h2>
          </div>
          <span className="text-[11px] text-[#E07B1F] font-bold">
            Current Stage: {WORKFLOW_STAGES[currentStage]?.label ?? "Problem Intake"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
          {WORKFLOW_STAGES.map((stage, idx) => {
            const isCompleted = currentStage > idx;
            const isCurrent = currentStage === idx;

            return (
              <Link
                key={stage.id}
                href={stage.href}
                className={`flex flex-col items-center p-2.5 rounded text-center transition-all border group cursor-pointer ${
                  isCompleted
                    ? "bg-[#DCFCE7]/60 border-[#86EFAC] text-[#16834B] hover:bg-[#DCFCE7]"
                    : isCurrent
                    ? "bg-[#EEF5FC] border-[#0B2A5B] text-[#0B2A5B] shadow-sm ring-1 ring-[#0B2A5B]/30"
                    : "bg-[#F5F7FA] border-[#D9E1EA] text-[#5E6B7E] hover:text-[#0B2A5B] hover:bg-[#EEF5FC] hover:border-[#0B2A5B]"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black mb-1.5 transition-transform group-hover:scale-105 ${
                    isCompleted
                      ? "bg-[#16834B] text-white"
                      : isCurrent
                      ? "bg-[#0B2A5B] text-white ring-2 ring-[#0B2A5B]/20"
                      : "bg-[#E2E8F0] text-[#5E6B7E]"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={12} /> : idx + 1}
                </div>
                <span className="text-[10px] font-semibold leading-tight line-clamp-2">
                  {stage.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Action Required Callout Banner ── */}
      <div className="border border-[#D9E1EA] border-l-4 border-l-[#0B2A5B] rounded bg-white p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded bg-[#EEF5FC] border border-[#D9E1EA] flex items-center justify-center text-[#0B2A5B] shrink-0 mt-0.5">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2A5B]">
                Immediate Nodal Action Required
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E07B1F] animate-pulse" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#172033]">
              {actionRequired.title}
            </h3>
            <p className="text-xs text-[#5E6B7E] mt-0.5">
              {actionRequired.desc}
            </p>
          </div>
        </div>

        <div className="shrink-0 w-full sm:w-auto">
          {actionRequired.action ? (
            <button
              onClick={actionRequired.action}
              className="w-full sm:w-auto bg-[#0B2A5B] hover:bg-[#1236B8] text-white text-xs font-bold py-2.5 px-4 rounded flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <span>{actionRequired.cta}</span>
              <ArrowRight size={14} />
            </button>
          ) : actionRequired.href ? (
            <Link
              href={actionRequired.href}
              className="w-full sm:w-auto bg-[#0B2A5B] hover:bg-[#1236B8] text-white text-xs font-bold py-2.5 px-4 rounded flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>{actionRequired.cta}</span>
              <ArrowRight size={14} />
            </Link>
          ) : null}
        </div>
      </div>

      {/* ── Procurement Intelligence Section (Active Cases Listings) ── */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-base font-bold text-[#0B2A5B] tracking-tight">
              Active Procurement Cases & Listings
            </h2>
            <p className="text-xs text-[#5E6B7E]">
              Structure requirements, evaluate solutions, and prepare evidence-based procurement decisions.
            </p>
          </div>
          <Link
            href="/problems/intake"
            className="text-xs font-bold text-[#0B2A5B] hover:underline flex items-center gap-1"
          >
            <span>+ Submit New Challenge</span>
          </Link>
        </div>

        {/* Filter Toolbar */}
        <FilterToolbar
          selectedStage={selectedStage}
          onSelectStage={setSelectedStage}
          selectedDepartment={selectedDepartment}
          onSelectDepartment={setSelectedDepartment}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Case Cards Grid (2-Column Responsive Reference Layout) */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-w-0">
            {/* Case 1: Active Hero Scenario */}
            <ProcurementCaseCard
              status={pilot?.success ? "EVALUATION COMPLETE" : pilot ? "PILOT ACTIVE" : requirement?.status === "Approved" ? "APPROVED FOR MATCHING" : requirement ? "REQUIREMENT STRUCTURED" : "OPEN CASE"}
              statusTone={pilot?.success ? "green" : pilot ? "amber" : "blue"}
              valueMetric="₹50L – ₹1Cr"
              title={problem?.title ?? "AI Road Damage Detection for Public Transport Routes"}
              description={problem?.narrative ?? "Public Works Department requires an edge-AI computer vision telemetry system mounted on municipal transport buses to autonomously identify and geotag potholes and road distress."}
              department={problem?.department ?? "Public Works Department, Maharashtra"}
              referenceId={problem?.id ? `PRB-MH-2026-${problem.id}` : "PRB-MH-2026-1042"}
              location="Pune Municipal Bus Fleet (PMPML)"
              deadline="90 Days Controlled Pilot Scope"
              stage={WORKFLOW_STAGES[currentStage]?.label ?? "Problem Intake"}
              category="Urban Infrastructure · Computer Vision Telemetry"
              estimatedBudget="₹75,00,000 (Approved Allocation)"
              primaryActionLabel={currentStage >= 6 ? "View Evidence Locker" : currentStage >= 3 ? "View Pilot Workspace" : "Execute Next Step"}
              onPrimaryAction={() => {
                if (currentStage >= 7) router.push("/readiness");
                else if (currentStage >= 5) router.push("/pilots");
                else if (currentStage >= 3) router.push("/matching");
                else router.push("/requirements");
              }}
              secondaryActionLabel="Evidence Locker"
              onSecondaryAction={() => router.push("/evidence")}
            />

            {/* Case 2: Standard Government Challenge Listing */}
            <ProcurementCaseCard
              status="OPEN FOR STRUCTURING"
              statusTone="blue"
              valueMetric="₹1.2Cr – ₹2.5Cr"
              title="IoT Water Pipeline Leakage & Contamination Telemetry"
              description="Water Supply & Sanitation Department seeks an acoustic sensor & flow meter mesh network to identify underground distribution leaks and microbial contamination in secondary pipelines."
              department="Water Supply & Sanitation Department"
              referenceId="PRB-MH-2026-1043"
              location="Nashik & Chhatrapati Sambhajinagar"
              deadline="120 Days Pilot Scope"
              stage="Problem Intake"
              category="Sensors & Water Infrastructure"
              estimatedBudget="₹1,50,00,000 (Estimated Budget)"
              primaryActionLabel="View Challenge Details"
              onPrimaryAction={() => router.push("/problems")}
              secondaryActionLabel="Institutional Memory"
              onSecondaryAction={() => router.push("/memory")}
            />
          </div>
        ) : (
          /* Table View Alternative */
          <div className="gov-card overflow-hidden">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Reference ID</th>
                  <th>Challenge Title</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Budget</th>
                  <th>Current Stage</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="record-id font-bold">PRB-MH-2026-1042</td>
                  <td>
                    <p className="font-bold text-[#0B2A5B] text-xs">AI Road Damage Detection</p>
                    <p className="text-[10px] text-[#5E6B7E]">Public Transport Telemetry</p>
                  </td>
                  <td className="text-xs">PWD Maharashtra</td>
                  <td className="text-xs">Pune</td>
                  <td className="text-xs font-semibold">₹50L – ₹1Cr</td>
                  <td>
                    <StatusBadge status={WORKFLOW_STAGES[currentStage]?.label ?? "Intake"} />
                  </td>
                  <td>
                    <button
                      onClick={() => router.push("/requirements")}
                      className="text-xs font-bold text-[#0B2A5B] hover:underline"
                    >
                      Open Case →
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="record-id font-bold">PRB-MH-2026-1043</td>
                  <td>
                    <p className="font-bold text-[#0B2A5B] text-xs">IoT Water Pipeline Leakage</p>
                    <p className="text-[10px] text-[#5E6B7E]">Acoustic sensor mesh</p>
                  </td>
                  <td className="text-xs">Water Sanitation</td>
                  <td className="text-xs">Nashik</td>
                  <td className="text-xs font-semibold">₹1.2Cr – ₹2.5Cr</td>
                  <td>
                    <StatusBadge status="Draft" />
                  </td>
                  <td>
                    <button
                      onClick={() => router.push("/problems")}
                      className="text-xs font-bold text-[#0B2A5B] hover:underline"
                    >
                      Open Case →
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <Pagination totalItems={2} pageSize={10} currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>

      {/* ── Operational Intelligence & Department Activity (4 Live Widgets) ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#D9E1EA] pb-2">
          <div>
            <h3 className="text-sm font-black text-[#172033] uppercase tracking-wider">
              Department Operations & Active Workflow Intelligence
            </h3>
            <p className="text-[11px] text-[#5E6B7E]">
              Real-time monitoring of department innovation challenges, approval gates, and system activity.
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EEF5FC] text-[#0B2A5B] border border-[#D9E1EA]">
            OPERATIONAL FEED
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
          {/* Card A: Active Application Trackers */}
          <Panel title="Active Application Trackers" icon={<Layers size={15} />}>
            <div className="divide-y divide-[#D9E1EA] text-xs">
              {[
                { id: "PRB-MH-2026-1042", title: "AI Road Damage Detection", dept: "Pune PWD", stage: "Sandbox Pilot", status: "Running", updated: "2h ago", tone: "blue" as const },
                { id: "PRB-MH-2026-1043", title: "Predictive Water Leak Detection", dept: "Nashik MJP", stage: "Requirements Structuring", status: "Review", updated: "4h ago", tone: "amber" as const },
                { id: "PRB-MH-2026-1044", title: "Grievance Classification AI", dept: "Nagpur NMC", stage: "Startup Matching", status: "Matched", updated: "1d ago", tone: "signal" as const },
                { id: "PRB-MH-2026-1045", title: "Drone Farm Inspection Telemetry", dept: "Aurangabad Ag", stage: "Problem Intake", status: "Submitted", updated: "2d ago", tone: "neutral" as const },
              ].map((c) => (
                <div key={c.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#0B2A5B]">{c.id}</span>
                      <span className="text-[10px] text-[#5E6B7E] truncate">· {c.dept}</span>
                    </div>
                    <p className="font-semibold text-[#172033] truncate mt-0.5">{c.title}</p>
                    <p className="text-[10px] text-[#8A96A8] mt-0.5">Stage: {c.stage}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge tone={c.tone}>{c.status}</Badge>
                    <p className="text-[10px] text-[#8A96A8] mt-1 font-mono">{c.updated}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Card B: Real-Time Analytics Summary */}
          <Panel title="Real-Time Analytics Summary" icon={<Gauge size={15} />}>
            <div className="grid grid-cols-2 gap-3 py-1">
              <div className="p-3 rounded bg-[#F8FAFC] border border-[#D9E1EA]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5E6B7E]">Active Cases</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-[#0B2A5B]">14</span>
                  <span className="text-[10px] font-semibold text-[#16834B]">↑ 2 this week</span>
                </div>
                <p className="text-[10px] text-[#8A96A8] mt-1">Across 6 state departments</p>
              </div>

              <div className="p-3 rounded bg-[#F8FAFC] border border-[#D9E1EA]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5E6B7E]">Pending Reviews</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-[#B45309]">5</span>
                  <span className="text-[10px] font-semibold text-[#D92D20]">Action required</span>
                </div>
                <p className="text-[10px] text-[#8A96A8] mt-1">3 requirements, 2 pilots</p>
              </div>

              <div className="p-3 rounded bg-[#F8FAFC] border border-[#D9E1EA]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5E6B7E]">Pilots Running</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-[#1D4ED8]">8</span>
                  <span className="text-[10px] font-semibold text-[#1D4ED8]">90-day sandbox</span>
                </div>
                <p className="text-[10px] text-[#8A96A8] mt-1">Pune, Nashik, Nagpur</p>
              </div>

              <div className="p-3 rounded bg-[#F8FAFC] border border-[#D9E1EA]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5E6B7E]">Ready for Decision</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-[#16834B]">3</span>
                  <span className="text-[10px] font-semibold text-[#16834B]">Score ≥ 90%</span>
                </div>
                <p className="text-[10px] text-[#8A96A8] mt-1">Handoff ready for GeM/CPPP</p>
              </div>
            </div>
          </Panel>

          {/* Card C: Pending Approvals */}
          <Panel title="Pending Approvals & Gateway Reviews" icon={<ListChecks size={15} />}>
            <div className="divide-y divide-[#D9E1EA] text-xs">
              {[
                { caseId: "PRB-MH-2026-1042", task: "Functional Requirements Sign-off", stage: "Stage 2: Requirements", assigned: "Nodal Officer", priority: "HIGH" },
                { caseId: "PILOT-SKYLINE-01", task: "90-Day Telemetry Verification", stage: "Stage 6: Evidence & KPI", assigned: "Technical Evaluator", priority: "MEDIUM" },
                { caseId: "AUD-SEC-2026-08", task: "Data Privacy Exemption Approval", stage: "Stage 7: Readiness", assigned: "Governance Auditor", priority: "LOW" },
              ].map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#0B2A5B]">{item.caseId}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        item.priority === "HIGH" ? "bg-red-100 text-red-700" :
                        item.priority === "MEDIUM" ? "bg-amber-100 text-amber-700" :
                        "bg-slate-100 text-slate-700"
                      }`}>{item.priority}</span>
                    </div>
                    <p className="font-semibold text-[#172033] truncate mt-0.5">{item.task}</p>
                    <p className="text-[10px] text-[#5E6B7E] mt-0.5">{item.stage} · {item.assigned}</p>
                  </div>
                  <button
                    onClick={() => router.push("/requirements")}
                    className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded bg-[#EEF5FC] text-[#0B2A5B] hover:bg-[#0B2A5B] hover:text-white transition-colors border border-[#D9E1EA]"
                  >
                    Review →
                  </button>
                </div>
              ))}
            </div>
          </Panel>

          {/* Card D: Recent System Notifications */}
          <Panel title="Recent System Notifications" icon={<Clock size={15} />}>
            <div className="divide-y divide-[#D9E1EA] text-xs">
              {[
                { title: "Requirement Approved", desc: "Structured specifications for #1042 approved by Officer Ananya Deshmukh.", time: "15m ago", iconTone: "text-[#16834B] bg-[#DCFCE7]" },
                { title: "New Solution Submitted", desc: "SkylineAI submitted proposal for Pune Transit Computer Vision Challenge.", time: "1h ago", iconTone: "text-[#0B2A5B] bg-[#EEF5FC]" },
                { title: "Evidence Locker Updated", desc: "Inspection video hashes verified and committed to cryptographic log.", time: "3h ago", iconTone: "text-[#B45309] bg-[#FEF3C7]" },
                { title: "Pilot Milestone Completed", desc: "Mid-term operational telemetry metrics confirmed at 94.2% accuracy.", time: "5h ago", iconTone: "text-[#16834B] bg-[#DCFCE7]" },
              ].map((notif, idx) => (
                <div key={idx} className="py-2.5 flex items-start gap-2.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${notif.iconTone}`}>
                    <CheckCircle2 size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-[#172033] truncate">{notif.title}</p>
                      <span className="text-[10px] text-[#8A96A8] font-mono shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-[#5E6B7E] leading-snug mt-0.5">{notif.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Lower Intelligence Modules Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
        {/* Risk Radar / Procurement Governance Assessment */}
        <Panel title="Procurement Risk Radar" icon={<ShieldAlert size={15} />}>
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#D9E1EA] text-xs">
              <span className="text-[#5E6B7E] font-medium">Critical Risk Items:</span>
              <span className="font-bold text-[#D92D20] bg-[#FEE2E2] px-2 py-0.5 rounded border border-[#FCA5A5]">
                {criticalRisks} High Priority Risk
              </span>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded bg-[#FEF3C7]/60 border border-[#FDE68A] text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#B45309]">Data Residency & Privacy Compliance</span>
                  <Badge tone="amber">MEDIUM</Badge>
                </div>
                <p className="text-[11px] text-[#5E6B7E] mt-1 leading-tight">
                  Public transport camera feeds require localized state storage and PII anonymization.
                </p>
              </div>

              <div className="p-2.5 rounded bg-[#F5F7FA] border border-[#D9E1EA] text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#172033]">Hardware Mounting & Deprecations</span>
                  <Badge tone="neutral">LOW</Badge>
                </div>
                <p className="text-[11px] text-[#5E6B7E] mt-1 leading-tight">
                  Standardized bracket installation verified across 200 PMPML buses.
                </p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <Link href="/risk" className="text-xs font-bold text-[#0B2A5B] hover:underline inline-flex items-center gap-1">
                <span>View Full Risk Matrix</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        </Panel>

        {/* Append-Only Governance Audit Trail */}
        <Panel title="Immutable Audit Trail Feed" icon={<Activity size={15} />}>
          <div className="space-y-2.5">
            {recentAudit.length > 0 ? (
              <div className="divide-y divide-[#D9E1EA] max-h-[220px] overflow-y-auto">
                {recentAudit.map((event) => (
                  <div key={event.id} className="py-2 flex items-start gap-2.5 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#0B2A5B] mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-[#172033] truncate">{event.action}</p>
                        <span className="text-[10px] text-[#8A96A8] shrink-0 font-mono">
                          {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5E6B7E] truncate">{event.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#8A96A8]">
                <Activity size={24} className="mx-auto mb-2 opacity-40 text-[#0B2A5B]" />
                <p>No audit events recorded yet.</p>
                <p className="text-[10px]">Load the hero scenario to initialize governance events.</p>
              </div>
            )}

            <div className="pt-2 border-t border-[#D9E1EA] text-right">
              <Link href="/audit" className="text-xs font-bold text-[#0B2A5B] hover:underline inline-flex items-center gap-1">
                <span>View Full Audit Log ({audit.length})</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
