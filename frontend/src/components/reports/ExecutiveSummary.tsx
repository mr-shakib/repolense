import { ReportResponse } from '@/types/api'

interface ExecutiveSummaryProps {
  report: ReportResponse
}

export function ExecutiveSummary({ report }: ExecutiveSummaryProps) {
  if (!report.ai_executive_summary && !report.ai_developer_guide) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      {report.ai_executive_summary && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-3xl">📋</span> Executive Summary
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {report.ai_executive_summary}
            </div>
          </div>
        </div>
      )}

      {/* Developer Roadmap */}
      {report.ai_developer_guide && Object.keys(report.ai_developer_guide).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-3xl">🗺️</span> Developer Improvement Roadmap
          </h2>
          
          {/* Learning Path */}
          {report.ai_developer_guide.learning_path && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                📚 Recommended Learning Path
              </h3>
              <div className="space-y-3">
                {report.ai_developer_guide.learning_path.map((item: any, idx: number) => (
                  <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{item.skill}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.why}</p>
                        {item.resources && item.resources.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Resources:</p>
                            <ul className="text-xs space-y-1">
                              {item.resources.map((resource: string, rIdx: number) => (
                                <li key={rIdx} className="text-blue-600 dark:text-blue-400">
                                  • {resource}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {item.time_estimate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects to Build */}
          {report.ai_developer_guide.projects_to_build && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                🛠️ Practice Projects
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {report.ai_developer_guide.projects_to_build.map((project: any, idx: number) => (
                  <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{project.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{project.description}</p>
                    {project.skills_practiced && project.skills_practiced.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.skills_practiced.map((skill: string, sIdx: number) => (
                          <span key={sIdx} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Career Insights */}
          {report.ai_developer_guide.career_insights && (
            <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                💼 Career Insights
              </h3>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {report.ai_developer_guide.career_insights.current_level && (
                  <p><span className="font-semibold">Current Level:</span> {report.ai_developer_guide.career_insights.current_level}</p>
                )}
                {report.ai_developer_guide.career_insights.next_level_readiness && (
                  <p><span className="font-semibold">Next Level Readiness:</span> {report.ai_developer_guide.career_insights.next_level_readiness}</p>
                )}
                {report.ai_developer_guide.career_insights.roles_you_qualify_for && (
                  <div>
                    <p className="font-semibold mb-1">Roles You Qualify For:</p>
                    <div className="flex flex-wrap gap-2">
                      {report.ai_developer_guide.career_insights.roles_you_qualify_for.map((role: string, rIdx: number) => (
                        <span key={rIdx} className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
