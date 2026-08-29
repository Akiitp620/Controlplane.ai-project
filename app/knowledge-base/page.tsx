'use client';

import * as React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { LoadingState } from '@/components/common/loading-state';
import type { KnowledgeDocument } from '@/types';
import { Search, FileText, Upload, ArrowRight, BookOpen } from 'lucide-react';

export default function KnowledgeBasePage() {
  const [query, setQuery] = React.useState('');
  const [documents, setDocuments] = React.useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
    const token = window.localStorage.getItem('token');
    fetch(`${apiUrl}/api/documents`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load knowledge documents.');
        const backendDocuments = await response.json();
        setDocuments(backendDocuments.map((doc: { id: number; name: string; documentType?: string; description?: string; source?: string; createdAt?: string }) => ({
          id: String(doc.id),
          name: doc.name,
          version: '1.0',
          source: doc.source ?? 'Backend document store',
          lastUpdated: doc.createdAt ?? '',
          status: 'INDEXED',
          category: doc.documentType ?? 'General',
          sections: [{ id: `${doc.id}-summary`, title: 'Summary', content: doc.description ?? 'No description provided.' }],
          usedInEvaluations: 0,
        })));
      })
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(query.toLowerCase()) ||
      doc.category.toLowerCase().includes(query.toLowerCase()) ||
      doc.source.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState title="Knowledge base unavailable" description={error} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Base"
        description="Enterprise source documents used for evidence verification and RAG retrieval."
        badge={
          <Badge variant="outline" className="text-xs text-muted-foreground">
            Simulated Documents
          </Badge>
        }
        actions={
          <Button size="sm" variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        }
      />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No documents found"
          description="No documents match your search. Try a different query."
          icon={<BookOpen className="h-6 w-6" />}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((doc) => (
            <Link key={doc.id} href={`/knowledge-base/${doc.id}`}>
              <Card className="h-full transition-colors hover:border-primary/40 hover:bg-accent/30">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{doc.name}</CardTitle>
                        <div className="text-xs text-muted-foreground">
                          v{doc.version} · {doc.source}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        doc.status === 'INDEXED'
                          ? 'border-success/30 bg-success/10 text-success text-xs'
                          : doc.status === 'PROCESSING'
                          ? 'border-warning/30 bg-warning/10 text-warning text-xs'
                          : 'text-xs text-muted-foreground'
                      }
                    >
                      {doc.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {doc.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      Updated {doc.lastUpdated}
                    </Badge>
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      {doc.sections.length} sections
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {doc.sections[0]?.content}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground">
                      Used in {doc.usedInEvaluations} evaluations
                    </span>
                    <span className="flex items-center text-sm font-medium text-primary">
                      View
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
