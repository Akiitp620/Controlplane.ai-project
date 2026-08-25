'use client';

import * as React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/common/status-badge';
import { EmptyState } from '@/components/common/empty-state';
import { getAuditTrail, useCaseList } from '@/lib/mock-data';
import type { Decision, RiskLevel, UseCaseId } from '@/types';
import { Search, History, ArrowRight } from 'lucide-react';

export default function AuditPage() {
  const [query, setQuery] = React.useState('');
  const [useCaseFilter, setUseCaseFilter] = React.useState<string>('all');
  const [decisionFilter, setDecisionFilter] = React.useState<string>('all');
  const [riskFilter, setRiskFilter] = React.useState<string>('all');

  const audits = React.useMemo(() => getAuditTrail(), []);

  const filtered = audits.filter((a) => {
    const matchesQuery =
      a.evaluationId.toLowerCase().includes(query.toLowerCase()) ||
      a.policy.toLowerCase().includes(query.toLowerCase());
    const matchesUseCase =
      useCaseFilter === 'all' || a.useCase === useCaseFilter;
    const matchesDecision =
      decisionFilter === 'all' || a.decision === decisionFilter;
    const matchesRisk = riskFilter === 'all' || a.risk === riskFilter;
    return matchesQuery && matchesUseCase && matchesDecision && matchesRisk;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Trail"
        description="Immutable record of all AI evaluations and their autonomy decisions."
        badge={
          <span className="text-xs text-muted-foreground">
            {audits.length} records
          </span>
        }
      />

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by evaluation ID or policy..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={useCaseFilter} onValueChange={setUseCaseFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Use Case" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Use Cases</SelectItem>
                {useCaseList.map((uc) => (
                  <SelectItem key={uc.id} value={uc.id}>
                    {uc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={decisionFilter} onValueChange={setDecisionFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Decision" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Decisions</SelectItem>
                <SelectItem value="ALLOW">ALLOW</SelectItem>
                <SelectItem value="MODIFY">MODIFY</SelectItem>
                <SelectItem value="HUMAN_REVIEW">HUMAN REVIEW</SelectItem>
                <SelectItem value="BLOCK">BLOCK</SelectItem>
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk</SelectItem>
                <SelectItem value="LOW">LOW</SelectItem>
                <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                <SelectItem value="HIGH">HIGH</SelectItem>
                <SelectItem value="CRITICAL">CRITICAL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          title="No audit records found"
          description="No evaluations match your filters. Try adjusting your search."
          icon={<History className="h-6 w-6" />}
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="whitespace-nowrap px-4 py-3 font-medium text-muted-foreground">
                    Timestamp
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium text-muted-foreground">
                    Evaluation ID
                  </th>
                  <th className="hidden whitespace-nowrap px-4 py-3 font-medium text-muted-foreground md:table-cell">
                    Use Case
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium text-muted-foreground">
                    Risk
                  </th>
                  <th className="hidden whitespace-nowrap px-4 py-3 font-medium text-muted-foreground lg:table-cell">
                    Consequence
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium text-muted-foreground">
                    Decision
                  </th>
                  <th className="hidden whitespace-nowrap px-4 py-3 font-medium text-muted-foreground xl:table-cell">
                    Policy
                  </th>
                  <th className="hidden whitespace-nowrap px-4 py-3 font-medium text-muted-foreground lg:table-cell">
                    Reviewer
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((a) => {
                  const uc = useCaseList.find((u) => u.id === a.useCase);
                  return (
                    <tr key={a.id} className="hover:bg-accent/30">
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                        {new Date(a.timestamp).toLocaleString('en-US', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Link
                          href={`/evaluate/${a.evaluationId}`}
                          className="font-mono text-xs font-medium text-primary hover:underline"
                        >
                          {a.evaluationId}
                        </Link>
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-muted-foreground md:table-cell">
                        {uc?.name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <StatusBadge risk={a.risk as RiskLevel}>
                          {a.risk}
                        </StatusBadge>
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 lg:table-cell">
                        <StatusBadge risk={a.consequence as RiskLevel}>
                          {a.consequence}
                        </StatusBadge>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <StatusBadge decision={a.decision as Decision}>
                          {a.decision === 'HUMAN_REVIEW'
                            ? 'HUMAN REVIEW'
                            : a.decision}
                        </StatusBadge>
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-xs text-muted-foreground xl:table-cell">
                        {a.policy}
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-xs text-muted-foreground lg:table-cell">
                        {a.reviewer ?? '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
