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
}

export interface Analysis {
  id: string
  repo_url: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  status_display: string
  started_at: string
  completed_at: string | null
  error_message: string | null
}

export interface AnalysisResponse {
  id: string
  status: string
  message: string
}

export interface Repository {
  url: string
  name: string
  owner: string
  description: string | null
  stars: number
  forks: number
  primary_language: string
}

export interface ArchitectureSignal {
  pattern: string
  confidence: number
  confidence_level: string
  evidence: string[]
  indicators: Record<string, boolean | number>
}

export interface QualityInsight {
  key_strengths: string[]
  critical_issues: string[]
  quick_wins: string[]
  complexity_analysis: {
    overall_assessment: string
    hotspots: Array<{
      area: string
      issue: string
      urgency: string
      recommendation: string
    }>
    cognitive_load_rating: string
    benchmark_comparison: string
  }
  maintainability_score: {
    score: number
    technical_debt_hours: number
    long_term_cost: string
    refactoring_priorities: Array<{
      item: string
      impact: string
      effort_days: number
      roi: string
    }>
  }
  test_coverage_analysis: {
    coverage_assessment: string
    critical_gaps: Array<{
      area: string
      risk: string
      priority: string
      suggested_tests: string[]
    }>
    test_quality: string
    strategy_evaluation: string
    improvement_priority: string[]
  }
  documentation_quality: {
    readme_effectiveness: string
    api_documentation: string
    code_comments: string
    critical_gaps: string[]
    quick_wins: string[]
  }
  performance_indicators: {
    potential_bottlenecks: string[]
    optimization_opportunities: string[]
    resource_intensive_patterns: string[]
  }
}

export interface PrinciplesInsight {
  solid_principles_analysis: {
    overall_adherence: string
    single_responsibility: {
      score: number
      violations_found: number
      impact: string
      examples: Array<{
        location: string
        issue: string
        fix: string
      }>
    }
    dry_principle: {
      score: number
      duplication_level: string
      estimated_waste: string
      critical_duplications: Array<{
        pattern: string
        locations: string[]
        refactoring_approach: string
      }>
    }
  }
  code_organization: {
    structure_quality: string
    modularity_score: number
    separation_of_concerns: string
    cohesion_level: string
    coupling_level: string
    improvements: string[]
  }
  naming_conventions: {
    consistency_score: number
    clarity_rating: string
    best_practices: string
    confusing_names: string[]
    recommendations: string[]
  }
  error_handling: {
    strategy_quality: string
    best_practices_followed: string[]
    gaps: string[]
    critical_risks: string[]
    improvement_priorities: string[]
  }
  design_patterns_evaluation: {
    patterns_used_well: string[]
    missing_opportunities: Array<{
      pattern: string
      where_needed: string
      benefit: string
      priority: string
    }>
    anti_patterns: Array<{
      pattern: string
      location: string
      severity: string
      remedy: string
    }>
  }
  architectural_health: {
    technical_debt_level: string
    scalability_concerns: string[]
    dependency_management: string
    future_proofing: string
  }
  actionable_roadmap: Array<{
    phase: string
    actions: string[]
    effort_estimate: string
    expected_impact: string
  }>
}

export interface ArchitectureInsight {
  pattern_justification: {
    primary_pattern: string
    confidence_explanation: string
    evidence_analysis: string[]
    alternative_patterns_considered: string[]
  }
  quality_assessment: {
    overall_rating: string
    layering_score: number
    key_strengths: string[]
    key_weaknesses: string[]
    dependency_management: string
    scalability_potential: string
  }
  recommendations: Array<{
    title: string
    description: string
    category: string
    priority: string
    effort: string
    impact: string
    implementation_guide: string
  }>
  tech_stack_analysis: {
    framework_fit: string
    missing_practices: string[]
    modernization_suggestions: string[]
  }
  real_world_examples: Array<{
    project: string
    url: string
    relevance: string
  }>
}

export interface CollaborationInsight {
  collaboration_score_breakdown: {
    current_score: number
    factors_raising_score: string[]
    factors_lowering_score: string[]
    realistic_improvement_target: number
  }
  team_dynamics: {
    collaboration_health: string
    contributor_diversity: string
    communication_patterns: string
    key_observations: string[]
    potential_concerns: string[]
  }
  commit_patterns_analysis: {
    commit_frequency: string
    commit_quality: string
    work_rhythm: string
    healthy_patterns: string[]
    red_flags: string[]
  }
  pr_review_culture: {
    review_engagement: string
    approval_patterns: string
    feedback_quality: string
    improvement_areas: string[]
  }
  knowledge_distribution: {
    bus_factor_risk: string
    knowledge_silos: string
    critical_areas: Array<{
      area: string
      primary_owner: string
      risk_level: string
      mitigation: string
    }>
    cross_training_needs: string[]
  }
  code_ownership: {
    ownership_model: string
    shared_responsibility: string
    orphaned_code_risk: string
    recommendations: string[]
  }
  team_bottlenecks: Array<{
    bottleneck: string
    severity: string
    impact: string
    solution: string
  }>
  hiring_insights: {
    team_readiness: string
    skill_gaps: string[]
    onboarding_challenges: string
    candidate_fit_criteria: string[]
  }
  team_health_recommendations: Array<{
    recommendation: string
    category: string
    priority: string
    implementation: string
    expected_benefit: string
  }>
}

export interface Insights {
  quality?: QualityInsight
  principles?: PrinciplesInsight
  architecture?: ArchitectureInsight
  collaboration?: CollaborationInsight
}

export interface ReportResponse {
  id: string
  analysis: Analysis
  overall_score: number
  architecture_score: number
  quality_score: number
  principles_score: number
  collaboration_score: number
  repository: Repository
  architecture: {
    signals: ArchitectureSignal[]
  }
  quality?: any  // Raw quality data fallback
  principles?: any  // Raw principles data fallback
  collaboration?: any  // Raw collaboration data fallback
  insights?: Insights  // AI-generated insights (may be partial or missing)
  ai_executive_summary?: string
  ai_developer_guide?: any
  ai_hire_recommendation?: string
  ai_total_tokens?: number
  ai_processing_time_ms?: number
}

export interface ErrorResponse {
  error?: boolean
  message?: string
  detail?: string
  repository_url?: string[]
  github_token?: string[]
}
