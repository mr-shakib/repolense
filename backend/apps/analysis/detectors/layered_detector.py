"""
Layered Architecture pattern detector.

Detects traditional N-Tier/Layered Architecture.

Layer: Analysis Layer
"""

from apps.analysis.data_classes import RepoStructure, ArchitectureSignal
from .base_detector import BaseDetector


class LayeredDetector(BaseDetector):
    """
    Detects Layered/N-Tier Architecture pattern.
    
    Layered Architecture characteristics:
    - Horizontal separation of concerns
    - presentation/ or ui/ (top layer)
    - business/ or service/ (middle layer)
    - data/ or dal/ (bottom layer)
    - Optional: api/ layer (REST endpoints)
    
    Key principle: Top-down dependencies
    - Presentation calls business
    - Business calls data
    - Each layer can only depend on layers below
    
    Common in enterprise applications, Spring/Java projects.
    
    Confidence scoring:
    - presentation/ui: 30 points
    - business/service: 35 points (core logic)
    - data/dal: 35 points (persistence)
    """
    
    def detect(self, repo: RepoStructure) -> ArchitectureSignal:
        """
        Detect Layered Architecture pattern.
        
        Args:
            repo: Repository structure to analyze
            
        Returns:
            ArchitectureSignal with confidence and evidence
        """
        confidence = 0.0
        evidence = []
        indicators = {}
        
        # Presentation layer
        has_presentation = self.has_any_folder(repo, [
            "presentation", "ui", "views", "frontend", "web"
        ])
        if has_presentation:
            confidence += 30
            evidence.append("Has presentation/ui layer")
            indicators['has_presentation'] = True
        
        # Business layer (most critical)
        has_business = self.has_any_folder(repo, [
            "business", "service", "services", "logic", "core"
        ])
        if has_business:
            confidence += 35
            evidence.append("Has business/service layer")
            indicators['has_business'] = True
        
        # Data layer
        has_data = self.has_any_folder(repo, [
            "data", "dal", "persistence", "repository", "repositories"
        ])
        if has_data:
            confidence += 35
            evidence.append("Has data/persistence layer")
            indicators['has_data'] = True
        
        if not evidence:
            evidence.append("No layered architecture detected")
        
        return ArchitectureSignal(
            pattern="Layered Architecture",
            confidence=min(confidence, 100.0),
            evidence=evidence,
            indicators=indicators
        )
