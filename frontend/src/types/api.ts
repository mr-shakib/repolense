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
    detected_patterns: Array<{
      pattern: string
      confidence: number
      evidence: string[]
    }>
    primary_pattern: string
    confidence: number
  }
  quality_data: {
    complexity_metrics: {
      total_files: number
      avg_file_length: number
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
    }
    overall_score: number
    grade: string
  }
  principles_data: {
    violations: Array<{
      principle: string
      description: string
      severity: string
      file_path: string | null
    }>
    solid_scores: Record<string, number>
    code_smell_count: number
    overall_score: number
    grade: string
  }
  collaboration_data: {
    total_contributors: number
    active_contributors: number
    key_contributors: number
    bus_factor: number
    commit_frequency: number
    ownership_concentration: number
    overall_score: number
    grade: string
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
