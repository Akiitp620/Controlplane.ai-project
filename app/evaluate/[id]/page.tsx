'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { DecisionCard } from '@/components/evaluation/decision-card';
import { RiskFingerprint } from '@/components/evaluation/risk-fingerprint';
import { EvidencePanel } from '@/components/evaluation/evidence-panel';
import { ConsequencePanel } from '@/components/evaluation/consequence-panel';
import { PolicySnapshotCard } from '@/components/evaluation/policy-snapshot';
import { DecisionReasoningPanel } from '@/components/evaluation/decision-reasoning';
import { DecisionPipeline } from '@/components/evaluation/decision-pipeline';
import { ErrorState } from '@/components/common/error-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCaseList, getEvaluation } from '@/lib/mock-data';
import type { UseCaseId } from '@/types';
import { ArrowLeft, Clock, FileSearch, ScrollText } from 'lucide-react';

export default function EvaluationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const result = getEvaluation(params.id);

  if (!result) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <ErrorState
          title="Evaluation not found"
          description={`Evaluation ${params.id} was not found. It may have been created in a different session.`}
        />
      </div>
    );
  }

  const useCase = useCaseList.find((uc) => uc.id === result.useCase);
  const timestamp = new Date(result.timestamp).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  });

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <PageHeader
        title={`Evaluation ${result.evaluationId}`}
        description="Forensic evaluation detail"
        badge={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {useCase?.name ?? result.useCase}
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              {timestamp}
            </Badge>
          </div>
        }
        actions={
          <Button asChild size="sm" variant="outline">
            <Link href="/audit">
              <ScrollText className="mr-2 h-4 w-4" />
              Audit Record
            </Link>
          </Button>
        }
      />

      <DecisionCard
        decision={result.decision}
        reason={result.reasoning[0]}
        evaluationId={result.evaluationId}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI Response</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap font-mono text-sm text-foreground">
              {result.response}
            </p>
          </CardContent>
        </Card>

        <DecisionPipeline stages={result.pipeline} />
      </div>

      <RiskFingerprint findings={result.riskDetails} />

      <EvidencePanel
        status={result.evidence.status}
        sources={result.evidence.sources}
      />

      <div className="grid gap-6 lg:grid-cols-2">
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

      {result.humanReview ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Human Review Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <FileSearch className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {result.humanReview.status === 'PENDING'
                  ? 'This evaluation is awaiting human review.'
                  : `Reviewed by ${result.humanReview.reviewer} — ${result.humanReview.status}`}
              </span>
              {result.humanReview.status === 'PENDING' && (
                <Button asChild size="sm" variant="outline" className="ml-auto">
                  <Link href="/review">Go to Review Queue</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
