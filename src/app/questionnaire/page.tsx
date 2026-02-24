'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuestionnaireAnswers } from '@/types';

const initialAnswers: QuestionnaireAnswers = {
  appType: 'saas',
  expectedUsers: '0-1k',
  realTimeFeatures: false,
  budget: 'low',
  teamSize: 'solo',
  aiIntegration: false,
  compliance: 'none',
  timeToMarket: 'fast',
};

export default function QuestionnairePage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(initialAnswers);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendation');
      }

      const data = await response.json();

      // Store full result data in session storage (URL params have size limits)
      sessionStorage.setItem('questionnaireResult', JSON.stringify(data));

      // Redirect to results page
      router.push('/results');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get recommendation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <LinkBack />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Tell Us About Your Project
          </h1>
          <p className="text-gray-600 mt-2">
            Answer a few questions to get personalized stack recommendations
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* App Type */}
          <QuestionGroup
            title="What type of app are you building?"
            name="appType"
            value={answers.appType}
            onChange={(value) => setAnswers({ ...answers, appType: value as QuestionnaireAnswers['appType'] })}
            options={[
              { value: 'saas', label: 'SaaS Product', icon: '💼' },
              { value: 'marketplace', label: 'Marketplace', icon: '🏪' },
              { value: 'ai-app', label: 'AI Application', icon: '🤖' },
              { value: 'social-app', label: 'Social App', icon: '👥' },
              { value: 'internal-tool', label: 'Internal Tool', icon: '🔧' },
            ]}
          />

          {/* Expected Users */}
          <QuestionGroup
            title="Expected number of users?"
            name="expectedUsers"
            value={answers.expectedUsers}
            onChange={(value) => setAnswers({ ...answers, expectedUsers: value as QuestionnaireAnswers['expectedUsers'] })}
            options={[
              { value: '0-1k', label: '0 - 1,000 users', icon: '🌱' },
              { value: '1k-10k', label: '1,000 - 10,000 users', icon: '🌿' },
              { value: '10k-100k', label: '10,000 - 100,000 users', icon: '🌳' },
              { value: '100k+', label: '100,000+ users', icon: '🌲' },
            ]}
          />

          {/* Real-time Features */}
          <BooleanQuestion
            title="Do you need real-time features?"
            description="Live updates, chat, notifications, collaborative editing"
            value={answers.realTimeFeatures}
            onChange={(value) => setAnswers({ ...answers, realTimeFeatures: value })}
          />

          {/* Budget Level */}
          <QuestionGroup
            title="What's your budget level?"
            name="budget"
            value={answers.budget}
            onChange={(value) => setAnswers({ ...answers, budget: value as QuestionnaireAnswers['budget'] })}
            options={[
              { value: 'low', label: 'Low (Bootstrap/Free tiers)', icon: '💰' },
              { value: 'medium', label: 'Medium ($100-500/mo)', icon: '💵' },
              { value: 'high', label: 'High (Funded/Enterprise)', icon: '💎' },
            ]}
          />

          {/* Team Size */}
          <QuestionGroup
            title="Team size?"
            name="teamSize"
            value={answers.teamSize}
            onChange={(value) => setAnswers({ ...answers, teamSize: value as QuestionnaireAnswers['teamSize'] })}
            options={[
              { value: 'solo', label: 'Solo Founder', icon: '👤' },
              { value: 'small-team', label: 'Small Team (2-10)', icon: '👥' },
              { value: 'funded-team', label: 'Funded Team (10+)', icon: '🏢' },
            ]}
          />

          {/* AI Integration */}
          <BooleanQuestion
            title="Do you need AI/ML integration?"
            description="Machine learning, NLP, computer vision, recommendations"
            value={answers.aiIntegration}
            onChange={(value) => setAnswers({ ...answers, aiIntegration: value })}
          />

          {/* Compliance Needs */}
          <QuestionGroup
            title="Compliance requirements?"
            name="compliance"
            value={answers.compliance}
            onChange={(value) => setAnswers({ ...answers, compliance: value as QuestionnaireAnswers['compliance'] })}
            options={[
              { value: 'none', label: 'None', icon: '✅' },
              { value: 'gdpr', label: 'GDPR', icon: '🇪🇺' },
              { value: 'hipaa', label: 'HIPAA', icon: '🏥' },
            ]}
          />

          {/* Time to Market */}
          <QuestionGroup
            title="Time to market priority?"
            name="timeToMarket"
            value={answers.timeToMarket}
            onChange={(value) => setAnswers({ ...answers, timeToMarket: value as QuestionnaireAnswers['timeToMarket'] })}
            options={[
              { value: 'fast', label: 'Fast (Ship ASAP)', icon: '🚀' },
              { value: 'balanced', label: 'Balanced', icon: '⚖️' },
              { value: 'long-term', label: 'Long-term Scalable', icon: '🏗️' },
            ]}
          />

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-primary-600 text-white font-semibold rounded-lg shadow-lg hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  Get My Recommendation
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function LinkBack() {
  return (
    <a
      href="/"
      className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
    >
      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back to Home
    </a>
  );
}

function QuestionGroup({
  title,
  name,
  value,
  onChange,
  options,
}: {
  title: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; icon: string }[];
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
              ${value === option.value
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            <span className="text-2xl mr-3">{option.icon}</span>
            <span className={`font-medium ${value === option.value ? 'text-primary-700' : 'text-gray-700'}`}>
              {option.label}
            </span>
            {value === option.value && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

function BooleanQuestion({
  title,
  description,
  value,
  onChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">{title}</h2>
      <p className="text-gray-500 text-sm mb-4">{description}</p>
      <div className="flex gap-4">
        <label
          className={`
            flex-1 flex items-center justify-center py-3 rounded-lg border-2 cursor-pointer transition-all font-medium
            ${value === true
              ? 'border-green-600 bg-green-50 text-green-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }
          `}
        >
          <input
            type="radio"
            name={title}
            value="true"
            checked={value === true}
            onChange={() => onChange(true)}
            className="sr-only"
          />
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Yes
        </label>
        <label
          className={`
            flex-1 flex items-center justify-center py-3 rounded-lg border-2 cursor-pointer transition-all font-medium
            ${value === false
              ? 'border-gray-600 bg-gray-50 text-gray-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }
          `}
        >
          <input
            type="radio"
            name={title}
            value="false"
            checked={value === false}
            onChange={() => onChange(false)}
            className="sr-only"
          />
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          No
        </label>
      </div>
    </div>
  );
}
