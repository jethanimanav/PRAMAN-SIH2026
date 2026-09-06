"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, ClipboardList, ListChecks, Target,
  TestTube2, FileCheck2, Gauge, ShieldCheck, Package, TrendingUp,
  Activity, BarChart3, Settings, Menu, X, Bell,
  UserRound, LogOut, Database, RefreshCw, ShieldAlert, History,
  Eye, GitBranch, Users2, LineChart, CheckSquare, BookOpen,
  ChevronRight, AlertTriangle, HelpCircle, Accessibility,
} from "lucide-react";
import { usePraman } from "@/lib/PramanContext";

const NAV = [
  {
    section: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    section: "PROCUREMENT INTELLIGENCE",
    items: [
      { label: "Government Problems", href: "/problems", icon: FileText },
      { label: "Problem Intake", href: "/problems/intake", icon: ClipboardList },
      { label: "Requirements", href: "/requirements", icon: ListChecks },
      { label: "Startup Discovery", href: "/matching", icon: Target },
      { label: "Matching & Ranking", href: "/matching", icon: Target, hidden: true },
    ],
  },
  {
    section: "VALIDATION",
    items: [
      { label: "Evidence Locker", href: "/evidence", icon: FileCheck2 },
      { label: "Pilot Management", href: "/pilots", icon: TestTube2 },
      { label: "Readiness Assessment", href: "/readiness", icon: Gauge },
      { label: "Risk Radar", href: "/risk", icon: ShieldAlert },
    ],
  },
  {
    section: "DECISION",
    items: [
      { label: "Recommendations", href: "/decisions", icon: ShieldCheck },
      { label: "Decision Register", href: "/decisions", icon: ShieldCheck, hidden: true },
      { label: "Handoff Pack", href: "/handoff", icon: Package },
      { label: "Scale & Reuse", href: "/scale", icon: TrendingUp },
    ],
  },
  {
    section: "IMPLEMENTATION",
    items: [
      { label: "Implementation Planner", href: "/implementation", icon: GitBranch },
      { label: "Dependency Graph", href: "/implementation/dependencies", icon: GitBranch },
      { label: "Responsibility Matrix", href: "/implementation/responsibilities", icon: Users2 },
      { label: "Performance Monitoring", href: "/monitoring", icon: LineChart },
    ],
  },
  {
    section: "OUTCOMES",
    items: [
      { label: "Outcome Assessment", href: "/outcomes", icon: CheckSquare },
      { label: "Lessons Learned", href: "/lessons", icon: BookOpen },
    ],
  },
  {
    section: "INSTITUTIONAL MEMORY",
    items: [
      { label: "Historical Projects", href: "/memory", icon: Database },
      { label: "Reuse Intelligence", href: "/reuse", icon: RefreshCw },
      { label: "Decision Replay", href: "/replay", icon: History },
    ],
  },
  {
    section: "ADMINISTRATION",
    items: [
      { label: "Audit Trail", href: "/audit", icon: Activity },
      { label: "Analytics & Reports", href: "/analytics", icon: BarChart3 },
      { label: "Transparency Portal", href: "/transparency", icon: Eye },
      { label: "System Settings", href: "/settings", icon: Settings },
    ],
  },
];

// Flatten for active-page lookup
const ALL_ITEMS = NAV.flatMap(g => g.items);

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, problem, currentStage, logout, authInitialized } = usePraman();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (authInitialized && !user) {
      router.push("/");
    }
  }, [user, authInitialized, router]);

  if (!authInitialized || !user) return null;

  // Find active page label
  let activePage = "Dashboard";
  ALL_ITEMS.forEach(i => { if (i.href === pathname) activePage = i.label; });

  const STAGE_LABELS = [
    "Problem Loaded", "Requirements Structured", "Matching Complete",
    "Pilot Running", "Readiness Assessed", "Handoff Ready", "Scale Ready",
  ];
  const stageLabel = STAGE_LABELS[currentStage] || "Not Started";

  function handleLogout() {
    logout();
    router.push("/");
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col overflow-hidden">

      {/* ── Brand block ── */}
      <div className="px-4 pt-4 pb-3 border-b border-white/10 flex-shrink-0">
        {/* Gov of Maharashtra line */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base leading-none">🇮🇳</span>
          <span className="text-[9px] font-semibold text-white/50 uppercase tracking-[0.12em] leading-tight">
            Govt. of Maharashtra
          </span>
        </div>
        {/* PRAMAN logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded font-black text-white text-sm shadow border border-white/20"
            style={{ background: "#e07b1f" }}
          >
            P
          </div>
          <div>
            <h1 className="text-[15px] font-black text-white tracking-tight leading-tight">PRAMAN</h1>
            <p className="text-[8px] text-white/35 uppercase tracking-[0.15em] leading-tight mt-0.5">
              Procurement Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* ── System status bar ── */}
      <div
        className="mx-3 mt-2.5 mb-1 rounded px-2.5 py-1.5 flex items-center gap-2 flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
        <span className="text-[9px] font-semibold text-white/50 uppercase tracking-wider flex-1 min-w-0">
          DEMO · System Online
        </span>
        <span className="text-[8px] text-white/25 font-mono flex-shrink-0">SIH 2026</span>
      </div>

      {/* ── Current stage indicator ── */}
      {problem && (
        <div
          className="mx-3 mt-1.5 mb-1 rounded px-2.5 py-1.5 flex-shrink-0"
          style={{ background: "rgba(224,123,31,0.15)", border: "1px solid rgba(224,123,31,0.3)" }}
        >
          <p className="text-[8px] text-amber-300/70 uppercase tracking-wider font-semibold">Active Stage</p>
          <p className="text-[10px] font-bold text-amber-200 mt-0.5">{stageLabel}</p>
        </div>
      )}

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-3">
        {NAV.map(group => {
          const visibleItems = group.items.filter(i => !i.hidden);
          return (
            <div key={group.section}>
              <p className="px-2 mb-1 text-[8px] font-bold uppercase tracking-[0.18em] text-white/30">
                {group.section}
              </p>
              <div className="space-y-0.5">
                {visibleItems.map(item => {
                  const Icon = item.icon;
                  const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={`${item.href}-${item.label}`}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 rounded px-2 py-1.5 text-[12px] font-medium transition-all ${
                        active
                          ? "text-white font-semibold"
                          : "text-white/50 hover:text-white/80 hover:bg-white/5"
                      }`}
                      style={active ? { background: "rgba(224,123,31,0.25)", borderLeft: "2px solid #e07b1f", paddingLeft: "calc(0.5rem - 2px)" } : {}}
                    >
                      <Icon size={13} className={active ? "text-amber-300 flex-shrink-0" : "text-white/30 flex-shrink-0"} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* ── User footer ── */}
      <div className="border-t border-white/10 px-3 py-3 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded font-bold text-white text-xs"
            style={{ background: "rgba(224,123,31,0.3)" }}
          >
            {user?.name?.[0] ?? "O"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-white/85 truncate">{user?.name ?? "Officer"}</p>
            <p className="text-[9px] text-white/35 truncate capitalize">{user?.role ?? "—"} · {user?.department ?? "Procurement"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex h-6 w-6 items-center justify-center rounded text-white/30 hover:text-white/70 hover:bg-white/10 transition"
            title="Sign out"
          >
            <LogOut size={12} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ background: "var(--paper)" }}>

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex w-[210px] shrink-0 flex-col fixed top-0 left-0 bottom-0 z-40 overflow-hidden"
        style={{ background: "var(--gov-blue-dark)" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          />
          <aside
            className="relative z-10 flex h-full w-[210px] flex-col"
            style={{ background: "var(--gov-blue-dark)" }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-2 top-2 p-1.5 rounded text-white/50 hover:bg-white/10"
            >
              <X size={16} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col lg:pl-[210px] min-w-0">

        {/* ── Government Top Banner ── */}
        <div
          className="hidden lg:flex items-center justify-between px-6 py-1.5 flex-shrink-0"
          style={{ background: "var(--gov-blue)", borderBottom: "1px solid var(--gov-blue-mid)" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm leading-none">🇮🇳</span>
            <span className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">
              Government of Maharashtra &nbsp;·&nbsp; Public Procurement &amp; Innovation Intelligence
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-[10px] text-white/50 hover:text-white/80 transition">
              <Accessibility size={11} /> Accessibility
            </button>
            <button className="flex items-center gap-1 text-[10px] text-white/50 hover:text-white/80 transition">
              <HelpCircle size={11} /> Help
            </button>
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ background: "rgba(224,123,31,0.3)", color: "#fcd5a0", border: "1px solid rgba(224,123,31,0.4)" }}
            >
              DEMO ENVIRONMENT
            </span>
          </div>
        </div>

        {/* ── Application Top Bar ── */}
        <header
          className="sticky top-0 z-30 flex h-12 items-center justify-between px-5 flex-shrink-0"
          style={{ background: "var(--white)", borderBottom: "1px solid var(--line)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden -ml-1 p-1.5 rounded text-slate-500 hover:bg-slate-100"
            >
              <Menu size={18} />
            </button>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[12px]">
              <span className="font-bold uppercase tracking-wider text-[10px]" style={{ color: "var(--saffron)" }}>PRAMAN</span>
              <ChevronRight size={12} className="text-slate-300" />
              <span className="font-semibold" style={{ color: "var(--ink-mid)" }}>{activePage}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {problem && (
              <div
                className="hidden sm:flex items-center gap-1.5 rounded px-2.5 py-1 text-[10px] font-semibold"
                style={{ background: "var(--gov-blue-light)", color: "var(--gov-blue)", border: "1px solid var(--gov-blue-border)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                PRB-MH-2026-1042 · {stageLabel}
              </div>
            )}
            <button
              className="flex h-8 w-8 items-center justify-center rounded text-slate-500 hover:bg-slate-100 transition relative"
              title="Notifications"
            >
              <Bell size={15} />
            </button>
            {user && (
              <div
                className="hidden sm:flex items-center gap-2 rounded px-2.5 py-1"
                style={{ background: "var(--mist)", border: "1px solid var(--line)" }}
              >
                <UserRound size={13} style={{ color: "var(--gov-blue)" }} />
                <div>
                  <p className="text-[11px] font-bold leading-tight" style={{ color: "var(--ink)" }}>{user.name}</p>
                  <p className="text-[9px] leading-tight capitalize" style={{ color: "var(--ink-soft)" }}>{user.role}</p>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 lg:p-6 min-w-0">
          {children}
        </main>

        {/* ── Government Footer ── */}
        <footer
          className="px-6 py-2 text-[9px] flex items-center justify-between flex-shrink-0"
          style={{ background: "var(--mist)", borderTop: "1px solid var(--line)", color: "var(--ink-soft)" }}
        >
          <span>PRAMAN · Public Procurement &amp; Innovation Intelligence · Government of Maharashtra</span>
          <span className="font-mono font-semibold">SIMULATED DATA · SIH 2026 · PS 26136</span>
        </footer>
      </div>
    </div>
  );
}