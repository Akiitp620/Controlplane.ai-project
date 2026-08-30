'use client';

import * as React from 'react';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { LoadingState } from '@/components/common/loading-state';

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Database,
  FileText,
  Loader2,
  Search,
  Upload,
  X,
} from 'lucide-react';

type BackendDocument = {
  id: number;
  name: string;
  documentType?: string;
  description?: string;
  source?: string;
  createdAt?: string;
};

type BackendApplication = {
  id: number;
  name?: string;
};

type KnowledgeDocumentViewModel = {
  id: string;
  name: string;
  version: string;
  source: string;
  lastUpdated: string;
  status: 'INDEXED' | 'PROCESSING' | 'AVAILABLE';
  category: string;
  description: string;
  usedInEvaluations: number;
};

type UploadFormState = {
  name: string;
  documentType: string;
  description: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

const INITIAL_UPLOAD_FORM: UploadFormState = {
  name: '',
  documentType: 'POLICY',
  description: '',
};

const ACCEPTED_FILE_TYPES = '.txt,.md';

export default function KnowledgeBasePage() {
  const fileInputRef =
    React.useRef<HTMLInputElement | null>(null);

  const [query, setQuery] = React.useState('');
  const [documents, setDocuments] = React.useState<
    KnowledgeDocumentViewModel[]
  >([]);

  const [loading, setLoading] =
    React.useState(true);

  const [error, setError] =
    React.useState<string | null>(null);

  const [showUploadModal, setShowUploadModal] =
    React.useState(false);

  const [selectedFile, setSelectedFile] =
    React.useState<File | null>(null);

  const [fileContent, setFileContent] =
    React.useState('');

  const [uploading, setUploading] =
    React.useState(false);

  const [uploadError, setUploadError] =
    React.useState<string | null>(null);

  const [uploadSuccess, setUploadSuccess] =
    React.useState<string | null>(null);

  const [form, setForm] =
    React.useState<UploadFormState>(
      INITIAL_UPLOAD_FORM,
    );

  /* ------------------------------------------------------------------------ */
  /* Authentication                                                            */
  /* ------------------------------------------------------------------------ */

  const getAuthHeaders = React.useCallback(
    (includeContentType = false): HeadersInit => {
      const token =
        window.localStorage.getItem('token');

      return {
        ...(includeContentType
          ? {
              'Content-Type':
                'application/json',
            }
          : {}),
        ...(token
          ? {
              Authorization:
                `Bearer ${token}`,
            }
          : {}),
      };
    },
    [],
  );

  /* ------------------------------------------------------------------------ */
  /* Load documents                                                            */
  /* ------------------------------------------------------------------------ */

  const loadDocuments = React.useCallback(
    async () => {
      const response = await fetch(
        `${API_URL}/api/documents`,
        {
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Unable to load knowledge documents (${response.status}).`,
        );
      }

      const backendDocuments =
        (await response.json()) as BackendDocument[];

      const normalizedDocuments: KnowledgeDocumentViewModel[] =
        Array.isArray(backendDocuments)
          ? backendDocuments.map(
              (doc) => ({
                id: String(doc.id),
                name: doc.name,
                version: '1.0',
                source:
                  doc.source ??
                  'Backend document store',
                lastUpdated:
                  doc.createdAt ?? '',
                status: 'INDEXED',
                category:
                  doc.documentType ??
                  'GENERAL',
                description:
                  doc.description?.trim() ??
                  'No description provided.',
                usedInEvaluations: 0,
              }),
            )
          : [];

      setDocuments(normalizedDocuments);
    },
    [getAuthHeaders],
  );

  /* ------------------------------------------------------------------------ */
  /* Initial load                                                              */
  /* ------------------------------------------------------------------------ */

  React.useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        await loadDocuments();
      } catch (requestError) {
        if (!mounted) return;

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load knowledge documents.',
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      mounted = false;
    };
  }, [loadDocuments]);

  /* ------------------------------------------------------------------------ */
  /* Search                                                                    */
  /* ------------------------------------------------------------------------ */

  const filteredDocuments = React.useMemo(() => {
    const normalizedQuery =
      query.trim().toLowerCase();

    if (!normalizedQuery) {
      return documents;
    }

    return documents.filter(
      (doc) =>
        doc.name
          .toLowerCase()
          .includes(normalizedQuery) ||
        doc.category
          .toLowerCase()
          .includes(normalizedQuery) ||
        doc.source
          .toLowerCase()
          .includes(normalizedQuery) ||
        doc.description
          .toLowerCase()
          .includes(normalizedQuery),
    );
  }, [documents, query]);

  /* ------------------------------------------------------------------------ */
  /* Upload modal                                                              */
  /* ------------------------------------------------------------------------ */

  const openUploadModal = () => {
    setForm(INITIAL_UPLOAD_FORM);
    setSelectedFile(null);
    setFileContent('');
    setUploadError(null);
    setUploadSuccess(null);
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    if (uploading) return;

    setShowUploadModal(false);
    setForm(INITIAL_UPLOAD_FORM);
    setSelectedFile(null);
    setFileContent('');
    setUploadError(null);
  };

  /* ------------------------------------------------------------------------ */
  /* Escape key                                                                */
  /* ------------------------------------------------------------------------ */

  React.useEffect(() => {
    if (!showUploadModal) {
      return;
    }

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === 'Escape' &&
        !uploading
      ) {
        closeUploadModal();
      }
    };

    window.addEventListener(
      'keydown',
      handleEscape,
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleEscape,
      );
    };
  }, [showUploadModal, uploading]);

  /* ------------------------------------------------------------------------ */
  /* Form update                                                               */
  /* ------------------------------------------------------------------------ */

  const updateForm = (
    field: keyof UploadFormState,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (uploadError) {
      setUploadError(null);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* File selection                                                            */
  /* ------------------------------------------------------------------------ */

  const handleFileSelection = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    setUploadError(null);
    setUploadSuccess(null);

    const extension =
      file.name
        .split('.')
        .pop()
        ?.toLowerCase();

    if (
      extension !== 'txt' &&
      extension !== 'md'
    ) {
      setSelectedFile(null);
      setFileContent('');
      setUploadError(
        'Only .txt and .md files are supported right now.',
      );

      event.target.value = '';
      return;
    }

    try {
      const content =
        await file.text();

      if (!content.trim()) {
        setUploadError(
          'The selected file is empty.',
        );

        setSelectedFile(null);
        setFileContent('');
        event.target.value = '';

        return;
      }

      setSelectedFile(file);
      setFileContent(content);

      setForm((current) => ({
        ...current,
        name: current.name || file.name.replace(
          /\.(txt|md)$/i,
          '',
        ),
        description:
          current.description || content,
      }));
    } catch {
      setSelectedFile(null);
      setFileContent('');
      setUploadError(
        'Unable to read the selected file.',
      );

      event.target.value = '';
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Trigger native file picker                                                */
  /* ------------------------------------------------------------------------ */

  const chooseFile = () => {
    fileInputRef.current?.click();
  };

  /* ------------------------------------------------------------------------ */
  /* Upload validation                                                         */
  /* ------------------------------------------------------------------------ */

  const validateUpload = (): string | null => {
    if (!selectedFile) {
      return 'Please choose a .txt or .md document.';
    }

    if (!form.name.trim()) {
      return 'Document name is required.';
    }

    if (!fileContent.trim()) {
      return 'The selected document does not contain readable text.';
    }

    if (!form.documentType.trim()) {
      return 'Document type is required.';
    }

    return null;
  };

  /* ------------------------------------------------------------------------ */
  /* Resolve application                                                       */
  /* ------------------------------------------------------------------------ */

  const resolveApplicationId =
    async (): Promise<number> => {
      const response = await fetch(
        `${API_URL}/api/applications`,
        {
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Unable to resolve application (${response.status}).`,
        );
      }

      const applications =
        (await response.json()) as BackendApplication[];

      if (
        !Array.isArray(applications) ||
        applications.length === 0
      ) {
        throw new Error(
          'No application is available for document upload.',
        );
      }

      return applications[0].id;
    };

  /* ------------------------------------------------------------------------ */
  /* Upload document                                                           */
  /* ------------------------------------------------------------------------ */

  const handleUpload = async () => {
    const validationError =
      validateUpload();

    if (validationError) {
      setUploadError(validationError);
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);
      setUploadSuccess(null);

      const applicationId =
        await resolveApplicationId();

      const payload = {
        applicationId,
        name: form.name.trim(),
        documentType:
          form.documentType.trim().toUpperCase(),
        description: fileContent.trim(),
        source: `Uploaded via ControlPlane · ${selectedFile?.name ?? 'document'}`,
      };

      const response = await fetch(
        `${API_URL}/api/documents`,
        {
          method: 'POST',
          headers: getAuthHeaders(true),
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        let message =
          `Unable to upload document (${response.status}).`;

        try {
          const body =
            (await response.json()) as {
              message?: string;
              error?: string;
            };

          if (body.message) {
            message = body.message;
          } else if (body.error) {
            message = body.error;
          }
        } catch {
          // Use status-based fallback.
        }

        throw new Error(message);
      }

      await loadDocuments();

      setShowUploadModal(false);
      setForm(INITIAL_UPLOAD_FORM);
      setSelectedFile(null);
      setFileContent('');

      setUploadSuccess(
        'Document uploaded and indexed successfully.',
      );

      window.setTimeout(() => {
        setUploadSuccess(null);
      }, 4500);
    } catch (requestError) {
      setUploadError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to upload document.',
      );
    } finally {
      setUploading(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Render states                                                             */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        title="Knowledge base unavailable"
        description={error}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* -------------------------------------------------------------------- */}
      {/* Header                                                                */}
      {/* -------------------------------------------------------------------- */}

      <PageHeader
        title="Knowledge Base"
        description="Enterprise source documents used for evidence verification and RAG retrieval."
        badge={
          <Badge
            variant="outline"
            className="text-xs text-muted-foreground"
          >
            {documents.length}{' '}
            {documents.length === 1
              ? 'Document'
              : 'Documents'}
          </Badge>
        }
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={openUploadModal}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        }
      />

      {/* -------------------------------------------------------------------- */}
      {/* Success notification                                                  */}
      {/* -------------------------------------------------------------------- */}

      {uploadSuccess && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />

          <span>{uploadSuccess}</span>

          <button
            type="button"
            onClick={() =>
              setUploadSuccess(null)
            }
            className="ml-auto rounded-md p-1 transition-colors hover:bg-emerald-500/10"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* Search                                                                */}
      {/* -------------------------------------------------------------------- */}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search documents..."
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          className="pl-9"
        />
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Documents                                                              */}
      {/* -------------------------------------------------------------------- */}

      {filteredDocuments.length === 0 ? (
        <EmptyState
          title={
            documents.length === 0
              ? 'No documents yet'
              : 'No documents found'
          }
          description={
            documents.length === 0
              ? 'Upload your first governance document to make it available to the evidence retrieval layer.'
              : 'No documents match your current search.'
          }
          icon={
            <BookOpen className="h-6 w-6" />
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredDocuments.map(
            (document) => (
              <Link
                key={document.id}
                href={`/knowledge-base/${document.id}`}
                className="block"
              >
                <Card className="h-full transition-all hover:border-primary/40 hover:bg-accent/20 hover:shadow-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>

                        <div className="min-w-0">
                          <CardTitle className="truncate text-base">
                            {document.name}
                          </CardTitle>

                          <div className="mt-1 truncate text-xs text-muted-foreground">
                            v{document.version} ·{' '}
                            {document.source}
                          </div>
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className="shrink-0 border-success/30 bg-success/10 text-success text-xs"
                      >
                        {document.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="text-xs"
                      >
                        {document.category}
                      </Badge>

                      <Badge
                        variant="outline"
                        className="text-xs text-muted-foreground"
                      >
                        Updated{' '}
                        {document.lastUpdated || '—'}
                      </Badge>

                      <Badge
                        variant="outline"
                        className="text-xs text-muted-foreground"
                      >
                        Vector indexed
                      </Badge>
                    </div>

                    <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {document.description}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-muted-foreground">
                        {document.usedInEvaluations}{' '}
                        evaluations
                      </span>

                      <span className="flex items-center text-sm font-medium text-primary">
                        View
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ),
          )}
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* Upload modal                                                           */}
      {/* -------------------------------------------------------------------- */}

      {showUploadModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="upload-document-title"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeUploadModal();
            }
          }}
        >
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
            {/* Modal header */}
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Database className="h-4 w-4 text-primary" />
                </div>

                <div>
                  <h2
                    id="upload-document-title"
                    className="text-base font-semibold text-foreground"
                  >
                    Upload Knowledge Document
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Add a text-based source document to the
                    evidence retrieval layer.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeUploadModal}
                disabled={uploading}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close upload dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto px-6 py-6">
              <div className="space-y-5">
                {/* Hidden input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_FILE_TYPES}
                  onChange={handleFileSelection}
                  className="hidden"
                />

                {/* File picker */}
                <button
                  type="button"
                  onClick={chooseFile}
                  disabled={uploading}
                  className="group flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center transition-colors hover:border-primary/40 hover:bg-primary/[0.03] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-foreground">
                      {selectedFile
                        ? selectedFile.name
                        : 'Choose a document'}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {selectedFile
                        ? `${formatFileSize(selectedFile.size)} · ready to upload`
                        : 'Supported formats: .txt and .md'}
                    </p>
                  </div>
                </button>

                {/* Preview */}
                {selectedFile && (
                  <div className="rounded-lg border border-border bg-muted/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <FileText className="h-4 w-4 shrink-0 text-primary" />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {selectedFile.name}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(
                              selectedFile.size,
                            )}
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className="shrink-0 text-xs"
                      >
                        Text
                      </Badge>
                    </div>

                    <div className="mt-3 max-h-36 overflow-y-auto rounded-md border border-border bg-background p-3">
                      <p className="whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
                        {fileContent.slice(
                          0,
                          1500,
                        )}
                        {fileContent.length >
                        1500
                          ? '\n\n…'
                          : ''}
                      </p>
                    </div>
                  </div>
                )}

                {/* Error */}
                {uploadError && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {uploadError}
                  </div>
                )}

                {/* Form */}
                <div className="grid gap-5 md:grid-cols-2">
                  {/* Name */}
                  <div className="space-y-2 md:col-span-2">
                    <label
                      htmlFor="document-name"
                      className="text-sm font-medium text-foreground"
                    >
                      Document Name{' '}
                      <span className="text-destructive">
                        *
                      </span>
                    </label>

                    <Input
                      id="document-name"
                      value={form.name}
                      onChange={(event) =>
                        updateForm(
                          'name',
                          event.target.value,
                        )
                      }
                      placeholder="e.g. Refund Policy 2026"
                      disabled={uploading}
                    />
                  </div>

                  {/* Type */}
                  <div className="space-y-2">
                    <label
                      htmlFor="document-type"
                      className="text-sm font-medium text-foreground"
                    >
                      Document Type
                    </label>

                    <select
                      id="document-type"
                      value={
                        form.documentType
                      }
                      onChange={(event) =>
                        updateForm(
                          'documentType',
                          event.target.value,
                        )
                      }
                      disabled={uploading}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="POLICY">
                        POLICY
                      </option>
                      <option value="GUIDELINE">
                        GUIDELINE
                      </option>
                      <option value="PROCEDURE">
                        PROCEDURE
                      </option>
                      <option value="COMPLIANCE">
                        COMPLIANCE
                      </option>
                      <option value="GENERAL">
                        GENERAL
                      </option>
                    </select>
                  </div>

                  {/* Source */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Processing
                    </label>

                    <div className="flex h-10 items-center rounded-lg border border-border bg-muted/30 px-3 text-sm text-muted-foreground">
                      Upload & automatic indexing
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2 md:col-span-2">
                    <label
                      htmlFor="document-description"
                      className="text-sm font-medium text-foreground"
                    >
                      Content Preview
                    </label>

                    <textarea
                      id="document-description"
                      value={fileContent}
                      onChange={(event) => {
                        const value =
                          event.target.value;

                        setFileContent(value);

                        if (
                          !form.description
                        ) {
                          setForm((current) => ({
                            ...current,
                            description:
                              value,
                          }));
                        }
                      }}
                      rows={7}
                      disabled={uploading}
                      className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <p className="text-xs text-muted-foreground">
                      The text is stored as the document
                      content and passed to the existing vector
                      indexing layer.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/20 px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeUploadModal}
                disabled={uploading}
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleUpload}
                disabled={
                  uploading ||
                  !selectedFile
                }
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload & Index
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatFileSize(
  bytes: number,
): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}