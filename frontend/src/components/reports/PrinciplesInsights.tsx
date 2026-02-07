import { PrinciplesInsight } from '@/types/api'

interface PrinciplesInsightsProps {
  insight: PrinciplesInsight
}

export function PrinciplesInsights({ insight }: PrinciplesInsightsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Engineering Principles</h2>

      {/* SOLID Principles */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🏗️ SOLID Principles</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{insight.solid_principles_analysis.overall_adherence}</p>

        {/* Single Responsibility Principle */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Single Responsibility Principle</h4>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {insight.solid_principles_analysis.single_responsibility.score.toFixed(1)}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${insight.solid_principles_analysis.single_responsibility.score}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {insight.solid_principles_analysis.single_responsibility.violations_found} violations found
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            {insight.solid_principles_analysis.single_responsibility.impact}
          </p>
          
          {insight.solid_principles_analysis.single_responsibility.examples.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Examples:</p>
              {insight.solid_principles_analysis.single_responsibility.examples.slice(0, 3).map((example, idx) => (
                <div key={idx} className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded text-sm">
                  <p className="font-mono text-xs text-gray-600 dark:text-gray-400 mb-1">{example.location}</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-1">{example.issue}</p>
                  <p className="text-blue-600 dark:text-blue-400">💡 {example.fix}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DRY Principle */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Don't Repeat Yourself (DRY)</h4>
            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {insight.solid_principles_analysis.dry_principle.score}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${insight.solid_principles_analysis.dry_principle.score}%` }}
            />
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            Duplication Level: <span className="font-semibold">{insight.solid_principles_analysis.dry_principle.duplication_level}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {insight.solid_principles_analysis.dry_principle.estimated_waste}
          </p>

          {insight.solid_principles_analysis.dry_principle.critical_duplications.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Critical Duplications:</p>
              {insight.solid_principles_analysis.dry_principle.critical_duplications.slice(0, 3).map((dup, idx) => (
                <div key={idx} className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded text-sm">
                  <p className="font-medium text-gray-900 dark:text-white mb-1">{dup.pattern}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Found in {dup.locations.length} locations
                  </p>
                  <p className="text-blue-600 dark:text-blue-400">💡 {dup.refactoring_approach}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Code Organization */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📁 Code Organization</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Modularity Score</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{insight.code_organization.modularity_score}/100</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Structure Quality</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{insight.code_organization.structure_quality}</p>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Cohesion Level:</span>
            <span className="font-medium text-gray-900 dark:text-white">{insight.code_organization.cohesion_level}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Coupling Level:</span>
            <span className="font-medium text-gray-900 dark:text-white">{insight.code_organization.coupling_level}</span>
          </div>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{insight.code_organization.separation_of_concerns}</p>
        
        {insight.code_organization.improvements.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Improvements:</p>
            <ul className="space-y-1">
              {insight.code_organization.improvements.map((improvement, idx) => (
                <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Actionable Roadmap */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🗺️ Actionable Roadmap</h3>
        <div className="space-y-4">
          {insight.actionable_roadmap.map((phase, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">{phase.phase}</h4>
                <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                  {phase.effort_estimate}
                </span>
              </div>
              <ul className="space-y-2 mb-3">
                {phase.actions.map((action, actionIdx) => (
                  <li key={actionIdx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {action}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                Expected Impact: {phase.expected_impact}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Design Patterns */}
      {insight.design_patterns_evaluation.anti_patterns.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">⚠️ Anti-Patterns Detected</h3>
          <div className="space-y-3">
            {insight.design_patterns_evaluation.anti_patterns.map((antiPattern, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                antiPattern.severity === 'High' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
                antiPattern.severity === 'Medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' :
                'bg-gray-50 dark:bg-gray-900/20 border-gray-500'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900 dark:text-white">{antiPattern.pattern}</span>
                  <span className="text-xs px-2 py-1 rounded bg-white dark:bg-gray-800">
                    {antiPattern.severity} Severity
                  </span>
                </div>
                <p className="text-sm font-mono text-gray-600 dark:text-gray-400 mb-2">{antiPattern.location}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">💡 {antiPattern.remedy}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
