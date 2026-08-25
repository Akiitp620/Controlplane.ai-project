import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/status-badge';
import type { ConsequenceLevel } from '@/types';
import { TrendingUp } from 'lucide-react';

interface ConsequencePanelProps {
  level: ConsequenceLevel;
  impact: string;
  className?: string;
}

export function ConsequencePanel({
  level,
  impact,
  className,
}: ConsequencePanelProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Business Consequence</CardTitle>
          <StatusBadge risk={level}>{level}</StatusBadge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Potential Impact
            </div>
            <p className="mt-0.5 text-sm text-foreground">{impact}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
