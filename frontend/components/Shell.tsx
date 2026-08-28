"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, ClipboardList, ListChecks, Target,
  TestTube2, FileCheck2, Gauge, ShieldCheck, Package, TrendingUp,
  Activity, BarChart3, Settings, Menu, X, Bell, ChevronDown,
  UserRound, Circle, LogOut, Sparkles
} from "lucide-react";
import { usePraman } from "@/lib/PramanContext";

const NAV = [
  {
    section: "Command Center",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    section: "Problem to Pilot",
    items: [
      { label: "Problems", href: "/problems", icon: FileText },
      { label: "Problem Intake", href: "/problems/intake", icon: ClipboardList },
      { label: "Requirements", href: "/requirements", icon: ListChecks },
      { label: "Matching & Ranking", href: "/matching", icon: Target },
      { label: "Pilots", href: "/pilots", icon: TestTube2 },
      { label: "Evidence", href: "/evidence", icon: FileCheck2 },
    ],
  },
  {
    section: "Decision",
    items: [
      { label: "Procurement Readiness", href: "/readiness", icon: Gauge },
      { label: "Decisions", href: "/decisions", icon: ShieldCheck },
      { label: "Handoff Pack", href: "/handoff", icon: Package },
      { label: "Scale & Reuse", href: "/scale", icon: TrendingUp },
    ],
  },
  {
    section: "Governance",
    items: [
      { label: "Audit Log", href: "/audit", icon: Activity },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, problem, currentStage, logout } = usePraman();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Find active page label
  let activePage = "Dashboard";
  NAV.forEach(g => g.items.forEach(i => { if (i.href === pathname) activePage = i.label; }));

  const stageLabel = ["Problem Loaded", "Requirements Structured", "Matching Complete", "Pilot Running", "Readiness Assessed", "Handoff Ready", "Scale Ready"][currentStage] || "Not Started";

  function handleLogout() {
    logout();
    router.push("/");
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#168675] text-white font-black text-lg shadow">
            P
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-tight">PRAMAN</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Innovation Procurement</p>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mx-4 mt-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] font-medium text-white/60 uppercase tracking-wider">System Online · Demo</span>
        <span className="ml-auto text-[9px] text-white/30">SIH 2026</span>
      </div>

      {/* Current Stage */}
      {problem && (
        <div className="mx-4 mt-2 rounded-lg bg-[#168675]/20 border border-[#168675]/30 px-3 py-2">
          <p className="text-[9px] text-emerald-300/70 uppercase tracking-wider font-medium">Current Stage</p>
          <p className="text-xs font-semibold text-emerald-200 mt-0.5">{stageLabel}</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV.map(group => (
          <div key={group.section}>
            <p className="px-2 mb-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-white/30">
              {group.section}
            </p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all ${
                      active
                        ? "bg-[#168675] text-white shadow-sm"
                        : "text-white/55 hover:bg-white/8 hover:text-white/90"
                    }`}
                  >
                    <Icon size={15} className={active ? "text-white" : "text-white/40"} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      {user && (
        <div className="border-t border-white/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#168675]/30 text-emerald-300">
              <UserRound size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white/90 truncate">{user.name}</p>
              <p className="text-[10px] text-white/40 truncate">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex h-7 w-7 items-center justify-center rounded-md text-white/30 hover:bg-white/10 hover:text-white/70 transition"
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ background: "#f1f5f9" }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex w-[220px] shrink-0 flex-col fixed top-0 left-0 bottom-0 z-40 overflow-hidden"
        style={{ background: "#062b27" }}
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
            className="relative z-10 flex h-full w-64 flex-col"
            style={{ background: "#062b27" }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 p-2 rounded-lg text-white/50 hover:bg-white/10"
            >
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col lg:pl-[220px] min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden -ml-1 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <Menu size={20} />
            </button>
            <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#168675]">PRAMAN</span>
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-slate-700">{activePage}</span>
            </div>
            <div className="lg:hidden flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#062b27] font-black text-emerald-300 text-sm">P</div>
              <span className="font-bold text-slate-900">PRAMAN</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {problem && (
              <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-semibold text-emerald-700">Problem #1042 · {stageLabel}</span>
              </div>
            )}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Bell size={15} />
            </div>
            {user && (
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                <UserRound size={14} className="text-slate-500" />
                <span className="text-[11px] font-semibold text-slate-700">{user.name}</span>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}