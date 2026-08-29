'use client';

import * as React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/common/status-badge';
import { ErrorState } from '@/components/common/error-state';
import { LoadingState } from '@/components/common/loading-state';
import {
  Activity,
  ShieldAlert,
  ShieldX,
  Gauge,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';

const decisionColors: Record<string, string> = {
  ALLOW: 'hsl(var(--success))',
  MODIFY: 'hsl(var(--warning))',
  HUMAN_REVIEW: 'hsl(var(--review))',
  BLOCK: 'hsl(var(--destructive))',
};

const riskColors: Record<string, string> = {
  LOW: 'hsl(var(--success))',
  MEDIUM: 'hsl(var(--warning))',
  HIGH: 'hsl(var(--review))',
  CRITICAL: 'hsl(var(--destructive))',
};

export default function MetricsPage() {
  const [data, setData] = React.useState<{
    totalEvaluations: number;
    allowedDecisions: number;
    modifyDecisions: number;
    reviewDecisions: number;
    blockedDecisions: number;
    highRiskCount: number;
    mediumRiskCount: number;
    lowRiskCount: number;
    averageRiskScore: number;
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
    const token = window.localStorage.getItem('token');
    fetch(`${apiUrl}/api/metrics/dashboard`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load metrics.');
        setData(await response.json());
      })
      .catch((requestError: Error) => setError(requestError.message));
  }, []);

  if (error) return <ErrorState title="Metrics unavailable" description={error} />;
  if (!data) return <LoadingState />;

  const total = data.totalEvaluations || 1;
  const metrics = {
    evaluationsToday: data.totalEvaluations,
    allowRate: Math.round((data.allowedDecisions / total) * 100),
    modifyRate: Math.round((data.modifyDecisions / total) * 100),
    humanReviewRate: Math.round((data.reviewDecisions / total) * 100),
    blockRate: Math.round((data.blockedDecisions / total) * 100),
    decisionDistribution: [
      { decision: 'ALLOW', count: data.allowedDecisions },
      { decision: 'MODIFY', count: data.modifyDecisions },
      { decision: 'HUMAN_REVIEW', count: data.reviewDecisions },
      { decision: 'BLOCK', count: data.blockedDecisions },
    ],
    riskDistribution: [
      { risk: 'LOW', count: data.lowRiskCount },
      { risk: 'MEDIUM', count: data.mediumRiskCount },
      { risk: 'HIGH', count: data.highRiskCount },
      { risk: 'CRITICAL', count: 0 },
    ],
    evaluationVolume: [],
    humanReviewTrend: [],
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Metrics"
        description="System-level evaluation metrics and decision distribution."
        badge={
          <Badge variant="outline" className="text-xs text-muted-foreground">
            Demo / Simulated Metrics
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          icon={Activity}
          label="Total Evaluations"
          value={metrics.evaluationsToday}
        />
        <MetricCard
          icon={CheckCircle2}
          label="Allow Rate"
          value={`${metrics.allowRate}%`}
          tone="text-success"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Modify Rate"
          value={`${metrics.modifyRate}%`}
          tone="text-warning"
        />
        <MetricCard
          icon={ShieldAlert}
          label="Human Review Rate"
          value={`${metrics.humanReviewRate}%`}
          tone="text-review"
        />
        <MetricCard
          icon={ShieldX}
          label="Block Rate"
          value={`${metrics.blockRate}%`}
          tone="text-destructive"
        />
        <MetricCard
          icon={Gauge}
            label="Average Risk"
          value={`${Math.round(data.averageRiskScore)}%`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Decision Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.decisionDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="decision"
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(v) =>
                    v === 'HUMAN_REVIEW' ? 'REVIEW' : v
                  }
                />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {metrics.decisionDistribution.map((entry) => (
                    <Cell key={entry.decision} fill={decisionColors[entry.decision]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics.riskDistribution}
                  dataKey="count"
                  nameKey="risk"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => entry.risk}
                  labelLine={false}
                >
                  {metrics.riskDistribution.map((entry) => (
                    <Cell key={entry.risk} fill={riskColors[entry.risk]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evaluation Volume Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.evaluationVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Human Review Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.humanReviewTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="hsl(var(--review))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--review))', r: 3 }}
                  name="Pending"
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--success))', r: 3 }}
                  name="Resolved"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  tone?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </div>
            <div className="text-2xl font-bold tabular-nums text-foreground">
              {value}
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Icon className={`h-5 w-5 ${tone ?? 'text-muted-foreground'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
