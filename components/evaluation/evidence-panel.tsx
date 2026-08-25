import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/status-badge';
import type { EvidenceSource, EvidenceStatus } from '@/types';
import { FileText, CheckCircle2, XCircle, HelpCircle, AlertCircle } from 'lucide-react';

const evidenceIcon: Record<
  EvidenceStatus,
  React.ComponentType<{ className?: string }>
> = {
  VERIFIED: CheckCircle2,
  CONTRADICTED: XCircle,
  UNVERIFIED: AlertCircle,
  UNKNOWN: HelpCircle,
};

const evidenceToneClass: Record<EvidenceStatus, string> = {
  VERIFIED: 'text-success',
  CONTRADICTED: 'text-destructive',
  UNVERIFIED: 'text-warning',
  UNKNOWN: 'text-muted-foreground',
};

function EvidenceRow({ source }: { source: EvidenceSource }) {
  const Icon = evidenceIcon[source.status];
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">
              {source.title}
            </div>
            {source.version ? (
              <div className="text-xs text-muted-foreground">
                v{source.version}
              </div>
            ) : null}
          </div>
        </div>
        <StatusBadge evidence={source.status}>{source.status}</StatusBadge>
      </div>

      <div className="mt-3 space-y-2 text-sm">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Claim
          </span>
          <p className="text-foreground">{source.claim}</p>
        </div>
        {source.sourceSays ? (
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Source Says
            </span>
            <p className={evidenceToneClass[source.status]}>
              {source.sourceSays}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface EvidencePanelProps {
  status: EvidenceStatus;
  sources: EvidenceSource[];
  className?: string;
}

export function EvidencePanel({ status, sources, className }: EvidencePanelProps) {
  const Icon = evidenceIcon[status];
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Evidence Verification</CardTitle>
          <StatusBadge evidence={status}>{status}</StatusBadge>
        </div>
      </CardHeader>
      <CardContent>
        {sources.length === 0 ? (
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-border py-8 px-4 text-center">
            <Icon className={`h-5 w-5 ${evidenceToneClass[status]}`} />
            <div className="text-sm text-muted-foreground">
              {status === 'UNKNOWN'
                ? 'No evidence sources available for this evaluation.'
                : 'No source documents were retrieved for verification.'}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {sources.map((s) => (
              <EvidenceRow key={s.id} source={s} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
