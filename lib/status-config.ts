import type { Decision, EvidenceStatus, RiskLevel } from '@/types';

export type BadgeTone =
  | 'allow'
  | 'modify'
  | 'review'
  | 'block'
  | 'verified'
  | 'contradicted'
  | 'unverified'
  | 'unknown'
  | 'low'
  | 'medium'
  | 'high'
  | 'critical'
  | 'neutral'
  | 'info';

export const decisionTone: Record<Decision, BadgeTone> = {
  ALLOW: 'allow',
  MODIFY: 'modify',
  HUMAN_REVIEW: 'review',
  BLOCK: 'block',
};

export const evidenceTone: Record<EvidenceStatus, BadgeTone> = {
  VERIFIED: 'verified',
  CONTRADICTED: 'contradicted',
  UNVERIFIED: 'unverified',
  UNKNOWN: 'unknown',
};

export const riskTone: Record<RiskLevel, BadgeTone> = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const toneClasses: Record<BadgeTone, string> = {
  allow: 'bg-success/10 text-success border-success/30',
  modify: 'bg-warning/10 text-warning border-warning/30',
  review: 'bg-review/10 text-review border-review/30',
  block: 'bg-destructive/10 text-destructive border-destructive/30',
  verified: 'bg-success/10 text-success border-success/30',
  contradicted: 'bg-destructive/10 text-destructive border-destructive/30',
  unverified: 'bg-warning/10 text-warning border-warning/30',
  unknown: 'bg-muted text-muted-foreground border-border',
  low: 'bg-success/10 text-success border-success/30',
  medium: 'bg-warning/10 text-warning border-warning/30',
  high: 'bg-review/10 text-review border-review/30',
  critical: 'bg-destructive/10 text-destructive border-destructive/30',
  neutral: 'bg-muted text-muted-foreground border-border',
  info: 'bg-info/10 text-info border-info/30',
};
