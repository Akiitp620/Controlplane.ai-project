'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Play,
  Loader2,
  Zap,
  ShieldCheck,
  Sparkles,
  FileText,
  RotateCcw,
} from 'lucide-react';

import {
  useCaseList,
  demoScenarios,
  type DemoScenario,
} from '@/lib/mock-data';

import type { UseCaseId } from '@/types';

interface EvaluationInputProps {
  onEvaluate: (useCase: UseCaseId, response: string) => void;
  isEvaluating: boolean;
  defaultUseCase?: UseCaseId;
  defaultResponse?: string;
}

export function EvaluationInput({
  onEvaluate,
  isEvaluating,
  defaultUseCase = 'decision_support',
  defaultResponse = '',
}: EvaluationInputProps) {
  const [useCase, setUseCase] =
    React.useState<UseCaseId>(defaultUseCase);

  const [response, setResponse] =
    React.useState(defaultResponse);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!response.trim() || isEvaluating) {
      return;
    }

    onEvaluate(useCase, response);
  };

  const handleScenario = (scenario: DemoScenario) => {
    setUseCase(scenario.useCase);
    setResponse(scenario.response);
  };

  const handleClear = () => {
    setResponse('');
  };

  const characterCount = response.length;
  const hasResponse = response.trim().length > 0;

  return (
    <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <CardHeader className="border-b border-border/60 bg-muted/20 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Evaluate AI Response
              </CardTitle>

              <p className="mt-1 max-w-lg text-xs leading-5 text-muted-foreground">
                Submit an AI-generated response and run it through the
                ControlPlane decision pipeline.
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] font-medium text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
            <Zap className="h-3.5 w-3.5" />
            Demo Scenarios
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* =====================================================
              QUICK SCENARIOS
          ===================================================== */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Quick scenarios
                </p>

                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Load a prepared example to demonstrate the evaluation flow.
                </p>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {demoScenarios.map((scenario) => {
                const isSelected =
                  response === scenario.response &&
                  useCase === scenario.useCase;

                return (
                  <Button
                    key={scenario.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleScenario(scenario)}
                    className={`h-auto min-h-10 justify-start px-3 py-2 text-left text-xs transition-all ${
                      isSelected
                        ? 'border-blue-300 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300'
                        : 'border-border/70 bg-background hover:border-blue-200 hover:bg-blue-50/40 dark:hover:border-blue-400/20 dark:hover:bg-blue-400/5'
                    }`}
                  >
                    <span className="truncate">
                      {scenario.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          </section>

          {/* =====================================================
              USE CASE
          ===================================================== */}
          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />

              <Label
                htmlFor="use-case"
                className="text-xs font-semibold text-foreground"
              >
                AI Use Case
              </Label>
            </div>

            <Select
              value={useCase}
              onValueChange={(value) =>
                setUseCase(value as UseCaseId)
              }
            >
              <SelectTrigger
                id="use-case"
                className="h-11 w-full bg-background"
              >
                <SelectValue placeholder="Select a use case" />
              </SelectTrigger>

              <SelectContent>
                {useCaseList.map((item) => (
                  <SelectItem
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>

          {/* =====================================================
              AI RESPONSE
          ===================================================== */}
          <section className="space-y-2">
            <div className="flex items-end justify-between gap-3">
              <div>
                <Label
                  htmlFor="ai-response"
                  className="text-xs font-semibold text-foreground"
                >
                  AI Response
                </Label>

                <p className="mt-1 text-[11px] text-muted-foreground">
                  Paste the response you want ControlPlane to evaluate.
                </p>
              </div>

              <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                {characterCount.toLocaleString()} characters
              </span>
            </div>

            <div className="relative">
              <Textarea
                id="ai-response"
                value={response}
                onChange={(event) =>
                  setResponse(event.target.value)
                }
                placeholder="Paste the AI-generated response you want ControlPlane to evaluate..."
                className="min-h-[170px] resize-y border-border/70 bg-background px-4 py-3 font-mono text-sm leading-6 shadow-none transition-all placeholder:text-muted-foreground/60 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/10"
                disabled={isEvaluating}
              />

              {hasResponse && !isEvaluating && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={handleClear}
                  aria-label="Clear AI response"
                  className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            <div className="flex flex-col gap-1.5 text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>
                ControlPlane will evaluate the response against the selected
                use-case context.
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Input ready
              </span>
            </div>
          </section>

          {/* =====================================================
              ACTION
          ===================================================== */}
          <div className="border-t border-border/60 pt-5">
            <Button
              type="submit"
              disabled={isEvaluating || !hasResponse}
              className="h-11 w-full bg-blue-600 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Evaluating response...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run ControlPlane Evaluation
                </>
              )}
            </Button>

            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              The evaluation runs through the configured decision pipeline.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}