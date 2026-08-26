'use client';

import * as React from 'react';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { EvaluationInput } from '@/components/evaluation/evaluation-input';
import { EvaluationLoading } from '@/components/evaluation/evaluation-loading';
import { DecisionCard } from '@/components/evaluation/decision-card';
import { RiskFingerprint } from '@/components/evaluation/risk-fingerprint';
import { EvidencePanel } from '@/components/evaluation/evidence-panel';
import { ConsequencePanel } from '@/components/evaluation/consequence-panel';
import { PolicySnapshotCard } from '@/components/evaluation/policy-snapshot';
import { DecisionReasoningPanel } from '@/components/evaluation/decision-reasoning';
import { DecisionPipeline } from '@/components/evaluation/decision-pipeline';
import { EmptyState } from '@/components/common/empty-state';

import {
  evaluateResponse,
  storeEvaluation,
} from '@/lib/mock-data';

import type {
  EvaluationResult,
  EvaluationStatus,
  UseCaseId,
} from '@/types';

import {
  ArrowRight,
  FileSearch,
  ShieldCheck,
  Workflow,
} from 'lucide-react';

interface EvaluationWorkspaceProps {
  compact?: boolean;
}

export function EvaluationWorkspace({
  compact = false,
}: EvaluationWorkspaceProps) {
  const [status, setStatus] =
    React.useState<EvaluationStatus>('idle');

  const [result, setResult] =
    React.useState<EvaluationResult | null>(null);

  const handleEvaluate = (
    useCase: UseCaseId,
    response: string,
  ) => {
    setStatus('evaluating');
    setResult(null);

    setTimeout(() => {
      const evalResult = evaluateResponse(
        useCase,
        response,
      );

      storeEvaluation(evalResult);
      setResult(evalResult);
      setStatus('success');
    }, 1200);
  };

  const compactGrid = compact
    ? 'grid items-start gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]'
    : 'space-y-6';

  return (
    <div className={compact ? 'space-y-4' : 'space-y-6'}>
      {/* =========================================================
          PIPELINE INTRO
      ========================================================= */}
      <div className="grid gap-3 sm:grid-cols-3">
        <PipelineInfo
          number="01"
          title="Understand"
          description="Context & intent"
          active={status === 'idle'}
        />

        <PipelineInfo
          number="02"
          title="Assess"
          description="Risk & evidence"
          active={status === 'evaluating'}
        />

        <PipelineInfo
          number="03"
          title="Decide"
          description="Policy & autonomy"
          active={status === 'success'}
        />
      </div>

      {/* =========================================================
          MAIN WORKSPACE
      ========================================================= */}
      <div className={compactGrid}>
        {/* =======================================================
            INPUT PANEL
        ======================================================= */}
        <Card className="self-start overflow-hidden border-border/70 bg-card shadow-sm">
          <div className="border-b border-border/60 bg-muted/20 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                <Workflow className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground">
                  AI Response
                </h3>

                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                  Provide the response you want ControlPlane to evaluate.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-5">
            <EvaluationInput
              onEvaluate={handleEvaluate}
              isEvaluating={status === 'evaluating'}
            />
          </CardContent>
        </Card>

        {/* =======================================================
            RESULT PANEL
        ======================================================= */}
        <div className="min-w-0 self-start">
          {/* -----------------------------------------------------
              IDLE PREVIEW
          ----------------------------------------------------- */}
          {status === 'idle' && !result && (
            <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
              <div className="border-b border-border/60 bg-muted/20 px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Decision Preview
                    </p>

                    <h3 className="mt-1 text-sm font-semibold text-foreground">
                      Awaiting evaluation
                    </h3>
                  </div>

                  <span className="rounded-full border border-border/60 bg-background px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                    Ready
                  </span>
                </div>
              </div>

              <CardContent className="p-5">
                <div className="rounded-xl border border-dashed border-border/70 bg-muted/[0.18] p-6">
                  <EmptyState
                    title="No decision yet"
                    description="Submit an AI response to run the ControlPlane decision pipeline."
                    icon={<FileSearch className="h-6 w-6" />}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <DecisionPlaceholder
                    label="Risk"
                  />

                  <DecisionPlaceholder
                    label="Evidence"
                  />

                  <DecisionPlaceholder
                    label="Policy"
                  />

                  <DecisionPlaceholder
                    label="Autonomy"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* -----------------------------------------------------
              EVALUATING
          ----------------------------------------------------- */}
          {status === 'evaluating' && (
            <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
              <div className="border-b border-border/60 bg-muted/20 px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
                  Decision Engine
                </p>

                <h3 className="mt-1 text-sm font-semibold text-foreground">
                  Evaluating response
                </h3>
              </div>

              <CardContent className="flex min-h-[270px] items-center justify-center p-6">
                <div className="text-center">
                  <EvaluationLoading />

                  <p className="mt-4 text-xs leading-5 text-muted-foreground">
                    Running context, risk, evidence, consequence and policy
                    checks...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* -----------------------------------------------------
              SUCCESS
          ----------------------------------------------------- */}
          {status === 'success' && result && (
            <div className="space-y-4 animate-fade-in">
              {/* =================================================
                  FINAL DECISION
              ================================================= */}
              <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
                <div className="flex flex-col gap-2 border-b border-border/60 bg-muted/20 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />

                    <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                      Final autonomy decision
                    </span>
                  </div>

                  <span className="max-w-full truncate text-[10px] font-mono text-muted-foreground sm:max-w-[240px]">
                    {result.evaluationId}
                  </span>
                </div>

                <div className="p-5">
                  <DecisionCard
                    decision={result.decision}
                    reason={result.reasoning[0]}
                    evaluationId={result.evaluationId}
                  />
                </div>
              </div>

              {/* =================================================
                  ACTIONS
              ================================================= */}
              <div className="flex flex-wrap gap-2">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="bg-background"
                >
                  <Link
                    href={`/evaluate/${result.evaluationId}`}
                  >
                    <FileSearch className="mr-2 h-4 w-4" />
                    View decision reasoning
                  </Link>
                </Button>

                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                >
                  <Link href="/audit">
                    Open audit record
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* =================================================
                  DECISION PIPELINE
              ================================================= */}
              <Card className="border-border/70 bg-card shadow-sm">
                <CardContent className="p-5">
                  <DecisionPipeline
                    stages={result.pipeline}
                    compact={compact}
                  />
                </CardContent>
              </Card>

              {/* =================================================
                  RISK
              ================================================= */}
              <Card className="border-border/70 bg-card shadow-sm">
                <CardContent className="p-5">
                  <RiskFingerprint
                    findings={result.riskDetails}
                  />
                </CardContent>
              </Card>

              {/* =================================================
                  EVIDENCE
              ================================================= */}
              <Card className="border-border/70 bg-card shadow-sm">
                <CardContent className="p-5">
                  <EvidencePanel
                    status={result.evidence.status}
                    sources={result.evidence.sources}
                  />
                </CardContent>
              </Card>

              {/* =================================================
                  CONSEQUENCE + POLICY
              ================================================= */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-border/70 bg-card shadow-sm">
                  <CardContent className="p-5">
                    <ConsequencePanel
                      level={result.consequence}
                      impact={result.consequenceImpact}
                    />
                  </CardContent>
                </Card>

                <Card className="border-border/70 bg-card shadow-sm">
                  <CardContent className="p-5">
                    <PolicySnapshotCard
                      policy={result.policy}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* =================================================
                  REASONING
              ================================================= */}
              <Card className="border-border/70 bg-card shadow-sm">
                <CardContent className="p-5">
                  <DecisionReasoningPanel
                    decision={result.decision}
                    reasoning={result.reasoning}
                    result={result}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===============================================================
   PIPELINE INFO
================================================================ */

function PipelineInfo({
  number,
  title,
  description,
  active = false,
}: {
  number: string;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div
      className={[
        'flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors',
        active
          ? 'border-blue-200 bg-blue-50/50 dark:border-blue-400/20 dark:bg-blue-400/[0.05]'
          : 'border-border/60 bg-card/60',
      ].join(' ')}
    >
      <div
        className={[
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-[10px] font-semibold',
          active
            ? 'bg-blue-600 text-white'
            : 'bg-muted text-muted-foreground',
        ].join(' ')}
      >
        {number}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold text-foreground">
          {title}
        </p>

        <p className="text-[11px] text-muted-foreground">
          {description}
        </p>
      </div>

      {active && (
        <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
      )}
    </div>
  );
}

/* ===============================================================
   DECISION PLACEHOLDER
================================================================ */

function DecisionPlaceholder({
  label,
}: {
  label: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-background px-3 py-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-xs font-medium text-muted-foreground/50">
        Awaiting
      </p>
    </div>
  );
}