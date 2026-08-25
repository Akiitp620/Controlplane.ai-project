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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Loader2, Zap } from 'lucide-react';
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
  const [useCase, setUseCase] = React.useState<UseCaseId>(defaultUseCase);
  const [response, setResponse] = React.useState(defaultResponse);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!response.trim() || isEvaluating) return;
    onEvaluate(useCase, response);
  };

  const handleScenario = (scenario: DemoScenario) => {
    setUseCase(scenario.useCase);
    setResponse(scenario.response);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Evaluate AI Response</CardTitle>
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-warning" />
            <span className="text-xs font-medium text-muted-foreground">
              Demo Scenarios
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {demoScenarios.map((scenario) => (
              <Button
                key={scenario.id}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleScenario(scenario)}
                className="text-xs"
              >
                {scenario.label}
              </Button>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="use-case">Use Case</Label>
            <Select
              value={useCase}
              onValueChange={(v) => setUseCase(v as UseCaseId)}
            >
              <SelectTrigger id="use-case">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {useCaseList.map((uc) => (
                  <SelectItem key={uc.id} value={uc.id}>
                    {uc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ai-response">AI Response</Label>
            <Textarea
              id="ai-response"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Paste the AI-generated response you want ControlPlane to evaluate..."
              className="min-h-[120px] resize-y font-mono text-sm"
            />
          </div>

          <Button
            type="submit"
            disabled={isEvaluating || !response.trim()}
            className="w-full"
          >
            {isEvaluating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Evaluating...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Evaluation
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
