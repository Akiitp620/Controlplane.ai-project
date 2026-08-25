import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/status-badge';
import type { Decision, EvaluationResult } from '@/types';
import { ChevronDown } from 'lucide-react';

interface DecisionReasoningPanelProps {
  decision: Decision;
  reasoning: string[];
  result?: EvaluationResult;
  className?: string;
}

export function DecisionReasoningPanel({
  decision,
  reasoning,
  result,
  className,
}: DecisionReasoningPanelProps) {
  const decisionLabel =
    decision === 'HUMAN_REVIEW'
      ? 'HUMAN REVIEW'
      : decision === 'MODIFY'
      ? 'MODIFY'
      : decision;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Why This Decision?</CardTitle>
          <StatusBadge decision={decision}>{decisionLabel}</StatusBadge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {reasoning.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {idx + 1}
                </div>
                {idx < reasoning.length - 1 && (
                  <div className="my-0.5 h-full min-h-6 w-px bg-border" />
                )}
              </div>
              <p className="pt-0.5 text-sm text-foreground">{reason}</p>
            </div>
          ))}
        </div>

        {result ? (
          <div className="mt-4 space-y-2 rounded-lg bg-muted/50 p-3">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Decision Factors
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
              <FactorItem
                label="Risk Level"
                value={result.riskLevel}
                badge={<StatusBadge risk={result.riskLevel}>{result.riskLevel}</StatusBadge>}
              />
              <FactorItem
                label="Evidence"
                value={result.evidence.status}
                badge={
                  <StatusBadge evidence={result.evidence.status}>
                    {result.evidence.status}
                  </StatusBadge>
                }
              />
              <FactorItem
                label="Consequence"
                value={result.consequence}
                badge={<StatusBadge risk={result.consequence}>{result.consequence}</StatusBadge>}
              />
            </div>
          </div>
        ) : null}

        <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Final Decision
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-bold text-foreground">
            {decisionLabel}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function FactorItem({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      {badge}
    </div>
  );
}
