'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ErrorState } from '@/components/common/error-state';
import { Button } from '@/components/ui/button';
import { knowledgeDocumentMap } from '@/lib/mock-data';
import {
  ArrowLeft,
  FileText,
  BookOpen,
  GitBranch,
} from 'lucide-react';

export default function KnowledgeDocumentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const doc = knowledgeDocumentMap[params.id];

  if (!doc) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <ErrorState
          title="Document not found"
          description={`Document "${params.id}" does not exist.`}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <PageHeader
        title={doc.name}
        description={`${doc.source} · ${doc.category}`}
        badge={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              v{doc.version}
            </Badge>
            <Badge
              variant="outline"
              className={
                doc.status === 'INDEXED'
                  ? 'border-success/30 bg-success/10 text-success text-xs'
                  : 'text-xs text-muted-foreground'
              }
            >
              {doc.status}
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              Updated {doc.lastUpdated}
            </Badge>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Document Overview</CardTitle>
              <p className="text-xs text-muted-foreground">
                Used in {doc.usedInEvaluations} evaluations
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-xs text-muted-foreground">Source</div>
              <div className="text-sm font-medium">{doc.source}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Category</div>
              <div className="text-sm font-medium">{doc.category}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Version</div>
              <div className="text-sm font-medium">v{doc.version}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Last Updated</div>
              <div className="text-sm font-medium">{doc.lastUpdated}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Indexed Sections</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {doc.sections.map((section) => (
              <div
                key={section.id}
                className="rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-semibold text-foreground">
                    {section.title}
                  </h4>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Retrieval & Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This document is indexed for RAG-based evidence verification.
            When an AI response is evaluated, ControlPlane retrieves relevant
            passages from this document to verify or contradict claims made by
            the AI. This makes the evidence verification process transparent
            and auditable.
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-muted/50 p-3">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Simulated document — content is sample data for prototype demonstration.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
