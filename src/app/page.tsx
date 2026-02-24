import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-2xl shadow-lg">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          </div>

          {/* Headline */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></span>
            Free • Open Source • No Sign-up
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Build Your Perfect{' '}
            <span className="text-primary-600">Tech Stack</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Stuckatstack helps founders and developers choose the right
            technology stack based on their project needs, budget, and scale.
            Get detailed recommendations with clear explanations.
          </p>

          {/* CTA Button */}
          <Link
            href="/questionnaire"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-primary-600 rounded-lg shadow-lg hover:bg-primary-700 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
          >
            Get Stack Recommendation
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            }
            title="Smart Recommendations"
            description="Rule-based engine analyzes your requirements to suggest the optimal tech stack."
          />
          <FeatureCard
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            }
            title="Scaling Roadmap"
            description="Get a clear path from MVP to scale with stage-by-stage infrastructure guidance."
          />
          <FeatureCard
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            }
            title="Budget-Conscious"
            description="Recommendations tailored to your budget with estimated hosting costs."
          />
        </div>

        {/* How It Works */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            How It Works
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Step number={1} text="Answer questions about your project" />
            <div className="hidden md:block w-16 h-0.5 bg-gray-300" />
            <Step number={2} text="Get personalized recommendations" />
            <div className="hidden md:block w-16 h-0.5 bg-gray-300" />
            <Step number={3} text="Export and start building" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-500">
          <p>Stuckatstack</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
        <svg
          className="w-6 h-6 text-primary-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {icon}
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Step({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
        {number}
      </div>
      <span className="text-gray-700 font-medium">{text}</span>
    </div>
  );
}
