import { QualityInsight } from '@/types/api'

interface QualityInsightsProps {
  insight: QualityInsight
}

export function QualityInsights({ insight }: QualityInsightsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quality Analysis</h2>

      {/* Key Strengths */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">✨ Key Strengths</h3>
        <ul className="space-y-2">
          {insight.key_strengths.map((strength, idx) => (
            <li key={idx} className="flex items-start">
              <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
              <span className="text-gray-700 dark:text-gray-300">{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Critical Issues */}
      {insight.critical_issues.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">⚠️ Critical Issues</h3>
          <ul className="space-y-2">
            {insight.critical_issues.map((issue, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">!</span>
                <span className="text-gray-700 dark:text-gray-300">{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Wins */}
      {insight.quick_wins.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">🎯 Quick Wins</h3>
          <ul className="space-y-2">
            {insight.quick_wins.map((win, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">→</span>
                <span className="text-gray-700 dark:text-gray-300">{win}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Maintainability Score */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Maintainability Score</h3>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{insight.maintainability_score.score}/100</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Tech Debt: {insight.maintainability_score.technical_debt_hours} hours
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${
                insight.maintainability_score.score >= 70
                  ? 'bg-green-500'
                  : insight.maintainability_score.score >= 50
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${insight.maintainability_score.score}%` }}
            />
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{insight.maintainability_score.long_term_cost}</p>
        
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Refactoring Priorities</h4>
        <div className="space-y-3">
          {insight.maintainability_score.refactoring_priorities.map((priority, idx) => (
            <div key={idx} className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900 dark:text-white">{priority.item}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  priority.roi === 'HIGH' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                  priority.roi === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                }`}>
                  ROI: {priority.roi}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{priority.impact}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Effort: {priority.effort_days} days</p>
            </div>
          ))}
        </div>
      </div>

      {/* Complexity Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🔍 Complexity Analysis</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{insight.complexity_analysis.overall_assessment}</p>
        <div className="space-y-3">
          {insight.complexity_analysis.hotspots.map((hotspot, idx) => (
            <div key={idx} className={`p-4 rounded-lg ${
              hotspot.urgency === 'CRITICAL' ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500' :
              hotspot.urgency === 'HIGH' ? 'bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500' :
              'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900 dark:text-white">{hotspot.area}</span>
                <span className="text-xs px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {hotspot.urgency}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{hotspot.issue}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">💡 {hotspot.recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Test Coverage Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🧪 Test Coverage Analysis</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{insight.test_coverage_analysis.coverage_assessment}</p>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{insight.test_coverage_analysis.strategy_evaluation}</p>
        
        {insight.test_coverage_analysis.critical_gaps.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Critical Gaps</h4>
            {insight.test_coverage_analysis.critical_gaps.map((gap, idx) => (
              <div key={idx} className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{gap.area}</span>
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                      {gap.risk} RISK
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300">
                      {gap.priority}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Suggested Tests:</p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {gap.suggested_tests.map((test, testIdx) => (
                      <li key={testIdx}>• {test}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
