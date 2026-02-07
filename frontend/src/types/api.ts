/**
 * API Response Types
 * 
 * These types match the Django backend response structure.
 */

export interface HealthCheckResponse {
  status: string
  version: string
  message: string
}

export interface AnalysisRequest {
  repository_url: string
  github_token?: string
}

export interface AnalysisResponse {
  id: string
  repository_url: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  overall_score: number | null
  started_at: string
  completed_at: string | null
  error_message: string | null
}

export interface ReportResponse {
  id: string
  analysis: AnalysisResponse
  architecture_data: {
    signals: Array<{
      pattern: string
      confidence: number
      evidence: string[]
      indicators: Record<string, boolean>
      confidence_level: string
    }>
    primary_pattern: string
    detected_patterns: string[]
    has_clear_architecture: boolean
  }
  quality_data: {
    file_metrics: {
      total_files: number
      total_lines: number
      avg_file_length: number
      max_file_length: number
      median_file_length: number
      large_files_count: number
    }
    test_metrics: {
      has_tests: boolean
      test_files_count: number
      test_ratio: number
    }
    documentation_metrics: {
      has_readme: boolean
      has_docs_folder: boolean
      documented_files_count: number
      doc_ratio: number
    }
    scores: {
      complexity: number
      tests: number
      documentation: number
      overall: number
    }
    grade: string
    quality_level: string
    strengths: string[]
    issues: string[]
  }
  principles_data: {
    violations: Array<{
      principle: string
      description: string
      severity: string
      file: string | null
      suggestion: string
    }>
    solid_scores: Record<string, number>
    code_smells: string[]
    total_violations: number
    high_severity_count: number
    principle_score: number
    grade: string
    quality_level: string
  }
  collaboration_data: {
    total_contributors: number
    active_contributors: number
    top_contributors: Array<{
      name: string
      commits: number
      percentage: number
      is_key: boolean
      files_touched: number
    }>
    bus_factor: number
    bus_factor_severity: string
    has_bus_factor_risk: boolean
    total_commits: number
    commit_frequency: number
    ownership_concentration: number
    collaboration_score: number
    grade: string
    level: string
  }
  created_at: string
}

export interface ErrorResponse {
  error?: boolean
  message?: string
  detail?: string
  repository_url?: string[]
  github_token?: string[]
}
