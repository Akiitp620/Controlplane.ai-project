export type Decision = 'ALLOW' | 'MODIFY' | 'HUMAN_REVIEW' | 'BLOCK';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type EvidenceStatus =
  | 'VERIFIED'
  | 'CONTRADICTED'
  | 'UNVERIFIED'
  | 'UNKNOWN';

export type ConsequenceLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type UseCaseId =
  | 'customer_support'
  | 'knowledge_assistant'
  | 'decision_support'
  | 'agent_action';

export type RiskDimension =
  | 'hallucination'
  | 'privacy'
  | 'bias'
  | 'safety'
  | 'responsibility';

export type RiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskFinding {
  dimension: RiskDimension;
  severity: RiskSeverity;
  confidence?: number;
  explanation: string;
  evidence?: string;
}

export interface EvidenceSource {
  id: string;
  title: string;
  version?: string;
  status: EvidenceStatus;
  claim: string;
  sourceSays?: string;
}

export interface PolicySnapshot {
  id: string;
  name: string;
  version: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
}

export interface PipelineStage {
  key: 'context' | 'risk' | 'evidence' | 'consequence' | 'policy' | 'autonomy';
  label: string;
  status: 'pass' | 'warn' | 'fail' | 'neutral';
  detail: string;
}

export interface EvaluationResult {
  evaluationId: string;
  useCase: UseCaseId;
  response: string;
  timestamp: string;
  riskLevel: RiskLevel;
  findings: Record<RiskDimension, RiskSeverity>;
  riskDetails: RiskFinding[];
  evidence: {
    status: EvidenceStatus;
    sources: EvidenceSource[];
  };
  consequence: ConsequenceLevel;
  consequenceImpact: string;
  policy: PolicySnapshot;
  decision: Decision;
  reasoning: string[];
  pipeline: PipelineStage[];
  humanReview?: {
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'OVERRIDDEN';
    reviewer?: string;
    timestamp?: string;
    reason?: string;
  };
}

export interface EvaluationRequest {
  useCase: UseCaseId;
  response: string;
}

export type EvaluationStatus = 'idle' | 'evaluating' | 'success' | 'error';
