"""
Clean Architecture pattern detector.

Detects Clean Architecture (Uncle Bob) pattern.

Layer: Analysis Layer
"""

from apps.analysis.data_classes import RepoStructure, ArchitectureSignal
from .base_detector import BaseDetector


class CleanArchitectureDetector(BaseDetector):
    """
    Detects Clean Architecture pattern.
    
    Clean Architecture characteristics:
    - domain/ or entities/ (core business logic, innermost layer)
    - application/ or usecases/ (use case layer)
    - infrastructure/ (external concerns, outermost layer)
    - interfaces/ or adapters/ (dependency inversion)
    
    Django Clean Architecture recognition:
    - apps/domain/ (business logic layer)
    - apps/api/ (adapter layer for HTTP)
    - apps/*/services/ (use case layer)
    
    Key principle: Dependencies point inward
    - Infrastructure depends on domain (NOT vice versa)
    - Strict layer isolation
    
    Confidence scoring:
    - domain/entities: 40 points (core requirement)
    - application/usecases: 30 points (use case layer)
    - infrastructure: 20 points (external layer)
    - interfaces/adapters: 10 points (DIP evidence)
    """
    
    def detect(self, repo: RepoStructure) -> ArchitectureSignal:
        """
        Detect Clean Architecture pattern.
        
        Args:
            repo: Repository structure to analyze
            
        Returns:
            ArchitectureSignal with confidence and evidence
        """
        confidence = 0.0
        evidence = []
        indicators = {}
        
        # Core domain layer (innermost)
        # Recognize both traditional and Django patterns
        has_domain = (
            self.has_any_folder(repo, ["domain", "entities", "core"]) or
            self.has_path_pattern(repo, "apps/domain")  # Django Clean Architecture
        )
        if has_domain:
            confidence += 40
            evidence.append("Has domain/entities layer (core business logic)")
            indicators['has_domain'] = True
        
        # Application/Use case layer
        # Recognize Django services pattern
        has_application = (
            self.has_any_folder(repo, ["application", "usecases", "use_cases"]) or
            self.has_path_pattern(repo, "apps/domain/services")  # Django services
        )
        if has_application:
            confidence += 30
            evidence.append("Has application/usecases layer")
            indicators['has_application'] = True
        
        # Infrastructure layer (outermost)
        # Recognize Django analysis/ingestion as infrastructure
        has_infrastructure = (
            self.has_folder(repo, "infrastructure") or
            self.has_path_pattern(repo, "apps/analysis")  # Django infrastructure
        )
        if has_infrastructure:
            confidence += 20
            evidence.append("Has infrastructure layer (external concerns)")
            indicators['has_infrastructure'] = True
        
        # Dependency inversion indicators
        # Recognize Django API as adapters layer
        has_interfaces = (
            self.has_any_folder(repo, ["interfaces", "adapters", "ports"]) or
            self.has_path_pattern(repo, "apps/api")  # Django HTTP adapters
        )
        if has_interfaces:
            confidence += 10
            evidence.append("Has interfaces/adapters (dependency inversion)")
            indicators['has_interfaces'] = True
        
        if not evidence:
            evidence.append("No Clean Architecture structure detected")
        
        return ArchitectureSignal(
            pattern="Clean Architecture",
            confidence=min(confidence, 100.0),
            evidence=evidence,
            indicators=indicators
        )
