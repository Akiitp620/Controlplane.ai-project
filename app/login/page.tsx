'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  LockKeyhole,
  BrainCircuit,
  FileCheck2,
  Scale,
  UserRoundCheck,
  Activity,
} from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      return;
    }

    setLoading(true);

    // Demo authentication flow.
    // Replace this with real authentication when backend auth is implemented.
    await new Promise((resolve) => setTimeout(resolve, 900));

    window.location.href = '/dashboard';
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white selection:bg-blue-500/30">
      {/* =========================================================
          BACKGROUND
      ========================================================= */}
      <div className="pointer-events-none absolute inset-0">
        {/* Main cinematic blue glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_42%,rgba(37,99,235,0.14),transparent_30%),radial-gradient(circle_at_82%_25%,rgba(59,130,246,0.10),transparent_28%)]" />

        {/* Fine grid */}
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />

        {/* Decorative circles */}
        <div className="absolute left-[-180px] top-[25%] h-[420px] w-[420px] rounded-full border border-blue-400/[0.05]" />

        <div className="absolute right-[-180px] top-[18%] h-[520px] w-[520px] rounded-full border border-blue-400/[0.06]" />
      </div>

      {/* =========================================================
          HEADER
      ========================================================= */}
      <header className="relative z-20 border-b border-white/[0.07] bg-[#05070b]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20 transition-transform group-hover:scale-105">
              <ShieldCheck className="h-[18px] w-[18px]" />
            </div>

            <div className="leading-none">
              <div className="text-[15px] font-semibold tracking-tight">
                ControlPlane
                <span className="text-blue-400">.ai</span>
              </div>

              <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.18em] text-white/35">
                Responsible AI Control
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-[10px] font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            Secure workspace
          </div>
        </div>
      </header>

      {/* =========================================================
          MAIN
      ========================================================= */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center px-5 py-12 sm:px-8 lg:py-16">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">

          {/* =====================================================
              LEFT PRODUCT STORY
          ===================================================== */}
          <section className="hidden lg:block">
            <div className="max-w-2xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[0.06] px-3.5 py-2 text-xs font-medium text-blue-300">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                AI Control Environment
              </div>

              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
                Responsible AI
              </div>

              <h1 className="mt-4 text-5xl font-semibold leading-[0.95] tracking-[-0.05em] xl:text-6xl">
                Govern AI decisions
                <span className="block text-blue-500">
                  before they become actions.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-white/50">
                ControlPlane evaluates AI responses through context,
                risk, evidence, consequence and policy before deciding
                how much autonomy the system should receive.
              </p>

              {/* Control Pipeline */}
              <div className="mt-9 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
                <div className="border-b border-white/[0.07] px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white/80">
                        Control pipeline
                      </div>

                      <div className="mt-1 text-[10px] text-white/30">
                        Decision controls are active
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Operational
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-px bg-white/[0.06]">
                  <PipelineCell
                    icon={BrainCircuit}
                    label="Context"
                    active
                  />

                  <PipelineCell
                    icon={Activity}
                    label="Risk"
                  />

                  <PipelineCell
                    icon={FileCheck2}
                    label="Evidence"
                  />

                  <PipelineCell
                    icon={Scale}
                    label="Policy"
                  />

                  <PipelineCell
                    icon={UserRoundCheck}
                    label="Decision"
                  />
                </div>

                <div className="border-t border-white/[0.07] px-5 py-4">
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-white/35">
                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      Context-aware
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      Evidence-aware
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      Human oversight
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-[10px] text-white/25">
                <LockKeyhole className="h-3.5 w-3.5" />
                Your workspace is protected by ControlPlane security controls.
              </div>
            </div>
          </section>

          {/* =====================================================
              LOGIN CARD
          ===================================================== */}
          <section className="w-full">
            <div className="relative mx-auto w-full max-w-md">

              {/* =================================================
                  BLUE AURA BEHIND LOGIN CARD
              ================================================= */}
              <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[44px] bg-blue-500/20 blur-3xl" />

              <div className="pointer-events-none absolute -inset-5 -z-10 rounded-[34px] bg-blue-400/10 blur-2xl" />

              <div className="pointer-events-none absolute -inset-1 -z-10 rounded-[26px] bg-blue-500/[0.07] blur-xl" />

              {/* =================================================
                  LOGIN CARD
              ================================================= */}
              <div className="relative rounded-[22px] border border-white/[0.10] bg-[#0b1018]/95 p-7 shadow-[0_30px_100px_rgba(37,99,235,0.18)] backdrop-blur-xl sm:p-8">

                {/* Card Header */}
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-400/[0.07] text-blue-300">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <h2 className="mt-6 text-2xl font-semibold tracking-[-0.025em] text-white">
                    Welcome back
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-white/40">
                    Sign in to your ControlPlane workspace.
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-5"
                >
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs font-semibold text-white/70"
                    >
                      Work email
                    </label>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="you@company.com"
                      autoComplete="email"
                      required
                      className="h-11 w-full rounded-xl border border-white/[0.09] bg-white/[0.025] px-3.5 text-sm text-white outline-none transition-all placeholder:text-white/20 hover:border-white/[0.14] focus:border-blue-400 focus:bg-white/[0.035] focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="text-xs font-semibold text-white/70"
                      >
                        Password
                      </label>

                      <button
                        type="button"
                        className="text-xs font-medium text-blue-400 transition-colors hover:text-blue-300"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        id="password"
                        type={
                          showPassword ? 'text' : 'password'
                        }
                        value={password}
                        onChange={(event) =>
                          setPassword(event.target.value)
                        }
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                        className="h-11 w-full rounded-xl border border-white/[0.09] bg-white/[0.025] px-3.5 pr-11 text-sm text-white outline-none transition-all placeholder:text-white/20 hover:border-white/[0.14] focus:border-blue-400 focus:bg-white/[0.035] focus:ring-4 focus:ring-blue-500/10"
                      />

                      <button
                        type="button"
                        aria-label={
                          showPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                        onClick={() =>
                          setShowPassword((value) => !value)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/70"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember */}
                  <label className="flex cursor-pointer items-center gap-2.5 text-xs text-white/35">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/20 bg-white/[0.03] text-blue-600 focus:ring-blue-500"
                    />

                    Remember this device
                  </label>

                  {/* Sign In */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="my-7 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/[0.07]" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
                    or
                  </span>

                  <div className="h-px flex-1 bg-white/[0.07]" />
                </div>

                {/* Google SSO */}
                <button
                  type="button"
                  className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-white/[0.09] bg-white/[0.02] text-sm font-medium text-white/70 transition-all hover:border-white/[0.15] hover:bg-white/[0.05] hover:text-white"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-slate-800">
                    G
                  </span>

                  Continue with Google
                </button>

                {/* Request Access */}
                <p className="mt-6 text-center text-xs text-white/35">
                  Don&apos;t have access?{' '}
                  <button
                    type="button"
                    className="font-semibold text-blue-400 transition-colors hover:text-blue-300"
                  >
                    Request access
                  </button>
                </p>
              </div>

              {/* Security */}
              <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-white/25">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400/70" />
                Protected by ControlPlane security controls
              </div>

              {/* Back */}
              <div className="mt-5 text-center">
                <Link
                  href="/"
                  className="text-xs font-medium text-white/30 transition-colors hover:text-white/70"
                >
                  ← Back to ControlPlane
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* ===============================================================
   PIPELINE CELL
================================================================ */

function PipelineCell({
  icon: Icon,
  label,
  active = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex min-h-[82px] flex-col items-center justify-center gap-2 px-2 text-center ${
        active
          ? 'bg-blue-500/[0.07]'
          : 'bg-[#0b1018]'
      }`}
    >
      <Icon
        className={`h-4 w-4 ${
          active ? 'text-blue-400' : 'text-white/25'
        }`}
      />

      <span
        className={`text-[10px] font-medium ${
          active ? 'text-blue-300' : 'text-white/35'
        }`}
      >
        {label}
      </span>
    </div>
  );
}