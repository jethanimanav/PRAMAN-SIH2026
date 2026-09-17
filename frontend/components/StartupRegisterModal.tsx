"use client";

import React, { useState } from "react";
import { X, Building2, User, Mail, Globe, Layers, FileText, CheckCircle2, ArrowRight } from "lucide-react";

interface StartupRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRedirect: () => void;
}

export function StartupRegisterModal({ isOpen, onClose, onSuccessRedirect }: StartupRegisterModalProps) {
  const [formData, setFormData] = useState({
    startupName: "",
    dpiitNumber: "",
    founderName: "",
    officialEmail: "",
    website: "",
    sector: "Urban Infrastructure & Mobility",
    stage: "Pilot Ready / TRL-7",
    solutionTitle: "",
    ventureDescription: "",
    ipStatus: "Patented / Patent Pending",
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSuccessRedirect();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-[620px] bg-white rounded-xl shadow-2xl border border-[#DCE3EC] overflow-hidden my-8 animate-fade-in">
        {/* Header */}
        <div className="bg-[#0A2540] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#16834B] flex items-center justify-center text-xl shadow-inner">
              🚀
            </div>
            <div>
              <h3 className="text-base font-black text-white leading-tight">
                Register New Startup
              </h3>
              <p className="text-xs text-white/80 mt-0.5">
                PRAMAN Innovation Procurement Onboarding · Government of Maharashtra
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#DCFCE7] text-[#16834B] mx-auto flex items-center justify-center">
              <CheckCircle2 size={36} />
            </div>
            <h4 className="text-lg font-bold text-[#0A2540]">
              Startup Registered Successfully!
            </h4>
            <p className="text-xs text-[#475569] max-w-md mx-auto">
              Your profile has been created in PRAMAN. Redirecting you to the dedicated Startup Portal...
            </p>
            <div className="w-8 h-8 border-3 border-[#16834B] border-t-transparent rounded-full animate-spin mx-auto mt-4" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Startup Legal Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#334155] mb-1">
                  Startup Entity Name *
                </label>
                <div className="relative">
                  <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="text"
                    required
                    placeholder="Skyline AI Technologies"
                    value={formData.startupName}
                    onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
                    className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded focus:bg-white focus:border-[#1D4ED8] outline-none text-[#0F172A] font-medium"
                  />
                </div>
              </div>

              {/* DPIIT Recognition Number */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#334155] mb-1">
                  DPIIT / Startup India Reg No. *
                </label>
                <input
                  type="text"
                  required
                  placeholder="DIPP-104928"
                  value={formData.dpiitNumber}
                  onChange={(e) => setFormData({ ...formData, dpiitNumber: e.target.value })}
                  className="w-full h-9 px-3 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded focus:bg-white focus:border-[#1D4ED8] outline-none text-[#0F172A] font-medium"
                />
              </div>

              {/* Founder / Authorized Lead */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#334155] mb-1">
                  Founder / Technical Lead *
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="text"
                    required
                    placeholder="Vikramaditya Patil"
                    value={formData.founderName}
                    onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
                    className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded focus:bg-white focus:border-[#1D4ED8] outline-none text-[#0F172A] font-medium"
                  />
                </div>
              </div>

              {/* Official Email */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#334155] mb-1">
                  Official Email *
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="email"
                    required
                    placeholder="contact@skyline.ai"
                    value={formData.officialEmail}
                    onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                    className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded focus:bg-white focus:border-[#1D4ED8] outline-none text-[#0F172A] font-medium"
                  />
                </div>
              </div>

              {/* Sector / Domain */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#334155] mb-1">
                  Technology Domain *
                </label>
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="w-full h-9 px-3 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded focus:bg-white focus:border-[#1D4ED8] outline-none text-[#0F172A] font-medium"
                >
                  <option>Urban Infrastructure & Mobility</option>
                  <option>Water Resources & Telemetry</option>
                  <option>Clean Energy & Smart Grid</option>
                  <option>Healthcare & Telemedicine</option>
                  <option>Agritech & Crop Intelligence</option>
                  <option>Citizen Services & GovTech AI</option>
                </select>
              </div>

              {/* Readiness / TRL Stage */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#334155] mb-1">
                  TRL Maturity Level *
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  className="w-full h-9 px-3 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded focus:bg-white focus:border-[#1D4ED8] outline-none text-[#0F172A] font-medium"
                >
                  <option>TRL-6: Prototype Validated in Relevant Env</option>
                  <option>TRL-7: Demonstrated in Operational Env (Pilot Ready)</option>
                  <option>TRL-8: System Complete and Qualified</option>
                  <option>TRL-9: Proven in Commercial / Gov Field</option>
                </select>
              </div>
            </div>

            {/* Solution Headline */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#334155] mb-1">
                Solution Title / Core Innovation *
              </label>
              <input
                type="text"
                required
                placeholder="Edge-AI Road Surface Condition Telemetry & Real-Time Distress Mapping"
                value={formData.solutionTitle}
                onChange={(e) => setFormData({ ...formData, solutionTitle: e.target.value })}
                className="w-full h-9 px-3 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded focus:bg-white focus:border-[#1D4ED8] outline-none text-[#0F172A] font-medium"
              />
            </div>

            {/* Venture Description */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#334155] mb-1">
                Explain Your Venture & Gov Use-Case Compatibility *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Explain what your startup builds, hardware/software telemetry architecture, deployment readiness, and how you intend to pilot with Maharashtra public departments..."
                value={formData.ventureDescription}
                onChange={(e) => setFormData({ ...formData, ventureDescription: e.target.value })}
                className="w-full p-3 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded focus:bg-white focus:border-[#1D4ED8] outline-none text-[#0F172A] font-normal leading-relaxed"
              />
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#16834B] hover:bg-[#136C3E] text-white text-xs font-bold px-5 py-2.5 rounded shadow-sm transition-all flex items-center gap-2"
              >
                <span>Submit Startup Registration</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
