import { NextRequest, NextResponse } from 'next/server';
import { getDecisionEngine } from '@/lib/decision-engine/DecisionEngine';
import { QuestionnaireAnswers, StackRecommendation } from '@/types';
import { z } from 'zod';

const questionnaireSchema: z.ZodType<QuestionnaireAnswers> = z.strictObject({
  appType: z.enum(['saas', 'marketplace', 'ai-app', 'social-app', 'internal-tool']),
  expectedUsers: z.enum(['0-1k', '1k-10k', '10k-100k', '100k+']),
  realTimeFeatures: z.boolean(),
  budget: z.enum(['low', 'medium', 'high']),
  teamSize: z.enum(['solo', 'small-team', 'funded-team']),
  aiIntegration: z.boolean(),
  compliance: z.enum(['none', 'gdpr', 'hipaa']),
  timeToMarket: z.enum(['fast', 'balanced', 'long-term']),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Request body must be valid JSON' },
      { status: 400 }
    );
  }

  try {
    const parsed = questionnaireSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid questionnaire answers',
          issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
        },
        { status: 400 }
      );
    }

    const answers = parsed.data;

    // Get recommendation from decision engine (fast, no I/O)
    const engine = getDecisionEngine();
    const recommendation: StackRecommendation = engine.recommend(answers);

    // Save to database asynchronously (don't block response)
    // Database is initialized lazily on first use
    import('@/lib/db').then(({ saveRecommendation }) => {
      saveRecommendation({
        appType: answers.appType,
        expectedUsers: answers.expectedUsers,
        realTimeFeatures: answers.realTimeFeatures,
        budget: answers.budget,
        teamSize: answers.teamSize,
        aiIntegration: answers.aiIntegration,
        compliance: answers.compliance,
        timeToMarket: answers.timeToMarket,
        backend: recommendation.backend,
        frontend: recommendation.frontend,
        databaseRec: recommendation.database,
        deployment: recommendation.deployment,
        scalingStrategy: recommendation.scalingStrategy,
        reasoning: recommendation.reasoning,
        scalingRoadmap: JSON.stringify(recommendation.scalingRoadmap),
        estimatedHosting: recommendation.estimatedHosting,
      });
    }).catch(err => console.error('DB save failed:', err));

    return NextResponse.json({
      answers,
      recommendation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error processing recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to process recommendation' },
      { status: 500 }
    );
  }
}
