'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { StackRecommendation, QuestionnaireAnswers } from '@/types';

interface ResultData {
  answers: QuestionnaireAnswers;
  recommendation: StackRecommendation;
  timestamp: string;
}

function ResultsContent() {
  const router = useRouter();
  const [data, setData] = useState<ResultData | null>(null);
  const [copied, setCopied] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'backend' | 'frontend' | 'database' | 'deployment' | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Try to load from session storage first
    const stored = sessionStorage.getItem('questionnaireResult');
    if (stored) {
      try {
        setData(JSON.parse(stored));
        return;
      } catch (error) {
        console.error('Failed to parse stored data:', error);
      }
    }

    // Fallback to URL param (for backwards compatibility)
    const dataParam = new URLSearchParams(window.location.search).get('data');
    if (dataParam) {
      try {
        setData(JSON.parse(decodeURIComponent(dataParam)));
      } catch (error) {
        console.error('Failed to parse result data:', error);
      }
    }
  }, []);

  if (!data) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your recommendation...</p>
        </div>
      </main>
    );
  }

  const { answers, recommendation } = data;

  const handleExport = () => {
    const md = generateMarkdown(answers, recommendation);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stackup-recommendation-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const md = generateMarkdown(answers, recommendation);
    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formatValue = (v: string) => v.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <a href="/" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">← Back to Home</a>
          <h1 className="text-3xl font-bold text-gray-900">Your Tech Stack Recommendation</h1>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center mb-8">
          <button onClick={handleExport} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Download Markdown
          </button>
          <button onClick={handleCopy} className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
          <button 
            onClick={() => setShowComparison(!showComparison)} 
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {showComparison ? 'Hide' : 'Show'} Alternatives
          </button>
        </div>

        {/* Main Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StackCard label="Backend" value={recommendation.backend} icon="🖥️" />
          <StackCard label="Frontend" value={recommendation.frontend} icon="🎨" />
          <StackCard label="Database" value={recommendation.database} icon="🗄️" />
          <StackCard label="Deployment" value={recommendation.deployment} icon="🚀" />
        </div>

        {/* Cost Estimate */}
        {recommendation.estimatedHosting && (
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white mb-8">
            <h3 className="text-lg font-semibold mb-2">💰 Estimated Hosting</h3>
            <p className="text-2xl font-bold">{recommendation.estimatedHosting}</p>
            <p className="text-primary-100 text-sm">Initial monthly cost</p>
          </div>
        )}

        {/* Comparison View */}
        {showComparison && (
          <div className="mb-8 space-y-6">
            <ComparisonSection 
              title="Backend Alternatives" 
              icon="🖥️"
              details={recommendation.backendDetails} 
            />
            <ComparisonSection 
              title="Frontend Alternatives" 
              icon="🎨"
              details={recommendation.frontendDetails} 
            />
            <ComparisonSection 
              title="Database Alternatives" 
              icon="🗄️"
              details={recommendation.databaseDetails} 
            />
            <ComparisonSection 
              title="Deployment Alternatives" 
              icon="🚀"
              details={recommendation.deploymentDetails} 
            />
          </div>
        )}

        {/* Granular Explanations */}
        <div className="space-y-4 mb-8">
          <ExplanationCard
            title="Backend"
            icon="🖥️"
            details={recommendation.backendDetails}
            isExpanded={expandedSection === 'backend'}
            onToggle={() => setExpandedSection(expandedSection === 'backend' ? null : 'backend')}
          />
          <ExplanationCard
            title="Frontend"
            icon="🎨"
            details={recommendation.frontendDetails}
            isExpanded={expandedSection === 'frontend'}
            onToggle={() => setExpandedSection(expandedSection === 'frontend' ? null : 'frontend')}
          />
          <ExplanationCard
            title="Database"
            icon="🗄️"
            details={recommendation.databaseDetails}
            isExpanded={expandedSection === 'database'}
            onToggle={() => setExpandedSection(expandedSection === 'database' ? null : 'database')}
          />
          <ExplanationCard
            title="Deployment"
            icon="🚀"
            details={recommendation.deploymentDetails}
            isExpanded={expandedSection === 'deployment'}
            onToggle={() => setExpandedSection(expandedSection === 'deployment' ? null : 'deployment')}
          />
        </div>

        {/* Scaling Strategy */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📈 Scaling Strategy</h2>
          <p className="text-gray-700">{recommendation.scalingStrategy}</p>
        </div>

        {/* Scaling Roadmap */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex justify-between items-center"
          >
            <h2 className="text-xl font-semibold text-gray-900">🗺️ Scaling Roadmap</h2>
            <span className="text-primary-600">{showDetails ? '−' : '+'}</span>
          </button>
          {showDetails && (
            <div className="mt-4 space-y-4">
              <RoadmapStage title="Stage 1: Launch" value={recommendation.scalingRoadmap.stage1} color="green" />
              <RoadmapStage title="Stage 2: Growth" value={recommendation.scalingRoadmap.stage2} color="blue" />
              <RoadmapStage title="Stage 3: Scale" value={recommendation.scalingRoadmap.stage3} color="purple" />
            </div>
          )}
        </div>

        {/* Your Requirements */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Your Requirements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ReqItem label="App Type" value={formatValue(answers.appType)} />
            <ReqItem label="Users" value={answers.expectedUsers} />
            <ReqItem label="Budget" value={formatValue(answers.budget)} />
            <ReqItem label="Team" value={formatValue(answers.teamSize)} />
            <ReqItem label="Real-time" value={answers.realTimeFeatures ? 'Yes' : 'No'} />
            <ReqItem label="AI/ML" value={answers.aiIntegration ? 'Yes' : 'No'} />
            <ReqItem label="Compliance" value={formatValue(answers.compliance)} />
            <ReqItem label="Timeline" value={formatValue(answers.timeToMarket)} />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <a href="/questionnaire" className="text-primary-600 hover:text-primary-700 font-medium">
            Start New Recommendation →
          </a>
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}

function StackCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function ExplanationCard({
  title,
  icon,
  details,
  isExpanded,
  onToggle,
}: {
  title: string;
  icon: string;
  details: import('@/types').AlternativesConsidered;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
            {details.chosen.name}
          </span>
        </div>
        <span className="text-primary-600 text-lg">{isExpanded ? '−' : '+'}</span>
      </button>
      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">{details.chosen.explanation}</p>
            {details.chosen.sources.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  Sources & References
                </h4>
                <ul className="space-y-3">
                  {details.chosen.sources.map((source, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-amber-600 mt-0.5">
                        {source.type === 'book' ? '📚' : source.type === 'blog' ? '📝' : '📄'}
                      </span>
                      <div className="flex-1">
                        <p className="text-amber-900 font-medium">{source.title}</p>
                        <p className="text-amber-700 text-sm">
                          by {source.author}
                          {source.year && ` (${source.year})`}
                          {source.chapter && ` — ${source.chapter}`}
                        </p>
                        {source.link && (
                          <a
                            href={source.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-600 hover:text-amber-800 text-sm inline-flex items-center gap-1 mt-1"
                          >
                            View Source
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ComparisonSection({
  title,
  icon,
  details,
}: {
  title: string;
  icon: string;
  details: import('@/types').AlternativesConsidered;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        {title}
      </h3>
      
      {/* Chosen */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
            ✓ Selected
          </span>
          <span className="font-semibold text-gray-900">{details.chosen.name}</span>
        </div>
        <p className="text-gray-700 text-sm">{details.chosen.explanation}</p>
      </div>

      {/* Rejected */}
      <div className="space-y-4">
        {details.rejected.map((alt, i) => (
          <div key={i} className="border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                ✗ {alt.name}
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Why Not Chosen</h4>
                <p className="text-gray-700 text-sm">{alt.reason}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">When To Use</h4>
                <p className="text-gray-700 text-sm">{alt.whenToUse}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoadmapStage({ title, value, color }: { title: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    green: 'bg-green-50 border-green-200 text-green-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
  };
  return (
    <div className={`p-4 rounded-lg border ${colors[color]}`}>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm">{value}</p>
    </div>
  );
}

function ReqItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="text-sm font-medium text-gray-900">{value}</dd>
    </div>
  );
}

function generateMarkdown(answers: QuestionnaireAnswers, rec: StackRecommendation): string {
  const f = (v: string) => v.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return `# StackUp Recommendation

## Your Stack
- **Backend:** ${rec.backend}
- **Frontend:** ${rec.frontend}
- **Database:** ${rec.database}
- **Deployment:** ${rec.deployment}
${rec.estimatedHosting ? `- **Cost:** ${rec.estimatedHosting}` : ''}

## Why
${rec.reasoning}

## Scaling
${rec.scalingStrategy}

## Roadmap
1. ${rec.scalingRoadmap.stage1}
2. ${rec.scalingRoadmap.stage2}
3. ${rec.scalingRoadmap.stage3}

## Requirements
- App: ${f(answers.appType)}
- Users: ${answers.expectedUsers}
- Budget: ${f(answers.budget)}
- Team: ${f(answers.teamSize)}
- Real-time: ${answers.realTimeFeatures ? 'Yes' : 'No'}
- AI: ${answers.aiIntegration ? 'Yes' : 'No'}
- Compliance: ${f(answers.compliance)}
- Timeline: ${f(answers.timeToMarket)}

---
Generated by StackUp
`;
}
