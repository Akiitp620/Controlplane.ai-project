'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Send,
  WalletCards,
  LockKeyhole,
  AlertTriangle,
  CheckCircle2,
  Ban,
  ArrowRight,
} from 'lucide-react';

type Decision =
  | 'ALLOW'
  | 'MODIFY'
  | 'HUMAN_REVIEW'
  | 'BLOCK'
  | '';

interface ActionResponse {
  decision: Decision;
  riskScore: number;
  reason: string;
  requiresHumanReview: boolean;
  evidence: string[];
  passportId: number | null;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const presets = [
  {
    label: 'Password Reset',
    icon: Send,
    agentName: 'Customer Support Agent',
    actionType: 'SEND_PASSWORD_RESET_EMAIL',
    actionDescription: 'Send a password reset email',
    amount: '',
    userRequest: 'Help me reset my password',
  },
  {
    label: '₹2,000 Refund',
    icon: WalletCards,
    agentName: 'Refund Agent',
    actionType: 'ISSUE_REFUND',
    actionDescription: 'Issue a refund to the customer',
    amount: '2000',
    userRequest: 'Refund my payment',
  },
  {
    label: '₹24,500 Refund',
    icon: AlertTriangle,
    agentName: 'Refund Agent',
    actionType: 'ISSUE_REFUND',
    actionDescription: 'Issue a refund to the customer',
    amount: '24500',
    userRequest: 'Refund my payment',
  },
];

export default function ActionGatePage() {
  const router = useRouter();

  const [agentName, setAgentName] = useState('Refund Agent');
  const [actionType, setActionType] = useState('ISSUE_REFUND');
  const [actionDescription, setActionDescription] = useState(
    'Issue a refund to the customer'
  );
  const [amount, setAmount] = useState('24500');
  const [userRequest, setUserRequest] = useState('Refund my payment');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ActionResponse | null>(null);

  const applyPreset = (preset: (typeof presets)[number]) => {
    setAgentName(preset.agentName);
    setActionType(preset.actionType);
    setActionDescription(preset.actionDescription);
    setAmount(preset.amount);
    setUserRequest(preset.userRequest);
    setResult(null);
    setError('');
  };

  const evaluateAction = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = window.localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/actions/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          applicationId: 1,
          agentName,
          actionType,
          actionDescription,
          amount: amount ? Number(amount) : null,
          userRequest,
        }),
      });

      const contentType = response.headers.get('content-type') || '';

      let data: ActionResponse | { message?: string };

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error(
          'Server returned an unexpected response. Please try again.'
        );
      }

      if (!response.ok) {
        throw new Error(
          'message' in data && data.message
            ? data.message
            : `Action evaluation failed (${response.status})`
        );
      }

      setResult(data as ActionResponse);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to evaluate the action.'
      );
    } finally {
      setLoading(false);
    }
  };

  const decisionMeta = getDecisionMeta(result?.decision || '');

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <ShieldCheck className="h-4 w-4" />
              ControlPlane
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Agent Action Gate
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Evaluate an AI agent&apos;s requested action before it reaches
              the real world.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Back to Dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Presets */}
        <div className="mb-8 grid gap-3 md:grid-cols-3">
          {presets.map((preset) => {
            const Icon = preset.icon;

            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset)}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition hover:border-primary/40 hover:bg-accent"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <div className="text-sm font-semibold">
                    {preset.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Load demo scenario
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Request */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Agent Action Request
              </div>

              <h2 className="mt-2 text-xl font-semibold">
                What does the agent want to do?
              </h2>
            </div>

            <div className="space-y-5">
              <Field
                label="Agent Name"
                value={agentName}
                onChange={setAgentName}
              />

              <Field
                label="Action Type"
                value={actionType}
                onChange={setActionType}
              />

              <Field
                label="Action Description"
                value={actionDescription}
                onChange={setActionDescription}
              />

              <Field
                label="Amount (optional)"
                value={amount}
                onChange={setAmount}
                type="number"
              />

              <div>
                <label className="mb-2 block text-sm font-medium">
                  User Request
                </label>

                <textarea
                  value={userRequest}
                  onChange={(e) => setUserRequest(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={evaluateAction}
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Evaluating...' : 'Evaluate Action'}
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                This is a simulated governance check. No real external action
                is executed.
              </div>
            </div>
          </section>

          {/* Result */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                ControlPlane Evaluation
              </div>

              <h2 className="mt-2 text-xl font-semibold">
                Autonomy decision
              </h2>
            </div>

            {!result ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 text-center">
                <LockKeyhole className="mb-4 h-10 w-10 text-muted-foreground" />
                <div className="text-lg font-semibold">
                  Waiting for an action
                </div>
                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  Submit an agent action request to see risk, evidence and the
                  final autonomy decision.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Decision */}
                <div
                  className={`rounded-2xl border p-5 ${decisionMeta.containerClass}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background/70">
                      <decisionMeta.icon className="h-6 w-6" />
                    </div>

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">
                        Final autonomy decision
                      </div>

                      <div className="mt-1 text-2xl font-semibold">
                        {decisionMeta.label}
                      </div>

                      <p className="mt-2 text-sm leading-6 opacity-80">
                        {result.reason}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <Metric
                    label="Risk Score"
                    value={`${result.riskScore}`}
                  />

                  <Metric
                    label="Human Review"
                    value={result.requiresHumanReview ? 'Required' : 'No'}
                  />

                  <Metric
                    label="Passport"
                    value={
                      result.passportId
                        ? `#${result.passportId}`
                        : 'Simulation'
                    }
                  />
                </div>

                {/* Evidence */}
                <div className="rounded-xl border border-border p-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Evidence
                  </div>

                  {result.evidence.length > 0 ? (
                    <div className="mt-3 space-y-3">
                      {result.evidence.map((item, index) => (
                        <div
                          key={`${item}-${index}`}
                          className="rounded-lg bg-muted/40 p-3 text-sm leading-6"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 text-sm text-muted-foreground">
                      No additional evidence required for this low-risk action.
                    </div>
                  )}
                </div>

                {/* Simulated execution state */}
                <div className="rounded-xl border border-border bg-muted/20 p-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Simulated Action
                  </div>

                  <div className="mt-3 text-sm leading-6">
                    {result.decision === 'ALLOW' ? (
                      <span>
                        ControlPlane has granted autonomous permission. In a
                        production system, the agent could proceed to its
                        authorized tool/action.
                      </span>
                    ) : result.decision === 'HUMAN_REVIEW' ? (
                      <span>
                        Execution is paused. The action must receive human
                        approval before proceeding.
                      </span>
                    ) : result.decision === 'BLOCK' ? (
                      <span>
                        Execution is prohibited by ControlPlane policy.
                      </span>
                    ) : (
                      <span>
                        The requested action requires modification before it
                        can proceed.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
      />
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold">{value}</div>
    </div>
  );
}

function getDecisionMeta(decision: Decision) {
  switch (decision) {
    case 'ALLOW':
      return {
        label: 'Autonomously Allowed',
        icon: CheckCircle2,
        containerClass:
          'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      };

    case 'HUMAN_REVIEW':
      return {
        label: 'Human Review Required',
        icon: AlertTriangle,
        containerClass:
          'border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-300',
      };

    case 'BLOCK':
      return {
        label: 'Action Blocked',
        icon: Ban,
        containerClass:
          'border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300',
      };

    case 'MODIFY':
      return {
        label: 'Modification Required',
        icon: AlertTriangle,
        containerClass:
          'border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
      };

    default:
      return {
        label: 'Decision Pending',
        icon: LockKeyhole,
        containerClass:
          'border-border bg-muted/20 text-foreground',
      };
  }
}