/**
 * QualityCard Component
 * 
 * Displays code quality metrics including complexity, tests, and documentation.
 */

import type { ReportResponse } from '@/types/api'

interface QualityCardProps {
  data: ReportResponse['quality_data']
}

export default function QualityCard({ data }: QualityCardProps) {
  const score = data.overall_score
  const grade = data.grade

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">✨</div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Code Quality
          </h3>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold" style={{ color: getScoreColor(score) }}>
            {score.toFixed(1)}
          </div>
          <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            {grade}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{
            width: `${score}%`,
            backgroundColor: getScoreColor(score),
          }}
        />
      </div>

      {/* Metrics */}
      <div className="space-y-3 text-sm">
        {/* Complexity */}
        <div>
          <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Complexity
          </div>
          <div className="space-y-1 text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Files:</span>
              <span className="font-medium">{data.complexity_metrics.total_files}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Length:</span>
              <span className="font-medium">{data.complexity_metrics.avg_file_length} lines</span>
            </div>
            <div className="flex justify-between">
              <span>Large Files:</span>
              <span className="font-medium">{data.complexity_metrics.large_files_count}</span>
            </div>
          </div>
        </div>

        {/* Tests */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Tests
          </div>
          <div className="space-y-1 text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Has Tests:</span>
              <span className="font-medium">{data.test_metrics.has_tests ? '✓ Yes' : '✗ No'}</span>
            </div>
            <div className="flex justify-between">
              <span>Test Files:</span>
              <span className="font-medium">{data.test_metrics.test_files_count}</span>
            </div>
            <div className="flex justify-between">
              <span>Test Ratio:</span>
              <span className="font-medium">{(data.test_metrics.test_ratio * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Documentation */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Documentation
          </div>
          <div className="space-y-1 text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>README:</span>
              <span className="font-medium">{data.documentation_metrics.has_readme ? '✓ Yes' : '✗ No'}</span>
            </div>
            <div className="flex justify-between">
              <span>Docs Folder:</span>
              <span className="font-medium">{data.documentation_metrics.has_docs_folder ? '✓ Yes' : '✗ No'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getScoreColor(score: number): string {
  if (score >= 90) return '#10b981'
  if (score >= 70) return '#3b82f6'
  if (score >= 60) return '#f59e0b'
  if (score >= 50) return '#f97316'
  return '#ef4444'
}
