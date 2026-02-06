export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          RepoLense AI
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Analyze GitHub repositories for architecture, quality, and engineering principles
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/analyze"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Analyze Repository
          </a>
          <a
            href="/api/health"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            Check API Health
          </a>
        </div>
      </div>
    </main>
  )
}
