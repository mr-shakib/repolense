import { ReportResponse } from '@/types/api'

interface AIInsightsOverviewProps {
  report: ReportResponse
}

export function AIInsightsOverview({ report }: AIInsightsOverviewProps) {
  const hasArchitecture = !!report.insights?.architecture
  const hasQuality = !!report.insights?.quality
  const hasPrinciples = !!report.insights?.principles
  const hasCollaboration = !!report.insights?.collaboration
  const hasExecutiveSummary = !!report.ai_executive_summary
  const hasDeveloperGuide = !!report.ai_developer_guide
  
  const totalInsights = [hasArchitecture, hasQuality, hasPrinciples, hasCollaboration].filter(Boolean).length
  const totalSections = [hasExecutiveSummary, hasDeveloperGuide].filter(Boolean).length
  
  // Determine hire recommendation styling
  const getHireStyle = (recommendation?: string) => {
    if (!recommendation) return { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Analyzing...' }
    
    if (recommendation.toLowerCase().includes('strong yes')) {
      return { bg: 'bg-green-100', text: 'text-green-700', label: '✅ Strong Yes' }
    }
    if (recommendation.toLowerCase().includes('yes')) {
      return { bg: 'bg-blue-100', text: 'text-blue-700', label: '👍 Yes' }
    }
    if (recommendation.toLowerCase().includes('maybe')) {
      return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '🤔 Maybe' }
    }
    if (recommendation.toLowerCase().includes('strong no')) {
      return { bg: 'bg-red-100', text: 'text-red-700', label: '❌ Strong No' }
    }
    if (recommendation.toLowerCase().includes('no')) {
      return { bg: 'bg-orange-100', text: 'text-orange-700', label: '👎 No' }
    }
    return { bg: 'bg-gray-100', text: 'text-gray-600', label: recommendation }
  }
  
  const hireStyle = getHireStyle(report.ai_hire_recommendation)

  return (
    <div className="bg-white rounded-2xl p-6 border border-blue-200 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-3xl">🤖</span> AI Analysis
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Powered by {report.ai_total_tokens?.toLocaleString() || 0} tokens in {((report.ai_processing_time_ms || 0) / 1000).toFixed(1)}s
          </p>
        </div>
        
        {/* Hire Recommendation Badge */}
        {report.ai_hire_recommendation && (
          <div className={`px-6 py-3 rounded-lg ${hireStyle.bg} border-2 border-current`}>
            <div className="text-xs font-semibold uppercase tracking-wide opacity-70">Recommendation</div>
            <div className={`text-lg font-bold ${hireStyle.text}`}>{hireStyle.label}</div>
          </div>
        )}
      </div>

      {/* AI Insights Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className={`p-3 rounded-lg border ${hasArchitecture ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{hasArchitecture ? '✅' : '⏳'}</span>
            <div>
              <div className="text-xs font-semibold text-gray-600">Architecture</div>
              <div className={`text-sm font-bold ${hasArchitecture ? 'text-green-700' : 'text-gray-500'}`}>
                {hasArchitecture ? 'Ready' : 'Processing'}
              </div>
            </div>
          </div>
        </div>

        <div className={`p-3 rounded-lg border ${hasQuality ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{hasQuality ? '✅' : '⏳'}</span>
            <div>
              <div className="text-xs font-semibold text-gray-600">Quality</div>
              <div className={`text-sm font-bold ${hasQuality ? 'text-green-700' : 'text-gray-500'}`}>
                {hasQuality ? 'Ready' : 'Processing'}
              </div>
            </div>
          </div>
        </div>

        <div className={`p-3 rounded-lg border ${hasPrinciples ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{hasPrinciples ? '✅' : '⏳'}</span>
            <div>
              <div className="text-xs font-semibold text-gray-600">Principles</div>
              <div className={`text-sm font-bold ${hasPrinciples ? 'text-green-700' : 'text-gray-500'}`}>
                {hasPrinciples ? 'Ready' : 'Processing'}
              </div>
            </div>
          </div>
        </div>

        <div className={`p-3 rounded-lg border ${hasCollaboration ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{hasCollaboration ? '✅' : '⏳'}</span>
            <div>
              <div className="text-xs font-semibold text-gray-600">Collaboration</div>
              <div className={`text-sm font-bold ${hasCollaboration ? 'text-green-700' : 'text-gray-500'}`}>
                {hasCollaboration ? 'Ready' : 'Processing'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      {totalInsights < 4 && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            🔄 <span className="font-semibold">{totalInsights}/4 AI insights generated.</span> Showing raw analysis data for pending sections.
          </p>
        </div>
      )}

      {/* Executive Summary Preview */}
      {report.ai_executive_summary && (
        <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span>📋</span> Executive Summary Available
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {report.ai_executive_summary.substring(0, 150)}...
          </p>
        </div>
      )}
    </div>
  )
}
