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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
      {/* Creative Gradient Mesh Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -120, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, -80, 0],
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-gradient-to-bl from-indigo-400/25 to-blue-400/25 rounded-full blur-3xl"
        />
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="absolute w-2 h-2 bg-blue-400/40 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
          />
        ))}
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
            whileHover={{ x: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 group px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-blue-100/50 shadow-sm hover:shadow-md transition-all"
          >
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: [-2, 0, -2] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </motion.svg>
            <span>Back to Analyzer</span>
          </motion.a>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block"
          >
            <motion.h1
              className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
              animate={{
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{ duration: 8, repeat: Infinity }}
              style={{ backgroundSize: '200% auto' }}
            >
              Analysis Report
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "120px" }}
              transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
              className="h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg shadow-blue-500/50"
            />
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar with scores - Animated with 3D effect */}
          <motion.div
            initial={{ opacity: 0, x: -20, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            whileHover={{ y: -4 }}
            className="lg:col-span-1"
            style={{ transformStyle: "preserve-3d", perspective: 1000 }}
          >
            <motion.div className="sticky top-4">
              <ScoresOverview report={report} />
            </motion.div>
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
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <AIInsightsOverview report={report} />
            </motion.div>

            {/* Executive Summary with stagger animation */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <ExecutiveSummary report={report} />
            </motion.div>

            {/* Analysis Tabs with modern design */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl shadow-blue-500/10 overflow-hidden"
            >
              {/* Tab Navigation with Glassmorphism */}
              <div className="flex overflow-x-auto border-b border-gray-100/50 bg-gradient-to-r from-gray-50/80 to-blue-50/40 backdrop-blur-sm">
                {[
                  { key: 'quality', label: 'Quality', icon: '📊' },
                  { key: 'principles', label: 'Principles', icon: '🏗️' },
                  { key: 'architecture', label: 'Architecture', icon: '🏛️' },
                  { key: 'collaboration', label: 'Collaboration', icon: '👥' },
                ].map((tab, index) => (
                  <motion.button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`relative flex-1 px-6 py-4 font-bold transition-all whitespace-nowrap ${
                      activeTab === tab.key
                        ? 'text-blue-600 bg-white/90 backdrop-blur-sm shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <motion.span 
                      className="mr-2 text-xl"
                      animate={{ rotate: activeTab === tab.key ? [0, 10, -10, 0] : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {tab.icon}
                    </motion.span>
                    {tab.label}
                    {activeTab === tab.key && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/50"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
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
