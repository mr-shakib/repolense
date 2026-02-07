/**
 * CollaborationCard Component
 * 
 * Displays team collaboration metrics including bus factor and contribution distribution.
 */

import type { ReportResponse } from '@/types/api'

interface CollaborationCardProps {
  data: ReportResponse['collaboration_data']
}

export default function CollaborationCard({ data }: CollaborationCardProps) {
  const score = data?.collaboration_score || 0
  const grade = data?.grade || 'N/A'
  const totalContributors = data?.total_contributors || 0
  const activeContributors = data?.active_contributors || 0
  const topContributors = data?.top_contributors || []
  const busFactor = data?.bus_factor || 0
  const commitFrequency = data?.commit_frequency || 0
  const ownershipConcentration = data?.ownership_concentration || 0

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">👥</div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Collaboration
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
        {/* Contributors */}
        <div>
          <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Contributors
          </div>
          <div className="space-y-1 text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="font-medium">{totalContributors}</span>
            </div>
            <div className="flex justify-between">
              <span>Active (≥5%):</span>
              <span className="font-medium">{activeContributors}</span>
            </div>
            <div className="flex justify-between">
              <span>Key Contributors:</span>
              <span className="font-medium">{topContributors.filter(c => c.is_key).length}</span>
            </div>
          </div>
        </div>

        {/* Bus Factor */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Bus Factor
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getBusFactorColor(
                busFactor
              )}`}
            >
              {busFactor}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {getBusFactorLabel(busFactor)}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Min contributors owning 50% of commits
          </p>
        </div>

        {/* Activity */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Activity
          </div>
          <div className="space-y-1 text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Commits/Week:</span>
              <span className="font-medium">{commitFrequency.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span>Top Contributor:</span>
              <span className="font-medium">{ownershipConcentration.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getBusFactorColor(busFactor: number): string {
  if (busFactor >= 5) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
  if (busFactor >= 3) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
  return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
}

function getBusFactorLabel(busFactor: number): string {
  if (busFactor >= 5) return 'Low Risk'
  if (busFactor >= 3) return 'Medium Risk'
  return 'High Risk'
}

function getScoreColor(score: number): string {
  if (score >= 90) return '#10b981'
  if (score >= 70) return '#3b82f6'
  if (score >= 60) return '#f59e0b'
  if (score >= 50) return '#f97316'
  return '#ef4444'
}
