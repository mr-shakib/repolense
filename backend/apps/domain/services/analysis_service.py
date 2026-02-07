"""
Analysis service - Main orchestrator for repository analysis workflow.

Layer: Domain Layer
"""

from typing import Optional
from django.db import transaction
from django.utils import timezone

from apps.domain.models import Analysis, AnalysisStatus, Report
from apps.analysis.ingestion import RepoIngestionService
from apps.analysis.detectors import ArchitectureAnalyzer
from apps.analysis.analyzers import QualityAnalyzer, PrincipleEvaluator, CollaborationAnalyzer


class AnalysisService:
    """
    Orchestrates complete repository analysis.
    
    Workflow: Ingest -> Architecture -> Quality -> Principles -> Collaboration -> Save
    """
    
    def __init__(self):
        # Note: RepoIngestionService is created per request to support custom tokens
        self.architecture_detector = ArchitectureAnalyzer()
        self.quality_analyzer = QualityAnalyzer()
        self.principle_evaluator = PrincipleEvaluator()
        self.collaboration_analyzer = CollaborationAnalyzer()
    
    @transaction.atomic
    def analyze_repository(self, repo_url: str, github_token: Optional[str] = None) -> Analysis:
        """Analyze a GitHub repository. Returns Analysis object."""
        
        analysis = Analysis.objects.create(
            repo_url=repo_url,
            status=AnalysisStatus.PENDING,
            started_at=timezone.now(),
        )
        
        try:
            analysis.status = AnalysisStatus.IN_PROGRESS
            analysis.save()
            
            # Ingest repository data (create service with token for this request)
            github_service = RepoIngestionService(github_token=github_token)
            repo_structure = github_service.ingest_repository(repo_url)
            
            # Run all analyzers
            arch_result = self.architecture_detector.analyze(repo_structure)
            quality_result = self.quality_analyzer.analyze(repo_structure)
            principles_result = self.principle_evaluator.evaluate(repo_structure)
            collab_result = self.collaboration_analyzer.analyze(repo_structure)
            
            # Calculate overall score
            overall = self._calc_overall_score(
                quality_result.overall_quality_score,
                principles_result.principle_score,
                collab_result.collaboration_score,
            )
            
            # Update analysis
            analysis.status = AnalysisStatus.COMPLETED
            analysis.completed_at = timezone.now()
            analysis.save()
            
            # Calculate architecture score from primary pattern confidence
            primary_signal = arch_result.get_signal_by_pattern(arch_result.primary_pattern) if arch_result.primary_pattern else None
            architecture_score = primary_signal.confidence if primary_signal else 0.0
            
            # Create report with proper field mapping
            Report.objects.create(
                analysis=analysis,
                overall_score=overall,
                architecture_score=architecture_score,
                quality_score=quality_result.overall_quality_score,
                principles_score=principles_result.principle_score,
                collaboration_score=collab_result.collaboration_score,
                insights={},  # To be populated by AI service later
                raw_data={
                    'repository': {
                        'name': repo_structure.name,
                        'owner': repo_structure.owner,
                        'url': repo_structure.url,
                        'primary_language': repo_structure.primary_language,
                        'stars': repo_structure.stars,
                        'forks': repo_structure.forks,
                        'description': repo_structure.description,
                    },
                    'architecture': arch_result.to_dict(),
                    'quality': quality_result.to_dict(),
                    'principles': principles_result.to_dict(),
                    'collaboration': collab_result.to_dict(),
                }
            )
            
            return analysis
            
        except Exception as e:
            analysis.status = AnalysisStatus.FAILED
            analysis.error_message = str(e)
            analysis.completed_at = timezone.now()
            analysis.save()
            raise
    
    def get_analysis(self, analysis_id: int) -> Optional[Analysis]:
        """Get analysis by ID."""
        try:
            return Analysis.objects.get(id=analysis_id)
        except Analysis.DoesNotExist:
            return None
    
    def get_report(self, analysis_id: int) -> Optional[Report]:
        """Get report for analysis."""
        try:
            return Report.objects.get(analysis_id=analysis_id)
        except Report.DoesNotExist:
            return None
    
    def _parse_repo_url(self, repo_url: str) -> tuple[str, str]:
        """Parse GitHub URL. Returns (owner, repo_name)."""
        url = repo_url.strip().rstrip('/')
        
        # Remove protocol and domain
        if url.startswith('https://github.com/'):
            url = url[19:]
        elif url.startswith('http://github.com/'):
            url = url[18:]
        elif url.startswith('github.com/'):
            url = url[11:]
        
        # Split into owner/repo
        parts = url.split('/')
        if len(parts) < 2:
            raise ValueError(f"Invalid GitHub URL: {repo_url}")
        
        return parts[0], parts[1].rstrip('.git')
    
    def _calc_overall_score(self, quality: float, principles: float, collaboration: float) -> float:
        """Calculate weighted overall score. Weights: Quality 40%, Principles 35%, Collaboration 25%"""
        return quality * 0.40 + principles * 0.35 + collaboration * 0.25
