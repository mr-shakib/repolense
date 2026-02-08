import { PrinciplesInsight } from '@/types/api'

interface PrinciplesInsightsProps {
  insight: PrinciplesInsight
}

export function PrinciplesInsights({ insight }: PrinciplesInsightsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Engineering Principles</h2>

      {/* SOLID Principles */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🏗️ SOLID Principles</h3>
        <p className="text-gray-700 mb-6">{insight.solid_principles_analysis.overall_adherence}</p>

        {/* Single Responsibility Principle */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">Single Responsibility Principle</h4>
            <span className="text-lg font-bold text-blue-600">
              {insight.solid_principles_analysis.single_responsibility.score.toFixed(1)}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${insight.solid_principles_analysis.single_responsibility.score}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {insight.solid_principles_analysis.single_responsibility.violations_found} violations found
          </p>
          <p className="text-sm text-gray-700 mb-4">
            {insight.solid_principles_analysis.single_responsibility.impact}
          </p>
          
          {insight.solid_principles_analysis.single_responsibility.examples.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Examples:</p>
              {insight.solid_principles_analysis.single_responsibility.examples.slice(0, 3).map((example, idx) => (
                <div key={idx} className="bg-yellow-50 p-3 rounded text-sm">
                  <p className="font-mono text-xs text-gray-600 mb-1">{example.location}</p>
                  <p className="text-gray-700 mb-1">{example.issue}</p>
                  <p className="text-blue-600">💡 {example.fix}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DRY Principle */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">Don't Repeat Yourself (DRY)</h4>
            <span className="text-lg font-bold text-purple-600">
              {insight.solid_principles_analysis.dry_principle.score}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${insight.solid_principles_analysis.dry_principle.score}%` }}
            />
          </div>
          <p className="text-sm text-gray-700 mb-3">
            Duplication Level: <span className="font-semibold">{insight.solid_principles_analysis.dry_principle.duplication_level}</span>
          </p>
          <p className="text-sm text-gray-600 mb-4">
            {insight.solid_principles_analysis.dry_principle.estimated_waste}
          </p>

          {insight.solid_principles_analysis.dry_principle.critical_duplications.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Critical Duplications:</p>
              {insight.solid_principles_analysis.dry_principle.critical_duplications.slice(0, 3).map((dup, idx) => (
                <div key={idx} className="bg-purple-50 p-3 rounded text-sm">
                  <p className="font-medium text-gray-900 mb-1">{dup.pattern}</p>
                  <p className="text-xs text-gray-600 mb-2">
                    Found in {dup.locations.length} locations
                  </p>
                  <p className="text-blue-600">💡 {dup.refactoring_approach}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Code Organization */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📁 Code Organization</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Modularity Score</p>
            <p className="text-2xl font-bold text-gray-900">{insight.code_organization.modularity_score}/100</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Structure Quality</p>
            <p className="text-lg font-semibold text-gray-900">{insight.code_organization.structure_quality}</p>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Cohesion Level:</span>
            <span className="font-medium text-gray-900">{insight.code_organization.cohesion_level}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Coupling Level:</span>
            <span className="font-medium text-gray-900">{insight.code_organization.coupling_level}</span>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-3">{insight.code_organization.separation_of_concerns}</p>
        
        {insight.code_organization.improvements.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Improvements:</p>
            <ul className="space-y-1">
              {insight.code_organization.improvements.map((improvement, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Actionable Roadmap */}
      <div className="bg-white rounded-2xl p-6 border border-blue-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🗺️ Actionable Roadmap</h3>
        <div className="space-y-4">
          {insight.actionable_roadmap.map((phase, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{phase.phase}</h4>
                <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                  {phase.effort_estimate}
                </span>
              </div>
              <ul className="space-y-2 mb-3">
                {phase.actions.map((action, actionIdx) => (
                  <li key={actionIdx} className="text-sm text-gray-700 flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {action}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-600 italic">
                Expected Impact: {phase.expected_impact}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Design Patterns */}
      {insight.design_patterns_evaluation.anti_patterns.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">⚠️ Anti-Patterns Detected</h3>
          <div className="space-y-3">
            {insight.design_patterns_evaluation.anti_patterns.map((antiPattern, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border-l-4 ${
                antiPattern.severity === 'High' ? 'bg-red-50 border-red-500' :
                antiPattern.severity === 'Medium' ? 'bg-yellow-50 border-yellow-500' :
                'bg-gray-50 border-gray-500'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{antiPattern.pattern}</span>
                  <span className="text-xs px-2 py-1 rounded bg-white">
                    {antiPattern.severity} Severity
                  </span>
                </div>
                <p className="text-sm font-mono text-gray-600 mb-2">{antiPattern.location}</p>
                <p className="text-sm text-blue-600">💡 {antiPattern.remedy}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}




