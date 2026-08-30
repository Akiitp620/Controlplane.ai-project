'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';

import { PageHeader } from '@/components/layout/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ErrorState } from '@/components/common/error-state';
import { LoadingState } from '@/components/common/loading-state';
import { Button } from '@/components/ui/button';

import {
  ArrowLeft,
  BookOpen,
  FileText,
  GitBranch,
  Database,
  ShieldCheck,
  Clock3,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Backend contract                                                           */
/* -------------------------------------------------------------------------- */

type BackendDocument = {
  id: number;
  name: string;
  documentType?: string;
  description?: string;
  source?: string;
  createdAt?: string;
};

/* -------------------------------------------------------------------------- */
/* UI model                                                                   */
/* -------------------------------------------------------------------------- */

type DocumentViewModel = {
  id: string;
  name: string;
  documentType: string;
  description: string;
  source: string;
  createdAt: string;
};

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function KnowledgeDocumentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [document, setDocument] =
    React.useState<DocumentViewModel | null>(null);

  const [loading, setLoading] =
    React.useState(true);

  const [error, setError] =
    React.useState<string | null>(null);

  /* ------------------------------------------------------------------------ */
  /* Fetch document                                                           */
  /* ------------------------------------------------------------------------ */

  React.useEffect(() => {
    let mounted = true;

    const fetchDocument = async () => {
      try {
        setLoading(true);
        setError(null);

        const token =
          window.localStorage.getItem('token');

        const headers: HeadersInit = token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {};

        const response = await fetch(
          `${API_URL}/api/documents`,
          {
            headers,
          },
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load documents (${response.status}).`,
          );
        }

        const documents =
          (await response.json()) as BackendDocument[];

        const backendDocument = documents.find(
          (item) =>
            String(item.id) === String(params.id),
        );

        if (!backendDocument) {
          throw new Error(
            `Document "${params.id}" does not exist.`,
          );
        }

        const normalizedDocument: DocumentViewModel = {
          id: String(backendDocument.id),
          name: backendDocument.name,
          documentType:
            backendDocument.documentType ??
            'GENERAL',
          description:
            backendDocument.description?.trim() ??
            'No document content or description is available.',
          source:
            backendDocument.source ??
            'Backend document store',
          createdAt:
            backendDocument.createdAt ??
            '',
        };

        if (!mounted) return;

        setDocument(normalizedDocument);
      } catch (requestError) {
        if (!mounted) return;

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load document.',
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void fetchDocument();

    return () => {
      mounted = false;
    };
  }, [params.id]);

  /* ------------------------------------------------------------------------ */
  /* Render states                                                             */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return <LoadingState />;
  }

  if (error || !document) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <ErrorState
          title="Document unavailable"
          description={
            error ??
            `Document "${params.id}" does not exist.`
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* -------------------------------------------------------------------- */}
      {/* Back navigation                                                       */}
      {/* -------------------------------------------------------------------- */}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* -------------------------------------------------------------------- */}
      {/* Header                                                                */}
      {/* -------------------------------------------------------------------- */}

      <PageHeader
        title={document.name}
        description={`${document.source} · ${document.documentType}`}
        badge={
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs"
            >
              v1.0
            </Badge>

            <Badge
              variant="outline"
              className="border-success/30 bg-success/10 text-success text-xs"
            >
              INDEXED
            </Badge>
          </div>
        }
      />

      {/* -------------------------------------------------------------------- */}
      {/* Overview                                                              */}
      {/* -------------------------------------------------------------------- */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard
          icon={FileText}
          label="Document Type"
          value={document.documentType}
        />

        <InfoCard
          icon={Database}
          label="Source"
          value={document.source}
        />

        <InfoCard
          icon={ShieldCheck}
          label="Index Status"
          value="INDEXED"
        />

        <InfoCard
          icon={Clock3}
          label="Created"
          value={formatDate(document.createdAt)}
        />
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Document content                                                       */}
      {/* -------------------------------------------------------------------- */}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>

            <div>
              <CardTitle className="text-base">
                Indexed Content
              </CardTitle>

              <p className="mt-1 text-xs text-muted-foreground">
                Content available to the evidence retrieval
                layer.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border border-border bg-muted/20 p-5">
            <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/80">
              {document.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* -------------------------------------------------------------------- */}
      {/* Retrieval information                                                  */}
      {/* -------------------------------------------------------------------- */}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Retrieval & Verification
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm leading-6 text-muted-foreground">
            This document is available to ControlPlane&apos;s
            evidence retrieval layer. During an AI evaluation,
            relevant indexed content can be retrieved and used
            as supporting evidence for the governance decision.
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            <RetrievalItem
              label="Vector Index"
              value="Available"
            />

            <RetrievalItem
              label="Document ID"
              value={document.id}
            />

            <RetrievalItem
              label="Status"
              value="Ready"
            />
          </div>
        </CardContent>
      </Card>

      {/* -------------------------------------------------------------------- */}
      {/* Governance usage                                                      */}
      {/* -------------------------------------------------------------------- */}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Governance Role
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

              <div>
                <p className="text-sm font-medium text-foreground">
                  Evidence source for AI evaluation
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  ControlPlane can use this indexed document
                  as trusted context when evaluating AI
                  responses and determining whether a decision
                  should be allowed, modified, escalated, or
                  blocked.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Small reusable components                                                   */
/* -------------------------------------------------------------------------- */

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">
              {label}
            </div>

            <div className="truncate text-sm font-semibold text-foreground">
              {value}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RetrievalItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="text-xs text-muted-foreground">
        {label}
      </div>

      <div className="mt-1 text-sm font-medium text-foreground">
        {value}
      </div>
    </div>
  );
}

function formatDate(value: string) {
  if (!value) {
    return 'Not available';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}