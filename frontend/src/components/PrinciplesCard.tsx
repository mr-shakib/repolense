/**
 * PrinciplesCard Component
 * 
 * Displays SOLID principles evaluation and code smell detection.
 */

import type { ReportResponse } from '@/types/api'

interface PrinciplesCardProps {
  data: ReportResponse['principles_data']
}

export default function PrinciplesCard({ data }: PrinciplesCardProps) {
  const score = data.overall_score
  const grade = data.grade

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">📐</div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            SOLID Principles
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

      {/* SOLID Scores */}
      <div className="mb-4">
        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          SOLID Breakdown
        </div>
        <div className="space-y-2">
          {Object.entries(data.solid_scores).map(([principle, principleScore]) => (
            <div key={principle} className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">{formatPrinciple(principle)}</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {principleScore.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Violations Summary */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Issues Found
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {data.violations.length}
          </span>
        </div>
        
        {data.violations.length > 0 && (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {data.violations.slice(0, 3).map((violation, idx) => (
              <div
                key={idx}
                className="p-2 rounded bg-slate-50 dark:bg-slate-700/50 text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {violation.principle}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(
                      violation.severity
                    )}`}
                  >
                    {violation.severity}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                  {violation.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function formatPrinciple(key: string): string {
  const map: Record<string, string> = {
    single_responsibility: 'Single Responsibility',
    open_closed: 'Open/Closed',
    liskov_substitution: 'Liskov Substitution',
    interface_segregation: 'Interface Segregation',
    dependency_inversion: 'Dependency Inversion',
  }
  return map[key] || key
}

function getSeverityColor(severity: string): string {
  switch (severity.toUpperCase()) {
    case 'HIGH':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
    case 'MEDIUM':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
    case 'LOW':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
  }
}

function getScoreColor(score: number): string {
  if (score >= 90) return '#10b981'
  if (score >= 70) return '#3b82f6'
  if (score >= 60) return '#f59e0b'
  if (score >= 50) return '#f97316'
  return '#ef4444'
}
