'use client'

import { useState, useEffect } from 'react'
import { AnalysisRequest } from '@/types/api'

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
    github_token: '',
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
    if (loading && analysisId) {
      const phaseInterval = setInterval(() => {
        setCurrentPhase(prev => {
          const next = prev + 1
          return next < ANALYSIS_PHASES.length ? next : prev
        })
      }, 10000) // 10 seconds per phase

      return () => clearInterval(phaseInterval)
    } else {
      setCurrentPhase(0)
    }
  }, [loading, analysisId])

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
      })relative overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 py-12 px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3">
            Analyze Repository
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Get AI-powered insights on architecture, quality, and team collaboration
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Example Repos */}
          {!loading && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Try with examples
                </h3>
                {recentAnalyses.length > 0 && (
                  <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {showSidebar ? 'Hide' : 'Show'} recent
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_REPOS.map((repo) => (
                  <button
                    key={repo.url}
                    onClick={() => handleExampleClick(repo.url)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    {repo.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Form Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 animate-slide-up delay-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Repository URL */}
              <div className="group">
                <label htmlFor="repository_url" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Repository URL *
                </label>
                <div className="relative">
                  <input
                    type="url"
                    id="repository_url"
                    required
                    placeholder="https://github.com/owner/repo"
                    value={formData.repository_url}
                    onChange={(e) => setFormData({ ...formData, repository_url: e.target.value })}
                    className={`w-full px-4 py-3 pr-10 border ${
                      urlValid === false
                        ? 'border-red-300 dark:border-red-700 focus:ring-red-500'
                        : urlValid === true
                        ? 'border-green-300 dark:border-green-700 focus:ring-green-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    } rounded-xl focus:ring-2 focus:border-transparent dark:bg-gray-700/50 dark:text-white transition-all duration-200`}
                  />
                  {urlValid === true && (
                    <div className="absolute right-3 top-3.5 text-green-500">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {urlValid === false && (
                    <div className="absolute right-3 top-3.5 text-red-500">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Enter a valid GitHub repository URL
                </p>
              </div>

              {/* GitHub Token */}
              <div>
                <label htmlFor="github_token" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  GitHub Token (Optional)
                </label>
                <input
                  type="password"
                  id="github_token"
                  placeholder="ghp_xxxxxxxxxxxx"
                  value={formData.github_token}
                  onChange={(e) => setFormData({ ...formData, github_token: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700/50 dark:text-white transition-all duration-200"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  For private repositories or higher rate limits
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 animate-shake">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                </div>
              )}

              {/* Analysis Progress */}
              {loading && analysisId && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 animate-fade-in">
                  <div className="flex items-center mb-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 dark:border-blue-400 mr-3"></div>
                    <p className="text-blue-900 dark:text-blue-100 font-medium">
                      Analyzing repository...
                    </p>
                  </div>
                  
                  {/* Progress Steps */}
                  <div className="space-y-3 mt-4">
                    {ANALYSIS_PHASES.map((phase, index) => (
                      <div
                        key={phase.name}
                        className={`flex items-center transition-all duration-500 ${
                          index <= currentPhase ? 'opacity-100' : 'opacity-40'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 transition-colors duration-300 ${
                          index < currentPhase
                            ? 'bg-green-500 text-white'
                            : index === currentPhase
                            ? 'bg-blue-500 text-white animate-pulse'
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                        }`}>
                          {index < currentPhase ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span className="text-xs font-bold">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            index <= currentPhase
                              ? 'text-gray-900 dark:text-gray-100'
                              : 'text-gray-500 dark:text-gray-500'
                          }`}>
                            {phase.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {phase.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-4 text-center">
                    This may take 60-90 seconds
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || urlValid === false}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Analyze Repository</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Benefits Section */}
          {!loading && (
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 animate-slide-up delay-200">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                What you'll get
              </h3>
              <div className="grid gap-3">
                {[
                  { icon: '🏗️', text: 'Architecture pattern detection and quality assessment' },
                  { icon: '📊', text: 'Code quality metrics with maintainability scores' },
                  { icon: '⚡', text: 'SOLID principles and engineering best practices evaluation' },
                  { icon: '👥', text: 'Team collaboration insights and hiring recommendations' },
                  { icon: '🤖', text: 'AI-generated actionable recommendations with effort estimates' },
                ].map((item, index) => (
                  <div key={index} className="flex items-start group hover:bg-gray-50 dark:hover:bg-gray-700/30 p-2 rounded-lg transition-colors duration-200">
                    <span className="text-xl mr-3 group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Analyses Sidebar */}
      {showSidebar && recentAnalyses.length > 0 && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-2xl border-l border-gray-200 dark:border-gray-700 p-6 animate-slide-in-right overflow-y-auto z-50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Analyses
            </h3>
            <button
              onClick={() => setShowSidebar(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-3">
            {recentAnalyses.map((analysis) => (
              <a
                key={analysis.id}
                href={`/report/${analysis.id}`}
                className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1">
                  {analysis.repo_url.replace('https://github.com/', '')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(analysis.created_at).toLocaleDateString()}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-slide-up.delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        .animate-slide-up.delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .delay-500 {
          animation-delay: 2s;
        }
        
        .delay-1000 {
          animation-delay: 4s;
        }
      `}</style {loading && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                  <p className="text-blue-800 dark:text-blue-200">
                    {analysisId ? 'Analyzing repository... This may take 60-90 seconds' : 'Starting analysis...'}
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                '🔍 Analyze Repository'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">What you'll get:</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Architecture pattern detection and quality assessment</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Code quality metrics with maintainability scores</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>SOLID principles and engineering best practices evaluation</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Team collaboration insights and hiring recommendations</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>AI-generated actionable recommendations with effort estimates</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
