'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';

import { PageHeader } from '@/components/layout/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/common/status-badge';
import { ErrorState } from '@/components/common/error-state';
import { LoadingState } from '@/components/common/loading-state';
import { Button } from '@/components/ui/button';

import {
  ArrowLeft,
  AlertCircle,
  Clock,
  FileSearch,
  ShieldCheck,
  TrendingUp,
  ScrollText,
} from 'lucide-react';

type BackendPolicy = {
  id: number;
  name: string;
  useCase: string;
  riskTolerance?: string;
  evidenceRequirement?: string;
  humanReviewRequirement?: string;
  version?: number;
  status?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

type PolicyViewModel = {
  id: string;
  name: string;
  useCase: string;
  riskTolerance: string;
  evidenceRequirement: string;
  humanReviewRequirement: string;
  version: number;
  status: string;
  description: string;
  lastUpdated: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export default function PolicyDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [policy, setPolicy] =
    React.useState<PolicyViewModel | null>(null);

  const [loading, setLoading] =
    React.useState(true);

  const [error, setError] =
    React.useState<string | null>(null);

  const loadPolicy = React.useCallback(async () => {
    const token = window.localStorage.getItem('token');

    const headers: HeadersInit = token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};

    const response = await fetch(
      `${API_URL}/api/policies/${params.id}`,
      {
        headers,
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          `Policy "${params.id}" does not exist.`,
        );
      }

      throw new Error(
        `Unable to load policy (${response.status}).`,
      );
    }

    const data =
      (await response.json()) as BackendPolicy;

    const normalizedPolicy: PolicyViewModel = {
      id: String(data.id),
      name: data.name,
      useCase: data.useCase,
      riskTolerance:
        data.riskTolerance ?? 'MEDIUM',
      evidenceRequirement:
        data.evidenceRequirement ?? 'OPTIONAL',
      humanReviewRequirement:
        data.humanReviewRequirement ?? 'OPTIONAL',
      version: Number(data.version ?? 1),
      status: data.status ?? 'ACTIVE',
      description:
        data.description?.trim() ??
        'No policy description provided.',
      lastUpdated:
        data.updatedAt ??
        data.createdAt ??
        new Date().toISOString(),
    };

    setPolicy(normalizedPolicy);
  }, [params.id]);

  React.useEffect(() => {
    let mounted = true;

    const fetchPolicy = async () => {
      try {
        setLoading(true);
        setError(null);

        await loadPolicy();
      } catch (requestError) {
        if (!mounted) return;

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load policy.',
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void fetchPolicy();

    return () => {
      mounted = false;
    };
  }, [loadPolicy]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !policy) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <ErrorState
          title="Policy not found"
          description={
            error ??
            `Policy "${params.id}" does not exist.`
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Header */}
      <PageHeader
        title={policy.name}
        description={`Version ${policy.version} · ${policy.useCase}`}
        badge={
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs"
            >
              v{policy.version}
            </Badge>

            <StatusBadge
              tone={
                policy.status === 'ACTIVE'
                  ? 'allow'
                  : 'neutral'
              }
            >
              {policy.status}
            </StatusBadge>
          </div>
        }
      />

      {/* Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard
          icon={AlertCircle}
          label="Risk Tolerance"
          value={policy.riskTolerance}
        />

        <InfoCard
          icon={TrendingUp}
          label="Use Case"
          value={policy.useCase}
        />

        <InfoCard
          icon={FileSearch}
          label="Evidence Requirement"
          value={policy.evidenceRequirement}
        />

        <InfoCard
          icon={ShieldCheck}
          label="Human Review"
          value={policy.humanReviewRequirement}
        />

        <InfoCard
          icon={Clock}
          label="Version"
          value={`v${policy.version}`}
        />

        <InfoCard
          icon={ScrollText}
          label="Last Updated"
          value={formatDate(policy.lastUpdated)}
        />
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Policy Description
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
            {policy.description}
          </p>
        </CardContent>
      </Card>

      {/* Governance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Governance Configuration
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <div className="text-xs text-muted-foreground">
                Risk Tolerance
              </div>

              <div className="mt-2">
                <StatusBadge
                  risk={normalizeRiskLevel(
                    policy.riskTolerance,
                  )}
                >
                  {policy.riskTolerance}
                </StatusBadge>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4">
              <div className="text-xs text-muted-foreground">
                Human Review
              </div>

              <div className="mt-2">
                <Badge
                  variant="outline"
                  className="text-xs"
                >
                  {policy.humanReviewRequirement}
                </Badge>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4">
              <div className="text-xs text-muted-foreground">
                Evidence
              </div>

              <div className="mt-2">
                <Badge
                  variant="outline"
                  className="text-xs"
                >
                  {policy.evidenceRequirement}
                </Badge>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4">
              <div className="text-xs text-muted-foreground">
                Policy Status
              </div>

              <div className="mt-2">
                <StatusBadge
                  tone={
                    policy.status === 'ACTIVE'
                      ? 'allow'
                      : 'neutral'
                  }
                >
                  {policy.status}
                </StatusBadge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

function normalizeRiskLevel(
  value: string | undefined,
): 'LOW' | 'MEDIUM' | 'HIGH' {
  switch (value?.toUpperCase()) {
    case 'LOW':
      return 'LOW';

    case 'HIGH':
      return 'HIGH';

    case 'MEDIUM':
    default:
      return 'MEDIUM';
  }
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

/* -------------------------------------------------------------------------- */
/* Info Card                                                                   */
/* -------------------------------------------------------------------------- */

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
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

          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">
              {label}
            </div>

            <div className="truncate text-sm font-semibold text-foreground">
              {value}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}