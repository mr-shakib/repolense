export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="text-center max-w-4xl">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            RepoLense AI
          </h1>
          <p className="text-2xl text-gray-700 dark:text-gray-300 mb-4">
            AI-Powered Repository Analysis
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
            Get deep insights on architecture patterns, code quality, engineering principles, and team collaboration
          </p>
          
          <div className="flex gap-6 justify-center mb-16">
            <a
              href="/analyze"
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
            >
              🔍 Analyze Repository
            </a>
            <a
              href="http://localhost:8000/api/health/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-lg"
            >
              💚 API Health
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="text-4xl mb-4">🏗️</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Architecture</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Detect patterns like MVC, Clean Architecture, and Microservices
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Quality</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Maintainability scores, test coverage, and technical debt analysis
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Principles</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                SOLID, DRY, and best practices with actionable roadmaps
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Collaboration</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Team dynamics, bus factor, and hiring recommendations
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Powered by Groq AI (Llama 3.3 70B) • Django Clean Architecture • Next.js
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

