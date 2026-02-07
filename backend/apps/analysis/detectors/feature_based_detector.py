"""
Feature-Based Architecture pattern detector.

Detects modular/feature-based organization.

Layer: Analysis Layer
"""

from apps.analysis.data_classes import RepoStructure, ArchitectureSignal
from .base_detector import BaseDetector


class FeatureBasedDetector(BaseDetector):
    """
    Detects Feature-Based/Modular Architecture.
    
    Feature-Based characteristics:
    - Vertical slicing by features/modules
    - Each feature is self-contained (own models, views, services)
    - Common feature names: users/, products/, orders/, auth/, billing/
    - modules/ or features/ parent directory
    
    Key principle: Organization by business capability, not technical layer
    - user/ module has user models, views, services
    - product/ module has product models, views, services
    - Reduces coupling between features
    
    Common in:
    - Microservices monorepos
    - Django apps structure
    - Modern modular frontends
    
    Confidence scoring:
    - Multiple feature modules: 40 points (2+ features)
    - modules/features parent: 30 points
    - Common feature names: 30 points (user/product/order/auth)
    """
    
    # Common feature/module names
    COMMON_FEATURES = [
        "user", "users", "auth", "authentication",
        "product", "products", "order", "orders",
        "payment", "payments", "billing",
        "profile", "account", "cart", "checkout"
    ]
    
    def detect(self, repo: RepoStructure) -> ArchitectureSignal:
        """
        Detect Feature-Based Architecture pattern.
        
        Args:
            repo: Repository structure to analyze
            
        Returns:
            ArchitectureSignal with confidence and evidence
        """
        confidence = 0.0
        evidence = []
        indicators = {}
        
        # Get all folder names
        folder_names = self.get_folder_names(repo)
        
        # Check for modules/ or features/ parent directory
        has_modules_parent = self.has_any_folder(repo, ["modules", "features", "apps"])
        if has_modules_parent:
            confidence += 30
            evidence.append("Has modules/features parent directory")
            indicators['has_modules_parent'] = True
        
        # Count feature modules
        feature_count = 0
        detected_features = []
        
        for folder in folder_names:
            folder_lower = folder.lower()
            if folder_lower in self.COMMON_FEATURES:
                feature_count += 1
                detected_features.append(folder)
        
        if feature_count >= 2:
            confidence += 40
            evidence.append(
                f"Has {feature_count} feature modules: {', '.join(detected_features[:3])}"
            )
            indicators['feature_count'] = feature_count
            indicators['features'] = detected_features
        
        # Check for common feature names
        if detected_features:
            confidence += 30
            evidence.append("Uses domain-driven feature names")
            indicators['has_domain_features'] = True
        
        if not evidence:
            evidence.append("No feature-based architecture detected")
        
        return ArchitectureSignal(
            pattern="Feature-Based Architecture",
            confidence=min(confidence, 100.0),
            evidence=evidence,
            indicators=indicators
        )
