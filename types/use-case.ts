import type { Decision, RiskLevel, UseCaseId } from './evaluation';

export interface UseCase {
  id: UseCaseId;
  name: string;
  description: string;
  riskTolerance: RiskLevel;
  latencyBudget: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH';
  evidenceRequirement: 'NONE' | 'RECOMMENDED' | 'REQUIRED' | 'STRICT';
  humanReviewRule: string;
  allowedAutonomy: Decision[];
  commonRisks: string[];
  recentEvaluations: string[];
}

export interface KnowledgeDocument {
  id: string;
  name: string;
  version: string;
  source: string;
  lastUpdated: string;
  status: 'INDEXED' | 'PROCESSING' | 'STALE';
  category: string;
  sections: KnowledgeSection[];
  usedInEvaluations: number;
}

export interface KnowledgeSection {
  id: string;
  title: string;
  content: string;
}
