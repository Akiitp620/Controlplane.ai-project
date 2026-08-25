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
import type { EvaluationResult, EvaluationStatus, UseCaseId } from '@/types';
import { FileSearch, ArrowRight } from 'lucide-react';

interface EvaluationWorkspaceProps {
  compact?: boolean;
}

export function EvaluationWorkspace({ compact = false }: EvaluationWorkspaceProps) {
  const [status, setStatus] = React.useState<EvaluationStatus>('idle');
  const [result, setResult] = React.useState<EvaluationResult | null>(null);

  const handleEvaluate = (useCase: UseCaseId, response: string) => {
    setStatus('evaluating');
    setResult(null);
    setTimeout(() => {
      const evalResult = evaluateResponse(useCase, response);
      storeEvaluation(evalResult);
      setResult(evalResult);
      setStatus('success');
    }, 1200);
  };

  return (
    <div className={compact ? 'grid gap-6 lg:grid-cols-2' : 'space-y-6'}>
      <EvaluationInput
        onEvaluate={handleEvaluate}
        isEvaluating={status === 'evaluating'}
      />

      <div className={compact ? 'space-y-4' : 'space-y-6'}>
        {status === 'idle' && !result && (
          <EmptyState
            title="No evaluation yet"
            description="Submit an AI response to begin. ControlPlane will evaluate it through the full decision pipeline."
            icon={<FileSearch className="h-6 w-6" />}
          />
        )}

        {status === 'evaluating' && <EvaluationLoading />}

        {status === 'success' && result && (
          <div className="space-y-4 animate-fade-in">
            <DecisionCard
              decision={result.decision}
              reason={result.reasoning[0]}
              evaluationId={result.evaluationId}
            />

            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/evaluate/${result.evaluationId}`}>
                  <FileSearch className="mr-2 h-4 w-4" />
                  View Decision Reasoning
                </Link>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link href="/audit">
                  Open Audit Record
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <DecisionPipeline stages={result.pipeline} compact={compact} />

            <RiskFingerprint findings={result.riskDetails} />

            <EvidencePanel
              status={result.evidence.status}
              sources={result.evidence.sources}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <ConsequencePanel
                level={result.consequence}
                impact={result.consequenceImpact}
              />
              <PolicySnapshotCard policy={result.policy} />
            </div>

            <DecisionReasoningPanel
              decision={result.decision}
              reasoning={result.reasoning}
              result={result}
            />
          </div>
        )}
      </div>
    </div>
  );
}
