/**
 * AnalyzeForm Component
 * 
 * Form for submitting GitHub repositories for analysis.
 * Handles submission, polling, and redirects to report page.
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api, APIError } from '@/lib/api/client'
import type { AnalysisResponse } from '@/types/api'

export default function AnalyzeForm() {
  const router = useRouter()
  const [repoUrl, setRepoUrl] = useState('')
  const [githubToken, setGithubToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisId, setAnalysisId] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  // Poll for analysis completion
  useEffect(() => {
    if (!analysisId) return

    const pollInterval = setInterval(async () => {
      try {
        const analysis = await api.getAnalysisStatus(analysisId)
        setStatus(analysis.status)

        if (analysis.status === 'COMPLETED') {
          clearInterval(pollInterval)
          // Redirect to report page
          router.push(`/report/${analysisId}`)
        } else if (analysis.status === 'FAILED') {
          clearInterval(pollInterval)
          setError(analysis.error_message || 'Analysis failed')
          setLoading(false)
        }
      } catch (err) {
        console.error('Polling error:', err)
      }
    }, 2000) // Poll every 2 seconds

    return () => clearInterval(pollInterval)
  }, [analysisId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await api.analyzeRepository({
        repository_url: repoUrl,
        github_token: githubToken || undefined,
      })

      setAnalysisId(response.id)
      setStatus(response.status)
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message)
        if (err.details) {
          const details = err.details as Record<string, string[]>
          const fieldErrors = Object.entries(details)
            .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
            .join('; ')
          setError(`${err.message}. ${fieldErrors}`)
        }
      } else {
        setError('Failed to submit repository for analysis')
      }
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Repository URL Input */}
      <div>
        <label htmlFor="repo-url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          GitHub Repository URL <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="repo-url"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/owner/repo"
          required
          disabled={loading}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 
                   bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Supports: https://github.com/owner/repo, github.com/owner/repo, or owner/repo
        </p>
      </div>

      {/* GitHub Token Input (Optional) */}
      <div>
        <label htmlFor="github-token" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          GitHub Token (Optional)
        </label>
        <input
          type="password"
          id="github-token"
          value={githubToken}
          onChange={(e) => setGithubToken(e.target.value)}
          placeholder="ghp_xxxxxxxxxxxx"
          disabled={loading}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 
                   bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Increases rate limit from 60 to 5000 requests/hour
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Status Display */}
      {loading && status && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Status:</strong> {status.replace('_', ' ')}
            </p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !repoUrl}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg
                 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition-all
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
      >
        {loading ? (
          <span className="flex items-center justify-center space-x-2">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            <span>Analyzing...</span>
          </span>
        ) : (
          'Analyze Repository'
        )}
      </button>
    </form>
  )
}
