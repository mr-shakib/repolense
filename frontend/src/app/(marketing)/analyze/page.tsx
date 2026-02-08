'use client'

import { useState, useEffect } from 'react'
import { AnalysisRequest } from '@/types/api'
import AnalysisLoadingAnimation from '@/components/analysis/AnalysisLoadingAnimation'
import { motion } from 'framer-motion'

interface RecentAnalysis {
  id: string
  repo_url: string
  status: string
  created_at: string
}

const EXAMPLE_REPOS = [
  { url: 'https://github.com/facebook/react', name: 'React' },
  { url: 'https://github.com/vercel/next.js', name: 'Next.js' },
  { url: 'https://github.com/django/django', name: 'Django' },
]

const ANALYSIS_PHASES = [
  { name: 'Ingestion', description: 'Fetching repository data' },
  { name: 'Architecture', description: 'Detecting patterns' },
  { name: 'Quality', description: 'Analyzing code metrics' },
  { name: 'Principles', description: 'Evaluating SOLID' },
  { name: 'Collaboration', description: 'Analyzing team dynamics' },
  { name: 'AI Insights', description: 'Generating recommendations' },
]

export default function AnalyzePage() {
  const [formData, setFormData] = useState<AnalysisRequest>({
    repository_url: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisId, setAnalysisId] = useState<string | null>(null)
  const [urlValid, setUrlValid] = useState<boolean | null>(null)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([])
  const [showSidebar, setShowSidebar] = useState(false)

  // Validate GitHub URL in real-time
  useEffect(() => {
    if (!formData.repository_url) {
      setUrlValid(null)
      return
    }
    
    const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/
    setUrlValid(githubUrlPattern.test(formData.repository_url))
  }, [formData.repository_url])

  // Load recent analyses from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentAnalyses')
    if (stored) {
      setRecentAnalyses(JSON.parse(stored))
    }
  }, [])

  // Simulate analysis phases
  useEffect(() => {
    if (loading) {
      const phaseInterval = setInterval(() => {
        setCurrentPhase(prev => {
          const next = prev + 1
          return next < ANALYSIS_PHASES.length ? next : prev
        })
      }, 8000) // 8 seconds per phase (48 seconds total for 6 phases)

      return () => clearInterval(phaseInterval)
    } else {
      setCurrentPhase(0)
    }
  }, [loading])

  const handleExampleClick = (url: string) => {
    setFormData({ ...formData, repository_url: url })
  }

  const saveToRecent = (id: string, url: string) => {
    const newAnalysis = {
      id,
      repo_url: url,
      status: 'IN_PROGRESS',
      created_at: new Date().toISOString(),
    }
    const updated = [newAnalysis, ...recentAnalyses.slice(0, 4)]
    setRecentAnalyses(updated)
    localStorage.setItem('recentAnalyses', JSON.stringify(updated))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setAnalysisId(null)
    setCurrentPhase(0)

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'
      const response = await fetch(`${apiBaseUrl}/api/analyze/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      setAnalysisId(data.id)
      saveToRecent(data.id, formData.repository_url)
      
      // Poll for completion
      pollAnalysisStatus(data.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  const pollAnalysisStatus = async (id: string) => {
    const maxAttempts = 60 // 2 minutes max
    let attempts = 0

    const poll = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'
        const response = await fetch(`${apiBaseUrl}/api/analyze/${id}/`)
        const analysis = await response.json()

        if (analysis.status === 'COMPLETED') {
          setLoading(false)
          // Redirect to report page
          window.location.href = `/report/${id}`
        } else if (analysis.status === 'FAILED') {
          setError(analysis.error_message || 'Analysis failed')
          setLoading(false)
        } else if (attempts < maxAttempts) {
          attempts++
          setTimeout(poll, 2000) // Poll every 2 seconds
        } else {
          setError('Analysis timeout - please check status manually')
          setLoading(false)
        }
      } catch (err) {
        setError('Failed to check analysis status')
        setLoading(false)
      }
    }

    poll()
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-50">
      {/* Creative Geometric Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* SVG Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        {/* Animated Floating Shapes */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[10%] w-20 h-20 border-4 border-blue-200/30"
          style={{ borderRadius: '30%' }}
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            x: [0, -25, 0],
            rotate: [0, -120, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-[15%] w-16 h-16 bg-purple-200/20 rounded-full"
        />
        <motion.div
          animate={{
            y: [0, -35, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-32 left-[20%] w-12 h-12 border-4 border-cyan-200/30"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 right-[25%] w-24 h-24 border-4 border-indigo-200/30"
          style={{ borderRadius: '40%' }}
        />
        
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.12, 0.22, 0.12],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 py-6 px-4">
        {/* Creative Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-6"
        >
          {/* Decorative Elements */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"
            />
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-sm font-bold text-blue-600 tracking-widest uppercase"
            >
              AI-Powered Analysis
            </motion.span>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full"
            />
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-3 leading-tight"
            style={{
              textShadow: '3px 3px 0 rgba(59,130,246,0.1), 6px 6px 0 rgba(139,92,246,0.05)'
            }}
          >
            Unlock Repository
            <br />
            <span className="relative inline-block mt-1">
              Intelligence
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-2 bg-blue-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                style={{
                  boxShadow: '0 4px 16px rgba(59,130,246,0.4)'
                }}
              />
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base text-gray-600 max-w-2xl mx-auto"
          >
            Transform your codebase into actionable insights with cutting-edge AI analysis
          </motion.p>

          {/* Stats Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-4">
          
            {[
              { icon: '⚡', label: '60-90s', desc: 'Analysis Time' },
              { icon: '🎯', label: '6 Metrics', desc: 'Comprehensive' },
              { icon: '🤖', label: 'AI-Driven', desc: 'Smart Insights' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -2, scale: 1.03 }}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border-2 border-gray-200"
                style={{
                  boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.9), 0 4px 12px rgba(0,0,0,0.04)'
                }}
              >
                <span className="text-xl">{stat.icon}</span>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900">{stat.label}</p>
                  <p className="text-[10px] text-gray-500">{stat.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Main Form - Takes 2 columns */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="lg:col-span-2"
            >
              {/* Example Repos - Compact Design */}
              {!loading && (
                <motion.div 
                  className="mb-3"
                  whileHover={{ y: -1 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                      <span className="text-xs font-bold text-gray-700">Quick Start</span>
                    </div>
                    {recentAnalyses.length > 0 && (
                      <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="ml-auto text-xs font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
                      >
                        {showSidebar ? '← Hide' : 'Recent →'}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {EXAMPLE_REPOS.map((repo, i) => (
                      <motion.button
                        key={repo.url}
                        onClick={() => handleExampleClick(repo.url)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 + i * 0.1 }}
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative px-3 py-1.5 bg-white text-xs font-semibold text-gray-700 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all overflow-hidden group"
                        style={{
                          boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                        }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-blue-50"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                        <span className="relative z-10 flex items-center gap-1.5">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                          </svg>
                          {repo.name}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Main Form Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-white rounded-2xl p-5 relative overflow-hidden"
                style={{
                  border: '2px solid rgba(226,232,240,0.8)',
                  boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.9), 0 10px 30px rgba(0,0,0,0.06)'
                }}
              >
                {/* Decorative corner elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full opacity-50" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-50 rounded-tr-full opacity-50" />

                <form onSubmit={handleSubmit} className="relative space-y-4">
                  {/* Repository URL */}
                  <div>
                    <label htmlFor="repository_url" className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Repository URL
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <input
                        type="url"
                        id="repository_url"
                        required
                        placeholder="https://github.com/owner/repository"
                        value={formData.repository_url}
                        onChange={(e) => setFormData({ ...formData, repository_url: e.target.value })}
                        className={`w-full px-4 py-3 pr-12 border-2 text-sm ${
                          urlValid === false
                            ? 'border-red-300 focus:ring-red-500 bg-red-50/50'
                            : urlValid === true
                            ? 'border-green-300 focus:ring-green-500 bg-green-50/50'
                            : 'border-gray-200 focus:ring-blue-500 bg-gray-50'
                        } rounded-2xl focus:ring-4 focus:border-transparent text-gray-900 font-medium transition-all duration-200 placeholder:text-gray-400`}
                        style={{
                          boxShadow: urlValid === true 
                            ? 'inset 0 2px 4px rgba(34,197,94,0.1), 0 0 0 3px rgba(34,197,94,0.1)'
                            : urlValid === false
                            ? 'inset 0 2px 4px rgba(239,68,68,0.1), 0 0 0 3px rgba(239,68,68,0.1)'
                            : 'inset 0 2px 4px rgba(0,0,0,0.03)'
                        }}
                      />
                      {/* Validation Icons */}
                      {urlValid === true && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="absolute right-4 top-4"
                        >
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </motion.div>
                      )}
                      {urlValid === false && (
                        <motion.div
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="absolute right-4 top-4"
                        >
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </motion.div>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Paste any public GitHub repository URL
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="bg-red-50 border-2 border-red-200 rounded-xl p-3 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500" />
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-red-900 mb-0.5">Analysis Failed</p>
                          <p className="text-xs text-red-700">{error}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Analysis Progress */}
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <AnalysisLoadingAnimation 
                        phases={ANALYSIS_PHASES} 
                        currentPhase={currentPhase} 
                      />
                    </motion.div>
                  )}

                  {/* Submit Button - Creative Design */}
                  <motion.button
                    type="submit"
                    disabled={loading || urlValid === false}
                    whileHover={{ scale: loading || urlValid === false ? 1 : 1.02 }}
                    whileTap={{ scale: loading || urlValid === false ? 1 : 0.98 }}
                    className="relative w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed overflow-hidden group"
                    style={{
                      boxShadow: loading || urlValid === false 
                        ? 'none' 
                        : 'inset 0 1px 0 0 rgba(255,255,255,0.2), 0 8px 24px rgba(59,130,246,0.3)',
                    }}
                  >
                    {/* Animated background shimmer */}
                    {!loading && urlValid !== false && (
                      <motion.div
                        className="absolute inset-0 bg-blue-400/30"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                    
                    <span className="relative z-10 flex items-center justify-center gap-2 text-base">
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                          />
                          <span>Analyzing Repository...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span>Start AI Analysis</span>
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </span>
                  </motion.button>

                  {/* Trust indicators */}
                  {!loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="flex items-center justify-center gap-4 pt-2 text-[10px] text-gray-500"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Secure Analysis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>60-90 seconds</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                        </svg>
                        <span>AI-Powered</span>
                      </div>
                    </motion.div>
                  )}
                </form>
              </motion.div>
            </motion.div>

            {/* Sidebar - Features List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="lg:col-span-1 space-y-3"
            >
              {!loading && (
                <>
                  {/* What You Get Card */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-2xl p-4 border-2 border-gray-200"
                    style={{
                      boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.9), 0 6px 16px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="font-black text-gray-900 text-sm">Analysis Includes</h3>
                    </div>
                    <div className="space-y-2">
                      {[
                        { icon: '🏗️', title: 'Architecture', desc: 'Pattern detection & design analysis' },
                        { icon: '📊', title: 'Code Quality', desc: 'Metrics & maintainability scores' },
                        { icon: '⚡', title: 'Best Practices', desc: 'SOLID principles evaluation' },
                        { icon: '👥', title: 'Team Insights', desc: 'Collaboration & dynamics' },
                        { icon: '🤖', title: 'AI Recommendations', desc: 'Actionable improvements' },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + i * 0.1 }}
                          className="flex items-start gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors group cursor-default"
                        >
                          <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900">{item.title}</p>
                            <p className="text-[10px] text-gray-600">{item.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Fun Fact Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.4 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-purple-50 border-2 border-purple-200 rounded-xl p-3"
                  >
                    <div className="flex items-start gap-2">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-2xl"
                      >
                        💡
                      </motion.div>
                      <div>
                        <p className="text-xs font-bold text-purple-900 mb-0.5">Pro Tip</p>
                        <p className="text-[10px] text-purple-700">
                          GitHub authentication configured server-side for secure repo access
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Recent Analyses Sidebar - Creative Redesign */}
      {showSidebar && recentAnalyses.length > 0 && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-96 bg-white z-50 overflow-hidden"
          style={{
            boxShadow: '-20px 0 60px rgba(0,0,0,0.15)',
            borderLeft: '2px solid rgba(226,232,240,0.8)'
          }}
        >
          {/* Header with Pattern */}
          <div className="relative bg-blue-600 p-6 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
            
            <div className="relative flex items-center justify-between">
              <div>
                <span className="text-blue-100 text-xs font-bold uppercase tracking-wider">Your History</span>
                <h3 className="text-2xl font-black text-white">Recent Analyses</h3>
              </div>
              <motion.button
                onClick={() => setShowSidebar(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Analysis List */}
          <div className="p-6 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 132px)' }}>
            {recentAnalyses.map((analysis, index) => (
              <motion.a
                key={analysis.id}
                href={`/report/${analysis.id}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: -4, scale: 1.02 }}
                className="block group relative"
              >
                <div 
                  className="p-5 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 relative overflow-hidden"
                  style={{
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                  }}
                >
                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 bg-blue-50"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Repository Name */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate mb-1 group-hover:text-blue-600 transition-colors">
                          {analysis.repo_url.replace('https://github.com/', '')}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{new Date(analysis.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                        analysis.status === 'COMPLETED' 
                          ? 'bg-green-100 text-green-700'
                          : analysis.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          analysis.status === 'COMPLETED' 
                            ? 'bg-green-500'
                            : analysis.status === 'IN_PROGRESS'
                            ? 'bg-blue-500 animate-pulse'
                            : 'bg-gray-500'
                        }`} />
                        {analysis.status.replace('_', ' ')}
                      </span>
                      
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </main>
  )
}
