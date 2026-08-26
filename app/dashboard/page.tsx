'use client';

import { PageHeader } from '@/components/layout/page-header';
import { EvaluationWorkspace } from '@/components/evaluation/evaluation-workspace';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  Gauge,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Sparkles,
  Waypoints,
} from 'lucide-react';
import { getDashboardMetrics } from '@/lib/mock-data';

export default function DashboardPage() {
  const metrics = getDashboardMetrics();

  return (
    <div className="space-y-8 pb-4">
      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <PageHeader
        title="Control Center"
        description="Monitor AI decisions, evaluate risk, and control autonomy at the point of decision."
        badge={
          <Badge
            variant="outline"
            className="gap-2 border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            Control Layer Active
          </Badge>
        }
      />

      {/* =========================================================
          CONTROL PLANE HERO
      ========================================================= */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-white shadow-sm dark:border-white/[0.08]">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[-120px] top-[-160px] h-[360px] w-[360px] rounded-full bg-blue-600/15 blur-3xl" />

          <div className="absolute bottom-[-180px] left-[28%] h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:56px_56px]" />
        </div>

        <div className="relative p-6 sm:p-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300">
                  <Waypoints className="h-3.5 w-3.5" />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-300">
                  Decision Control Plane
                </span>
              </div>

              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Every AI response gets a decision, not just a score.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
                ControlPlane combines context, risk, evidence, consequence
                and policy to decide whether AI should act, be constrained,
                be reviewed, or be blocked.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2 text-xs font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Policy-aware evaluation
            </div>
          </div>

          {/* Control Pipeline */}
          <div className="mt-7 grid overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] sm:grid-cols-5">
            <PipelineStep
              index="01"
              title="Context"
              description="Use-case"
              active
            />

            <PipelineStep
              index="02"
              title="Risk"
              description="Signals"
            />

            <PipelineStep
              index="03"
              title="Evidence"
              description="Verification"
            />

            <PipelineStep
              index="04"
              title="Policy"
              description="Governance"
            />

            <PipelineStep
              index="05"
              title="Autonomy"
              description="Decision"
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          SYSTEM OVERVIEW
      ========================================================= */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              System Overview
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
              Decision activity
            </h2>
          </div>

          <span className="hidden text-xs text-muted-foreground sm:block">
            Current period
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={Activity}
            label="Evaluations"
            value={metrics.evaluationsToday}
            description="AI responses evaluated"
            tone="blue"
          />

          <MetricCard
            icon={ShieldAlert}
            label="Human Review"
            value={metrics.humanReviews}
            description="Awaiting human oversight"
            tone="amber"
          />

          <MetricCard
            icon={ShieldX}
            label="Blocked"
            value={metrics.blocked}
            description="Prevented from proceeding"
            tone="red"
          />

          <MetricCard
            icon={Gauge}
            label="Avg. Latency"
            value={`${metrics.avgLatencyMs}ms`}
            description="Average evaluation time"
            tone="violet"
          />
        </div>
      </section>

      {/* =========================================================
          DECISION ENGINE
      ========================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                <Sparkles className="h-3.5 w-3.5" />
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                Decision Engine
              </span>
            </div>

            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Evaluate an AI response
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              Run a response through the control pipeline and determine the
              appropriate level of autonomy.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Evaluation Engine Ready
          </div>
        </div>

        <EvaluationWorkspace compact />
      </section>

      {/* =========================================================
          CONTROL INSIGHTS
      ========================================================= */}
      <section className="space-y-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Control Insights
          </p>

          <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
            Current control posture
          </h2>
        </div>

        <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
          <div className="grid divide-y divide-border/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <CompactInsight
              label="Risk Posture"
              value="Controlled"
              tone="blue"
            />

            <CompactInsight
              label="Review Queue"
              value={`${metrics.humanReviews} Pending`}
              tone="amber"
            />

            <CompactInsight
              label="System Status"
              value="Operational"
              tone="green"
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          OPERATIONAL BAR
      ========================================================= */}
      <div className="border-t border-border/60 pt-4">
        <div className="flex flex-col gap-2 text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            ControlPlane control layer operational
          </div>

          <div className="flex items-center gap-3">
            <span>Prototype / Demo Environment</span>
            <span>•</span>
            <span>Responsible AI Control</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===============================================================
   PIPELINE STEP
================================================================ */

function PipelineStep({
  index,
  title,
  description,
  active = false,
}: {
  index: string;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div
      className={[
        'relative border-b border-white/[0.08] p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0',
        active ? 'bg-blue-500/[0.08]' : 'bg-transparent',
      ].join(' ')}
    >
      <div className="flex items-center gap-3">
        <div
          className={[
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-semibold',
            active
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'bg-white/[0.06] text-white/45',
          ].join(' ')}
        >
          {index}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">
            {title}
          </p>

          <p className="text-[11px] text-white/35">
            {description}
          </p>
        </div>
      </div>

      {active && (
        <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-blue-400" />
      )}
    </div>
  );
}

/* ===============================================================
   METRIC CARD
================================================================ */

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  description: string;
  tone: 'blue' | 'amber' | 'red' | 'violet';
}) {
  const toneStyles = {
    blue:
      'bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400',

    amber:
      'bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400',

    red:
      'bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400',

    violet:
      'bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400',
  };

  return (
    <Card className="group overflow-hidden border-border/70 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {label}
            </p>

            <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums text-foreground">
              {value}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {description}
            </p>
          </div>

          <div
            className={[
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105',
              toneStyles[tone],
            ].join(' ')}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-border/50 pt-3 text-[10px] font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Operational
        </div>
      </CardContent>
    </Card>
  );
}

/* ===============================================================
   COMPACT INSIGHT
================================================================ */

function CompactInsight({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'blue' | 'amber' | 'green';
}) {
  const toneStyles = {
    blue:
      'bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300',

    amber:
      'bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300',

    green:
      'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300',
  };

  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>

      <span
        className={[
          'rounded-full px-2.5 py-1 text-[10px] font-semibold',
          toneStyles[tone],
        ].join(' ')}
      >
        {value}
      </span>
    </div>
  );
}