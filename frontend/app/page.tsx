"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, ShieldCheck, CheckCircle2, ArrowRight, UserRoundCheck, Users, Target } from "lucide-react";
import { usePraman } from "@/lib/PramanContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, email, setEmail, password, setPassword, mfa, setMfa, loading, login } = usePraman();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (user) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-dvh bg-[#f5f8f7]">
      <div className="grid min-h-dvh lg:grid-cols-[47%_53%]">
        {/* LEFT BRAND EXPERIENCE */}
        <section className="relative hidden overflow-hidden bg-[#062b27] px-10 py-10 text-white lg:flex lg:flex-col xl:px-14">
          <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-teal-400/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
                backgroundSize: "42px 42px",
              }}
            />
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-emerald-300/20 bg-white/10 text-2xl font-bold text-emerald-300 shadow-lg backdrop-blur">
              P
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">PRAMAN</h1>
              <p className="mt-1 text-xs text-white/50">Public Procurement & Innovation Gateway</p>
            </div>
          </div>
          <div className="relative z-10 mt-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                Smart India Hackathon · Demo
              </span>
            </div>
          </div>
          <div className="relative z-10 mt-8 max-w-xl">
            <h2 className="text-4xl font-bold leading-[1.08] tracking-tight xl:text-5xl">
              Empowering<br />Government.<br />Enabling <span className="text-emerald-300">Innovation.</span>
            </h2>
            <p className="mt-7 max-w-lg text-sm leading-7 text-white/55 xl:text-base">
              PRAMAN creates an evidence-driven bridge between government challenges and startup innovation — from discovery to pilot, procurement and scale.
            </p>
          </div>
          <p className="relative z-10 mt-auto text-[10px] text-white/25">
            PRAMAN · Evidence-Based Public Procurement · 2026
          </p>
        </section>

        {/* RIGHT LOGIN */}
        <section className="relative flex min-h-dvh items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[10px] font-semibold text-slate-500 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            SECURE DEMO ENVIRONMENT
          </div>
          <div className="w-full max-w-[520px]">
            <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_30px_90px_rgba(15,23,42,0.10)] sm:p-10">
              <div className="flex justify-center">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 ring-8 ring-emerald-50/60">
                  <LockKeyhole size={28} className="text-[#168675]" />
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#168675]">Secure Government Access</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
                <p className="mt-2 text-sm text-slate-500">Sign in to continue to the PRAMAN command center.</p>
              </div>
              <div className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Official Email</label>
                  <input
                    className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#168675] focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@praman.local"
                  />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Password</label>
                    <span className="text-[10px] font-medium text-slate-400">Demo credential</span>
                  </div>
                  <input
                    className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#168675] focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                  />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Verification Code</label>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-[#168675]">
                      <ShieldCheck size={12} /> Simulated MFA
                    </span>
                  </div>
                  <input
                    className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-center text-lg font-semibold tracking-[0.5em] text-slate-900 outline-none transition focus:border-[#168675] focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    value={mfa}
                    onChange={(e) => setMfa(e.target.value)}
                    maxLength={6}
                  />
                </div>
                <button
                  onClick={login}
                  disabled={loading === "Verifying MFA"}
                  className="group flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#168675] px-4 font-semibold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-[#116f62] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle2 size={19} />
                  {loading === "Verifying MFA" ? "Verifying secure access..." : "Verify & Enter"}
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Demo access</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <RoleButton icon={<UserRoundCheck size={19} />} title="Officer" tone="green" onClick={() => setEmail("officer@praman.local")} />
                <RoleButton icon={<Users size={19} />} title="Evaluator" tone="blue" onClick={() => setEmail("evaluator@praman.local")} />
                <RoleButton icon={<Target size={19} />} title="Startup" tone="violet" onClick={() => setEmail("startup@praman.local")} />
                <RoleButton icon={<ShieldCheck size={19} />} title="Auditor" tone="amber" onClick={() => setEmail("auditor@praman.local")} />
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between px-2 text-[10px] text-slate-400">
              <span>PRAMAN Platform v1.0.0</span>
              <span className="font-mono">SIMULATED DATA</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function RoleButton({ icon, title, tone, onClick }: { icon: React.ReactNode; title: string; tone: "green" | "blue" | "violet" | "amber"; onClick: () => void; }) {
  const styles = {
    green: "border-emerald-100 bg-emerald-50/50 text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50",
    blue: "border-blue-100 bg-blue-50/50 text-blue-600 hover:border-blue-300 hover:bg-blue-50",
    violet: "border-violet-100 bg-violet-50/50 text-violet-600 hover:border-violet-300 hover:bg-violet-50",
    amber: "border-amber-100 bg-amber-50/50 text-amber-600 hover:border-amber-300 hover:bg-amber-50",
  };
  return (
    <button type="button" onClick={onClick} className={`rounded-xl border p-4 text-left transition hover:-translate-y-0.5 ${styles[tone]}`}>
      {icon}
      <p className="mt-3 text-sm font-semibold text-slate-800">{title}</p>
    </button>
  );
}