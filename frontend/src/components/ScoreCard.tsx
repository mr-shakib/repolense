/**
 * ScoreCard Component
 * 
 * Reusable card component for displaying analysis dimension scores.
 */

import React from 'react'

interface ScoreCardProps {
  title: string
  score: number
  grade: string
  icon?: React.ReactNode
  children?: React.ReactNode
}

export default function ScoreCard({ title, score, grade, icon, children }: ScoreCardProps) {
  const scoreColor = getScoreColor(score)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon && <div className="text-2xl">{icon}</div>}
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {title}
          </h3>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold" style={{ color: scoreColor }}>
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
            backgroundColor: scoreColor,
          }}
        />
      </div>

      {/* Content */}
      {children && (
        <div className="text-sm text-slate-600 dark:text-slate-300">
          {children}
        </div>
      )}
    </div>
  )
}

function getScoreColor(score: number): string {
  if (score >= 90) return '#10b981' // green
  if (score >= 70) return '#3b82f6' // blue
  if (score >= 60) return '#f59e0b' // amber
  if (score >= 50) return '#f97316' // orange
  return '#ef4444' // red
}
