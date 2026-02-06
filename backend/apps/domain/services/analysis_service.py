"""
Analysis service - Main orchestrator for repository analysis workflow.

Layer: Domain Layer
"""

from typing import Optional
from django.db import transaction
from django.utils import timezone

from apps.domain.models import Analysis, AnalysisStatus, Report
from apps.analysis.ingestion import GitHubIngestionService
from apps.analysis.detectors import ArchitectureDetector
from apps.analysis.analyzers import QualityAnalyzer, PrincipleEvaluator, CollaborationAnalyzer


class AnalysisService:
    """
    Orchestrates complete repository analysis.
    
    Workflow: Ingest -> Architecture -> Quality -> Principles -> Collaboration -> Save
    """
    
    def __init__(self):
        self.github_service = GitHubIngestionService()
        self.architecture_detector = ArchitectureDetector()
        self.quality_analyzer = QualityAnalyzer()
        self.principle_evaluator = PrincipleEvaluator()
        self.collaboration_analyzer = CollaborationAnalyzer()
    
    @transaction.atomic
    def analyze_repository(self, repo_url: str, github_token: Optional[str] = None) -> Analysis:
        """Analyze a GitHub repository. Returns Analysis object."""
        owner, repo_name = self._parse_repo_url(repo_url)
        
        analysis = Analysis.objects.create(
            repository_url=repo_url,
            status=AnalysisStatus.PENDING,
            started_at=timezone.now(),
        )
        
        try:
            analysis.status = AnalysisStatus.IN_PROGRESS
            analysis.save()
            
            # Ingest repository data
            repo_structure = self.github_service.ingest(
                owner=owner, repo_name=repo_name, token=github_token
            )
            
            # Run all analyzers
            arch_result = self.architecture_detector.detect(repo_structure)
            quality_result = self.quality_analyzer.analyze(repo_structure)
            principles_result = self.principle_evaluator.evaluate(repo_structure)
            collab_result = self.collaboration_analyzer.analyze(repo_structure)
            
            # Calculate overall score
            overall = self._calc_overall_score(
                quality_result.quality_score,
                principles_result.principle_score,
                collab_result.collaboration_score,
            )
            
            # Update analysis
            analysis.status = AnalysisStatus.COMPLETED
            analysis.completed_at = timezone.now()
            analysis.overall_score = overall
            analysis.save()
            
            # Create report
            Report.objects.create(
                analysis=analysis,
                repository_name=repo_structure.name,
                repository_owner=repo_structure.owner,
                primary_language=repo_structure.primary_language,
                stars=repo_structure.stars,
                forks=repo_structure.forks,
                architecture_patterns=arch_result.detected_patterns,
                quality_score=quality_result.quality_score,
                complexity_metrics=quality_result.to_dict(),
                principle_score=principles_result.principle_score,
                principle_violations=principles_result.to_dict(),
                collaboration_score=collab_result.collaboration_score,
                collaboration_metrics=collab_result.to_dict(),
                overall_score=overall,
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
