'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/status-badge';
import { ErrorState } from '@/components/common/error-state';
import { Button } from '@/components/ui/button';
import { useCaseList, getEvaluation } from '@/lib/mock-data';
import type { UseCaseId } from '@/types';
import {
  ArrowLeft,
  Briefcase,
  Clock,
  FileSearch,
  ShieldCheck,
  AlertCircle,
  GitBranch,
} from 'lucide-react';

export default function UseCaseDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const useCase = useCaseList.find((uc) => uc.id === params.id);

  if (!useCase) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <ErrorState
          title="Use case not found"
          description={`Use case "${params.id}" does not exist.`}
        />
      </div>
    );
  }

  const recentEvals = useCase.recentEvaluations
    .map((id) => getEvaluation(id))
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <PageHeader
        title={useCase.name}
        description={useCase.description}
        badge={<StatusBadge risk={useCase.riskTolerance}>Risk: {useCase.riskTolerance}</StatusBadge>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard icon={AlertCircle} label="Risk Tolerance" value={useCase.riskTolerance} />
        <InfoCard icon={Clock} label="Latency Budget" value={useCase.latencyBudget} />
        <InfoCard icon={FileSearch} label="Evidence Requirement" value={useCase.evidenceRequirement} />
        <InfoCard icon={ShieldCheck} label="Human Review" value={useCase.humanReviewRule} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Allowed Autonomy Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {useCase.allowedAutonomy.map((d) => (
              <StatusBadge key={d} decision={d}>
                {d === 'HUMAN_REVIEW' ? 'HUMAN REVIEW' : d}
              </StatusBadge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Common Risks</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {useCase.commonRisks.map((risk, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                {risk}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Evaluations</CardTitle>
        </CardHeader>
        <CardContent>
          {recentEvals.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No recent evaluations for this use case in the current session.
            </p>
          ) : (
            <div className="space-y-2">
              {recentEvals.map((ev) => (
                <Link
                  key={ev!.evaluationId}
                  href={`/evaluate/${ev!.evaluationId}`}
                  className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-accent/30"
                >
                  <div className="flex items-center gap-3">
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{ev!.evaluationId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge risk={ev!.riskLevel}>{ev!.riskLevel}</StatusBadge>
                    <StatusBadge decision={ev!.decision}>
                      {ev!.decision === 'HUMAN_REVIEW' ? 'HUMAN REVIEW' : ev!.decision}
                    </StatusBadge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-sm font-semibold">{value}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
