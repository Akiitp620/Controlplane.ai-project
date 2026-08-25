'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/status-badge';
import { useCaseList } from '@/lib/mock-data';
import {
  Briefcase,
  Clock,
  FileSearch,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export default function UseCasesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Use Cases"
        description="Enterprise AI use cases with their risk profiles and autonomy controls."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {useCaseList.map((uc) => (
          <Link key={uc.id} href={`/use-cases/${uc.id}`}>
            <Card className="h-full transition-colors hover:border-primary/40 hover:bg-accent/30">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{uc.name}</CardTitle>
                    </div>
                  </div>
                  <StatusBadge risk={uc.riskTolerance}>
                    {uc.riskTolerance} Risk
                  </StatusBadge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {uc.description}
                </p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Latency Budget
                      </div>
                      <div className="font-medium">{uc.latencyBudget}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileSearch className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Evidence
                      </div>
                      <div className="font-medium">
                        {uc.evidenceRequirement}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Human Review
                      </div>
                      <div className="font-medium text-xs">
                        {uc.humanReviewRule}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Common Risk
                      </div>
                      <div className="font-medium text-xs truncate">
                        {uc.commonRisks[0]}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-muted-foreground">
                    Allowed autonomy:
                  </span>
                  {uc.allowedAutonomy.map((d) => (
                    <StatusBadge key={d} decision={d} className="text-[10px]">
                      {d === 'HUMAN_REVIEW' ? 'REVIEW' : d}
                    </StatusBadge>
                  ))}
                </div>

                <div className="flex items-center text-sm font-medium text-primary pt-1">
                  View details
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
