import type { Decision, RiskLevel, UseCaseId } from './evaluation';

export interface AuditRecord {
  id: string;
  evaluationId: string;
  timestamp: string;
  useCase: UseCaseId;
  risk: RiskLevel;
  consequence: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  decision: Decision;
  policy: string;
  reviewer?: string;
  status: 'AUTO' | 'REVIEWED' | 'OVERRIDDEN';
}
