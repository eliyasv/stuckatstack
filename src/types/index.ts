export type AppType = 'saas' | 'marketplace' | 'ai-app' | 'social-app' | 'internal-tool';
export type UserScale = '0-1k' | '1k-10k' | '10k-100k' | '100k+';
export type BudgetLevel = 'low' | 'medium' | 'high';
export type TeamSize = 'solo' | 'small-team' | 'funded-team';
export type ComplianceNeed = 'none' | 'gdpr' | 'hipaa';
export type TimePriority = 'fast' | 'balanced' | 'long-term';

export interface QuestionnaireAnswers {
  appType: AppType;
  expectedUsers: UserScale;
  realTimeFeatures: boolean;
  budget: BudgetLevel;
  teamSize: TeamSize;
  aiIntegration: boolean;
  compliance: ComplianceNeed;
  timeToMarket: TimePriority;
}

export interface SourceReference {
  title: string;
  author: string;
  type: 'book' | 'blog' | 'documentation' | 'paper';
  chapter?: string;
  link?: string;
  year?: number;
}

export interface TechnologyChoice {
  name: string;
  explanation: string;
  sources: SourceReference[];
}

export interface AlternativesConsidered {
  chosen: TechnologyChoice;
  rejected: Array<{
    name: string;
    reason: string;
    whenToUse: string;
  }>;
}

export interface StackRecommendation {
  backend: string;
  frontend: string;
  database: string;
  deployment: string;
  scalingStrategy: string;
  reasoning: string;
  scalingRoadmap: {
    stage1: string;
    stage2: string;
    stage3: string;
  };
  estimatedHosting?: string;
  // Granular explanations with alternatives
  backendDetails: AlternativesConsidered;
  frontendDetails: AlternativesConsidered;
  databaseDetails: AlternativesConsidered;
  deploymentDetails: AlternativesConsidered;
}

export interface RecommendationRecord {
  id?: number;
  answers: QuestionnaireAnswers;
  recommendation: StackRecommendation;
  createdAt: string;
}
