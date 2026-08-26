import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-32 dark:bg-slate-950">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left */}
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300">
              <Sparkles className="h-4 w-4" />
              Context-aware AI governance
            </div>

            <h1 className="text-5xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">
              Control AI.
              <br />
              <span className="text-blue-600">
                Give it the right autonomy.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl dark:text-slate-300">
              ControlPlane evaluates AI responses using context, risk,
              evidence, consequence, and policy to determine when AI should
              act, when it should be constrained, and when a human should
              step in.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Launch ControlPlane
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                See How It Works
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Context-aware
              </span>

              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Evidence-aware
              </span>

              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Human-in-the-loop
              </span>
            </div>
          </div>

          {/* Right product visual */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-blue-500/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/30">
              {/* Window header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    ControlPlane
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    AI Evaluation
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Operational
                </div>
              </div>

              <div className="space-y-4 p-5">
                {/* AI response */}
                <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    AI Response
                  </div>

                 <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
  &quot;This customer is likely fraudulent and should be rejected.&quot;
</p>
                </div>

                {/* Signal grid */}
                <div className="grid grid-cols-2 gap-3">
                  <Signal
                    label="Responsibility"
                    value="HIGH"
                    tone="orange"
                  />

                  <Signal
                    label="Evidence"
                    value="UNVERIFIED"
                    tone="amber"
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
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-400/20 dark:bg-orange-400/10">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-400/10 dark:text-orange-300">
                      <ShieldCheck className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-300">
                        Final Autonomy Decision
                      </div>

                      <div className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">
                        Human Review
                      </div>

                      <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
                        High consequence with insufficient supporting
                        evidence.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Flow */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  <span>Context</span>
                  <ArrowRight className="h-3 w-3" />
                  <span>Risk</span>
                  <ArrowRight className="h-3 w-3" />
                  <span>Evidence</span>
                  <ArrowRight className="h-3 w-3" />
                  <span>Policy</span>
                  <ArrowRight className="h-3 w-3" />
                  <span>Autonomy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Signal({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "orange" | "amber" | "blue";
}) {
  const styles = {
    orange:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-300",
    amber:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300",
    blue:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300",
  };

  return (
    <div className={`rounded-xl border p-3 ${styles[tone]}`}>
      <div className="text-[11px] font-medium uppercase tracking-wider opacity-70">
        {label}
      </div>
      <div className="mt-1 text-sm font-bold">{value}</div>
    </div>
  );
}