'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ReportResponse } from '@/types/api'
import { ScoresOverview } from '@/components/reports/ScoresOverview'
import { QualityInsights } from '@/components/reports/QualityInsights'
import { PrinciplesInsights } from '@/components/reports/PrinciplesInsights'
import { ArchitectureInsights } from '@/components/reports/ArchitectureInsights'
import { CollaborationInsights } from '@/components/reports/CollaborationInsights'

export default function ReportPage() {
  const params = useParams()
  const id = params.id as string
  
  const [report, setReport] = useState<ReportResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'quality' | 'principles' | 'architecture' | 'collaboration'>('quality')

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'
        const response = await fetch(`${apiBaseUrl}/api/analyze/${id}/report/`)
        
        if (!response.ok) {
          throw new Error('Failed to load report')
        }

        const data = await response.json()
        setReport(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchReport()
    }
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading report...</p>
        </div>
      </main>
    )
  }

  if (error || !report) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error || 'Report not found'}</p>
          <a
            href="/analyze"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Analyze Another Repository
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/analyze"
            className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
          >
            ← Analyze Another Repository
          </a>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analysis Report
          </h1>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar with scores */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <ScoresOverview report={report} />
            </div>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab('quality')}
                  className={`flex-1 px-6 py-4 font-semibold transition ${
                    activeTab === 'quality'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Quality
                </button>
                <button
                  onClick={() => setActiveTab('principles')}
                  className={`flex-1 px-6 py-4 font-semibold transition ${
                    activeTab === 'principles'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Principles
                </button>
                <button
                  onClick={() => setActiveTab('architecture')}
                  className={`flex-1 px-6 py-4 font-semibold transition ${
                    activeTab === 'architecture'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Architecture
                </button>
                <button
                  onClick={() => setActiveTab('collaboration')}
                  className={`flex-1 px-6 py-4 font-semibold transition ${
                    activeTab === 'collaboration'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Collaboration
                </button>
              </div>
            </div>

            {/* Tab content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              {activeTab === 'quality' && report.insights?.quality && (
                <QualityInsights insight={report.insights.quality} />
              )}
              {activeTab === 'principles' && report.insights?.principles && (
                <PrinciplesInsights insight={report.insights.principles} />
              )}
              {activeTab === 'architecture' && report.insights?.architecture && (
                <ArchitectureInsights insight={report.insights.architecture} />
              )}
              {activeTab === 'collaboration' && report.insights?.collaboration && (
                <CollaborationInsights insight={report.insights.collaboration} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
