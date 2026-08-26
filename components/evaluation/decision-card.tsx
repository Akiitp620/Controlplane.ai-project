import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/status-badge';
import type { Decision } from '@/types';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldX,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const decisionConfig: Record<
  Decision,
  {
    label: string;
    eyebrow: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    container: string;
    iconContainer: string;
    iconTone: string;
    labelTone: string;
  }
> = {
  ALLOW: {
    label: 'ALLOW',
    eyebrow: 'Autonomy decision',
    description: 'The response meets the current control requirements and may proceed.',
    icon: CheckCircle2,
    container:
      'border-emerald-200 bg-emerald-50/70 dark:border-emerald-400/20 dark:bg-emerald-400/[0.06]',
    iconContainer:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300',
    iconTone: 'text-emerald-600 dark:text-emerald-300',
    labelTone: 'text-emerald-700 dark:text-emerald-300',
  },

  MODIFY: {
    label: 'MODIFY',
    eyebrow: 'Autonomy decision',
    description: 'The response should be adjusted before it is allowed to proceed.',
    icon: AlertTriangle,
    container:
      'border-amber-200 bg-amber-50/70 dark:border-amber-400/20 dark:bg-amber-400/[0.06]',
    iconContainer:
      'bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300',
    iconTone: 'text-amber-600 dark:text-amber-300',
    labelTone: 'text-amber-700 dark:text-amber-300',
  },

  HUMAN_REVIEW: {
    label: 'HUMAN REVIEW',
    eyebrow: 'Human oversight required',
    description:
      'Risk, uncertainty, or consequence requires a human decision before proceeding.',
    icon: ShieldAlert,
    container:
      'border-orange-200 bg-orange-50/70 dark:border-orange-400/20 dark:bg-orange-400/[0.06]',
    iconContainer:
      'bg-orange-100 text-orange-700 dark:bg-orange-400/10 dark:text-orange-300',
    iconTone: 'text-orange-600 dark:text-orange-300',
    labelTone: 'text-orange-700 dark:text-orange-300',
  },

  BLOCK: {
    label: 'BLOCK',
    eyebrow: 'Autonomy decision',
    description:
      'The response exceeds the configured risk threshold and should not proceed.',
    icon: ShieldX,
    container:
      'border-red-200 bg-red-50/70 dark:border-red-400/20 dark:bg-red-400/[0.06]',
    iconContainer:
      'bg-red-100 text-red-700 dark:bg-red-400/10 dark:text-red-300',
    iconTone: 'text-red-600 dark:text-red-300',
    labelTone: 'text-red-700 dark:text-red-300',
  },
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
        'overflow-hidden border shadow-sm',
        config.container,
        className,
      )}
    >
      {/* Top decision header */}
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                config.iconContainer,
              )}
            >
              <Icon className={cn('h-5.5 w-5.5', config.iconTone)} />
            </div>

            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {config.eyebrow}
              </div>

              <div
                className={cn(
                  'mt-1 text-2xl font-bold tracking-tight sm:text-3xl',
                  config.labelTone,
                )}
              >
                {config.label}
              </div>
            </div>
          </div>

          <StatusBadge decision={decision} className="shrink-0 text-xs">
            {config.label}
          </StatusBadge>
        </div>

        {/* Decision explanation */}
        <div className="rounded-xl border border-black/[0.06] bg-white/60 p-4 dark:border-white/[0.06] dark:bg-black/10">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Why this decision
              </div>

              <p className="mt-1.5 text-sm leading-6 text-foreground/80">
                {reason || config.description}
              </p>
            </div>
          </div>
        </div>

        {/* Decision footer */}
        <div className="flex flex-col gap-3 border-t border-black/[0.06] pt-4 dark:border-white/[0.06] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-background/70">
              <ShieldAlert className="h-3.5 w-3.5" />
            </span>

            <span>
              ControlPlane has completed the autonomy assessment.
            </span>
          </div>

          {evaluationId && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
              <span className="max-w-[220px] truncate">
                {evaluationId}
              </span>
              <ArrowRight className="h-3 w-3" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}