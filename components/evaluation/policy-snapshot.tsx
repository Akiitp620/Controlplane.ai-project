import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PolicySnapshot } from '@/types';
import { ScrollText } from 'lucide-react';

interface PolicySnapshotProps {
  policy: PolicySnapshot;
  className?: string;
}

export function PolicySnapshotCard({ policy, className }: PolicySnapshotProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Policy Applied</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
            <ScrollText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <div className="text-sm font-semibold text-foreground">
              {policy.name}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                v{policy.version}
              </Badge>
              <Badge
                variant="outline"
                className={
                  policy.status === 'ACTIVE'
                    ? 'border-success/30 bg-success/10 text-success text-xs'
                    : 'text-xs'
                }
              >
                {policy.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
