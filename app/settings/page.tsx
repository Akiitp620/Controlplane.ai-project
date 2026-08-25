'use client';

import * as React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useCaseList } from '@/lib/mock-data';
import type { UseCaseId } from '@/types';
import { Settings as SettingsIcon, Info } from 'lucide-react';

export default function SettingsPage() {
  const [defaultUseCase, setDefaultUseCase] = React.useState<UseCaseId>('decision_support');
  const [showReasoning, setShowReasoning] = React.useState(true);
  const [demoMode, setDemoMode] = React.useState(true);
  const [reviewAlerts, setReviewAlerts] = React.useState(true);
  const [evalAlerts, setEvalAlerts] = React.useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Prototype configuration for the ControlPlane interface."
        badge={
          <Badge variant="outline" className="text-xs text-muted-foreground">
            Prototype Settings
          </Badge>
        }
      />

      <Card className="border-info/30 bg-info/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" />
            <p className="text-sm text-muted-foreground">
              These settings are stored locally for this prototype session.
              They do not persist across sessions or connect to a backend.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
              <SettingsIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-base">General</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Environment</Label>
            <Select defaultValue="production">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="production">Production (Demo)</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="development">Development</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Interface Theme</Label>
            <Select defaultValue="light">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Evaluation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Default Use Case</Label>
            <Select
              value={defaultUseCase}
              onValueChange={(v) => setDefaultUseCase(v as UseCaseId)}
            >
              <SelectTrigger>
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
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label htmlFor="show-reasoning">Show Decision Reasoning</Label>
              <p className="text-xs text-muted-foreground">
                Display the &quot;Why This Decision?&quot; panel in evaluation results.
              </p>
            </div>
            <Switch
              id="show-reasoning"
              checked={showReasoning}
              onCheckedChange={setShowReasoning}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label htmlFor="demo-mode">Demo Mode</Label>
              <p className="text-xs text-muted-foreground">
                Show demo scenario quick-select buttons in the evaluation workspace.
              </p>
            </div>
            <Switch
              id="demo-mode"
              checked={demoMode}
              onCheckedChange={setDemoMode}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label htmlFor="review-alerts">Human Review Alerts</Label>
              <p className="text-xs text-muted-foreground">
                Show a notification badge when evaluations require human review.
              </p>
            </div>
            <Switch
              id="review-alerts"
              checked={reviewAlerts}
              onCheckedChange={setReviewAlerts}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label htmlFor="eval-alerts">Evaluation Alerts</Label>
              <p className="text-xs text-muted-foreground">
                Notify when a new evaluation is completed.
              </p>
            </div>
            <Switch
              id="eval-alerts"
              checked={evalAlerts}
              onCheckedChange={setEvalAlerts}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-xs text-muted-foreground">ControlPlane Version</div>
              <div className="text-sm font-medium">1.0.0 (Prototype)</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Prototype Status</div>
              <div className="text-sm font-medium">Active — Demo Build</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Backend</div>
              <div className="text-sm font-medium">Mock Data (Spring Boot Ready)</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Competition</div>
              <div className="text-sm font-medium">Accenture Innovation Challenge 2026</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
