'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/common/status-badge';
import { ErrorState } from '@/components/common/error-state';
import { Button } from '@/components/ui/button';
import { policyMap, useCaseList } from '@/lib/mock-data';
import {
  ArrowLeft,
  ScrollText,
  AlertCircle,
  Clock,
  FileSearch,
  ShieldCheck,
  TrendingUp,
  GitBranch,
} from 'lucide-react';

export default function PolicyDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const policy = policyMap[params.id];

  if (!policy) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <ErrorState
          title="Policy not found"
          description={`Policy "${params.id}" does not exist.`}
        />
      </div>
    );
  }

  const uc = useCaseList.find((u) => u.id === policy.useCase);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <PageHeader
        title={policy.name}
        description={`Version ${policy.version} · ${uc?.name ?? policy.useCase}`}
        badge={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              v{policy.version}
            </Badge>
            <StatusBadge tone={policy.status === 'ACTIVE' ? 'allow' : 'neutral'}>
              {policy.status}
            </StatusBadge>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard icon={AlertCircle} label="Risk Tolerance" value={policy.riskTolerance} />
        <InfoCard icon={TrendingUp} label="Consequence Threshold" value={policy.consequenceThreshold} />
        <InfoCard icon={FileSearch} label="Evidence Requirement" value={policy.evidenceRequirement} />
        <InfoCard icon={ShieldCheck} label="Human Review" value={policy.humanReviewRequirement} />
        <InfoCard icon={Clock} label="Latency Budget" value={policy.latencyBudget} />
        <InfoCard icon={ScrollText} label="Last Updated" value={policy.lastUpdated} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Allowed Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {policy.allowedActions.map((d) => (
              <StatusBadge key={d} decision={d}>
                {d === 'HUMAN_REVIEW' ? 'HUMAN REVIEW' : d}
              </StatusBadge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Policy Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {policy.rules.map((rule, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-lg border border-border p-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {rule.condition}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{rule.rationale}</p>
                </div>
                <StatusBadge decision={rule.action} className="shrink-0">
                  {rule.action === 'HUMAN_REVIEW' ? 'HUMAN REVIEW' : rule.action}
                </StatusBadge>
              </div>
            ))}
          </div>
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
