/**
 * API Client for backend communication.
 * 
 * This module provides a centralized way to interact with the Django backend.
 * All API requests should go through this client.
 */

import type {
  HealthCheckResponse,
  AnalysisRequest,
  AnalysisResponse,
  ReportResponse,
  ErrorResponse,
} from '@/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'APIError'
  }
}

/**
 * Makes an HTTP request to the backend API.
 */
async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      const errorData = data as ErrorResponse
      throw new APIError(
        errorData.message || 'An error occurred',
        response.status,
        errorData.details
      )
    }

    return data as T
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError('Network error', 0)
  }
}

/**
 * API client object with all endpoint methods.
 */
export const api = {
  /**
   * Check if the backend API is healthy.
   */
  healthCheck: () => request<HealthCheckResponse>('/api/health/'),

  /**
   * Submit a repository for analysis.
   */
  analyzeRepository: (data: AnalysisRequest) =>
    request<AnalysisResponse>('/api/analyze/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Get the status of an analysis.
   */
  getAnalysisStatus: (id: string) =>
    request<AnalysisResponse>(`/api/analyze/${id}/`),

  /**
   * Get a completed analysis report.
   */
  getReport: (id: string) =>
    request<ReportResponse>(`/api/analyze/${id}/report/`),
}

export { APIError }
