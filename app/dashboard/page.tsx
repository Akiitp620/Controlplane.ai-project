'use client';

import { PageHeader } from '@/components/layout/page-header';
import { EvaluationWorkspace } from '@/components/evaluation/evaluation-workspace';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  ShieldAlert,
  ShieldX,
  Gauge,
} from 'lucide-react';
import { getDashboardMetrics } from '@/lib/mock-data';

export default function DashboardPage() {
  const metrics = getDashboardMetrics();

  return (
    <div className="space-y-6">
      <PageHeader
        title="ControlPlane"
        description="AI autonomy control at the point of decision."
        badge={
          <Badge variant="outline" className="text-xs text-muted-foreground">
            Demo / Simulated Metrics
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={Activity}
          label="Evaluations Today"
          value={metrics.evaluationsToday}
        />
        <KpiCard
          icon={ShieldAlert}
          label="Human Reviews"
          value={metrics.humanReviews}
          tone="text-review"
        />
        <KpiCard
          icon={ShieldX}
          label="Blocked"
          value={metrics.blocked}
          tone="text-destructive"
        />
        <KpiCard
          icon={Gauge}
          label="Avg Evaluation Latency"
          value={`${metrics.avgLatencyMs}ms`}
        />
      </div>

      <EvaluationWorkspace compact />
    </div>
  );
}

function KpiCard({
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
