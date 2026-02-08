import { ReportResponse } from '@/types/api'

interface ScoresOverviewProps {
  report: ReportResponse
}

export function ScoresOverview({ report }: ScoresOverviewProps) {
  const scores = [
    { name: 'Overall', score: report.overall_score, color: 'indigo' },
    { name: 'Architecture', score: report.architecture_score, color: 'blue' },
    { name: 'Quality', score: report.quality_score, color: 'green' },
    { name: 'Principles', score: report.principles_score, color: 'purple' },
    { name: 'Collaboration', score: report.collaboration_score, color: 'teal' },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    if (score >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Scores</h2>
      <div className="mb-6">
        <h3 className="text-lg text-gray-600 mb-1">{report.repository?.name || 'Unknown Repository'}</h3>
        <p className="text-sm text-gray-500">by {report.repository?.owner || 'Unknown'}</p>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
          <span>⭐ {report.repository?.stars || 0}</span>
          <span>🔱 {report.repository?.forks || 0}</span>
          <span className="px-2 py-1 bg-gray-100 rounded">
            {report.repository?.primary_language || 'Unknown'}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {scores.map((item) => (
          <div key={item.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">{item.name}</span>
              <span className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                {item.score.toFixed(1)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${getBarColor(item.score)} transition-all duration-500`}
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Architecture Patterns Detected */}
      {report.architecture.signals.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Architecture Patterns</h3>
          <div className="space-y-2">
            {report.architecture.signals
              .filter((signal) => signal.confidence >= 50)
              .slice(0, 3)
              .map((signal, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{signal.pattern}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    signal.confidence_level === 'High Confidence'
                      ? 'bg-green-100 text-green-800'
                      : signal.confidence_level === 'Detected'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {signal.confidence.toFixed(0)}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
