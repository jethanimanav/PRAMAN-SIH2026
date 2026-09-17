"use client";

import { useState } from "react";
import { Panel, Action, AlertBanner } from "@/components/ui";
import { ClipboardList, Save, Send, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

const DEPARTMENTS = [
  "Urban Development / PWD",
  "Health & Family Welfare",
  "Agriculture & Farmers Welfare",
  "Transport",
  "Education",
  "Smart Cities Mission",
  "Water & Sanitation",
  "Environment & Climate",
];

const DOMAINS = [
  "Urban Infrastructure",
  "Healthcare",
  "Agriculture",
  "Transportation",
  "Education",
  "Environment",
  "Public Safety",
  "Governance",
];

export default function IntakePage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    department: "",
    location: "",
    domain: "",
    narrative: "",
    budget: "",
    timeline: "90",
    kpi: "",
    constraint: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit() {
    if (!form.title || !form.department || !form.narrative) return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      await api("/api/v1/problems", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setSubmitted(true);
      setTimeout(() => router.push("/problems"), 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit problem");
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <Send size={28} className="text-emerald-600" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Problem Submitted</h2>
        <p className="text-sm text-slate-500 mt-2">Redirecting to Problems list…</p>
      </div>
    );
  }

  const labelClass = "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5";
  const inputClass = "w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-[#168675] focus:bg-white focus:ring-2 focus:ring-[#168675]/20 transition";

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Problem to Pilot</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Problem Intake</h1>
        <p className="mt-1 text-sm text-slate-500">Submit a new government challenge to the PRAMAN system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,320px)] gap-5 min-w-0">
        <div className="space-y-5">
          <Panel title="Problem Details" icon={<ClipboardList size={15} />}>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Problem Title <span className="text-red-400">*</span></label>
                <input className={inputClass} value={form.title} onChange={update("title")} placeholder="e.g., AI Road Damage Detection for Public Transport Routes" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Department <span className="text-red-400">*</span></label>
                  <select className={inputClass} value={form.department} onChange={update("department")}>
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Location / Region</label>
                  <input className={inputClass} value={form.location} onChange={update("location")} placeholder="e.g., Pune Municipal" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Problem Narrative <span className="text-red-400">*</span></label>
                <textarea
                  className={`${inputClass} min-h-[100px]`}
                  value={form.narrative}
                  onChange={update("narrative")}
                  placeholder="Describe the problem, current gap, and expected outcome…"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Domain</label>
                  <select className={inputClass} value={form.domain} onChange={update("domain")}>
                    <option value="">Select Domain</option>
                    {DOMAINS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Budget Range</label>
                  <input className={inputClass} value={form.budget} onChange={update("budget")} placeholder="e.g., ₹50L – ₹1Cr" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Pilot Timeline (days)</label>
                  <input type="number" className={inputClass} value={form.timeline} onChange={update("timeline")} min="30" max="365" />
                </div>
                <div>
                  <label className={labelClass}>Core KPI</label>
                  <input className={inputClass} value={form.kpi} onChange={update("kpi")} placeholder="e.g., Detection recall ≥ 90%" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Key Constraint</label>
                <input className={inputClass} value={form.constraint} onChange={update("constraint")} placeholder="e.g., Must work at night with poor lighting" />
              </div>
            </div>
          </Panel>

          <div className="flex flex-wrap gap-3">
            <Action onClick={() => {
              const saved = { ...form, savedAt: new Date().toISOString() };
              localStorage.setItem("praman_draft", JSON.stringify(saved));
              alert("Draft saved to browser storage.");
            }} label="Save Draft" icon={<Save size={14} />} muted />
            <Action onClick={handleSubmit} label="Submit Problem" icon={<Send size={14} />} disabled={!form.title || !form.department || !form.narrative} />
          </div>
        </div>

        <div className="space-y-5">
          <Panel title="Instructions">
            <ul className="space-y-3">
              {[
                "Fill in the problem title and department — these are required.",
                "Write a clear problem narrative describing the gap, context, and expected outcome.",
                "Set a realistic pilot timeline (90 days recommended for SIH).",
                "Define a measurable Core KPI — this drives the matching engine.",
                "PRAMAN AI will structure requirements from your narrative after submission.",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">{i + 1}</span>
                  {tip}
                </li>
              ))}
            </ul>
          </Panel>

          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-4 text-sm text-blue-700">
            <strong>Demo Note:</strong> In this SIH prototype, the hero problem (AI Road Damage Detection #1042) is pre-loaded. Submitting this form demonstrates the intake flow.
          </div>
        </div>
      </div>
    </div>
  );
}
