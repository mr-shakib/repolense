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
import React from 'react'

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
    <main className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Creative Animated Pattern Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Geometric shapes pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        {/* Animated solid color circles with morphing effect */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            borderRadius: ['50%', '40%', '50%'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/20 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -120, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
            borderRadius: ['50%', '35%', '50%'],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-purple-500/15 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, -80, 0],
            scale: [1, 1.15, 1],
            rotate: [0, -90, 0],
            borderRadius: ['50%', '45%', '50%'],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-indigo-500/18 blur-3xl"
        />
        
        {/* Animated geometric shapes floating */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -40, 0],
              rotate: [0, 360],
              opacity: [0.15, 0.35, 0.15],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.7,
            }}
            className="absolute rounded-sm"
            style={{
              width: i % 2 === 0 ? '12px' : '8px',
              height: i % 2 === 0 ? '12px' : '8px',
              backgroundColor: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#06b6d4',
              opacity: 0.2,
              left: `${10 + i * 12}%`,
              top: `${15 + i * 8}%`,
              transform: `rotate(${i * 45}deg)`,
            }}
          />
        ))}
        {/* Dotted pattern overlay */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`dot-${i}`}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="absolute w-3 h-3 bg-blue-600/30 rounded-full"
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
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 group px-4 py-2.5 bg-white/80 backdrop-blur-md rounded-full border-2 border-blue-200 shadow-[0_4px_12px_rgba(59,130,246,0.1)] hover:shadow-[0_8px_24px_rgba(59,130,246,0.15)] transition-all"
            style={{
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.7), 0 4px 12px rgba(59,130,246,0.1)',
            }}
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
            className="inline-block relative"
          >
            <motion.h1
              className="text-5xl md:text-6xl font-black text-gray-900 mb-4 relative"
              style={{
                textShadow: '2px 2px 0 rgba(59,130,246,0.1), 4px 4px 0 rgba(139,92,246,0.05)',
              }}
            >
              Analysis Report
              {/* Animated underline decoration */}
              <motion.span
                className="absolute -bottom-2 left-0 h-2 bg-blue-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '120px' }}
                transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
                style={{
                  boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                }}
              />
            </motion.h1>
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
              className="bg-white/90 backdrop-blur-xl rounded-3xl border-2 border-gray-200 overflow-hidden"
              style={{
                boxShadow: '0 20px 60px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
              }}
            >
              {/* Tab Navigation with Neumorphic Style */}
              <div className="flex overflow-x-auto border-b-2 border-gray-200 bg-gray-50">
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
                        ? 'text-blue-600 bg-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    style={activeTab === tab.key ? {
                      boxShadow: '0 -2px 10px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,1)',
                    } : {}}
                  >
                    <motion.span 
                      className="mr-2 text-xl"
                      animate={{ 
                        rotate: activeTab === tab.key ? [0, 10, -10, 0] : 0,
                        y: activeTab === tab.key ? [0, -2, 0] : 0,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {tab.icon}
                    </motion.span>
                    {tab.label}
                    {activeTab === tab.key && (
                      <React.Fragment>
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                          style={{
                            boxShadow: '0 0 20px rgba(59,130,246,0.5)',
                          }}
                        />
                        {/* Corner highlights */}
                        <span className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      </React.Fragment>
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
