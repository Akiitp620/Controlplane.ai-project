'use client';

import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronRight,
  ShieldCheck,
  Activity,
  BrainCircuit,
  FileCheck2,
  Scale,
  UserRoundCheck,
  LockKeyhole,
} from 'lucide-react';

const pipeline = [
  {
    number: '01',
    title: 'Context',
    description: 'Understand where the AI response is being used.',
    icon: BrainCircuit,
  },
  {
    number: '02',
    title: 'Risk',
    description: 'Detect hallucination, bias and privacy signals.',
    icon: Activity,
  },
  {
    number: '03',
    title: 'Evidence',
    description: 'Check claims against available trusted sources.',
    icon: FileCheck2,
  },
  {
    number: '04',
    title: 'Policy',
    description: 'Apply use-case, geography and risk policies.',
    icon: Scale,
  },
  {
    number: '05',
    title: 'Autonomy',
    description: 'Decide whether AI can act or needs oversight.',
    icon: UserRoundCheck,
  },
];

const useCases = [
  {
    tag: 'CUSTOMER AI',
    title: 'Customer Support',
    description:
      'Prevent unsupported claims, sensitive-data exposure and unsafe responses before they reach customers.',
    decision: 'ALLOW / REVIEW',
  },
  {
    tag: 'INTERNAL AI',
    title: 'Employee Copilots',
    description:
      'Keep internal assistants aligned with enterprise knowledge, access boundaries and organizational policies.',
    decision: 'ALLOW / REVIEW',
  },
  {
    tag: 'HIGH CONSEQUENCE',
    title: 'Decision Support',
    description:
      'Increase scrutiny when AI recommendations can influence financial, operational or regulated decisions.',
    decision: 'REVIEW / BLOCK',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#05070b] text-white selection:bg-blue-500/30">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-[#05070b]/75 backdrop-blur-xl">
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

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#problem"
              className="text-sm text-white/55 transition-colors hover:text-white"
            >
              The Problem
            </a>

            <a
              href="#control-layer"
              className="text-sm text-white/55 transition-colors hover:text-white"
            >
              Control Layer
            </a>

            <a
              href="#use-cases"
              className="text-sm text-white/55 transition-colors hover:text-white"
            >
              Use Cases
            </a>

            <a
              href="#product"
              className="text-sm text-white/55 transition-colors hover:text-white"
            >
              Product
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-white/65 transition-colors hover:text-white sm:block"
            >
              Sign in
            </Link>

            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition-all hover:bg-blue-50"
            >
              Launch ControlPlane
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative flex min-h-screen items-center overflow-hidden pt-20">

        {/* Cinematic background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(37,99,235,0.20),transparent_32%),radial-gradient(circle_at_20%_70%,rgba(30,64,175,0.10),transparent_30%)]" />

          <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:70px_70px]" />

          <div className="absolute right-[-10%] top-[15%] h-[600px] w-[600px] rounded-full border border-blue-400/10" />
          <div className="absolute right-[0%] top-[25%] h-[420px] w-[420px] rounded-full border border-blue-400/[0.08]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-24 sm:px-8">

          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">

            {/* Hero Copy */}

            <div className="max-w-3xl">

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[0.07] px-3.5 py-2 text-xs font-medium text-blue-300">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.9)]" />
                Responsible AI Control Layer
              </div>

              <p className="mb-5 text-sm font-medium tracking-[0.12em] text-white/40">
                AI CAN GENERATE.
              </p>

              <h1 className="text-[clamp(3.5rem,8vw,7.6rem)] font-semibold leading-[0.88] tracking-[-0.065em]">
                Control
                <span className="block text-blue-500">
                  what happens next.
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
                ControlPlane evaluates AI responses in context —
                assessing risk, evidence, consequence and policy —
                before deciding how much autonomy an AI system should receive.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-500"
                >
                  See ControlPlane in action
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href="#control-layer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white/75 transition-colors hover:bg-white/[0.07] hover:text-white"
                >
                  Explore the control layer
                </a>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/40">
                <span className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  Context-aware
                </span>

                <span className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  Evidence-aware
                </span>

                <span className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  Human-in-the-loop
                </span>
              </div>
            </div>

            {/* Hero Product Visual */}

            <div className="relative">

              <div className="absolute -inset-10 rounded-full bg-blue-600/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-2xl border border-white/[0.10] bg-[#0b1018]/90 shadow-2xl shadow-black/50">

                {/* Window header */}

                <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-medium text-white/65">
                      ControlPlane Evaluation
                    </span>
                  </div>

                  <span className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
                    Operational
                  </span>
                </div>

                <div className="p-5">

                  <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
                    AI RESPONSE
                  </div>

                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4 text-sm leading-6 text-white/75">
                    “This customer is likely fraudulent and should be rejected.”
                  </div>

                  {/* Risk signals */}

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Signal
                      label="Responsibility"
                      value="HIGH"
                      tone="orange"
                    />

                    <Signal
                      label="Evidence"
                      value="UNVERIFIED"
                      tone="yellow"
                    />

                    <Signal
                      label="Consequence"
                      value="HIGH"
                      tone="orange"
                    />

                    <Signal
                      label="Policy"
                      value="REVIEW"
                      tone="blue"
                    />
                  </div>

                  {/* Decision */}

                  <div className="mt-3 rounded-xl border border-orange-400/20 bg-orange-400/[0.06] p-4">

                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-400/10 text-orange-300">
                        <UserRoundCheck className="h-4 w-4" />
                      </div>

                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-orange-300/70">
                          Final autonomy decision
                        </div>

                        <div className="mt-1 text-lg font-semibold text-white">
                          Human Review
                        </div>

                        <p className="mt-1 text-xs leading-5 text-white/45">
                          High consequence with insufficient supporting evidence.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pipeline */}

                  <div className="mt-5 flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.12em] text-white/25">
                    <span>Context</span>
                    <ArrowRight className="h-3 w-3" />
                    <span>Risk</span>
                    <ArrowRight className="h-3 w-3" />
                    <span>Evidence</span>
                    <ArrowRight className="h-3 w-3" />
                    <span>Policy</span>
                    <ArrowRight className="h-3 w-3" />
                    <span className="text-blue-400/70">Decision</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}

          <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-white/25 lg:flex">
            <span>Scroll to explore</span>
            <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
          </div>
        </div>
      </section>

      {/* =====================================================
          PROBLEM
      ===================================================== */}

      <section
        id="problem"
        className="relative border-t border-white/[0.06] bg-[#070a10] py-28 sm:py-36"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          <div className="max-w-3xl">
            <div className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              The problem
            </div>

            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-6xl">
              AI can produce an answer
              <span className="text-white/35">
                .That does not mean it should act.
              </span>
            </h2>

            <p className="mt-7 max-w-2xl text-base leading-7 text-white/45">
              Enterprise AI operates across customer support,
              employee copilots and high-consequence workflows.
              Each context has a different tolerance for risk.
            </p>
          </div>

          <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] md:grid-cols-3">

            <ProblemCard
              number="01"
              title="Hallucination"
              text="A confident answer can still be unsupported, fabricated or impossible to verify."
            />

            <ProblemCard
              number="02"
              title="Privacy & Bias"
              text="Sensitive information and biased reasoning can hide inside otherwise useful outputs."
            />

            <ProblemCard
              number="03"
              title="Compounding Risk"
              text="One questionable response can influence several downstream decisions or agent actions."
            />

          </div>
        </div>
      </section>

      {/* =====================================================
          CONTROL LAYER
      ===================================================== */}

      <section
        id="control-layer"
        className="relative overflow-hidden bg-[#05070b] py-28 sm:py-36"
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">

          <div className="max-w-3xl">
            <div className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              The control layer
            </div>

            <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Five signals.
              <span className="block text-blue-500">
                One autonomy decision.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/45">
              Instead of treating every AI response equally,
              ControlPlane evaluates the conditions around it and
              determines the appropriate level of autonomy.
            </p>
          </div>

          <div className="mt-20 grid gap-3 lg:grid-cols-5">
            {pipeline.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.number}
                  className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/25 hover:bg-blue-400/[0.04]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-[0.15em] text-white/25">
                      {item.number}
                    </span>

                    <Icon className="h-4 w-4 text-blue-400/70 transition-colors group-hover:text-blue-400" />
                  </div>

                  <h3 className="mt-12 text-lg font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-xs leading-5 text-white/40">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Decision strip */}

          <div className="mt-8 grid gap-3 md:grid-cols-3">

            <DecisionCard
              title="ALLOW"
              description="Low risk. Strong evidence. AI can proceed."
              tone="green"
            />

            <DecisionCard
              title="REVIEW"
              description="Uncertainty or consequence requires human oversight."
              tone="orange"
            />

            <DecisionCard
              title="BLOCK"
              description="Risk exceeds the configured autonomy threshold."
              tone="red"
            />

          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCT
      ===================================================== */}

      <section
        id="product"
        className="border-t border-white/[0.06] bg-[#080c13] py-28 sm:py-36"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          <div className="grid items-center gap-16 lg:grid-cols-[0.8fr_1.2fr]">

            <div>
              <div className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                The product
              </div>

              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                Make the decision
                <span className="block text-white/35">
                  visible.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/45">
                Every evaluation produces a traceable decision:
                what was detected, why it mattered, which policy
                applied and what should happen next.
              </p>

              <Link
                href="/dashboard"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300"
              >
                Open the ControlPlane dashboard
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Dashboard preview */}

            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b1018] shadow-2xl shadow-black/40">

              <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>

                  <div>
                    <div className="text-xs font-semibold">
                      ControlPlane
                    </div>

                    <div className="text-[9px] text-white/30">
                      Responsible AI Control
                    </div>
                  </div>
                </div>

                <div className="text-[9px] text-white/30">
                  Production ·{' '}
                  <span className="text-emerald-400">
                    Operational
                  </span>
                </div>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-3">

                <MiniMetric
                  label="Evaluations"
                  value="12,482"
                />

                <MiniMetric
                  label="Human Reviews"
                  value="384"
                />

                <MiniMetric
                  label="Blocked"
                  value="97"
                />

              </div>

              <div className="mx-5 mb-5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
                      Latest evaluation
                    </div>

                    <div className="mt-2 text-sm font-medium text-white/80">
                      Customer fraud recommendation
                    </div>
                  </div>

                  <span className="rounded-full bg-orange-400/10 px-2.5 py-1 text-[10px] font-semibold text-orange-300">
                    REVIEW
                  </span>
                </div>

                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-blue-600 to-orange-400" />
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2">
                  <MetricChip label="Risk" value="HIGH" />
                  <MetricChip label="Evidence" value="LOW" />
                  <MetricChip label="Impact" value="HIGH" />
                  <MetricChip label="Policy" value="REVIEW" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          USE CASES
      ===================================================== */}

      <section
        id="use-cases"
        className="border-t border-white/[0.06] bg-[#05070b] py-28 sm:py-36"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

            <div className="max-w-2xl">
              <div className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                Built for different risk signatures
              </div>

              <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
                One control layer.
                <span className="block text-white/35">
                  Different autonomy rules.
                </span>
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-6 text-white/40">
              Customer-facing AI, internal copilots and high-consequence
              workflows should not be governed by the same threshold.
            </p>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {useCases.map((item) => (
              <div
                key={item.title}
                className="group flex min-h-[330px] flex-col justify-between rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/20 hover:bg-white/[0.04]"
              >
                <div>
                  <div className="text-[10px] font-semibold tracking-[0.18em] text-blue-400">
                    {item.tag}
                  </div>

                  <h3 className="mt-8 text-2xl font-semibold tracking-tight">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-white/40">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/[0.07] pt-5">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
                    Decision modes
                  </span>

                  <span className="text-xs font-semibold text-white/65">
                    {item.decision}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="relative overflow-hidden border-t border-white/[0.07] bg-[#070b12] py-32 sm:py-44">

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.08] blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">

          <div className="mx-auto mb-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-400/[0.08] text-blue-300">
            <LockKeyhole className="h-5 w-5" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            AI autonomy, with control
          </p>

          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            Give every AI decision
            <span className="block text-blue-500">
              the autonomy it deserves.
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-white/40">
            Evaluate the response. Understand the risk.
            Apply the policy. Make the right decision.
          </p>

          <Link
            href="/dashboard"
            className="group mt-9 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-blue-50"
          >
            Launch ControlPlane
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-white/[0.07] bg-[#05070b]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>

            <span className="text-sm font-semibold">
              ControlPlane
              <span className="text-blue-400">.ai</span>
            </span>
          </div>

          <div className="text-xs text-white/30">
            Responsible AI Control Layer · Prototype / Demo
          </div>

          <Link
            href="/login"
            className="text-xs font-medium text-white/45 transition-colors hover:text-white"
          >
            Sign in
          </Link>
        </div>
      </footer>
    </main>
  );
}

/* =========================================================
   COMPONENTS
   ========================================================= */

function Signal({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'orange' | 'yellow' | 'blue';
}) {
  const styles = {
    orange:
      'border-orange-400/15 bg-orange-400/[0.05] text-orange-300',
    yellow:
      'border-yellow-400/15 bg-yellow-400/[0.05] text-yellow-300',
    blue:
      'border-blue-400/15 bg-blue-400/[0.05] text-blue-300',
  };

  return (
    <div className={`rounded-xl border p-3 ${styles[tone]}`}>
      <div className="text-[9px] font-semibold uppercase tracking-[0.12em] opacity-60">
        {label}
      </div>

      <div className="mt-1 text-xs font-bold">
        {value}
      </div>
    </div>
  );
}

function ProblemCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-[#0a0e15] p-7 sm:p-9">
      <div className="text-[10px] font-semibold tracking-[0.18em] text-blue-400">
        {number}
      </div>

      <h3 className="mt-14 text-2xl font-semibold">
        {title}
      </h3>

      <p className="mt-4 text-sm leading-6 text-white/40">
        {text}
      </p>
    </div>
  );
}

function DecisionCard({
  title,
  description,
  tone,
}: {
  title: string;
  description: string;
  tone: 'green' | 'orange' | 'red';
}) {
  const styles = {
    green:
      'border-emerald-400/15 bg-emerald-400/[0.035] text-emerald-300',
    orange:
      'border-orange-400/15 bg-orange-400/[0.035] text-orange-300',
    red:
      'border-red-400/15 bg-red-400/[0.035] text-red-300',
  };

  return (
    <div className={`rounded-2xl border p-5 ${styles[tone]}`}>
      <div className="text-xs font-bold tracking-[0.15em]">
        {title}
      </div>

      <p className="mt-3 text-xs leading-5 text-white/40">
        {description}
      </p>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
      <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/25">
        {label}
      </div>

      <div className="mt-2 text-xl font-semibold tracking-tight">
        {value}
      </div>
    </div>
  );
}

function MetricChip({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-2.5 py-2">
      <div className="text-[8px] uppercase tracking-[0.1em] text-white/25">
        {label}
      </div>

      <div className="mt-1 text-[10px] font-semibold text-white/65">
        {value}
      </div>
    </div>
  );
}