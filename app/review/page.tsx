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
import { ErrorState } from '@/components/common/error-state';
import { LoadingState } from '@/components/common/loading-state';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileSearch,
  Info,
} from 'lucide-react';

interface BackendReview {
  id: number;
  riskAssessmentId: number;
  decision?: string;
  modifiedResponse?: string;
  comments?: string;
  status: string;
  createdAt: string;
  reviewedAt?: string;
}

export default function ReviewPage() {
  const [reviews, setReviews] = React.useState<BackendReview[]>([]);
  const [reasons, setReasons] = React.useState<Record<string, string>>({});
  const [resolved, setResolved] = React.useState<BackendReview[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
    const token = window.localStorage.getItem('token');
    fetch(`${apiUrl}/api/human-reviews`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load human reviews.');
        const data: BackendReview[] = await response.json();
        setReviews(data.filter((review) => review.status === 'PENDING'));
      })
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (review: BackendReview, action: 'approve' | 'reject' | 'modify') => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
    const token = window.localStorage.getItem('token');
    const comments = reasons[String(review.id)]?.trim();
    // The backend modify endpoint reads `modifiedResponse` (not `comments`)
    // to update the passport's final response. For approve/reject, only
    // comments are needed.
    const body =
      action === 'modify'
        ? JSON.stringify({
            modifiedResponse: comments || 'Response modified by reviewer.',
            comments,
          })
        : JSON.stringify({ comments });
    const response = await fetch(`${apiUrl}/api/human-reviews/${review.id}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body,
    });
    if (!response.ok) {
      setError(`Unable to ${action} review.`);
      return;
    }
    const updated: BackendReview = await response.json();
    setResolved((prev) => [updated, ...prev]);
    setReviews((prev) => prev.filter((item) => item.id !== review.id));
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState title="Reviews unavailable" description={error} />;

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

      {reviews.length === 0 && resolved.length === 0 ? (
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
            return (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-review/10">
                        <ShieldCheck className="h-5 w-5 text-review" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          Review #{review.id}
                        </CardTitle>
                        <div className="text-xs text-muted-foreground">
                          Risk assessment #{review.riskAssessmentId} ·{' '}
                          {new Date(review.createdAt).toLocaleString('en-US', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge tone="review">
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
                      This review is linked to risk assessment #{review.riskAssessmentId}.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-border p-3">
                      <div className="text-xs text-muted-foreground">Risk Level</div>
                      <StatusBadge tone="review" className="mt-1">
                        PENDING
                      </StatusBadge>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <div className="text-xs text-muted-foreground">Evidence</div>
                      <StatusBadge
                        className="mt-1"
                      >
                        {review.decision ?? 'REVIEW REQUIRED'}
                      </StatusBadge>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <div className="text-xs text-muted-foreground">
                        Consequence
                      </div>
                      <StatusBadge tone="neutral" className="mt-1">
                        Assessment #{review.riskAssessmentId}
                      </StatusBadge>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Decision Recommendation
                    </div>
                    <p className="mt-1 text-sm text-foreground">
                      {review.comments ?? 'No reviewer comments yet.'}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`reason-${review.id}`}>
                      Reason (optional)
                    </Label>
                    <Textarea
                      id={`reason-${review.id}`}
                      placeholder="Provide a reason for this review decision..."
                      value={reasons[String(review.id)] ?? ''}
                      onChange={(e) =>
                        setReasons((prev) => ({
                          ...prev,
                          [String(review.id)]: e.target.value,
                        }))
                      }
                      className="min-h-[60px] text-sm"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAction(review, 'approve')}
                      className="bg-success text-success-foreground hover:bg-success/90"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleAction(review, 'reject')}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(review, 'modify')}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Override
                    </Button>
                    <Button asChild size="sm" variant="ghost" className="ml-auto">
                      <Link href={`/evaluate/EVAL-${review.riskAssessmentId}`}>
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

      {resolved.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recently Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {resolved.map((review) => (
                <div
                  key={review.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm">Review #{review.id}</span>
                    {review.comments && (
                      <span className="text-xs text-muted-foreground">
                        — {review.comments}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{review.reviewedAt}</span>
                    <span>·</span>
                    <StatusBadge
                      tone={
                        review.status === 'REVIEWED'
                          ? 'allow'
                          : review.decision === 'REJECT'
                          ? 'block'
                          : 'review'
                      }
                    >
                      {review.decision ?? review.status}
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
