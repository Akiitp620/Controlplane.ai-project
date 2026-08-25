'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/common/status-badge';
import { policies, useCaseList } from '@/lib/mock-data';
import { ScrollText, ArrowRight } from 'lucide-react';

export default function PoliciesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Policies"
        description="Governance policies that define autonomy rules for each AI use case."
      />

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium text-muted-foreground">Policy</th>
              <th className="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">
                Use Case
              </th>
              <th className="hidden px-4 py-3 font-medium text-muted-foreground lg:table-cell">
                Risk Tolerance
              </th>
              <th className="hidden px-4 py-3 font-medium text-muted-foreground lg:table-cell">
                Evidence
              </th>
              <th className="hidden px-4 py-3 font-medium text-muted-foreground xl:table-cell">
                Human Review
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Version</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {policies.map((policy) => {
              const uc = useCaseList.find((u) => u.id === policy.useCase);
              return (
                <tr key={policy.id} className="hover:bg-accent/30">
                  <td className="px-4 py-3">
                    <Link
                      href={`/policies/${policy.id}`}
                      className="flex items-center gap-2 font-medium text-foreground hover:text-primary"
                    >
                      <ScrollText className="h-4 w-4 text-muted-foreground" />
                      {policy.name}
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                    {uc?.name}
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <StatusBadge risk={policy.riskTolerance}>
                      {policy.riskTolerance}
                    </StatusBadge>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                    {policy.evidenceRequirement}
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-muted-foreground xl:table-cell">
                    {policy.humanReviewRequirement}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">
                      v{policy.version}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={policy.status === 'ACTIVE' ? 'allow' : 'neutral'}>
                      {policy.status}
                    </StatusBadge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {policies.map((policy) => {
          const uc = useCaseList.find((u) => u.id === policy.useCase);
          return (
            <Link key={policy.id} href={`/policies/${policy.id}`}>
              <Card className="h-full transition-colors hover:border-primary/40 hover:bg-accent/30">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <ScrollText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{policy.name}</CardTitle>
                        <div className="text-xs text-muted-foreground">
                          {uc?.name} · v{policy.version}
                        </div>
                      </div>
                    </div>
                    <StatusBadge tone={policy.status === 'ACTIVE' ? 'allow' : 'neutral'}>
                      {policy.status}
                    </StatusBadge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge risk={policy.riskTolerance}>
                      {policy.riskTolerance} Risk
                    </StatusBadge>
                    <Badge variant="outline" className="text-xs">
                      Evidence: {policy.evidenceRequirement}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Latency: {policy.latencyBudget}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {policy.humanReviewRequirement}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
