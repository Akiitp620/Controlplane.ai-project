import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/status-badge';
import type { Decision } from '@/types';
import { CheckCircle2, AlertTriangle, ShieldAlert, ShieldX } from 'lucide-react';

const decisionConfig: Record<
  Decision,
  { label: string; icon: React.ComponentType<{ className?: string }>; tone: string }
> = {
  ALLOW: { label: 'ALLOW', icon: CheckCircle2, tone: 'text-success' },
  MODIFY: { label: 'MODIFY', icon: AlertTriangle, tone: 'text-warning' },
  HUMAN_REVIEW: { label: 'HUMAN REVIEW', icon: ShieldAlert, tone: 'text-review' },
  BLOCK: { label: 'BLOCK', icon: ShieldX, tone: 'text-destructive' },
};

interface DecisionCardProps {
  decision: Decision;
  reason?: string;
  evaluationId?: string;
  className?: string;
}

export function DecisionCard({
  decision,
  reason,
  evaluationId,
  className,
}: DecisionCardProps) {
  const config = decisionConfig[decision];
  const Icon = config.icon;

  return (
    <Card
      className={cn(
        'relative overflow-hidden border-l-4 p-5',
        decision === 'ALLOW' && 'border-l-success',
        decision === 'MODIFY' && 'border-l-warning',
        decision === 'HUMAN_REVIEW' && 'border-l-review',
        decision === 'BLOCK' && 'border-l-destructive',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Autonomy Decision
          </div>
          <div className="flex items-center gap-2">
            <Icon className={cn('h-7 w-7', config.tone)} />
            <span className={cn('text-2xl font-bold tracking-tight', config.tone)}>
              {config.label}
            </span>
          </div>
        </div>
        <StatusBadge decision={decision} className="text-xs">
          {config.label}
        </StatusBadge>
      </div>
      {reason ? (
        <p className="mt-3 text-sm text-muted-foreground">{reason}</p>
      ) : null}
      {evaluationId ? (
        <div className="mt-3 font-mono text-xs text-muted-foreground">
          {evaluationId}
        </div>
      ) : null}
    </Card>
  );
}
