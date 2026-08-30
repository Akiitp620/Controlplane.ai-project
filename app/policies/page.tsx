'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  Plus,
  Save,
  ScrollText,
  X,
} from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/common/status-badge';
import { ErrorState } from '@/components/common/error-state';
import { LoadingState } from '@/components/common/loading-state';

/* -------------------------------------------------------------------------- */
/* Backend contracts                                                           */
/* -------------------------------------------------------------------------- */

type BackendPolicy = {
  id: number;
  name: string;
  useCase: string;
  riskTolerance: string;
  evidenceRequirement: string;
  humanReviewRequirement: string;
  version?: number;
  status: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

type BackendUseCase = {
  useCaseId: string;
  name: string;
  latencyBudget?: string;
};

/* -------------------------------------------------------------------------- */
/* UI models                                                                   */
/* -------------------------------------------------------------------------- */
type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

type PolicyViewModel = {
  id: string;
  name: string;
  useCase: string;
  useCaseName: string;
  riskTolerance: RiskLevel;
  evidenceRequirement: string;
  humanReviewRequirement: string;
  version: number;
  status: string;
  description: string;
  lastUpdated: string;
  latencyBudget: string;
};

type UseCaseViewModel = {
  id: string;
  name: string;
  latencyBudget: string;
};

/* -------------------------------------------------------------------------- */
/* Form models                                                                 */
/* -------------------------------------------------------------------------- */

type PolicyFormState = {
  name: string;
  useCase: string;
  riskTolerance: string;
  evidenceRequirement: string;
  humanReviewRequirement: string;
  description: string;
  version: string;
  status: string;
};

type CreatePolicyPayload = {
  name: string;
  useCase: string;
  riskTolerance: string;
  evidenceRequirement: string;
  humanReviewRequirement: string;
  description: string;
  version: number;
  status: string;
};

/* -------------------------------------------------------------------------- */
/* Constants                                                                   */
/* -------------------------------------------------------------------------- */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

const normalizeRiskLevel = (
  value: string | undefined,
): RiskLevel => {
  switch (value?.toUpperCase()) {
    case 'LOW':
      return 'LOW';

    case 'MEDIUM':
      return 'MEDIUM';

    case 'HIGH':
      return 'HIGH';

    default:
      return 'MEDIUM';
  }
};

const INITIAL_FORM: PolicyFormState = {
  name: '',
  useCase: '',
  riskTolerance: 'LOW',
  evidenceRequirement: 'REQUIRED',
  humanReviewRequirement: 'REQUIRED',
  description: '',
  version: '1',
  status: 'ACTIVE',
};

const RISK_OPTIONS = ['LOW', 'MEDIUM', 'HIGH'] as const;

const EVIDENCE_OPTIONS = [
  'REQUIRED',
  'RECOMMENDED',
  'OPTIONAL',
  'NOT_REQUIRED',
] as const;

const HUMAN_REVIEW_OPTIONS = [
  'REQUIRED',
  'CONDITIONAL',
  'OPTIONAL',
  'NOT_REQUIRED',
] as const;

const STATUS_OPTIONS = [
  'ACTIVE',
  'DRAFT',
  'INACTIVE',
] as const;

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

export default function PoliciesPage() {
  const [policyList, setPolicyList] = React.useState<PolicyViewModel[]>([]);
  const [useCaseList, setUseCaseList] = React.useState<UseCaseViewModel[]>([]);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [creating, setCreating] = React.useState(false);

  const [form, setForm] =
    React.useState<PolicyFormState>(INITIAL_FORM);

  const [formError, setFormError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] =
    React.useState<string | null>(null);

  /* ------------------------------------------------------------------------ */
  /* Authentication                                                            */
  /* ------------------------------------------------------------------------ */

  const getAuthHeaders = React.useCallback(
    (includeContentType = false): HeadersInit => {
      const token = window.localStorage.getItem('token');

      return {
        ...(includeContentType
          ? { 'Content-Type': 'application/json' }
          : {}),
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
      };
    },
    [],
  );

  /* ------------------------------------------------------------------------ */
  /* Load data                                                                 */
  /* ------------------------------------------------------------------------ */

  const loadData = React.useCallback(async () => {
    const [policiesResponse, useCasesResponse] =
      await Promise.all([
        fetch(`${API_URL}/api/policies`, {
          headers: getAuthHeaders(),
        }),
        fetch(`${API_URL}/api/use-cases`, {
          headers: getAuthHeaders(),
        }),
      ]);

    if (!policiesResponse.ok) {
      throw new Error(
        `Unable to load policies (${policiesResponse.status}).`,
      );
    }

    if (!useCasesResponse.ok) {
      throw new Error(
        `Unable to load use cases (${useCasesResponse.status}).`,
      );
    }

    const [
      backendPolicies,
      backendUseCases,
    ] = await Promise.all([
      policiesResponse.json() as Promise<BackendPolicy[]>,
      useCasesResponse.json() as Promise<BackendUseCase[]>,
    ]);

    const normalizedUseCases: UseCaseViewModel[] =
      Array.isArray(backendUseCases)
        ? backendUseCases.map((useCase) => ({
            id: String(useCase.useCaseId),
            name: useCase.name,
            latencyBudget:
              useCase.latencyBudget ?? 'MEDIUM',
          }))
        : [];

    const normalizedPolicies: PolicyViewModel[] =
      Array.isArray(backendPolicies)
        ? backendPolicies.map((policy) => {
            const matchingUseCase =
              normalizedUseCases.find(
                (useCase) =>
                  useCase.id === String(policy.useCase),
              );

            return {
              id: String(policy.id),
              name: policy.name,
              useCase: String(policy.useCase),
              useCaseName:
                matchingUseCase?.name ??
                String(policy.useCase),
              riskTolerance: normalizeRiskLevel(
  policy.riskTolerance,
),
              evidenceRequirement:
                policy.evidenceRequirement ??
                'OPTIONAL',
              humanReviewRequirement:
                policy.humanReviewRequirement ??
                'OPTIONAL',
              version: Number(policy.version ?? 1),
              status: policy.status ?? 'ACTIVE',
              description:
                policy.description?.trim() ?? '',
              lastUpdated:
                policy.updatedAt ??
                policy.createdAt ??
                new Date().toISOString(),
              latencyBudget:
                matchingUseCase?.latencyBudget ??
                'MEDIUM',
            };
          })
        : [];

    setUseCaseList(normalizedUseCases);
    setPolicyList(normalizedPolicies);
  }, [getAuthHeaders]);

  /* ------------------------------------------------------------------------ */
  /* Initial fetch                                                             */
  /* ------------------------------------------------------------------------ */

  React.useEffect(() => {
    let mounted = true;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        await loadData();
      } catch (requestError) {
        if (!mounted) return;

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load policy data.',
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void fetchInitialData();

    return () => {
      mounted = false;
    };
  }, [loadData]);

  /* ------------------------------------------------------------------------ */
  /* Modal controls                                                            */
  /* ------------------------------------------------------------------------ */

  const openCreateModal = () => {
    setForm(INITIAL_FORM);
    setFormError(null);
    setSuccessMessage(null);
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    if (creating) return;

    setShowCreateModal(false);
    setForm(INITIAL_FORM);
    setFormError(null);
  };

  /* ------------------------------------------------------------------------ */
  /* Escape key                                                                */
  /* ------------------------------------------------------------------------ */

  React.useEffect(() => {
    if (!showCreateModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !creating) {
        closeCreateModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showCreateModal, creating]);

  /* ------------------------------------------------------------------------ */
  /* Form helpers                                                              */
  /* ------------------------------------------------------------------------ */

  const updateForm = (
    field: keyof PolicyFormState,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (formError) {
      setFormError(null);
    }
  };

  const validateForm = (): string | null => {
    const name = form.name.trim();
    const description = form.description.trim();
    const version = Number(form.version);

    if (!name) {
      return 'Policy name is required.';
    }

    if (name.length < 3) {
      return 'Policy name must contain at least 3 characters.';
    }

    if (!form.useCase) {
      return 'Please select a use case.';
    }

    if (!description) {
      return 'Policy description is required.';
    }

    if (description.length < 10) {
      return 'Policy description should contain at least 10 characters.';
    }

    if (!Number.isInteger(version) || version < 1) {
      return 'Policy version must be a positive whole number.';
    }

    return null;
  };

  /* ------------------------------------------------------------------------ */
  /* Create policy                                                             */
  /* ------------------------------------------------------------------------ */

  const handleCreatePolicy = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    const payload: CreatePolicyPayload = {
      name: form.name.trim(),
      useCase: form.useCase,
      riskTolerance: form.riskTolerance,
      evidenceRequirement: form.evidenceRequirement,
      humanReviewRequirement:
        form.humanReviewRequirement,
      description: form.description.trim(),
      version: Number(form.version),
      status: form.status,
    };

    try {
      setCreating(true);
      setFormError(null);
      setSuccessMessage(null);

      const response = await fetch(
        `${API_URL}/api/policies`,
        {
          method: 'POST',
          headers: getAuthHeaders(true),
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        let message =
          `Unable to create policy (${response.status}).`;

        try {
          const responseBody =
            (await response.json()) as {
              message?: string;
              error?: string;
            };

          if (responseBody.message) {
            message = responseBody.message;
          } else if (responseBody.error) {
            message = responseBody.error;
          }
        } catch {
          // Keep the status-based fallback message.
        }

        throw new Error(message);
      }

      await loadData();

      setShowCreateModal(false);
      setForm(INITIAL_FORM);

      setSuccessMessage(
        'Policy created successfully.',
      );

      window.setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } catch (requestError) {
      setFormError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to create policy.',
      );
    } finally {
      setCreating(false);
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
        title="Policies unavailable"
        description={error}
      />
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Page                                                                      */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-6">
      {/* -------------------------------------------------------------------- */}
      {/* Page header                                                           */}
      {/* -------------------------------------------------------------------- */}

      <PageHeader
        title="Policies"
        description="Governance policies that define autonomy rules for each AI use case."
      />

      {/* -------------------------------------------------------------------- */}
      {/* Success notification                                                  */}
      {/* -------------------------------------------------------------------- */}

      {successMessage && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />

          <span>{successMessage}</span>

          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="ml-auto rounded-md p-1 transition-colors hover:bg-emerald-500/10"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* Action row                                                             */}
      {/* -------------------------------------------------------------------- */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {policyList.length}{' '}
            {policyList.length === 1
              ? 'policy'
              : 'policies'}{' '}
            configured
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/25"
        >
          <Plus className="h-4 w-4" />
          Add Policy
        </button>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Policy table                                                           */}
      {/* -------------------------------------------------------------------- */}

      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-muted/40">
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3.5 font-medium text-muted-foreground">
                  Policy
                </th>

                <th className="px-4 py-3.5 font-medium text-muted-foreground">
                  Use Case
                </th>

                <th className="px-4 py-3.5 font-medium text-muted-foreground">
                  Risk
                </th>

                <th className="px-4 py-3.5 font-medium text-muted-foreground">
                  Evidence
                </th>

                <th className="px-4 py-3.5 font-medium text-muted-foreground">
                  Human Review
                </th>

                <th className="px-4 py-3.5 font-medium text-muted-foreground">
                  Version
                </th>

                <th className="px-4 py-3.5 font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {policyList.map((policy) => (
                <tr
                  key={policy.id}
                  className="transition-colors hover:bg-accent/20"
                >
                  <td className="px-4 py-4">
                    <Link
                      href={`/policies/${policy.id}`}
                      className="group flex items-center gap-2"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                        <ScrollText className="h-4 w-4 text-primary" />
                      </span>

                      <span className="font-medium text-foreground group-hover:text-primary">
                        {policy.name}
                      </span>

                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </td>

                  <td className="px-4 py-4 text-muted-foreground">
                    {policy.useCaseName}
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge risk={policy.riskTolerance}>
                      {policy.riskTolerance}
                    </StatusBadge>
                  </td>

                  <td className="px-4 py-4 text-muted-foreground">
                    {policy.evidenceRequirement}
                  </td>

                  <td className="px-4 py-4 text-xs text-muted-foreground">
                    {policy.humanReviewRequirement}
                  </td>

                  <td className="px-4 py-4">
                    <Badge
                      variant="outline"
                      className="text-xs"
                    >
                      v{policy.version}
                    </Badge>
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge
                      tone={
                        policy.status === 'ACTIVE'
                          ? 'allow'
                          : 'neutral'
                      }
                    >
                      {policy.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))}

              {policyList.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-14 text-center"
                  >
                    <div className="mx-auto flex max-w-md flex-col items-center">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>

                      <h3 className="text-sm font-semibold text-foreground">
                        No governance policies yet
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Create your first policy to define
                        autonomy and human-review rules.
                      </p>

                      <button
                        type="button"
                        onClick={openCreateModal}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm font-medium transition-colors hover:bg-accent"
                      >
                        <Plus className="h-4 w-4" />
                        Create first policy
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Policy cards                                                           */}
      {/* -------------------------------------------------------------------- */}

      <div className="grid gap-4 md:grid-cols-2">
        {policyList.map((policy) => (
          <Link
            key={policy.id}
            href={`/policies/${policy.id}`}
            className="block"
          >
            <Card className="h-full transition-all hover:border-primary/40 hover:bg-accent/20 hover:shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <ScrollText className="h-5 w-5 text-primary" />
                    </div>

                    <div className="min-w-0">
                      <CardTitle className="truncate text-base">
                        {policy.name}
                      </CardTitle>

                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {policy.useCaseName} · v
                        {policy.version}
                      </p>
                    </div>
                  </div>

                  <StatusBadge
                    tone={
                      policy.status === 'ACTIVE'
                        ? 'allow'
                        : 'neutral'
                    }
                  >
                    {policy.status}
                  </StatusBadge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge risk={policy.riskTolerance}>
                    {policy.riskTolerance} Risk
                  </StatusBadge>

                  <Badge
                    variant="outline"
                    className="text-xs"
                  >
                    Evidence: {policy.evidenceRequirement}
                  </Badge>

                  <Badge
                    variant="outline"
                    className="text-xs"
                  >
                    Review: {policy.humanReviewRequirement}
                  </Badge>
                </div>

                <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {policy.description ||
                    'No policy description provided.'}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Create Policy Modal                                                    */}
      {/* -------------------------------------------------------------------- */}

      {showCreateModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-policy-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeCreateModal();
            }
          }}
        >
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
            {/* Modal header */}
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>

                <div>
                  <h2
                    id="create-policy-title"
                    className="text-base font-semibold text-foreground"
                  >
                    Create Governance Policy
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Define how an AI use case should be
                    governed.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                disabled={creating}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto px-6 py-6">
              <form
                id="create-policy-form"
                onSubmit={handleCreatePolicy}
                className="space-y-5"
              >
                {formError && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {formError}
                  </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">
                  {/* Name */}
                  <div className="space-y-2 md:col-span-2">
                    <label
                      htmlFor="policy-name"
                      className="text-sm font-medium text-foreground"
                    >
                      Policy Name{' '}
                      <span className="text-destructive">
                        *
                      </span>
                    </label>

                    <input
                      id="policy-name"
                      type="text"
                      value={form.name}
                      onChange={(event) =>
                        updateForm(
                          'name',
                          event.target.value,
                        )
                      }
                      placeholder="e.g. Refund Governance Policy"
                      disabled={creating}
                      autoComplete="off"
                      className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  {/* Use Case */}
                  <div className="space-y-2">
                    <label
                      htmlFor="policy-use-case"
                      className="text-sm font-medium text-foreground"
                    >
                      Use Case{' '}
                      <span className="text-destructive">
                        *
                      </span>
                    </label>

                    <select
                      id="policy-use-case"
                      value={form.useCase}
                      onChange={(event) =>
                        updateForm(
                          'useCase',
                          event.target.value,
                        )
                      }
                      disabled={creating}
                      className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="">
                        Select a use case
                      </option>

                      {useCaseList.map((useCase) => (
                        <option
                          key={useCase.id}
                          value={useCase.id}
                        >
                          {useCase.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Risk */}
                  <div className="space-y-2">
                    <label
                      htmlFor="policy-risk"
                      className="text-sm font-medium text-foreground"
                    >
                      Risk Tolerance
                    </label>

                    <select
                      id="policy-risk"
                      value={form.riskTolerance}
                      onChange={(event) =>
                        updateForm(
                          'riskTolerance',
                          event.target.value,
                        )
                      }
                      disabled={creating}
                      className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {RISK_OPTIONS.map((option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Evidence */}
                  <div className="space-y-2">
                    <label
                      htmlFor="policy-evidence"
                      className="text-sm font-medium text-foreground"
                    >
                      Evidence Requirement
                    </label>

                    <select
                      id="policy-evidence"
                      value={form.evidenceRequirement}
                      onChange={(event) =>
                        updateForm(
                          'evidenceRequirement',
                          event.target.value,
                        )
                      }
                      disabled={creating}
                      className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {EVIDENCE_OPTIONS.map((option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Human review */}
                  <div className="space-y-2">
                    <label
                      htmlFor="policy-human-review"
                      className="text-sm font-medium text-foreground"
                    >
                      Human Review
                    </label>

                    <select
                      id="policy-human-review"
                      value={form.humanReviewRequirement}
                      onChange={(event) =>
                        updateForm(
                          'humanReviewRequirement',
                          event.target.value,
                        )
                      }
                      disabled={creating}
                      className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {HUMAN_REVIEW_OPTIONS.map(
                        (option) => (
                          <option
                            key={option}
                            value={option}
                          >
                            {option}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  {/* Version */}
                  <div className="space-y-2">
                    <label
                      htmlFor="policy-version"
                      className="text-sm font-medium text-foreground"
                    >
                      Version
                    </label>

                    <input
                      id="policy-version"
                      type="number"
                      min={1}
                      step={1}
                      value={form.version}
                      onChange={(event) =>
                        updateForm(
                          'version',
                          event.target.value,
                        )
                      }
                      disabled={creating}
                      className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <label
                      htmlFor="policy-status"
                      className="text-sm font-medium text-foreground"
                    >
                      Status
                    </label>

                    <select
                      id="policy-status"
                      value={form.status}
                      onChange={(event) =>
                        updateForm(
                          'status',
                          event.target.value,
                        )
                      }
                      disabled={creating}
                      className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2 md:col-span-2">
                    <label
                      htmlFor="policy-description"
                      className="text-sm font-medium text-foreground"
                    >
                      Policy Description{' '}
                      <span className="text-destructive">
                        *
                      </span>
                    </label>

                    <textarea
                      id="policy-description"
                      value={form.description}
                      onChange={(event) =>
                        updateForm(
                          'description',
                          event.target.value,
                        )
                      }
                      placeholder="Define the governance rule, threshold, or oversight requirement..."
                      rows={5}
                      disabled={creating}
                      className="w-full resize-y rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm leading-6 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <p className="text-xs text-muted-foreground">
                      Example: Refunds above ₹20,000 require
                      human approval before execution.
                    </p>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/20 px-6 py-4">
              <button
                type="button"
                onClick={closeCreateModal}
                disabled={creating}
                className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="create-policy-form"
                disabled={creating}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Policy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}