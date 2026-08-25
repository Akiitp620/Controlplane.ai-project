import type { Decision, EvidenceStatus, RiskLevel, UseCaseId } from './evaluation';

export interface Policy {
  id: string;
  name: string;
  useCase: UseCaseId;
  version: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  lastUpdated: string;
  riskTolerance: RiskLevel;
  consequenceThreshold: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  evidenceRequirement: 'NONE' | 'RECOMMENDED' | 'REQUIRED' | 'STRICT';
  humanReviewRequirement: string;
  latencyBudget: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH';
  allowedActions: Decision[];
  rules: PolicyRule[];
}

export interface PolicyRule {
  condition: string;
  action: Decision;
  rationale: string;
}
