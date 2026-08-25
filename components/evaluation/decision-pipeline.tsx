import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PipelineStage } from '@/types';
import {
  FileText,
  ShieldAlert,
  FileSearch,
  TrendingUp,
  ScrollText,
  GitBranch,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  ShieldX,
  Circle,
} from 'lucide-react';

const stageIcons: Record<
  PipelineStage['key'],
  React.ComponentType<{ className?: string }>
> = {
  context: FileText,
  risk: ShieldAlert,
  evidence: FileSearch,
  consequence: TrendingUp,
  policy: ScrollText,
  autonomy: GitBranch,
};

const stageStatusConfig: Record<
  PipelineStage['status'],
  { icon: React.ComponentType<{ className?: string }>; tone: string; bg: string; border: string }
> = {
  pass: {
    icon: CheckCircle2,
    tone: 'text-success',
    bg: 'bg-success/5',
    border: 'border-success/30',
  },
  warn: {
    icon: AlertTriangle,
    tone: 'text-warning',
    bg: 'bg-warning/5',
    border: 'border-warning/30',
  },
  fail: {
    icon: ShieldX,
    tone: 'text-destructive',
    bg: 'bg-destructive/5',
    border: 'border-destructive/30',
  },
  neutral: {
    icon: Circle,
    tone: 'text-muted-foreground',
    bg: 'bg-muted/30',
    border: 'border-border',
  },
};

interface DecisionPipelineProps {
  stages: PipelineStage[];
  className?: string;
  compact?: boolean;
}

export function DecisionPipeline({
  stages,
  className,
  compact = false,
}: DecisionPipelineProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Autonomy Decision Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn('flex', compact ? 'flex-col gap-1' : 'flex-col gap-2')}>
          {stages.map((stage, idx) => {
            const StageIcon = stageIcons[stage.key];
            const statusConfig = stageStatusConfig[stage.status];
            const StatusIcon = statusConfig.icon;

            return (
              <div key={stage.key}>
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-lg border p-3 transition-colors',
                    statusConfig.bg,
                    statusConfig.border
                  )}
                >
                  <div
                    className={cn(
                      'flex shrink-0 items-center justify-center rounded-md bg-card',
                      compact ? 'h-8 w-8' : 'h-9 w-9'
                    )}
                  >
                    <StageIcon className={cn('h-4 w-4', statusConfig.tone)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {stage.label}
                      </span>
                      <StatusIcon className={cn('h-3.5 w-3.5', statusConfig.tone)} />
                    </div>
                    {!compact && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {stage.detail}
                      </p>
                    )}
                  </div>
                </div>
                {idx < stages.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <ArrowDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
