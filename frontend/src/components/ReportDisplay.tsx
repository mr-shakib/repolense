/**
 * ReportDisplay Component
 * 
 * Fetches and displays a complete analysis report.
 * Shows overall score and breakdowns for each analysis dimension.
 */

'use client'

import { useEffect, useState } from 'react'
import { api, APIError } from '@/lib/api/client'
import type { ReportResponse } from '@/types/api'
import LoadingSpinner from './LoadingSpinner'
import ArchitectureCard from './ArchitectureCard'
import QualityCard from './QualityCard'
import PrinciplesCard from './PrinciplesCard'
import CollaborationCard from './CollaborationCard'

interface ReportDisplayProps {
  analysisId: string
}

export default function ReportDisplay({ analysisId }: ReportDisplayProps) {
  const [report, setReport] = useState<ReportResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await api.getReportByAnalysis(analysisId)
        setReport(data)
      } catch (err) {
        if (err instanceof APIError) {
          setError(err.message)
        } else {
          setError('Failed to load report')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [analysisId])

  if (loading) {
    return <LoadingSpinner message="Loading report..." />
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Error Loading Report
          </h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      </div>
    )
  }

  if (!report) {
    return null
  }

  // Calculate overall score from weighted components (Quality 40%, Principles 35%, Collaboration 25%)
  const qualityScore = report.quality_data?.scores?.overall || 0
  const principlesScore = report.principles_data?.principle_score || 0
  const collaborationScore = report.collaboration_data?.collaboration_score || 0
  const overallScore = (qualityScore * 0.40) + (principlesScore * 0.35) + (collaborationScore * 0.25)
  
  const repoUrl = report.analysis?.repository_url || 'Unknown Repository'
  const repoName = repoUrl.includes('/') 
    ? repoUrl.split('/').slice(-2).join('/')
    : repoUrl

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Analysis Report
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          {repoName}
        </p>
      </div>

      {/* Overall Score */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Overall Score
        </h2>
        <div className="text-6xl font-bold mb-2" style={{ color: getScoreColor(overallScore) }}>
          {overallScore.toFixed(1)}
        </div>
        <div className="text-2xl font-semibold text-slate-600 dark:text-slate-400 mb-4">
          {getGrade(overallScore)}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <div>Quality: {qualityScore.toFixed(1)} × 40%</div>
          <div>Principles: {principlesScore.toFixed(1)} × 35%</div>
          <div>Collaboration: {collaborationScore.toFixed(1)} × 25%</div>
        </div>
      </div>

      {/* Score Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {report.architecture_data && <ArchitectureCard data={report.architecture_data} />}
        {report.quality_data && <QualityCard data={report.quality_data} />}
        {report.principles_data && <PrinciplesCard data={report.principles_data} />}
        {report.collaboration_data && <CollaborationCard data={report.collaboration_data} />}
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <a
          href="/"
          className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 
                   font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition"
        >
          Back to Home
        </a>
        <a
          href="/analyze"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg 
                   hover:bg-blue-700 transition"
        >
          Analyze Another Repository
        </a>
      </div>
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

function getGrade(score: number): string {
  if (score >= 95) return 'A+'
  if (score >= 90) return 'A'
  if (score >= 70) return 'B'
  if (score >= 60) return 'C'
  if (score >= 50) return 'D'
  return 'F'
}
