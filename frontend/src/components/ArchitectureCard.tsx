/**
 * ArchitectureCard Component
 * 
 * Displays architecture analysis results including detected patterns.
 */

import type { ReportResponse } from '@/types/api'

interface ArchitectureCardProps {
  data: ReportResponse['architecture_data']
}

export default function ArchitectureCard({ data }: ArchitectureCardProps) {
  const score = data?.confidence || 0
  const grade = getGrade(score)
  const detectedPatterns = data?.detected_patterns || []
  const primaryPattern = data?.primary_pattern || 'Unknown'

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🏗️</div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Architecture
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

      {/* Primary Pattern */}
      <div className="mb-4">
        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Primary Pattern
        </div>
        <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 
                      rounded-full text-sm font-medium">
          {primaryPattern}
        </div>
      </div>

      {/* Detected Patterns */}
      {detectedPatterns.length > 0 && (
        <div>
          <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            All Detected Patterns
          </div>
          <div className="space-y-2">
            {detectedPatterns.slice(0, 3).map((pattern, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">{pattern?.pattern || 'Unknown'}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {(pattern?.confidence || 0).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
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

function getGrade(score: number): string {
  if (score >= 95) return 'A+'
  if (score >= 90) return 'A'
  if (score >= 70) return 'B'
  if (score >= 60) return 'C'
  if (score >= 50) return 'D'
  return 'F'
}
