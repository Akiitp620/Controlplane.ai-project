'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const stages = [
  'Analyzing context...',
  'Evaluating risk...',
  'Checking evidence...',
  'Assessing consequence...',
  'Applying policy...',
];

export function EvaluationLoading() {
  const [currentStage, setCurrentStage] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => Math.min(prev + 1, stages.length - 1));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="animate-fade-in">
      <CardContent className="py-8">
        <div className="space-y-4">
          {stages.map((stage, idx) => {
            const isDone = idx < currentStage;
            const isActive = idx === currentStage;
            return (
              <div
                key={stage}
                className={cn(
                  'flex items-center gap-3 transition-opacity',
                  idx <= currentStage ? 'opacity-100' : 'opacity-40'
                )}
              >
                <div className="flex h-7 w-7 items-center justify-center">
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : isActive ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-sm',
                    isDone
                      ? 'text-muted-foreground line-through'
                      : isActive
                      ? 'font-medium text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {stage}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
