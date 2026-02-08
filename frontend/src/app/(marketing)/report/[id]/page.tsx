'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ReportResponse } from '@/types/api'
import { ScoresOverview } from '@/components/reports/ScoresOverview'
import { QualityInsights } from '@/components/reports/QualityInsights'
import { PrinciplesInsights } from '@/components/reports/PrinciplesInsights'
import { ArchitectureInsights } from '@/components/reports/ArchitectureInsights'
import { CollaborationInsights } from '@/components/reports/CollaborationInsights'
import { RawDataFallback } from '@/components/reports/RawDataFallback'
import { AIInsightsOverview } from '@/components/reports/AIInsightsOverview'
import { ExecutiveSummary } from '@/components/reports/ExecutiveSummary'
import { motion, AnimatePresence } from 'framer-motion'

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
      <main className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-600 font-medium"
          >
            Loading report...
          </motion.p>
        </motion.div>
      </main>
    )
  }

  if (error || !report) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-red-200 rounded-2xl p-8 max-w-md shadow-lg"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">Error</h1>
          <p className="text-gray-600 mb-6 text-center">{error || 'Report not found'}</p>
          <motion.a
            href="/analyze"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Analyze Another Repository
          </motion.a>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.02, 0.04, 0.02],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 py-8 px-4 max-w-7xl mx-auto">
        {/* Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <motion.a
            href="/analyze"
            whileHover={{ x: -4 }}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 group"
          >
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              whileHover={{ x: -2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </motion.svg>
            <span>Analyze Another Repository</span>
          </motion.a>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 mb-2"
          >
            Analysis Report
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="h-1 bg-blue-600 rounded-full"
          />
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar with scores - Animated */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-4">
              <ScoresOverview report={report} />
            </div>
          </motion.div>

          {/* Main content area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* AI Insights Overview with entrance animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <AIInsightsOverview report={report} />
            </motion.div>

            {/* Executive Summary with stagger animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <ExecutiveSummary report={report} />
            </motion.div>

            {/* Analysis Tabs with modern design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
            >
              {/* Tab Navigation */}
              <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50">
                {[
                  { key: 'quality', label: 'Quality', icon: '📊' },
                  { key: 'principles', label: 'Principles', icon: '🏗️' },
                  { key: 'architecture', label: 'Architecture', icon: '🏛️' },
                  { key: 'collaboration', label: 'Collaboration', icon: '👥' },
                ].map((tab, index) => (
                  <motion.button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`relative flex-1 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                      activeTab === tab.key
                        ? 'text-blue-600 bg-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                    {activeTab === tab.key && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Tab content with animation */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'quality' && (
                    <motion.div
                      key="quality"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {report.insights?.quality ? (
                        <QualityInsights insight={report.insights.quality} />
                      ) : (
                        <RawDataFallback title="Quality Analysis" rawData={(report as any).quality} type="quality" />
                      )}
                    </motion.div>
                  )}
                  {activeTab === 'principles' && (
                    <motion.div
                      key="principles"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {report.insights?.principles ? (
                        <PrinciplesInsights insight={report.insights.principles} />
                      ) : (
                        <RawDataFallback title="Engineering Principles" rawData={(report as any).principles} type="principles" />
                      )}
                    </motion.div>
                  )}
                  {activeTab === 'architecture' && (
                    <motion.div
                      key="architecture"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {report.insights?.architecture ? (
                        <ArchitectureInsights insight={report.insights.architecture} />
                      ) : (
                        <RawDataFallback title="Architecture" rawData={report.architecture} type="quality" />
                      )}
                    </motion.div>
                  )}
                  {activeTab === 'collaboration' && (
                    <motion.div
                      key="collaboration"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {report.insights?.collaboration ? (
                        <CollaborationInsights insight={report.insights.collaboration} />
                      ) : (
                        <RawDataFallback title="Collaboration" rawData={(report as any).collaboration} type="collaboration" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
