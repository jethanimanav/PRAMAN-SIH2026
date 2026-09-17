"use client";

import type { ReactNode } from "react";
import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, ClipboardList, ListChecks, Target,
  TestTube2, FileCheck2, Gauge, ShieldCheck, Package, TrendingUp,
  Activity, BarChart3, Settings, Menu, X, Bell,
  UserRound, LogOut, Database, RefreshCw, ShieldAlert, History,
  Eye, GitBranch, Users2, LineChart, CheckSquare, BookOpen,
  ChevronRight, ChevronLeft, ChevronDown, AlertTriangle, HelpCircle, Accessibility,
  CheckCircle2, Building2, Layers, Compass, Award, FolderLock, User,
  Search, ExternalLink, Globe, PhoneCall, Info
} from "lucide-react";
import { usePraman } from "@/lib/PramanContext";
import { useI18n } from "@/lib/i18n";

/* ═══════════════════════════════════════════════════════════════
   PRIMARY PORTAL NAVIGATION MAPPING & DROPDOWNS
   ═══════════════════════════════════════════════════════════════ */

export type DropdownItem = {
  label: string;
  href: string;
  desc?: string;
};

export type NavLinkItem = {
  label: string;
  href: string;
  badge?: string;
  roles?: string[];
  subRoutes?: string[];
  dropdownItems?: DropdownItem[];
};

const PRIMARY_NAV_GOV: NavLinkItem[] = [
  { label: "Home", href: "/dashboard", subRoutes: ["/dashboard"] },
  {
    label: "Procurement Cases",
    href: "/problems",
    subRoutes: ["/problems", "/problems/intake"],
    dropdownItems: [
      { label: "All Procurement Cases", href: "/problems", desc: "Browse active innovation challenges" },
      { label: "Problem Statement Intake", href: "/problems/intake", desc: "Register a new nodal challenge" },
    ],
  },
  {
    label: "Requirements",
    href: "/requirements",
    subRoutes: ["/requirements", "/transparency"],
    dropdownItems: [
      { label: "Structured Requirements", href: "/requirements", desc: "KPIs, functional & non-functional specs" },
      { label: "Transparency & Public Spec", href: "/transparency", desc: "Public challenge specifications" },
    ],
  },
  {
    label: "Startup Solutions",
    href: "/matching",
    subRoutes: ["/matching", "/scale"],
    dropdownItems: [
      { label: "Startup Discovery & Matching", href: "/matching", desc: "RRF + TOPSIS algorithm matching" },
      { label: "Scale & Commercialization", href: "/scale", desc: "Cross-departmental adoption & scale" },
    ],
  },
  {
    label: "Innovation Hub",
    href: "/innovation-hub",
    subRoutes: ["/innovation-hub"],
    dropdownItems: [
      { label: "Government Challenges", href: "/innovation-hub", desc: "Open innovation challenges seeking solutions" },
      { label: "Submit a Solution", href: "/innovation-hub?mode=submit", desc: "Respond to a government challenge" },
      { label: "Review Queue", href: "/innovation-hub?mode=review", desc: "Submissions awaiting government review" },
    ],
  },
  {
    label: "Pilot & Evidence",
    href: "/pilots",
    subRoutes: ["/pilots", "/evidence", "/analytics"],
    dropdownItems: [
      { label: "90-Day Sandbox Pilots", href: "/pilots", desc: "Controlled pilot telemetry & milestones" },
      { label: "Evidence Locker & Hashing", href: "/evidence", desc: "Tamper-evident cryptographic verification" },
      { label: "Performance Analytics", href: "/analytics", desc: "KPI telemetry & outcome analytics" },
    ],
  },
  {
    label: "Readiness & Decisions",
    href: "/readiness",
    subRoutes: ["/readiness", "/decisions", "/handoff", "/scale"],
    dropdownItems: [
      { label: "Procurement Readiness Score", href: "/readiness", desc: "Synthesized multi-dimensional readiness" },
      { label: "Officer Decision Gate", href: "/decisions", desc: "Human-in-the-loop justified sign-off" },
      { label: "Scaling Matrix", href: "/scale", desc: "Deployment & budget scaling" },
      { label: "Procurement Handoff Pack", href: "/handoff", desc: "GeM / standard procurement dossier" },
    ],
  },
  {
    label: "Governance & Audit",
    href: "/audit",
    subRoutes: ["/audit", "/risk", "/transparency", "/replay"],
    dropdownItems: [
      { label: "Append-Only Audit Trail", href: "/audit", desc: "SHA-256 verifiable event log" },
      { label: "Procurement Risk Radar", href: "/risk", desc: "Proactive risk & anomaly indicators" },
      { label: "Public Transparency Portal", href: "/transparency", desc: "Open public scrutiny view" },
      { label: "Decision Replay Audit", href: "/replay", desc: "Historical decision step simulation" },
    ],
  },
  {
    label: "Institutional Memory",
    href: "/memory",
    subRoutes: ["/memory", "/lessons", "/implementation", "/monitoring"],
    dropdownItems: [
      { label: "Institutional Memory Bank", href: "/memory", desc: "Searchable procurement repository" },
      { label: "Lessons Learned Registry", href: "/lessons", desc: "Departmental insights & post-mortems" },
      { label: "Implementation Tracking", href: "/implementation", desc: "Post-procurement rollout milestones" },
      { label: "Continuous Monitoring", href: "/monitoring", desc: "Ongoing SLA & performance telemetry" },
    ],
  },
];

const PRIMARY_NAV_STARTUP: NavLinkItem[] = [
  { label: "Home", href: "/dashboard", subRoutes: ["/dashboard"] },
  {
    label: "Open Challenges",
    href: "/problems",
    subRoutes: ["/problems"],
    dropdownItems: [
      { label: "Browse Challenges", href: "/problems", desc: "Explore open government challenges" },
    ],
  },
  {
    label: "Innovation Hub",
    href: "/innovation-hub",
    subRoutes: ["/innovation-hub"],
    dropdownItems: [
      { label: "Browse Challenges", href: "/innovation-hub", desc: "Discover open government challenges" },
      { label: "Submit Solution", href: "/innovation-hub?mode=submit", desc: "Submit your innovation" },
    ],
  },
  {
    label: "My Applications",
    href: "/matching",
    badge: "Active",
    subRoutes: ["/matching"],
    dropdownItems: [
      { label: "Matching & Status", href: "/matching", desc: "View evaluation and TOPSIS rank" },
    ],
  },
  {
    label: "Active Pilots",
    href: "/pilots",
    subRoutes: ["/pilots"],
    dropdownItems: [
      { label: "Sandbox Pilot Workspace", href: "/pilots", desc: "Submit telemetry & view milestones" },
    ],
  },
  {
    label: "Evidence Locker",
    href: "/evidence",
    subRoutes: ["/evidence"],
    dropdownItems: [
      { label: "Evidence Submissions", href: "/evidence", desc: "Upload and verify proof of performance" },
    ],
  },
  {
    label: "Readiness Assessment",
    href: "/readiness",
    subRoutes: ["/readiness"],
    dropdownItems: [
      { label: "Readiness Score", href: "/readiness", desc: "View procurement qualification score" },
    ],
  },
  {
    label: "Institutional Memory",
    href: "/memory",
    subRoutes: ["/memory", "/lessons"],
    dropdownItems: [
      { label: "Knowledge Base", href: "/memory", desc: "Prior solutions and reference specs" },
      { label: "Lessons Learned", href: "/lessons", desc: "Guidelines for procurement success" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   GOVERNMENT TOP BAR (Deep Navy #0B2A5B)
   ═══════════════════════════════════════════════════════════════ */
function GovernmentTopBar({ lastUpdated }: { lastUpdated: string }) {
  return (
    <div className="bg-[#0B2A5B] text-white text-[11px] h-[34px] px-4 sm:px-8 flex items-center justify-between border-b border-white/10 shrink-0 select-none z-50">
      <div className="flex items-center gap-3">
        <span className="font-bold tracking-wide flex items-center gap-1.5">
          <span>🇮🇳</span>
          <span>Government of India</span>
          <span className="text-white/40">|</span>
          <span className="font-normal text-white/90">भारत सरकार</span>
        </span>
        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-bold uppercase tracking-wider">
          SIH 2026 Prototype
        </span>
      </div>

      <div className="flex items-center gap-4 text-white/80 text-[10px]">
        <span className="hidden md:inline-block text-white/70">
          Last Updated: <strong className="text-white font-medium">{lastUpdated}</strong>
        </span>
        <span className="hidden md:inline-block text-white/30">|</span>
        <a
          href="#main-content"
          className="hover:text-white underline underline-offset-2 transition-colors"
        >
          Skip to main content
        </a>
        <span className="text-white/30">|</span>
        <div className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
          <Accessibility size={12} />
          <span className="hidden sm:inline">Screen Reader Access</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN GOVERNMENT HEADER (White, High-Trust Branding)
   ═══════════════════════════════════════════════════════════════ */
function GovernmentHeader({
  user,
  onLogout,
  isHindi,
  setIsHindi,
  notificationsCount,
}: {
  user: any;
  onLogout: () => void;
  isHindi: boolean;
  setIsHindi: (v: boolean) => void;
  notificationsCount: number;
}) {
  return (
    <header className="bg-white border-b border-[#D9E1EA] px-4 sm:px-8 py-3 flex items-center justify-between shrink-0 shadow-sm z-40">
      {/* Left: Emblem & Institutional Branding */}
      <Link href="/dashboard" className="flex items-center gap-3">
        <Image
          src="/images/praman-logo-clean.png"
          alt="PRAMAN – Public Procurement Intelligence Platform"
          width={180}
          height={48}
          className="h-10 sm:h-11 w-auto object-contain"
          priority
        />
      </Link>

      {/* Right: Tools + User Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Language Switcher */}
        <button
          onClick={() => setIsHindi(!isHindi)}
          className={`text-xs font-bold px-2.5 py-1 rounded border transition-all cursor-pointer flex items-center gap-1.5 ${
            isHindi
              ? "bg-[#0B2A5B] text-white border-[#0B2A5B] shadow-xs"
              : "bg-white text-[#0B2A5B] border-[#D9E1EA] hover:bg-[#EEF5FC] hover:border-[#0B2A5B]"
          }`}
          title={isHindi ? "Switch to English" : "हिंदी में बदलें"}
          aria-label="Language Toggle"
        >
          <span className={!isHindi ? "font-black" : "opacity-75"}>EN</span>
          <span className="opacity-40">|</span>
          <span className={isHindi ? "font-black" : "opacity-75"}>हिंदी</span>
        </button>

        {/* Support Links */}
        <div className="hidden md:flex items-center gap-3 text-xs text-[#5E6B7E] font-semibold">
          <span className="text-[#D9E1EA]">|</span>
          <Link href="/settings" className="hover:text-[#0B2A5B] flex items-center gap-1 transition-colors">
            <HelpCircle size={13} />
            <span>Help</span>
          </Link>
          <Link href="/transparency" className="hover:text-[#0B2A5B] flex items-center gap-1 transition-colors">
            <PhoneCall size={13} />
            <span>Contact</span>
          </Link>
          <span className="text-[#D9E1EA]">|</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            className="p-1.5 rounded-full hover:bg-[#EEF5FC] text-[#5E6B7E] hover:text-[#0B2A5B] transition-colors relative"
            title="Notifications"
          >
            <Bell size={18} />
            {notificationsCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#D92D20] rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-[#D9E1EA]">
          <div className="w-8 h-8 rounded-full bg-[#EEF5FC] border border-[#D9E1EA] flex items-center justify-center text-[#0B2A5B] font-bold text-xs">
            {user?.name?.[0] ?? "A"}
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <p className="text-xs font-bold text-[#172033] truncate max-w-[130px]">
              {user?.name ?? "Ananya Deshmukh"}
            </p>
            <p className="text-[10px] font-semibold text-[#0B2A5B] capitalize">
              {user?.role === "startup" ? "Startup Innovator" : "Nodal Officer"}
            </p>
          </div>
          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-1.5 text-[#5E6B7E] hover:text-[#D92D20] hover:bg-red-50 rounded transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRIMARY HORIZONTAL NAVIGATION BAR (With Dropdowns on Click)
   ═══════════════════════════════════════════════════════════════ */
function GovernmentNav({
  pathname,
  navLinks,
  onSearch,
  searchQuery,
  onToggleMobile,
  mobileOpen,
}: {
  pathname: string;
  navLinks: NavLinkItem[];
  onSearch: (q: string) => void;
  searchQuery: string;
  onToggleMobile: () => void;
  mobileOpen: boolean;
}) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <nav
      ref={navContainerRef}
      className="bg-white border-b border-[#D9E1EA] px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-sm z-30 relative"
    >
      {/* Mobile Toggle Button */}
      <div className="flex items-center gap-2 lg:hidden py-2">
        <button
          onClick={onToggleMobile}
          className="p-1.5 rounded text-[#0B2A5B] hover:bg-[#EEF5FC] border border-[#D9E1EA]"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <span className="text-xs font-bold text-[#0B2A5B] uppercase tracking-wider">
          Portal Menu
        </span>
      </div>

      {/* Desktop Horizontal Navigation Tabs with Dropdowns */}
      <div className="hidden lg:flex items-center gap-1 overflow-visible py-0">
        {navLinks.map((item) => {
          const isCurrentActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href)) ||
            (item.subRoutes && item.subRoutes.some((sr) => pathname === sr || pathname.startsWith(sr)));

          const hasDropdown = item.dropdownItems && item.dropdownItems.length > 0;
          const isDropdownOpen = openDropdown === item.label;

          return (
            <div key={item.label} className="relative">
              {hasDropdown ? (
                <button
                  type="button"
                  onClick={() => setOpenDropdown(isDropdownOpen ? null : item.label)}
                  className={`px-3 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 cursor-pointer select-none ${
                    isCurrentActive
                      ? "border-[#0B2A5B] text-[#0B2A5B] bg-[#EEF5FC] font-bold"
                      : "border-transparent text-[#5E6B7E] hover:text-[#0B2A5B] hover:border-[#D9E1EA]"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-bold rounded border border-amber-300">
                      {item.badge}
                    </span>
                  )}
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-150 ${isDropdownOpen ? "rotate-180 text-[#0B2A5B]" : "text-[#8A96A8]"}`}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`px-3 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
                    isCurrentActive
                      ? "border-[#0B2A5B] text-[#0B2A5B] bg-[#EEF5FC] font-bold"
                      : "border-transparent text-[#5E6B7E] hover:text-[#0B2A5B] hover:border-[#D9E1EA]"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-bold rounded border border-amber-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}

              {/* Functional Dropdown Panel */}
              {hasDropdown && isDropdownOpen && (
                <div className="absolute left-0 top-full mt-0.5 w-64 bg-white border border-[#D9E1EA] rounded-md shadow-xl py-1 z-50 animate-in fade-in-50 slide-in-from-top-1">
                  <div className="px-3 py-1.5 border-b border-[#D9E1EA]/60 bg-[#F5F7FA]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2A5B]">
                      {item.label}
                    </span>
                  </div>
                  {item.dropdownItems!.map((subItem) => {
                    const isSubActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        onClick={() => setOpenDropdown(null)}
                        className={`block px-3.5 py-2 text-xs transition-colors border-b last:border-b-0 border-[#D9E1EA]/40 ${
                          isSubActive
                            ? "bg-[#EEF5FC] text-[#0B2A5B] font-bold"
                            : "text-[#172033] hover:bg-[#EEF5FC] hover:text-[#0B2A5B]"
                        }`}
                      >
                        <div className="font-semibold flex items-center justify-between">
                          <span>{subItem.label}</span>
                          <ChevronRight size={12} className="text-[#8A96A8] opacity-60" />
                        </div>
                        {subItem.desc && (
                          <div className="text-[10px] text-[#5E6B7E] font-normal mt-0.5 leading-tight">
                            {subItem.desc}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Global Search Box */}
      <div className="py-2 flex items-center justify-end w-full lg:w-auto">
        <div className="relative w-full max-w-[260px] sm:max-w-[280px]">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8A96A8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search procurement, cases..."
            className="w-full h-8 pl-8 pr-3 text-xs bg-[#F5F7FA] border border-[#D9E1EA] rounded focus:bg-white focus:border-[#0B2A5B] outline-none text-[#172033] placeholder-[#8A96A8] transition-all"
          />
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GOVERNMENT FOOTER (4 Columns, Deep Navy #0B2A5B)
   ═══════════════════════════════════════════════════════════════ */
function GovernmentFooter({ lastUpdated }: { lastUpdated: string }) {
  return (
    <footer className="bg-[#0B2A5B] text-white text-xs shrink-0 border-t-2 border-[#E07B1F] select-none">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-white/80">
          {/* Col 1: Quick Links */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b border-white/20">
              Procurement Workflow
            </h3>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/dashboard" className="hover:text-white hover:underline transition-colors">Executive Dashboard</Link></li>
              <li><Link href="/problems" className="hover:text-white hover:underline transition-colors">Active Challenges Directory</Link></li>
              <li><Link href="/innovation-hub" className="hover:text-white hover:underline transition-colors">Innovation Hub</Link></li>
              <li><Link href="/problems/intake" className="hover:text-white hover:underline transition-colors">Problem Statement Intake</Link></li>
              <li><Link href="/requirements" className="hover:text-white hover:underline transition-colors">Requirement Structuring</Link></li>
              <li><Link href="/matching" className="hover:text-white hover:underline transition-colors">Startup Discovery & TOPSIS</Link></li>
            </ul>
          </div>

          {/* Col 2: Evidence & Validation */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b border-white/20">
              Evidence & Evaluation
            </h3>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/pilots" className="hover:text-white hover:underline transition-colors">90-Day Sandbox Pilots</Link></li>
              <li><Link href="/evidence" className="hover:text-white hover:underline transition-colors">Evidence Locker & Hashing</Link></li>
              <li><Link href="/readiness" className="hover:text-white hover:underline transition-colors">Procurement Readiness Score</Link></li>
              <li><Link href="/decisions" className="hover:text-white hover:underline transition-colors">Human Officer Decision Gate</Link></li>
              <li><Link href="/handoff" className="hover:text-white hover:underline transition-colors">Procurement Handoff Package</Link></li>
            </ul>
          </div>

          {/* Col 3: Governance & Compliance */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b border-white/20">
              Governance & Compliance
            </h3>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/audit" className="hover:text-white hover:underline transition-colors">Append-Only Audit Trail</Link></li>
              <li><Link href="/risk" className="hover:text-white hover:underline transition-colors">Procurement Risk Radar</Link></li>
              <li><Link href="/transparency" className="hover:text-white hover:underline transition-colors">Public Transparency Portal</Link></li>
              <li><Link href="/analytics" className="hover:text-white hover:underline transition-colors">Analytics & Outcomes</Link></li>
              <li><Link href="/replay" className="hover:text-white hover:underline transition-colors">Decision Replay Audit</Link></li>
            </ul>
          </div>

          {/* Col 4: Platform Information */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b border-white/20">
              PRAMAN Platform
            </h3>
            <p className="text-[11px] leading-relaxed text-white/70 mb-2">
              <strong>PRAMAN</strong> is an Evidence-Based Innovation Procurement Mechanism connecting verified government challenges with high-performing startup solutions.
            </p>
            <p className="text-[10px] text-amber-300 font-semibold">
              Smart India Hackathon 2026 · Problem Statement 26136
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-white/60">
          <p>
            © PRAMAN — Prototype for Smart Governance · Designed for Evidence-Based Procurement Evaluation
          </p>
          <p>
            System Status: <span className="text-[#86EFAC] font-bold">OPERATIONAL</span> · Last Data Sync: {lastUpdated}
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN SHELL COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, problem, currentStage, logout, authInitialized, memorySearchQuery, setMemorySearchQuery } = usePraman();
  const { isHindi, setLanguage } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleToggleLanguage(val: boolean) {
    setLanguage(val ? "hi" : "en");
  }

  useEffect(() => {
    if (authInitialized && !user) {
      router.push("/");
    }
  }, [user, authInitialized, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const lastUpdated = useMemo(() => {
    return new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " IST";
  }, []);

  if (!authInitialized || !user) return null;

  // Derive nav links from the authenticated user's role — no manual toggle needed
  const activeNavLinks = user?.role === "startup" ? PRIMARY_NAV_STARTUP : PRIMARY_NAV_GOV;

  function handleLogout() {
    logout();
    router.push("/");
  }

  function handleSearch(q: string) {
    if (setMemorySearchQuery) {
      setMemorySearchQuery(q);
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F5F7FA]">
      {/* 1. Indian Tricolor Accent Line */}
      <div className="tricolor-stripe" />

      {/* 2. Government Top Bar */}
      <GovernmentTopBar lastUpdated={lastUpdated} />

      {/* 3. Main White Government Header */}
      <GovernmentHeader
        user={user}
        onLogout={handleLogout}
        isHindi={isHindi}
        setIsHindi={handleToggleLanguage}
        notificationsCount={2}
      />

      {/* 4. Primary Horizontal Navigation Bar with Dropdowns */}
      <GovernmentNav
        pathname={pathname}
        navLinks={activeNavLinks}
        onSearch={handleSearch}
        searchQuery={memorySearchQuery || ""}
        onToggleMobile={() => setMobileOpen(!mobileOpen)}
        mobileOpen={mobileOpen}
      />

      {/* Mobile Drawer (Responsive) */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-[#D9E1EA] px-4 py-3 shadow-md z-20 space-y-2 max-h-[70vh] overflow-y-auto">
          {activeNavLinks.map((item) => (
            <div key={item.label} className="border-b border-[#D9E1EA]/50 pb-1.5 last:border-b-0">
              <Link
                href={item.href}
                className={`block px-3 py-1.5 rounded text-xs font-bold ${
                  pathname === item.href ? "bg-[#EEF5FC] text-[#0B2A5B]" : "text-[#172033] hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
              {item.dropdownItems && (
                <div className="pl-4 space-y-1 mt-1">
                  {item.dropdownItems.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="block px-2 py-1 text-[11px] text-[#5E6B7E] hover:text-[#0B2A5B] hover:bg-[#EEF5FC] rounded"
                    >
                      • {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 5. Main Content Canvas with Scroll Container & Footer */}
      <main id="main-content" className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden bg-[#F5F7FA]">
        <div className="page-container min-h-[calc(100vh-280px)]">
          {children}
        </div>

        {/* 6. Official Government Footer */}
        <GovernmentFooter lastUpdated={lastUpdated} />
      </main>
    </div>
  );
}