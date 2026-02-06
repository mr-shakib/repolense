/**
 * API Response Types
 * 
 * These types define the shape of data returned from the backend API.
 */

export interface HealthCheckResponse {
  status: string
  version: string
  message: string
}

export interface AnalysisRequest {
  repo_url: string
  user_type: 'recruiter' | 'developer'
}

export interface AnalysisResponse {
  id: string
  repo_url: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
}

export interface ReportResponse {
  id: string
  repo_url: string
  overall_score: number
  architecture_score: number
  quality_score: number
  principles_score: number
  collaboration_score: number
  ai_insights: {
    summary: string
    strengths: string[]
    risks: string[]
    recommendations: string[]
  }
  created_at: string
  completed_at: string
}

export interface ErrorResponse {
  error: boolean
  message: string
  details?: Record<string, unknown>
}
