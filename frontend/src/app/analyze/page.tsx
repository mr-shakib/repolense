/**
 * Analyze Page
 * 
 * Main page for submitting GitHub repositories for analysis.
 * Displays a form and handles the submission workflow.
 */

import AnalyzeForm from '@/components/AnalyzeForm'

export default function AnalyzePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Analyze Repository
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Enter a GitHub repository URL to analyze its architecture, quality, and engineering principles
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <AnalyzeForm />
          </div>

          {/* Info Section */}
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              What gets analyzed?
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• <strong>Architecture:</strong> MVC, Clean Architecture, Layered, Feature-Based patterns</li>
              <li>• <strong>Code Quality:</strong> File complexity, test coverage, documentation</li>
              <li>• <strong>SOLID Principles:</strong> SRP violations, code smells, design patterns</li>
              <li>• <strong>Collaboration:</strong> Bus factor, commit frequency, team distribution</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
