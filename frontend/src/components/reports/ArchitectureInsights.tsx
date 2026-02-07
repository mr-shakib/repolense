import { ArchitectureInsight } from '@/types/api'

interface ArchitectureInsightsProps {
  insight: ArchitectureInsight
}

export function ArchitectureInsights({ insight }: ArchitectureInsightsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Architecture Review</h2>

      {/* Pattern Justification */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🏛️ Primary Pattern</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
            {insight.pattern_justification.primary_pattern}
          </p>
          <p className="text-gray-700 dark:text-gray-300">{insight.pattern_justification.confidence_explanation}</p>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Evidence:</p>
            <ul className="space-y-1">
              {insight.pattern_justification.evidence_analysis.map((evidence, idx) => (
                <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  {evidence}
                </li>
              ))}
            </ul>
          </div>

          {insight.pattern_justification.alternative_patterns_considered.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Alternatives Considered:</p>
              <div className="flex flex-wrap gap-2">
                {insight.pattern_justification.alternative_patterns_considered.map((pattern, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300">
                    {pattern}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quality Assessment */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Quality Assessment</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Overall Rating</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{insight.quality_assessment.overall_rating}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Layering Score</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{insight.quality_assessment.layering_score}/100</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Strengths</h4>
            <ul className="space-y-1">
              {insight.quality_assessment.key_strengths.map((strength, idx) => (
                <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                  <span className="text-green-500 mr-2">+</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          {insight.quality_assessment.key_weaknesses.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Areas for Improvement</h4>
              <ul className="space-y-1">
                {insight.quality_assessment.key_weaknesses.map((weakness, idx) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                    <span className="text-yellow-500 mr-2">−</span>
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Dependency Management:</span>
            <span className="font-medium text-gray-900 dark:text-white">{insight.quality_assessment.dependency_management}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Scalability Potential:</span>
            <span className="font-medium text-gray-900 dark:text-white">{insight.quality_assessment.scalability_potential}</span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💡 Recommendations</h3>
        <div className="space-y-4">
          {insight.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-l-4 ${
                rec.priority === 'CRITICAL'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                  : rec.priority === 'HIGH'
                  ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500'
                  : rec.priority === 'MEDIUM'
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white flex-1">{rec.title}</h4>
                <div className="flex gap-2 ml-4">
                  <span className="text-xs px-2 py-1 rounded bg-white dark:bg-gray-800 whitespace-nowrap">
                    {rec.priority}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-white dark:bg-gray-800 whitespace-nowrap">
                    {rec.effort} effort
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-white dark:bg-gray-800 whitespace-nowrap">
                    {rec.impact} impact
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{rec.description}</p>
              <div className="bg-white dark:bg-gray-800 rounded p-3 mt-3">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Implementation Guide:</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{rec.implementation_guide}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🔧 Tech Stack Analysis</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{insight.tech_stack_analysis.framework_fit}</p>

        {insight.tech_stack_analysis.missing_practices.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Missing Practices:</h4>
            <div className="flex flex-wrap gap-2">
              {insight.tech_stack_analysis.missing_practices.map((practice, idx) => (
                <span key={idx} className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm">
                  {practice}
                </span>
              ))}
            </div>
          </div>
        )}

        {insight.tech_stack_analysis.modernization_suggestions.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Modernization Suggestions:</h4>
            <ul className="space-y-2">
              {insight.tech_stack_analysis.modernization_suggestions.map((suggestion, idx) => (
                <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Real World Examples */}
      {insight.real_world_examples.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🌟 Real World Examples</h3>
          <div className="space-y-3">
            {insight.real_world_examples.map((example, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{example.project}</h4>
                  <a
                    href={example.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    View →
                  </a>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{example.relevance}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
