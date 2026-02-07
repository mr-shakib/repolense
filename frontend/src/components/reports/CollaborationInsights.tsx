import { CollaborationInsight } from '@/types/api'

interface CollaborationInsightsProps {
  insight: CollaborationInsight
}

export function CollaborationInsights({ insight }: CollaborationInsightsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team Collaboration</h2>

      {/* Score Breakdown */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg p-6 border border-teal-200 dark:border-teal-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Collaboration Score</h3>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-4xl font-bold text-teal-600 dark:text-teal-400">{insight.collaboration_score_breakdown.current_score}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Score</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{insight.collaboration_score_breakdown.realistic_improvement_target}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Target Score</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {insight.collaboration_score_breakdown.factors_raising_score.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Positive Factors</h4>
              <ul className="space-y-1">
                {insight.collaboration_score_breakdown.factors_raising_score.map((factor, idx) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                    <span className="text-green-500 mr-2">+</span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {insight.collaboration_score_breakdown.factors_lowering_score.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Areas for Improvement</h4>
              <ul className="space-y-1">
                {insight.collaboration_score_breakdown.factors_lowering_score.map((factor, idx) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                    <span className="text-red-500 mr-2">−</span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Team Dynamics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">👥 Team Dynamics</h3>
        
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Health</p>
            <p className="font-semibold text-gray-900 dark:text-white">{insight.team_dynamics.collaboration_health}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Diversity</p>
            <p className="font-semibold text-gray-900 dark:text-white">{insight.team_dynamics.contributor_diversity}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Communication</p>
            <p className="font-semibold text-gray-900 dark:text-white">{insight.team_dynamics.communication_patterns}</p>
          </div>
        </div>

        {insight.team_dynamics.key_observations.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Observations:</h4>
            <ul className="space-y-1">
              {insight.team_dynamics.key_observations.map((obs, idx) => (
                <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {obs}
                </li>
              ))}
            </ul>
          </div>
        )}

        {insight.team_dynamics.potential_concerns.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded p-3">
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">⚠️ Concerns:</h4>
            <ul className="space-y-1">
              {insight.team_dynamics.potential_concerns.map((concern, idx) => (
                <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">• {concern}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Knowledge Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🧠 Knowledge Distribution</h3>
        
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900 dark:text-white">Bus Factor Risk</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              insight.knowledge_distribution.bus_factor_risk === 'High'
                ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                : insight.knowledge_distribution.bus_factor_risk === 'Medium'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
            }`}>
              {insight.knowledge_distribution.bus_factor_risk}
            </span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Knowledge Silos: {insight.knowledge_distribution.knowledge_silos}
          </p>
        </div>

        {insight.knowledge_distribution.critical_areas.length > 0 && (
          <div className="space-y-3 mb-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Critical Areas:</h4>
            {insight.knowledge_distribution.critical_areas.map((area, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                area.risk_level === 'CRITICAL'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                  : area.risk_level === 'HIGH'
                  ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500'
                  : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{area.area}</span>
                  <span className="text-xs px-2 py-1 rounded bg-white dark:bg-gray-800">
                    {area.risk_level}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Owner: {area.primary_owner}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">💡 {area.mitigation}</p>
              </div>
            ))}
          </div>
        )}

        {insight.knowledge_distribution.cross_training_needs.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Cross-Training Needs:</h4>
            <div className="flex flex-wrap gap-2">
              {insight.knowledge_distribution.cross_training_needs.map((need, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                  {need}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Team Bottlenecks */}
      {insight.team_bottlenecks.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🚧 Team Bottlenecks</h3>
          <div className="space-y-3">
            {insight.team_bottlenecks.map((bottleneck, idx) => (
              <div key={idx} className={`p-4 rounded-lg ${
                bottleneck.severity === 'CRITICAL'
                  ? 'bg-red-50 dark:bg-red-900/20'
                  : bottleneck.severity === 'HIGH'
                  ? 'bg-orange-50 dark:bg-orange-900/20'
                  : 'bg-yellow-50 dark:bg-yellow-900/20'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900 dark:text-white">{bottleneck.bottleneck}</span>
                  <span className="text-xs px-2 py-1 rounded bg-white dark:bg-gray-800">
                    {bottleneck.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{bottleneck.impact}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">💡 Solution: {bottleneck.solution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hiring Insights */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💼 Hiring Insights</h3>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Team Readiness:</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{insight.hiring_insights.team_readiness}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {insight.hiring_insights.skill_gaps.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Skill Gaps:</h4>
              <div className="flex flex-wrap gap-2">
                {insight.hiring_insights.skill_gaps.map((gap, idx) => (
                  <span key={idx} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm">
                    {gap}
                  </span>
                ))}
              </div>
            </div>
          )}

          {insight.hiring_insights.candidate_fit_criteria.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Candidate Fit:</h4>
              <ul className="space-y-1">
                {insight.hiring_insights.candidate_fit_criteria.map((criteria, idx) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {criteria}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 rounded p-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Onboarding Challenge:</span> {insight.hiring_insights.onboarding_challenges}
          </p>
        </div>
      </div>

      {/* Team Health Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📋 Action Items</h3>
        <div className="space-y-3">
          {insight.team_health_recommendations.map((rec, idx) => (
            <div key={idx} className={`p-4 rounded-lg border-l-4 ${
              rec.priority === 'HIGH'
                ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500'
                : rec.priority === 'MEDIUM'
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <span className="font-semibold text-gray-900 dark:text-white">{rec.recommendation}</span>
                <span className="text-xs px-2 py-1 rounded bg-white dark:bg-gray-800 whitespace-nowrap ml-2">
                  {rec.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Category: {rec.category}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{rec.implementation}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">✨ {rec.expected_benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
