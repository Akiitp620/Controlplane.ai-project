import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/status-badge';
import type { RiskFinding, RiskSeverity } from '@/types';
import {
  Brain,
  Lock,
  Scale,
  Shield,
  ShieldCheck,
} from 'lucide-react';

const dimensionConfig: Record<
  RiskFinding['dimension'],
  { label: string; icon: React.ComponentType<{ className?: string }>; description: string }
> = {
  hallucination: {
    label: 'Hallucination',
    icon: Brain,
    description: 'Factual accuracy and grounding',
  },
  privacy: {
    label: 'Privacy',
    icon: Lock,
    description: 'Sensitive data exposure',
  },
  bias: {
    label: 'Bias',
    icon: Scale,
    description: 'Fairness and discrimination',
  },
  safety: {
    label: 'Safety',
    icon: Shield,
    description: 'Harm prevention',
  },
  responsibility: {
    label: 'Responsibility',
    icon: ShieldCheck,
    description: 'Decision impact and accountability',
  },
};

const severityTone: Record<RiskSeverity, string> = {
  LOW: 'text-success',
  MEDIUM: 'text-warning',
  HIGH: 'text-review',
  CRITICAL: 'text-destructive',
};

interface RiskCardProps {
  finding: RiskFinding;
}

export function RiskCard({ finding }: RiskCardProps) {
  const config = dimensionConfig[finding.dimension];
  const Icon = config.icon;

  return (
    <div className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
            <Icon className="h-4.5 w-4.5 text-muted-foreground" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">
              {config.label}
            </div>
            <div className="text-xs text-muted-foreground">
              {config.description}
            </div>
          </div>
        </div>
        <StatusBadge risk={finding.severity as RiskSeverity}>
          {finding.severity}
        </StatusBadge>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{finding.explanation}</p>
      {finding.evidence ? (
        <p className="mt-2 text-xs text-muted-foreground">
          <span className="font-medium">Evidence: </span>
          {finding.evidence}
        </p>
      ) : null}
      {typeof finding.confidence === 'number' ? (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Confidence</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className={cn('h-full rounded-full', severityTone[finding.severity])}
              style={{
                width: `${Math.round(finding.confidence * 100)}%`,
                backgroundColor: 'currentColor',
              }}
            />
          </div>
          <span className="text-xs font-medium tabular-nums text-muted-foreground">
            {Math.round(finding.confidence * 100)}%
          </span>
        </div>
      ) : null}
    </div>
  );
}

interface RiskFingerprintProps {
  findings: RiskFinding[];
  className?: string;
}

export function RiskFingerprint({ findings, className }: RiskFingerprintProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Risk Fingerprint</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {findings.map((f) => (
            <RiskCard key={f.dimension} finding={f} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
