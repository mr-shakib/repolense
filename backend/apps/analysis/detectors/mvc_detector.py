"""
MVC architecture pattern detector.

Detects Model-View-Controller architectural pattern.

Layer: Analysis Layer
"""

from apps.analysis.data_classes import RepoStructure, ArchitectureSignal
from .base_detector import BaseDetector


class MVCDetector(BaseDetector):
    """
    Detects MVC (Model-View-Controller) architecture pattern.
    
    MVC characteristics:
    - models/ directory (data layer)
    - views/ directory (presentation layer)
    - controllers/ directory (business logic layer)
    - Common in Ruby on Rails, Django, Laravel frameworks
    
    Confidence scoring:
    - models/ + views/: 70 points (core components)
    - controllers/: +25 points (classic MVC)
    - routes/: +5 points (supporting evidence)
    """
    
    def detect(self, repo: RepoStructure) -> ArchitectureSignal:
        """
        Detect MVC pattern in repository.
        
        Args:
            repo: Repository structure to analyze
            
        Returns:
            ArchitectureSignal with confidence score and evidence
        """
        confidence = 0.0
        evidence = []
        indicators = {}
        
        # Check for models directory
        has_models = self.has_folder(repo, "models")
        if has_models:
            confidence += 35
            evidence.append("Has models/ directory (data layer)")
            indicators['has_models'] = True
        
        # Check for views directory
        has_views = self.has_folder(repo, "views")
        if has_views:
            confidence += 35
            evidence.append("Has views/ directory (presentation layer)")
            indicators['has_views'] = True
        
        # Check for controllers directory
        has_controllers = self.has_folder(repo, "controllers")
        if has_controllers:
            confidence += 25
            evidence.append("Has controllers/ directory (business logic)")
            indicators['has_controllers'] = True
        
        # Supporting evidence
        has_routes = self.has_folder(repo, "routes")
        if has_routes:
            confidence += 5
            evidence.append("Has routes/ directory (URL mapping)")
            indicators['has_routes'] = True
        
        # Alternative patterns
        if self.has_folder(repo, "app") and (has_models or has_views):
            evidence.append("Has app/ directory (Rails/Laravel style)")
        
        if not evidence:
            evidence.append("No MVC structure detected")
        
        return ArchitectureSignal(
            pattern="MVC",
            confidence=min(confidence, 100.0),
            evidence=evidence,
            indicators=indicators
        )
