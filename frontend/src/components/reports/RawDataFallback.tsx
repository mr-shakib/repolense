import React from 'react'

interface RawDataFallbackProps {
  title: string
  rawData: any
  type: 'quality' | 'principles' | 'collaboration'
}

export function RawDataFallback({ title, rawData, type }: RawDataFallbackProps) {
  if (type === 'quality' && rawData) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 dark:text-yellow-200">
            🤖 AI insights are still being generated. Showing raw analysis data below.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>

        {/* Scores */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {rawData.scores && (
            <>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <div className="text-sm text-gray-600 dark:text-gray-400">Overall</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {rawData.scores.overall?.toFixed(1) || 'N/A'}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <div className="text-sm text-gray-600 dark:text-gray-400">Complexity</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {rawData.scores.complexity?.toFixed(1) || 'N/A'}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <div className="text-sm text-gray-600 dark:text-gray-400">Tests</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {rawData.scores.tests?.toFixed(1) || 'N/A'}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <div className="text-sm text-gray-600 dark:text-gray-400">Documentation</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {rawData.scores.documentation?.toFixed(1) || 'N/A'}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Strengths */}
        {rawData.strengths && rawData.strengths.length > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">✨ Strengths</h3>
            <ul className="space-y-2">
              {rawData.strengths.map((strength: string, idx: number) => (
                <li key={idx} className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Issues */}
        {rawData.issues && rawData.issues.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">⚠️ Issues</h3>
            <ul className="space-y-2">
              {rawData.issues.map((issue: string, idx: number) => (
                <li key={idx} className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">!</span>
                  <span className="text-gray-700 dark:text-gray-300">{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* File Metrics */}
        {rawData.file_metrics && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 File Metrics</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-600 dark:text-gray-400">Total Files</dt>
                <dd className="font-semibold text-gray-900 dark:text-white">{rawData.file_metrics.total_files}</dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400">Total Lines</dt>
                <dd className="font-semibold text-gray-900 dark:text-white">{rawData.file_metrics.total_lines}</dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400">Avg File Length</dt>
                <dd className="font-semibold text-gray-900 dark:text-white">{rawData.file_metrics.avg_file_length?.toFixed(1)}</dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400">Max File Length</dt>
                <dd className="font-semibold text-gray-900 dark:text-white">{rawData.file_metrics.max_file_length}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    )
  }

  if (type === 'principles' && rawData) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 dark:text-yellow-200">
            🤖 AI insights are still being generated. Showing raw analysis data below.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>

        {/* Overall Score */}
        {rawData.principle_score !== undefined && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Overall Score</h3>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {rawData.principle_score.toFixed(1)}/100
            </div>
            {rawData.grade && (
              <div className="mt-2 text-gray-600 dark:text-gray-400">Grade: {rawData.grade}</div>
            )}
          </div>
        )}

        {/* Violations */}
        {rawData.violations && rawData.violations.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Violations ({rawData.violations.length})
            </h3>
            <div className="space-y-3">
              {rawData.violations.slice(0, 10).map((violation: any, idx: number) => (
                <div key={idx} className="border-l-4 border-red-500 pl-4 py-2">
                  <div className="font-semibold text-gray-900 dark:text-white">{violation.principle}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{violation.description}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Severity: {violation.severity} | {violation.file_path}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (type === 'collaboration' && rawData) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 dark:text-yellow-200">
            🤖 AI insights are still being generated. Showing raw analysis data below.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rawData.bus_factor !== undefined && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <div className="text-sm text-gray-600 dark:text-gray-400">Bus Factor</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{rawData.bus_factor}</div>
            </div>
          )}
          {rawData.active_contributors_count !== undefined && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Contributors</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{rawData.active_contributors_count}</div>
            </div>
          )}
          {rawData.collaboration_score !== undefined && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <div className="text-sm text-gray-600 dark:text-gray-400">Collaboration Score</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{rawData.collaboration_score.toFixed(1)}</div>
            </div>
          )}
        </div>

        {/* Contributors */}
        {rawData.contributors && rawData.contributors.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Contributors</h3>
            <div className="space-y-3">
              {rawData.contributors.slice(0, 5).map((contributor: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{contributor.username}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {contributor.commits} commits ({contributor.percentage}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="text-center py-12">
      <p className="text-gray-600 dark:text-gray-400">No data available for this section.</p>
    </div>
  )
}
