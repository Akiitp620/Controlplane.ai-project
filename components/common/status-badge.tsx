import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { toneClasses, type BadgeTone } from '@/lib/status-config';
import type { Decision, EvidenceStatus, RiskLevel } from '@/types';

interface StatusBadgeProps {
  tone?: BadgeTone;
  decision?: Decision;
  evidence?: EvidenceStatus;
  risk?: RiskLevel;
  children?: React.ReactNode;
  className?: string;
}

export function StatusBadge({
  tone,
  decision,
  evidence,
  risk,
  children,
  className,
}: StatusBadgeProps) {
  const resolvedTone: BadgeTone =
    decision
      ? decision === 'ALLOW'
        ? 'allow'
        : decision === 'MODIFY'
        ? 'modify'
        : decision === 'HUMAN_REVIEW'
        ? 'review'
        : 'block'
      : evidence
      ? evidence === 'VERIFIED'
        ? 'verified'
        : evidence === 'CONTRADICTED'
        ? 'contradicted'
        : evidence === 'UNVERIFIED'
        ? 'unverified'
        : 'unknown'
      : risk
      ? risk === 'LOW'
        ? 'low'
        : risk === 'MEDIUM'
        ? 'medium'
        : risk === 'HIGH'
        ? 'high'
        : 'critical'
      : tone ?? 'neutral';

  return (
    <Badge
      variant="outline"
      className={cn(toneClasses[resolvedTone], 'font-semibold', className)}
    >
      {children}
    </Badge>
  );
}
