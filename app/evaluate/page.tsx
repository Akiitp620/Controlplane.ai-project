'use client';

import { PageHeader } from '@/components/layout/page-header';
import { EvaluationWorkspace } from '@/components/evaluation/evaluation-workspace';

export default function EvaluatePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Evaluate"
        description="Run and inspect AI response evaluations."
      />
      <EvaluationWorkspace />
    </div>
  );
}
