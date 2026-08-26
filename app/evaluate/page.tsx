'use client';

import { PageHeader } from '@/components/layout/page-header';
import { EvaluationWorkspace } from '@/components/evaluation/evaluation-workspace';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function EvaluatePage() {
  return (
<div className="flex min-h-full flex-col space-y-6">
      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <PageHeader
        title="AI Decision Evaluation"
        description="Evaluate AI-generated decisions before they become real-world actions."
        badge={
          <Badge
            variant="outline"
            className="gap-2 border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Control Layer Active
          </Badge>
        }
      />

      {/* =========================================================
          INTRO / SYSTEM STATUS
      ========================================================= */}
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(37,99,235,0.10),transparent_35%)]" />

        <div className="relative flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
              <BrainCircuit className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
                Decision Engine
              </p>

              <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                Evaluate an AI decision
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                ControlPlane evaluates context, risk, evidence, consequence
                and policy before determining how much autonomy an AI system
                should receive.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Evaluation Engine Ready
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTROL PIPELINE
      ========================================================= */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Control Pipeline
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
              From AI response to autonomy decision
            </h2>
          </div>

          <ShieldCheck className="hidden h-5 w-5 text-emerald-500 sm:block" />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <PipelineStep
            number="01"
            icon={BrainCircuit}
            title="Understand"
            description="Context & intent"
            active
          />

          <PipelineStep
            number="02"
            icon={Activity}
            title="Assess"
            description="Risk & evidence"
          />

          <PipelineStep
            number="03"
            icon={ShieldCheck}
            title="Decide"
            description="Policy & autonomy"
          />
        </div>
      </section>

      {/* =========================================================
          EVALUATION WORKSPACE
      ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
            <Sparkles className="h-3.5 w-3.5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400">
              Live Evaluation
            </p>
          </div>
        </div>

        <EvaluationWorkspace />
      </section>

      {/* =========================================================
          FOOTNOTE
      ========================================================= */}
      <div className="flex items-center justify-center gap-2 border-t border-border/50 pt-5 text-xs text-muted-foreground">
        <span>Context</span>
        <ArrowRight className="h-3 w-3" />
        <span>Risk</span>
        <ArrowRight className="h-3 w-3" />
        <span>Evidence</span>
        <ArrowRight className="h-3 w-3" />
        <span>Consequence</span>
        <ArrowRight className="h-3 w-3" />
        <span>Policy</span>
        <ArrowRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Autonomy</span>
      </div>
    </div>
  );
}

/* ===============================================================
   PIPELINE STEP
================================================================ */

function PipelineStep({
  number,
  icon: Icon,
  title,
  description,
  active = false,
}: {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border p-4 transition-all duration-200 ${
        active
          ? 'border-blue-200 bg-blue-50/50 shadow-sm dark:border-blue-400/20 dark:bg-blue-400/5'
          : 'border-border/70 bg-card hover:border-border hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            active
              ? 'bg-blue-600 text-white'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground">
              {number}
            </span>

            <h3 className="text-sm font-semibold text-foreground">
              {title}
            </h3>
          </div>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        {active && (
          <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.10)]" />
        )}
      </div>
    </div>
  );
}