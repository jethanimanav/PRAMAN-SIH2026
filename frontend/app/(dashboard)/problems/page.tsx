"use client";

import { usePraman } from "@/lib/PramanContext";
import { GovPageHeader, Panel, Empty, ProcurementCaseCard, FilterToolbar, Pagination } from "@/components/ui";
import { Badge } from "@/components/Badge";
import { FileText, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProblemsPage() {
  const router = useRouter();
  const { problem, currentStage } = usePraman();
  const [search, setSearch] = useState("");
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("grid");

  const problems = problem
    ? [
        {
          id: problem.id || "1042",
          title: problem.title || "AI Road Damage Detection for Public Transport Routes",
          department: problem.department || "Public Works Department, Maharashtra",
          location: problem.location || "Pune Municipal Bus Fleet",
          narrative: problem.narrative || "Public Works Department requires an edge-AI computer vision telemetry system mounted on municipal transport buses to autonomously identify and geotag potholes and road distress.",
          budget: problem.budget || "₹50L – ₹1Cr",
          timeline: "90 Days Pilot",
          domain: problem.domain || "Urban Infrastructure",
          status: "APPROVED FOR PILOT",
          statusTone: "green" as const,
        },
        {
          id: "1043",
          title: "IoT Water Pipeline Leakage & Contamination Telemetry",
          department: "Water Supply & Sanitation Department",
          location: "Nashik & Chhatrapati Sambhajinagar",
          narrative: "Water Supply & Sanitation Department seeks an acoustic sensor & flow meter mesh network to identify underground distribution leaks and microbial contamination in secondary pipelines.",
          budget: "₹1.2Cr – ₹2.5Cr",
          timeline: "120 Days Pilot",
          domain: "Sensors & Water Sanitation",
          status: "OPEN CHALLENGE",
          statusTone: "blue" as const,
        },
      ]
    : [];

  const filtered = problems.filter(p =>
    (!search || p.title.toLowerCase().includes(search.toLowerCase()) || p.department.toLowerCase().includes(search.toLowerCase())) &&
    (selectedDepartment === "All Departments" || p.department.includes(selectedDepartment))
  );

  return (
    <div className="space-y-6 min-w-0">
      <GovPageHeader
        eyebrow="Government Problem to Pilot"
        title="Active Government Challenges & Listings"
        subtitle="Explore official government problem statements open for startup innovation, structured requirement drafting, and pilot validation."
        actions={
          <Link
            href="/problems/intake"
            className="bg-[#00008B] hover:bg-[#000070] text-white text-xs font-bold py-2 px-3.5 rounded flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus size={14} />
            <span>Submit New Problem</span>
          </Link>
        }
      />

      {/* Filter and View Switcher */}
      <FilterToolbar
        selectedStage={selectedStage}
        onSelectStage={setSelectedStage}
        selectedDepartment={selectedDepartment}
        onSelectDepartment={setSelectedDepartment}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {filtered.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-w-0">
            {filtered.map((p) => (
              <ProcurementCaseCard
                key={p.id}
                status={p.status}
                statusTone={p.statusTone}
                valueMetric={p.budget}
                title={p.title}
                description={p.narrative}
                department={p.department}
                referenceId={`PRB-MH-2026-${p.id}`}
                location={p.location}
                deadline={p.timeline}
                stage={p.id === "1042" ? "Stage 4 · Pilot & Evidence" : "Stage 0 · Problem Intake"}
                category={p.domain}
                estimatedBudget={p.budget}
                primaryActionLabel={p.id === "1042" ? "View Active Workflow" : "View Challenge"}
                onPrimaryAction={() => {
                  if (p.id === "1042") router.push("/requirements");
                }}
                secondaryActionLabel="Evidence Locker"
                onSecondaryAction={() => router.push("/evidence")}
              />
            ))}
          </div>
        ) : (
          <div className="gov-card overflow-hidden">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Reference ID</th>
                  <th>Challenge Title</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Budget Range</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="record-id font-bold">PRB-MH-2026-{p.id}</td>
                    <td>
                      <p className="font-bold text-[#00008B] text-xs">{p.title}</p>
                      <p className="text-[10px] text-[#475569]">{p.domain}</p>
                    </td>
                    <td className="text-xs">{p.department}</td>
                    <td className="text-xs">{p.location}</td>
                    <td className="text-xs font-semibold">{p.budget}</td>
                    <td>
                      <Badge tone={p.id === "1042" ? "success" : "neutral"}>{p.status}</Badge>
                    </td>
                    <td>
                      <button
                        onClick={() => router.push(p.id === "1042" ? "/requirements" : "/problems")}
                        className="text-xs font-bold text-[#00008B] hover:underline"
                      >
                        View Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <Panel title="No Government Challenges Found" icon={<FileText size={14} />}>
          <Empty
            text={search ? `No problems matching "${search}".` : "Load the Hero Scenario from the Dashboard to see Problem #1042, or create a new challenge using the intake form."}
            action={search ? "Clear search" : "Go to Dashboard → Load Hero Scenario"}
          />
        </Panel>
      )}

      {filtered.length > 0 && (
        <Pagination totalItems={filtered.length} pageSize={10} currentPage={1} />
      )}
    </div>
  );
}
