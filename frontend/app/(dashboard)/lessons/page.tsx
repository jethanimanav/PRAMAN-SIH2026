"use client";

import { usePraman } from "@/lib/PramanContext";
import { AlertBanner, Empty, Panel, Action } from "@/components/ui";
import {
  BookOpen,
  Lightbulb,
  AlertTriangle,
  ShieldAlert,
  GitBranch,
  RefreshCw,
  MessageSquarePlus,
  CheckCircle2,
  Clock,
} from "lucide-react";

import type { LessonLearned } from "@/types/praman";

export default function LessonsPage() {
  const { lessons, error } = usePraman();

  if (!lessons || lessons.length === 0) {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Post-Procurement</p>
          <h1 className="mt-1 text-2xl font-black text-slate-900">Lessons Learned</h1>
        </div>
        <Panel title="Project Retrospective">
          <Empty text="No lessons learned have been recorded yet." action="Record a Lesson" />
        </Panel>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Technical": return <Lightbulb size={18} className="text-blue-500" />;
      case "Integration": return <GitBranch size={18} className="text-purple-500" />;
      case "Operational": return <RefreshCw size={18} className="text-amber-500" />;
      case "Governance": return <ShieldAlert size={18} className="text-red-500" />;
      default: return <BookOpen size={18} className="text-slate-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technical": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Integration": return "bg-purple-50 text-purple-700 border-purple-200";
      case "Operational": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Governance": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#168675]">Post-Procurement</p>
          <h1 className="mt-1 text-2xl font-black text-slate-900">Lessons Learned</h1>
          <p className="mt-1 text-sm text-slate-500">Structured retrospective data used to train the PRAMAN matching AI.</p>
        </div>
        <div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-[#168675] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#126b5d]">
            <MessageSquarePlus size={16} /> Record Lesson
          </button>
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      <div className="grid gap-5">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">{getCategoryIcon(lesson.category)}</div>
                <div>
                  <span className={`inline-flex rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border mb-2 ${getCategoryColor(lesson.category)}`}>
                    {lesson.category}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">{lesson.lesson}</h2>
                </div>
              </div>
            </div>

            <div className="p-5 grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 size={14} className="text-emerald-500" /> What Worked
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed bg-emerald-50/50 p-3 rounded border border-emerald-100">{lesson.what_worked}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
                    <AlertTriangle size={14} className="text-red-500" /> What Failed
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed bg-red-50/50 p-3 rounded border border-red-100">{lesson.what_failed}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Systemic Impact</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded">
                      <Clock size={14} className="mt-0.5 shrink-0 text-amber-500" />
                      <span className="font-medium text-slate-700 mr-1">Delay Cause:</span> {lesson.delay_cause || "None"}
                    </div>
                    <div className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded">
                      <GitBranch size={14} className="mt-0.5 shrink-0 text-purple-500" />
                      <span className="font-medium text-slate-700 mr-1">Dependency:</span> {lesson.dependency_issue || "None"}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#168675] mb-2">Actionable Recommendation</h3>
                  <div className="rounded-lg border-2 border-[#168675] bg-teal-50/30 p-4">
                    <p className="text-sm font-bold text-slate-900">{lesson.recommendation}</p>
                    <div className="mt-3 flex gap-2">
                      <span className="inline-flex rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                        AI Training Data Point
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
