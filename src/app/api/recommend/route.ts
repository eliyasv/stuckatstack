import { NextRequest, NextResponse } from 'next/server';
import { getDecisionEngine } from '@/lib/decision-engine/DecisionEngine';
import { QuestionnaireAnswers, StackRecommendation } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields: (keyof QuestionnaireAnswers)[] = [
      'appType',
      'expectedUsers',
      'realTimeFeatures',
      'budget',
      'teamSize',
      'aiIntegration',
      'compliance',
      'timeToMarket',
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const answers: QuestionnaireAnswers = {
      appType: body.appType,
      expectedUsers: body.expectedUsers,
      realTimeFeatures: Boolean(body.realTimeFeatures),
      budget: body.budget,
      teamSize: body.teamSize,
      aiIntegration: Boolean(body.aiIntegration),
      compliance: body.compliance,
      timeToMarket: body.timeToMarket,
    };

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
