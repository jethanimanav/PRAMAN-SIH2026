"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search, Lightbulb, Users, TrendingUp, Play, ArrowRight,
  Phone, Mail, MapPin, ChevronRight, X, Menu, ShieldCheck,
  CheckCircle2, Lock, KeyRound, AlertTriangle, Building2,
  FileText, ExternalLink, Sparkles, Award
} from "lucide-react";
import { usePraman } from "@/lib/PramanContext";
import { useI18n } from "@/lib/i18n";
import {
  AshokaEmblem,
  MaharashtraSeal,
  MaharashtraHeroMap,
  SkylineBackdrop,
  MantralayaMapCard
} from "@/components/MaharashtraArtwork";
import { StartupRegisterModal } from "@/components/StartupRegisterModal";

export default function HomePage() {
  const router = useRouter();
  const {
    user, email, setEmail, password, setPassword,
    mfa, setMfa, loading, login, error, authInitialized
  } = usePraman();

  const { language, setLanguage, t, isHindi } = useI18n();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [startupRegisterModalOpen, setStartupRegisterModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  // "startup" | "government" | null — which role-selection card is open
  const [roleModalType, setRoleModalType] = useState<"startup" | "government" | null>(null);

  const DEMO_USERS = [
    {
      title: "Nodal Officer",
      role: "Procurement Decision Maker",
      email: "officer@praman.local",
      badgeColor: "#0B2A5B",
      bg: "#EEF5FC",
    },
    {
      title: "Technical Evaluator",
      role: "Pilot & KPI Verifier",
      email: "evaluator@praman.local",
      badgeColor: "#B45309",
      bg: "#FEF3C7",
    },
    {
      title: "Startup Innovator",
      role: "Solution & Telemetry Provider",
      email: "startup@praman.local",
      badgeColor: "#16834B",
      bg: "#DCFCE7",
    },
    {
      title: "Governance Auditor",
      role: "Compliance & Audit Replay",
      email: "auditor@praman.local",
      badgeColor: "#6D28D9",
      bg: "#EDE9FE",
    },
  ];

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login();
    if (email.includes("startup")) {
      router.push("/dashboard");
    } else {
      router.push("/dashboard");
    }
  }

  function handleQuickFill(demoEmail: string) {
    setEmail(demoEmail);
    setPassword("demo123");
    setMfa("123456");
  }

  // Dedicated direct Startup login action
  function handleStartupLoginDirect() {
    setEmail("startup@praman.local");
    setPassword("demo123");
    setMfa("123456");
    setRoleModalType(null);
    setLoginModalOpen(true);
  }

  // Dedicated direct Government login action
  function handleGovLoginDirect() {
    setEmail("officer@praman.local");
    setPassword("demo123");
    setMfa("123456");
    setRoleModalType(null);
    setLoginModalOpen(true);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#172033] font-sans antialiased">
      {/* ═══════════════════════════════════════════════════════════════
          1. HEADER (Pixel-Accurate Government Innovation Portal)
          ═══════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-xs">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 h-[96px] flex items-center justify-between gap-4">
          {/* Left: PRAMAN Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center group py-1">
              <Image
                src="/images/praman-logo-clean.png"
                alt="PRAMAN – Public Procurement Intelligence Platform"
                width={480}
                height={120}
                className="h-[80px] sm:h-[95px] w-auto object-contain transition-transform group-hover:scale-[1.02]"
                priority
              />
            </Link>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-bold text-[#1E293B]">
            <Link
              href="/"
              onClick={() => setActiveTab("home")}
              className={`py-1.5 transition-colors relative ${
                activeTab === "home" ? "text-[#1E40AF]" : "hover:text-[#1E40AF]"
              }`}
            >
              {t("home")}
              {activeTab === "home" && (
                <span className="absolute bottom-[-14px] left-0 right-0 h-[2.5px] bg-[#1E40AF] rounded-full" />
              )}
            </Link>
            <a href="#what-is-praman" className="py-1.5 hover:text-[#1E40AF] transition-colors">
              {t("about")}
            </a>
            <button
              onClick={() => setRoleModalType("startup")}
              className="py-1.5 hover:text-[#1E40AF] transition-colors cursor-pointer"
            >
              {t("forStartups")}
            </button>
            <button
              onClick={() => setRoleModalType("government")}
              className="py-1.5 hover:text-[#1E40AF] transition-colors cursor-pointer"
            >
              {t("forGovernment")}
            </button>
            <Link href="/transparency" className="py-1.5 hover:text-[#1E40AF] transition-colors">
              {t("resources")}
            </Link>
            <a href="#contact" className="py-1.5 hover:text-[#1E40AF] transition-colors">
              {t("contactUs")}
            </a>
          </nav>

          {/* Right: Functional Hindi Language Toggle + Auth Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Interactive Hindi Language Toggle */}
            <button
              onClick={() => setLanguage(isHindi ? "en" : "hi")}
              className={`text-xs font-bold px-3 py-1.5 rounded border transition-all cursor-pointer flex items-center gap-1.5 ${
                isHindi
                  ? "bg-[#1E40AF] text-white border-[#1E40AF] shadow-xs"
                  : "bg-white text-[#0B2A5B] border-[#CBD5E1] hover:bg-[#EEF5FC] hover:border-[#1E40AF]"
              }`}
              title={isHindi ? "Switch to English" : "हिंदी में बदलें"}
              aria-label="Language Toggle"
            >
              <span className={!isHindi ? "font-black" : "opacity-75"}>EN</span>
              <span className="opacity-40">|</span>
              <span className={isHindi ? "font-black" : "opacity-75"}>हिंदी</span>
            </button>

            {user ? (
              <Link
                href="/dashboard"
                className="bg-[#0A2540] hover:bg-[#061727] text-white text-[13px] font-bold px-5 py-2 rounded shadow-xs transition-all flex items-center gap-2"
              >
                <span>{user.role === "startup" ? t("startupPortal") : t("governmentPortal")}</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="bg-white hover:bg-slate-50 text-[#0A2540] border border-[#CBD5E1] text-[13px] font-bold px-5 py-2 rounded transition-colors shadow-2xs cursor-pointer"
                >
                  {t("login")}
                </button>
                <button
                  onClick={() => setStartupRegisterModalOpen(true)}
                  className="bg-[#0A2540] hover:bg-[#061727] text-white text-[13px] font-bold px-6 py-2 rounded transition-colors shadow-xs cursor-pointer"
                >
                  {t("register")}
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle & Mobile Language Switch */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setLanguage(isHindi ? "en" : "hi")}
              className="text-xs font-bold px-2 py-1 rounded border border-[#CBD5E1] bg-white text-[#0B2A5B]"
            >
              {isHindi ? "EN" : "हिंदी"}
            </button>
            <button
              onClick={() => setLoginModalOpen(true)}
              className="bg-[#0A2540] text-white text-xs font-bold px-3 py-1.5 rounded"
            >
              {t("login")}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#0A2540] rounded hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-[#E2E8F0] bg-white px-4 py-4 space-y-3 shadow-lg">
            <Link href="/" className="block text-sm font-bold text-[#1E40AF]">{t("home")}</Link>
            <a href="#what-is-praman" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#1E293B]">{t("about")}</a>
            <button onClick={() => { setRoleModalType("startup"); setMobileMenuOpen(false); }} className="block w-full text-left text-sm font-semibold text-[#1E293B] hover:text-[#1E40AF]">{t("forStartups")}</button>
            <button onClick={() => { setRoleModalType("government"); setMobileMenuOpen(false); }} className="block w-full text-left text-sm font-semibold text-[#1E293B] hover:text-[#1E40AF]">{t("forGovernment")}</button>
            <Link href="/transparency" className="block text-sm font-semibold text-[#1E293B]">{t("resources")}</Link>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#1E293B]">{t("contactUs")}</a>
            <div className="pt-2 border-t border-[#E2E8F0]">
              <button
                onClick={() => {
                  setLanguage(isHindi ? "en" : "hi");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-xs font-bold text-[#1E40AF] py-1"
              >
                {isHindi ? "Switch to English (English)" : "भाषा बदलें: हिंदी (Hindi)"}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          2. HERO SECTION (Maharashtra Map Cutout & Cityscape)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-b from-[#F0F6FC] via-[#F8FAFC] to-white pt-10 sm:pt-14 pb-14 sm:pb-16 overflow-hidden border-b border-[#E2E8F0]/70">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
            {/* Left Content (approx 52%) */}
            <div className="lg:col-span-6 space-y-5 text-left pr-0 lg:pr-4">
              {/* Eyebrow */}
              <div className="inline-flex items-center">
                <span className="text-xs sm:text-sm font-extrabold text-[#2563EB] uppercase tracking-[0.22em]">
                  {t("heroEyebrow")}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-[1.1]">
                <span className="text-[#0A2540] block">{t("heroHeadline1")}</span>
                <span className="text-[#1D4ED8] block mt-1">{t("heroHeadline2")}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-lg font-normal">
                {t("heroSubtitle")}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => setRoleModalType("startup")}
                  className="bg-[#0A2540] hover:bg-[#061727] text-white font-bold text-sm px-6 py-3 rounded shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{t("exploreStartupPortal")}</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById("what-is-praman");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-white hover:bg-slate-50 text-[#0A2540] border border-[#CBD5E1] font-bold text-sm px-6 py-3 rounded transition-colors flex items-center gap-2.5 shadow-2xs cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center text-[10px]">
                    ▶
                  </span>
                  <span>{t("howItWorks")}</span>
                </button>
              </div>
            </div>

            {/* Right Visual Composition (approx 48%) - Map Cutout + Typography alongside */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-[620px] flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
                {/* Vector Map of Maharashtra */}
                <div className="shrink-0 flex items-center justify-center">
                  <Image
                    src="/images/maharashtra-hero-map.png"
                    alt="Maharashtra Innovation Hub"
                    width={480}
                    height={400}
                    className="w-full max-w-[290px] sm:max-w-[340px] md:max-w-[360px] h-auto object-contain drop-shadow-md"
                    priority
                  />
                </div>

                {/* Typography positioned neatly to the RIGHT SIDE of the Maharashtra Map */}
                <div className="flex flex-col justify-center space-y-4 select-none shrink-0 text-center md:text-left">
                  {/* Marathi Section: Exactly "महाराष्ट्र सशक्त भविष्याकडे  " */}
                  <div className="space-y-1">
                    <p className="text-xl sm:text-2xl font-black text-[#0A2540] tracking-tight leading-snug">
                      महाराष्ट्र सशक्त भविष्याकडे  
                    </p>
                    <p className="text-xs sm:text-sm font-extrabold text-[#1D4ED8]">
                      महाराष्ट्र सक्षमतेकडून भविष्याकडे
                    </p>
                    <div className="mt-2 flex items-center justify-center md:justify-start gap-1.5">
                      <span className="w-9 h-[3px] bg-[#F59E0B] rounded-full" />
                      <span className="w-9 h-[3px] bg-[#16834B] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Silhouette outline across bottom */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none text-[#2563EB]/15">
          <SkylineBackdrop className="w-full h-12 opacity-20" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. WHAT IS PRAMAN? SECTION (Clean, 3-Column matching image)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="what-is-praman" className="bg-white py-12 sm:py-16 border-b border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Core Narrative (approx 45%) */}
            <div className="lg:col-span-6 space-y-3.5 pr-0 lg:pr-6">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A2540] tracking-tight">
                {t("whatIsPraman")}
              </h2>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed font-normal">
                {t("pramanDescription")}
              </p>
              <div className="pt-1">
                <Link
                  href="/transparency"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1D4ED8] hover:text-[#0A2540] transition-colors"
                >
                  <span>{t("learnMore")}</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Vertical Divider (Desktop) */}
            <div className="hidden lg:block lg:col-span-1 border-r border-[#E2E8F0] h-28 mx-auto" />

            {/* Right Column: Government of Maharashtra Logo & Slogan Card (approx 45%) */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 bg-slate-50 p-6 sm:p-8 rounded-xl border border-[#E2E8F0] shadow-2xs">
              {/* Prominent, Properly Anchored Government of Maharashtra Logo */}
              <div className="flex items-center justify-center shrink-0">
                <Image
                  src="/images/maharashtra-seal-clean.png"
                  alt="Government of Maharashtra – महाराष्ट्र शासन"
                  width={180}
                  height={220}
                  className="h-36 sm:h-40 md:h-44 w-auto object-contain shrink-0 drop-shadow-sm transition-transform hover:scale-[1.02]"
                  priority
                />
              </div>

              {/* Slogan Quote matching reference layout */}
              <div className="text-center sm:text-left border-t sm:border-t-0 sm:border-l border-[#CBD5E1] pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto">
                <p className="text-base sm:text-lg font-bold italic text-[#334155] leading-snug">
                  “Innovative<br className="hidden sm:inline" /> Maharashtra<br className="hidden sm:inline" /> for Inclusive<br className="hidden sm:inline" /> Growth”
                </p>
                <div className="mt-3 flex items-center justify-center sm:justify-start gap-1.5">
                  <span className="w-10 h-[3.5px] bg-[#F59E0B] rounded-full" />
                  <span className="w-10 h-[3.5px] bg-[#16834B] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4. EMPOWERING STARTUPS WITH OPPORTUNITIES SECTION (Dark Blue Theme)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="startups" className="bg-[#0A2540] text-white py-16 sm:py-20 border-y border-[#1E3A5F]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
          <div className="text-center sm:text-left mb-12">
            <span className="text-xs font-bold text-[#60A5FA] uppercase tracking-widest block mb-2">
              Startup Acceleration & Collaboration
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Empowering Startups with Opportunities
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl font-normal">
              A transparent, evidence-driven pathway for innovative companies to co-pilot solutions directly with Maharashtra public departments.
            </p>
          </div>

          {/* 4 Equal Feature Columns enclosed inside Dark Blue Container with High-Contrast White Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1: Discover */}
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-xs border border-white/15 rounded-xl p-7 flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="w-20 h-20 rounded-full bg-[#1D4ED8]/30 border border-[#60A5FA]/40 flex items-center justify-center text-[#93C5FD] mb-5 shadow-inner">
                <Search size={32} strokeWidth={2.4} />
              </div>
              <h3 className="text-base font-bold text-white mb-2 leading-tight">
                Discover<br />Government Needs
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-[210px]">
                Explore real-world challenges across Maharashtra departments and municipal bodies.
              </p>
            </div>

            {/* Feature 2: Showcase */}
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-xs border border-white/15 rounded-xl p-7 flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="w-20 h-20 rounded-full bg-[#10B981]/30 border border-[#34D399]/40 flex items-center justify-center text-[#6EE7B7] mb-5 shadow-inner">
                <Lightbulb size={32} strokeWidth={2.4} />
              </div>
              <h3 className="text-base font-bold text-white mb-2 leading-tight">
                Showcase<br />Your Solution
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-[210px]">
                Present your proprietary innovation and telemetry directly to government stakeholders.
              </p>
            </div>

            {/* Feature 3: Collaborate */}
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-xs border border-white/15 rounded-xl p-7 flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="w-20 h-20 rounded-full bg-[#F97316]/30 border border-[#FB923C]/40 flex items-center justify-center text-[#FDBA74] mb-5 shadow-inner">
                <Users size={32} strokeWidth={2.4} />
              </div>
              <h3 className="text-base font-bold text-white mb-2 leading-tight">
                Collaborate<br />with Departments
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-[210px]">
                Work together in 90-day sandbox environments to pilot and validate solutions with real data.
              </p>
            </div>

            {/* Feature 4: Scale */}
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-xs border border-white/15 rounded-xl p-7 flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="w-20 h-20 rounded-full bg-[#8B5CF6]/30 border border-[#A78BFA]/40 flex items-center justify-center text-[#C4B5FD] mb-5 shadow-inner">
                <TrendingUp size={32} strokeWidth={2.4} />
              </div>
              <h3 className="text-base font-bold text-white mb-2 leading-tight">
                Scale<br />Your Impact
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-[210px]">
                Turn proven pilots into procurement readiness and unlock state-wide implementation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          6. PRAMAN VALUE & WORKFLOW CTA SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#0B2A5B] text-white py-14 sm:py-16 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 relative z-10 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            From Government Need to Measurable Impact
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-2xl mx-auto leading-relaxed font-normal">
            PRAMAN connects problem identification, startup discovery, evaluation, pilot execution and evidence-based procurement in one transparent workflow.
          </p>
          <div className="pt-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#EEF5FC] text-[#0B2A5B] font-bold text-sm px-6 py-3 rounded-md shadow-md transition-all"
            >
              <span>Explore How PRAMAN Works</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Faint Skyline Silhouette in Background */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none text-white/5">
          <SkylineBackdrop className="w-full h-20" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          7. FOOTER (Deep Navy 3-Column Government Footer)
          ═══════════════════════════════════════════════════════════════ */}
      <footer id="contact" className="relative bg-[#0A2540] text-white pt-14 pb-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 mb-12">
            {/* Column 1: Contact Us */}
            <div className="md:col-span-4 space-y-4 text-xs text-white/80">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Contact Us
              </h3>
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3">
                  <Phone size={15} className="text-white/70 shrink-0" />
                  <span>+91 22 1234 5678</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={15} className="text-white/70 shrink-0" />
                  <span>support@praman.maharashtra.gov.in</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={15} className="text-white/70 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Mantralaya, Mumbai,<br />
                    Maharashtra 400032
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Access */}
            <div className="md:col-span-4 space-y-4 text-xs text-white/80">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Quick Access
              </h3>
              <ul className="space-y-2 pt-1">
                <li>
                  <Link href="/problems" className="hover:text-white transition-colors flex items-center gap-2">
                    <span className="text-white/60 font-bold">›</span>
                    <span>Latest Opportunities</span>
                  </Link>
                </li>
                <li>
                  <button onClick={() => setLoginModalOpen(true)} className="hover:text-white transition-colors flex items-center gap-2 text-left cursor-pointer">
                    <span className="text-white/60 font-bold">›</span>
                    <span>Startup Registration</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setLoginModalOpen(true)} className="hover:text-white transition-colors flex items-center gap-2 text-left cursor-pointer">
                    <span className="text-white/60 font-bold">›</span>
                    <span>Department Login</span>
                  </button>
                </li>
                <li>
                  <Link href="/transparency" className="hover:text-white transition-colors flex items-center gap-2">
                    <span className="text-white/60 font-bold">›</span>
                    <span>Guidelines & FAQs</span>
                  </Link>
                </li>
                <li>
                  <Link href="/transparency" className="hover:text-white transition-colors flex items-center gap-2">
                    <span className="text-white/60 font-bold">›</span>
                    <span>Resources</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Locate Us (Mantralaya Map Graphic) */}
            <div className="md:col-span-4 space-y-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Locate Us
              </h3>
              <MantralayaMapCard />
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/60">
            <p>
              © 2025 PRAMAN. Government of Maharashtra. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/transparency" className="hover:text-white transition-colors">Terms & Conditions</Link>
              <span>|</span>
              <Link href="/transparency" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span>|</span>
              <Link href="/transparency" className="hover:text-white transition-colors">Accessibility</Link>
            </div>
          </div>
        </div>

        {/* Skyline line art backdrop across footer */}
        <div className="absolute bottom-6 left-0 right-0 pointer-events-none text-white/5">
          <SkylineBackdrop className="w-full h-16 opacity-30" />
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════
          8. GOVERNMENT AUTHENTICATION MODAL (Preserving All Working Logic)
          ═══════════════════════════════════════════════════════════════ */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-[480px] bg-white rounded-lg shadow-2xl border border-[#DCE3EC] overflow-hidden">
            {/* Header */}
            <div className="bg-[#0A2540] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/images/praman-logo-clean.png"
                  alt="PRAMAN"
                  width={140}
                  height={38}
                  className="h-8 w-auto object-contain brightness-0 invert"
                />
                <div>
                  <h3 className="text-sm font-black text-white leading-tight">
                    PRAMAN Official Gateway
                  </h3>
                  <p className="text-[10px] text-white/70">
                    Department &amp; Startup Sign In · 2FA Enforced
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLoginModalOpen(false)}
                className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-[#FEE2E2] border border-[#FCA5A5] rounded text-xs text-[#DC2626] flex items-center gap-2 font-medium">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#334155] mb-1">
                    Official Email
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="officer@praman.local"
                      className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8F9FA] border border-[#DCE3EC] rounded focus:bg-white focus:border-[#1455B8] outline-none text-[#111827] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#334155] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8F9FA] border border-[#DCE3EC] rounded focus:bg-white focus:border-[#1455B8] outline-none text-[#111827] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#334155] mb-1">
                    MFA Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="text"
                      required
                      value={mfa}
                      onChange={(e) => setMfa(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8F9FA] border border-[#DCE3EC] rounded focus:bg-white focus:border-[#1455B8] outline-none text-[#111827] font-mono tracking-widest font-bold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading === "Verifying MFA"}
                  className="w-full h-10 bg-[#0B2A5B] hover:bg-[#061B3A] text-white font-bold rounded flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-60 mt-4"
                >
                  <span>{loading === "Verifying MFA" ? "Verifying Credentials…" : "Authenticate & Sign In"}</span>
                  <ArrowRight size={14} />
                </button>
              </form>

              {/* Demo Evaluation Personas */}
              <div className="mt-5 pt-3.5 border-t border-[#DCE3EC]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5D6878] mb-2">
                  One-Click Demo Personas:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_USERS.map((u) => (
                    <button
                      key={u.title}
                      type="button"
                      onClick={() => handleQuickFill(u.email)}
                      className="p-1.5 rounded border border-[#DCE3EC] hover:border-[#1455B8] bg-[#F8F9FA] hover:bg-[#EEF5FC] text-left transition-all"
                    >
                      <p className="font-bold text-[10px] text-[#111827]">{u.title}</p>
                      <p className="text-[8.5px] text-[#5D6878] truncate">{u.role}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          9. ROLE SELECTION MODAL
          ═══════════════════════════════════════════════════════════════ */}
      {roleModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-[420px] bg-white rounded-xl shadow-2xl border border-[#DCE3EC] overflow-hidden animate-fade-in">
            <div className={`px-6 py-5 flex items-center justify-between ${roleModalType === "startup" ? "bg-[#16834B]" : "bg-[#0B2A5B]"}`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{roleModalType === "startup" ? "🚀" : "🏛️"}</span>
                <div>
                  <h3 className="text-base font-black text-white leading-tight">
                    {roleModalType === "startup" ? "Startup Portal" : "Government Portal"}
                  </h3>
                  <p className="text-[11px] text-white/75 mt-0.5">
                    {roleModalType === "startup"
                      ? "Register your startup or sign in to your dedicated portal"
                      : "Register your department or sign in as an officer"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRoleModalType(null)}
                className="p-1.5 rounded text-white/80 hover:text-white hover:bg-white/15 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 gap-3">
              {/* Registration Option */}
              <button
                onClick={() => {
                  setRoleModalType(null);
                  if (roleModalType === "startup") {
                    setStartupRegisterModalOpen(true);
                  } else {
                    setLoginModalOpen(true);
                  }
                }}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all hover:shadow-md cursor-pointer ${
                  roleModalType === "startup"
                    ? "border-[#16834B] hover:bg-[#F0FDF4]"
                    : "border-[#0B2A5B] hover:bg-[#EEF5FC]"
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  roleModalType === "startup" ? "bg-[#DCFCE7] text-[#16834B]" : "bg-[#EEF5FC] text-[#0B2A5B]"
                }`}>
                  <FileText size={22} />
                </div>
                <div>
                  <p className="font-black text-[#111827] text-sm leading-tight">
                    {roleModalType === "startup" ? "Register a New Startup" : "Register Government Entity"}
                  </p>
                  <p className="text-xs text-[#5D6878] mt-0.5">
                    {roleModalType === "startup"
                      ? "Fill out venture submission form & apply for challenges"
                      : "Onboard your department and post procurement challenges"}
                  </p>
                </div>
                <ArrowRight size={16} className={`ml-auto shrink-0 ${roleModalType === "startup" ? "text-[#16834B]" : "text-[#0B2A5B]"}`} />
              </button>

              {/* Login Option */}
              <button
                onClick={() => {
                  if (roleModalType === "startup") {
                    handleStartupLoginDirect();
                  } else {
                    handleGovLoginDirect();
                  }
                }}
                className="flex items-center gap-4 p-4 rounded-lg border-2 border-[#DCE3EC] text-left transition-all hover:border-[#94A3B8] hover:bg-[#F8F9FA] cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#F1F5F9] text-[#475569] flex items-center justify-center shrink-0">
                  <Lock size={22} />
                </div>
                <div>
                  <p className="font-black text-[#111827] text-sm leading-tight">
                    {roleModalType === "startup" ? "Login as Startup" : "Login as Government Officer"}
                  </p>
                  <p className="text-xs text-[#5D6878] mt-0.5">
                    {roleModalType === "startup"
                      ? "Access the dedicated Startup Portal directly"
                      : "Access the Government Procurement Officer Workspace"}
                  </p>
                </div>
                <ArrowRight size={16} className="ml-auto shrink-0 text-[#475569]" />
              </button>
            </div>

            <div className="px-6 pb-5 text-center">
              <p className="text-[10px] text-[#94A3B8]">
                Strict Portal Isolation · Protected by 2FA · Government of Maharashtra
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          10. DEDICATED STARTUP REGISTRATION FORM MODAL
          ═══════════════════════════════════════════════════════════════ */}
      <StartupRegisterModal
        isOpen={startupRegisterModalOpen}
        onClose={() => setStartupRegisterModalOpen(false)}
        onSuccessRedirect={() => {
          setStartupRegisterModalOpen(false);
          handleStartupLoginDirect();
        }}
      />
    </div>
  );
}