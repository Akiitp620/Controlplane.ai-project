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
import { storeEvaluation } from '@/lib/mock-data';

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

interface BackendEvaluationResponse {
  assessmentId?: number;
  passportId?: number | null;

  applicationType?: string;
  riskTolerance?: string;

  hallucinationScore: number;
  privacyScore: number;
  biasScore: number;
  confidenceScore: number;
  contextRiskScore: number;
  overallRiskScore: number;

  consequenceLevel?: string;
  consequenceScore?: number;
  consequenceReason?: string;

  decision: string;
  finalResponse?: string;
  reason?: string;
  evidence?: string[];
}

export function EvaluationWorkspace({
  compact = false,
}: EvaluationWorkspaceProps) {
  const [status, setStatus] =
    React.useState<EvaluationStatus>('idle');

  const [result, setResult] =
    React.useState<EvaluationResult | null>(null);

  /**
   * Tracks the latest evaluation run.
   *
   * Every new input change or evaluation increments this value.
   * In-flight older requests are ignored when their run id no
   * longer matches the latest active run.
   */
  const evaluationRunRef = React.useRef(0);

  /**
   * Clear stale evaluation output whenever the current input
   * changes.
   *
   * This prevents an old decision from remaining visible while
   * the user is preparing a different scenario.
   */
  const handleInputChange = React.useCallback(() => {
    evaluationRunRef.current += 1;

    setResult(null);
    setStatus('idle');
  }, []);

  const generateEvaluationId = React.useCallback(() => {
    return `EVAL-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 11)}`;
  }, []);

  const transformBackendResponse = React.useCallback(
    (
      backendData: BackendEvaluationResponse,
      useCase: UseCaseId,
      response: string,
    ): EvaluationResult => {
      const evaluationId = backendData.assessmentId
        ? `EVAL-${backendData.assessmentId}`
        : generateEvaluationId();

      const timestamp = new Date().toISOString();

      // =========================================================
      // RISK LEVEL
      // =========================================================

      const riskLevel =
        backendData.overallRiskScore > 70
          ? 'CRITICAL'
          : backendData.overallRiskScore > 50
            ? 'HIGH'
            : backendData.overallRiskScore > 30
              ? 'MEDIUM'
              : 'LOW';

      // =========================================================
      // DECISION MAPPING
      // =========================================================

      const decisionMap: Record<
        string,
        EvaluationResult['decision']
      > = {
        PASS: 'ALLOW',
        WARN: 'HUMAN_REVIEW',
        ESCALATE: 'HUMAN_REVIEW',
        MODIFY: 'MODIFY',
        ALLOW: 'ALLOW',
        HUMAN_REVIEW: 'HUMAN_REVIEW',
        BLOCK: 'BLOCK',
      };

      const decision =
        decisionMap[backendData.decision] ||
        'HUMAN_REVIEW';

      // =========================================================
      // FINDINGS
      // =========================================================

      const findings: Record<
        string,
        'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      > = {
        hallucination:
          backendData.hallucinationScore > 70
            ? 'HIGH'
            : backendData.hallucinationScore > 40
              ? 'MEDIUM'
              : 'LOW',

        privacy:
          backendData.privacyScore > 70
            ? 'HIGH'
            : backendData.privacyScore > 40
              ? 'MEDIUM'
              : 'LOW',

        bias:
          backendData.biasScore > 70
            ? 'HIGH'
            : backendData.biasScore > 40
              ? 'MEDIUM'
              : 'LOW',

        safety:
          backendData.overallRiskScore > 70
            ? 'HIGH'
            : backendData.overallRiskScore > 40
              ? 'MEDIUM'
              : 'LOW',

        responsibility:
          backendData.contextRiskScore > 70
            ? 'HIGH'
            : backendData.contextRiskScore > 40
              ? 'MEDIUM'
              : 'LOW',
      };

      // =========================================================
      // RISK DETAILS
      // =========================================================

      const riskDetails = [
        {
          dimension: 'hallucination' as const,
          severity: findings.hallucination,
          confidence: backendData.hallucinationScore,
          explanation:
            `Hallucination risk score: ${backendData.hallucinationScore}`,
        },

        {
          dimension: 'privacy' as const,
          severity: findings.privacy,
          confidence: backendData.privacyScore,
          explanation:
            `Privacy risk score: ${backendData.privacyScore}`,
        },

        {
          dimension: 'bias' as const,
          severity: findings.bias,
          confidence: backendData.biasScore,
          explanation:
            `Bias risk score: ${backendData.biasScore}`,
        },

        {
          dimension: 'responsibility' as const,
          severity: findings.responsibility,
          confidence: backendData.contextRiskScore,
          explanation:
            `Context risk score: ${backendData.contextRiskScore}`,
        },
      ];

      // =========================================================
      // CONSEQUENCE
      // =========================================================
      //
      // Backend now returns:
      //   consequenceLevel
      //   consequenceScore
      //   consequenceReason
      //
      // Older responses without these fields are handled safely.
      //

      const consequenceLevelMap: Record<
        string,
        EvaluationResult['consequence']
      > = {
        LOW: 'LOW',
        MEDIUM: 'MEDIUM',
        HIGH: 'HIGH',
        CRITICAL: 'CRITICAL',
      };

      const normalizedConsequenceLevel =
        (
          backendData.consequenceLevel ??
          'MEDIUM'
        ).toUpperCase();

      const consequenceLevel =
        consequenceLevelMap[
          normalizedConsequenceLevel
        ] ?? 'MEDIUM';

      const consequenceScore =
        typeof backendData.consequenceScore === 'number'
          ? backendData.consequenceScore
          : 0;

      const consequenceReason =
        backendData.consequenceReason ||
        'Consequence impact assessed from the application context.';

      // =========================================================
      // DECISION PIPELINE
      // =========================================================

      const pipeline = [
        {
          key: 'context' as const,
          label: 'Context',

          status:
            backendData.contextRiskScore < 50
              ? ('pass' as const)
              : ('warn' as const),

          detail:
            `Context risk: ${backendData.contextRiskScore}`,
        },

        {
          key: 'risk' as const,
          label: 'Risk Analysis',

          status:
            backendData.overallRiskScore < 50
              ? ('pass' as const)
              : ('warn' as const),

          detail:
            `Overall risk: ${backendData.overallRiskScore}`,
        },

        {
          key: 'evidence' as const,
          label: 'Evidence',

          status:
            backendData.evidence?.length
              ? ('warn' as const)
              : ('neutral' as const),

          detail:
            backendData.evidence?.length
              ? `${backendData.evidence.length} evidence source(s) retrieved`
              : 'No evidence retrieved',
        },

        {
          key: 'consequence' as const,
          label: 'Consequence',

          status:
            consequenceLevel === 'HIGH' ||
            consequenceLevel === 'CRITICAL'
              ? ('warn' as const)
              : ('pass' as const),

          detail:
            `Consequence: ${consequenceLevel} · Score ${consequenceScore}`,
        },

        {
          key: 'policy' as const,
          label: 'Policy',

          status:
            decision === 'ALLOW'
              ? ('pass' as const)
              : ('warn' as const),

          detail:
            `Policy decision: ${backendData.decision}`,
        },

        {
          key: 'autonomy' as const,
          label: 'Autonomy',

          status:
            decision === 'ALLOW'
              ? ('pass' as const)
              : ('warn' as const),

          detail:
            `Autonomy: ${backendData.decision}`,
        },
      ];

      // =========================================================
      // FINAL UI RESULT
      // =========================================================

      return {
        evaluationId,
        useCase,
        response,
        timestamp,
        riskLevel,

        findings,
        riskDetails,

        // -------------------------------------------------------
        // Evidence
        // -------------------------------------------------------

        evidence: {
          status:
            backendData.hallucinationScore >= 80
              ? 'CONTRADICTED'
              : backendData.evidence?.length
                ? 'VERIFIED'
                : 'UNKNOWN',

          sources: (backendData.evidence || []).map(
            (source: string, index: number) => ({
              id: String(index + 1),

              title:
                `Backend evidence ${index + 1}`,

              status:
                backendData.hallucinationScore >= 80
                  ? 'CONTRADICTED'
                  : 'VERIFIED',

              claim: response,
              sourceSays: source,
            }),
          ),
        },

        // -------------------------------------------------------
        // REAL CONSEQUENCE DATA
        // -------------------------------------------------------

        consequence: consequenceLevel,

        consequenceImpact:
          `${consequenceReason} Consequence score: ${consequenceScore}/100.`,

        // -------------------------------------------------------
        // Policy
        // -------------------------------------------------------

        policy: {
          id: '1',
          name: 'Default Policy',
          version: '1.0',
          status: 'ACTIVE' as const,
        },

        // -------------------------------------------------------
        // Decision
        // -------------------------------------------------------

        decision,

        reasoning: [
          backendData.reason ||
            'No additional reasoning provided',
        ],

        // -------------------------------------------------------
        // Pipeline
        // -------------------------------------------------------

        pipeline,

        // -------------------------------------------------------
        // Human Review
        // -------------------------------------------------------

        humanReview:
          backendData.decision === 'ESCALATE' ||
          backendData.decision === 'WARN'
            ? {
                status: 'PENDING',
                reason: backendData.reason,
              }
            : undefined,
      };
    },
    [generateEvaluationId],
  );

  // ===========================================================
  // EVALUATE
  // ===========================================================

  const handleEvaluate = async (
    useCase: UseCaseId,
    response: string,
  ) => {
    const runId =
      ++evaluationRunRef.current;

    setStatus('evaluating');
    setResult(null);

    try {
      const token =
        window.localStorage.getItem('token');

      if (!token) {
        throw new Error(
          'Authentication token not found. Please sign in again.',
        );
      }

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ??
        'http://localhost:8080';

      // =========================================================
      // 1. RESOLVE APPLICATION
      // =========================================================

      const applicationsResponse =
        await fetch(
          `${apiUrl}/api/applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

      if (runId !== evaluationRunRef.current) {
        return;
      }

      if (!applicationsResponse.ok) {
        throw new Error(
          `Unable to load applications (${applicationsResponse.status})`,
        );
      }

      const applications =
        await applicationsResponse.json();

      if (runId !== evaluationRunRef.current) {
        return;
      }

      if (
        !Array.isArray(applications) ||
        applications.length === 0
      ) {
        throw new Error(
          'No application found. Please seed the database first.',
        );
      }

      const applicationId =
        applications[0].id;

      // =========================================================
      // 2. CALL BACKEND ANALYSIS
      // =========================================================

      const apiResponse =
        await fetch(
          `${apiUrl}/api/analyze`,
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
              applicationId,
              userRequest: response,
              aiResponse: response,
            }),
          },
        );

      const text =
        await apiResponse.text();

      if (runId !== evaluationRunRef.current) {
        return;
      }

      if (!apiResponse.ok) {
        throw new Error(
          text ||
            `Analysis failed (${apiResponse.status})`,
        );
      }

      // =========================================================
      // 3. PARSE RESPONSE
      // =========================================================

      let data: BackendEvaluationResponse;

      try {
        data = JSON.parse(
          text,
        ) as BackendEvaluationResponse;
      } catch {
        throw new Error(
          'Backend returned an invalid evaluation response.',
        );
      }

      if (runId !== evaluationRunRef.current) {
        return;
      }

      // =========================================================
      // 4. TRANSFORM
      // =========================================================

      const transformedResult =
        transformBackendResponse(
          data,
          useCase,
          response,
        );

      if (runId !== evaluationRunRef.current) {
        return;
      }

      // =========================================================
      // 5. PERSIST
      // =========================================================

      storeEvaluation(
        transformedResult,
      );

      // =========================================================
      // 6. UPDATE UI
      // =========================================================

      setResult(
        transformedResult,
      );

      setStatus('success');

    } catch (error) {

      /*
       * Ignore results/errors from stale requests.
       *
       * Example:
       *
       * Scenario A starts
       * ↓
       * Scenario B selected
       * ↓
       * Scenario A fails
       *
       * Scenario A must not overwrite Scenario B.
       */

      if (runId !== evaluationRunRef.current) {
        return;
      }

      console.error(
        'Analyze error:',
        error,
      );

      setResult(null);
      setStatus('error');
    }
  };

  // ===========================================================
  // GRID
  // ===========================================================

  const compactGrid = compact
    ? 'grid items-start gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]'
    : 'space-y-6';

  return (
    <div
      className={
        compact
          ? 'space-y-4'
          : 'space-y-6'
      }
    >
      {/* =======================================================
          PIPELINE INTRO
      ======================================================= */}

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

      {/* =======================================================
          MAIN WORKSPACE
      ======================================================= */}

      <div className={compactGrid}>
        {/* =====================================================
            INPUT PANEL
        ===================================================== */}

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
              onInputChange={handleInputChange}
              isEvaluating={
                status === 'evaluating'
              }
            />
          </CardContent>
        </Card>

        {/* =====================================================
            RESULT PANEL
        ===================================================== */}

        <div className="min-w-0 self-start">

          {/* ===================================================
              IDLE
          =================================================== */}

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
                    icon={
                      <FileSearch className="h-6 w-6" />
                    }
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <DecisionPlaceholder label="Risk" />
                  <DecisionPlaceholder label="Evidence" />
                  <DecisionPlaceholder label="Policy" />
                  <DecisionPlaceholder label="Autonomy" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* ===================================================
              EVALUATING
          =================================================== */}

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
                    Running context, risk, evidence,
                    consequence and policy checks...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ===================================================
              ERROR
          =================================================== */}

          {status === 'error' && !result && (
            <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
              <div className="border-b border-border/60 bg-muted/20 px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-red-600 dark:text-red-400">
                  Evaluation failed
                </p>

                <h3 className="mt-1 text-sm font-semibold text-foreground">
                  Unable to complete evaluation
                </h3>
              </div>

              <CardContent className="p-5">
                <div className="rounded-xl border border-dashed border-border/70 bg-muted/[0.18] p-6">
                  <EmptyState
                    title="Evaluation unavailable"
                    description="Please check that the backend is running and try again."
                    icon={
                      <ShieldCheck className="h-6 w-6" />
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* ===================================================
              SUCCESS
          =================================================== */}

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
                    evaluationId={
                      result.evaluationId
                    }
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
                    status={
                      result.evidence.status
                    }
                    sources={
                      result.evidence.sources
                    }
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
                      level={
                        result.consequence
                      }
                      impact={
                        result.consequenceImpact
                      }
                    />
                  </CardContent>
                </Card>

                <Card className="border-border/70 bg-card shadow-sm">
                  <CardContent className="p-5">
                    <PolicySnapshotCard
                      policy={
                        result.policy
                      }
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
                    decision={
                      result.decision
                    }
                    reasoning={
                      result.reasoning
                    }
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