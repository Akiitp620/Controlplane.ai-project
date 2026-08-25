'use client';

import * as React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/common/status-badge';
import { EmptyState } from '@/components/common/empty-state';
import {
  getPendingReviews,
  updateReviewStatus,
  useCaseList,
} from '@/lib/mock-data';
import type { EvaluationResult } from '@/types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileSearch,
  Info,
} from 'lucide-react';

export default function ReviewPage() {
  const [reviews, setReviews] = React.useState<EvaluationResult[]>([]);
  const [reasons, setReasons] = React.useState<Record<string, string>>({});
  const [resolved, setResolved] = React.useState<
    Record<string, EvaluationResult['humanReview']>
  >({});

  React.useEffect(() => {
    setReviews(getPendingReviews());
  }, []);

  const handleAction = (
    id: string,
    status: 'APPROVED' | 'REJECTED' | 'OVERRIDDEN'
  ) => {
    const reason = reasons[id]?.trim();
    const updated = updateReviewStatus(id, status, 'Risk Admin', reason);
    if (updated) {
      setResolved((prev) => ({ ...prev, [id]: updated.humanReview }));
      setReviews((prev) => prev.filter((r) => r.evaluationId !== id));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Human Review"
        description="Evaluations requiring human intervention before the AI response can proceed."
        badge={
          <span className="text-xs text-muted-foreground">
            {reviews.length} pending
          </span>
        }
      />

      <Card className="border-info/30 bg-info/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" />
            <p className="text-sm text-muted-foreground">
              Human feedback is captured for future policy and threshold
              refinement. It does not automatically retrain the model.
            </p>
          </div>
        </CardContent>
      </Card>

      {reviews.length === 0 && Object.keys(resolved).length === 0 ? (
        <EmptyState
          title="No reviews pending"
          description="There are no evaluations currently requiring human review. Run an evaluation with a high-consequence scenario to generate a review case."
          icon={<ShieldCheck className="h-6 w-6" />}
        />
      ) : reviews.length === 0 ? (
        <EmptyState
          title="All reviews resolved"
          description="All pending reviews have been addressed. New evaluations requiring human review will appear here."
          icon={<CheckCircle2 className="h-6 w-6" />}
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const uc = useCaseList.find((u) => u.id === review.useCase);
            return (
              <Card key={review.evaluationId}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-review/10">
                        <ShieldCheck className="h-5 w-5 text-review" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {review.evaluationId}
                        </CardTitle>
                        <div className="text-xs text-muted-foreground">
                          {uc?.name} ·{' '}
                          {new Date(review.timestamp).toLocaleString('en-US', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge decision={review.decision}>
                        HUMAN REVIEW
                      </StatusBadge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-border bg-muted/30 p-3">
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      AI Response
                    </div>
                    <p className="mt-1 whitespace-pre-wrap font-mono text-sm text-foreground">
                      {review.response}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-border p-3">
                      <div className="text-xs text-muted-foreground">Risk Level</div>
                      <StatusBadge risk={review.riskLevel} className="mt-1">
                        {review.riskLevel}
                      </StatusBadge>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <div className="text-xs text-muted-foreground">Evidence</div>
                      <StatusBadge
                        evidence={review.evidence.status}
                        className="mt-1"
                      >
                        {review.evidence.status}
                      </StatusBadge>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <div className="text-xs text-muted-foreground">
                        Consequence
                      </div>
                      <StatusBadge risk={review.consequence} className="mt-1">
                        {review.consequence}
                      </StatusBadge>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Decision Recommendation
                    </div>
                    <p className="mt-1 text-sm text-foreground">
                      {review.reasoning[0]}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`reason-${review.evaluationId}`}>
                      Reason (optional)
                    </Label>
                    <Textarea
                      id={`reason-${review.evaluationId}`}
                      placeholder="Provide a reason for this review decision..."
                      value={reasons[review.evaluationId] ?? ''}
                      onChange={(e) =>
                        setReasons((prev) => ({
                          ...prev,
                          [review.evaluationId]: e.target.value,
                        }))
                      }
                      className="min-h-[60px] text-sm"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAction(review.evaluationId, 'APPROVED')}
                      className="bg-success text-success-foreground hover:bg-success/90"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleAction(review.evaluationId, 'REJECTED')}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(review.evaluationId, 'OVERRIDDEN')}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Override
                    </Button>
                    <Button asChild size="sm" variant="ghost" className="ml-auto">
                      <Link href={`/evaluate/${review.evaluationId}`}>
                        <FileSearch className="mr-2 h-4 w-4" />
                        View Detail
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {Object.keys(resolved).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recently Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(resolved).map(([id, review]) => (
                <div
                  key={id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm">{id}</span>
                    {review?.reason && (
                      <span className="text-xs text-muted-foreground">
                        — {review.reason}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{review?.reviewer}</span>
                    <span>·</span>
                    <StatusBadge
                      tone={
                        review?.status === 'APPROVED'
                          ? 'allow'
                          : review?.status === 'REJECTED'
                          ? 'block'
                          : 'review'
                      }
                    >
                      {review?.status}
                    </StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
