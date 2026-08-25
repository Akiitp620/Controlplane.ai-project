'use client';

import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/common/status-badge';
import {
  User,
  Shield,
  Server,
  CheckCircle2,
  Mail,
  Building2,
} from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Account information for this prototype session."
        badge={
          <Badge variant="outline" className="text-xs text-muted-foreground">
            Prototype Profile
          </Badge>
        }
      />

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              RA
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Risk Admin</h2>
              <p className="text-sm text-muted-foreground">
                AI Governance Administrator
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailRow icon={User} label="Name" value="Risk Admin" />
            <DetailRow
              icon={Mail}
              label="Email"
              value="governance@controlplane.ai"
            />
            <DetailRow
              icon={Shield}
              label="Role"
              value="AI Governance Administrator"
            />
            <DetailRow
              icon={Building2}
              label="Organization"
              value="ControlPlane.ai"
            />
            <DetailRow
              icon={Server}
              label="Environment"
              value="Production (Demo)"
            />
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  Account Status
                </div>
                <StatusBadge tone="allow">Active</StatusBadge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Responsibilities</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              Review and resolve evaluations flagged for human review.
            </li>
            <li className="flex items-start gap-2">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              Override or approve AI autonomy decisions for high-consequence cases.
            </li>
            <li className="flex items-start gap-2">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              Monitor audit trail for policy compliance and decision patterns.
            </li>
            <li className="flex items-start gap-2">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              Provide feedback captured for future policy and threshold refinement.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
