"""
Unit tests for architecture detection system.

Tests all detectors and orchestrator.
"""

import pytest
from apps.analysis.data_classes import FileNode, RepoStructure
from apps.analysis.detectors import (
    MVCDetector,
    CleanArchitectureDetector,
    LayeredDetector,
    FeatureBasedDetector,
    ArchitectureAnalyzer
)


class TestMVCDetector:
    """Test MVC pattern detector."""
    
    def test_detects_mvc_pattern(self):
        """Should detect MVC with models, views, controllers."""
        # Create mock repo structure with MVC folders
        files = [
            FileNode(name="models", path="models", type="dir"),
            FileNode(name="views", path="views", type="dir"),
            FileNode(name="controllers", path="controllers", type="dir")
        ]
        
        repo = RepoStructure(
            owner="test",
            name="mvc-app",
            url="https://github.com/test/mvc-app",
            description="Test",
            primary_language="Python",
            languages={"Python": 1000},
            files=files,
            commits=[],
            contributors=[]
        )
        
        detector = MVCDetector()
        signal = detector.detect(repo)
        
        assert signal.pattern == "MVC"
        assert signal.confidence >= 90  # Should have high confidence
        assert len(signal.evidence) >= 3  # models, views, controllers
        assert signal.indicators['has_models'] is True
        assert signal.indicators['has_views'] is True
        assert signal.indicators['has_controllers'] is True
    
    def test_partial_mvc_detection(self):
        """Should detect partial MVC (only models and views)."""
        files = [
            FileNode(name="models", path="models", type="dir"),
            FileNode(name="views", path="views", type="dir")
        ]
        
        repo = RepoStructure(
            owner="test", name="mvc-app", url="https://github.com/test/mvc-app",
            description="Test", primary_language="Python", languages={"Python": 1000},
            files=files, commits=[], contributors=[]
        )
        
        detector = MVCDetector()
        signal = detector.detect(repo)
        
        assert signal.pattern == "MVC"
        assert signal.confidence == 70  # models + views only
        assert signal.indicators['has_models'] is True
        assert signal.indicators['has_views'] is True


class TestCleanArchitectureDetector:
    """Test Clean Architecture detector."""
    
    def test_detects_clean_architecture(self):
        """Should detect Clean Architecture pattern."""
        files = [
            FileNode(name="domain", path="domain", type="dir"),
            FileNode(name="application", path="application", type="dir"),
            FileNode(name="infrastructure", path="infrastructure", type="dir"),
            FileNode(name="interfaces", path="interfaces", type="dir")
        ]
        
        repo = RepoStructure(
            owner="test", name="clean-app", url="https://github.com/test/clean-app",
            description="Test", primary_language="Python", languages={"Python": 1000},
            files=files, commits=[], contributors=[]
        )
        
        detector = CleanArchitectureDetector()
        signal = detector.detect(repo)
        
        assert signal.pattern == "Clean Architecture"
        assert signal.confidence == 100
        assert signal.indicators['has_domain'] is True
        assert signal.indicators['has_application'] is True


class TestLayeredDetector:
    """Test Layered Architecture detector."""
    
    def test_detects_layered_architecture(self):
        """Should detect layered/N-tier pattern."""
        files = [
            FileNode(name="presentation", path="presentation", type="dir"),
            FileNode(name="business", path="business", type="dir"),
            FileNode(name="data", path="data", type="dir")
        ]
        
        repo = RepoStructure(
            owner="test", name="layered-app", url="https://github.com/test/layered-app",
            description="Test", primary_language="Python", languages={"Python": 1000},
            files=files, commits=[], contributors=[]
        )
        
        detector = LayeredDetector()
        signal = detector.detect(repo)
        
        assert signal.pattern == "Layered Architecture"
        assert signal.confidence == 100
        assert signal.indicators['has_presentation'] is True
        assert signal.indicators['has_business'] is True
        assert signal.indicators['has_data'] is True


class TestFeatureBasedDetector:
    """Test Feature-Based Architecture detector."""
    
    def test_detects_feature_modules(self):
        """Should detect feature-based architecture."""
        files = [
            FileNode(name="users", path="users", type="dir"),
            FileNode(name="products", path="products", type="dir"),
            FileNode(name="orders", path="orders", type="dir"),
            FileNode(name="auth", path="auth", type="dir")
        ]
        
        repo = RepoStructure(
            owner="test", name="feature-app", url="https://github.com/test/feature-app",
            description="Test", primary_language="Python", languages={"Python": 1000},
            files=files, commits=[], contributors=[]
        )
        
        detector = FeatureBasedDetector()
        signal = detector.detect(repo)
        
        assert signal.pattern == "Feature-Based Architecture"
        assert signal.confidence == 70  # 40 + 30 (no modules parent folder)
        assert signal.indicators['feature_count'] == 4
        assert 'users' in signal.indicators['features']


class TestArchitectureAnalyzer:
    """Test architecture analyzer orchestrator."""
    
    def test_determines_primary_pattern(self):
        """Should determine primary pattern from multiple detections."""
        # Create Django-like structure (MVC + Feature-based)
        files = [
            FileNode(name="models", path="models", type="dir"),
            FileNode(name="views", path="views", type="dir"),
            FileNode(name="users", path="users", type="dir"),
            FileNode(name="products", path="products", type="dir")
        ]
        
        repo = RepoStructure(
            owner="test", name="django-app", url="https://github.com/test/django-app",
            description="Test", primary_language="Python", languages={"Python": 1000},
            files=files, commits=[], contributors=[]
        )
        
        analyzer = ArchitectureAnalyzer()
        result = analyzer.analyze(repo)
        
        # Should detect both patterns
        assert len(result.detected_patterns) >= 1
        assert result.primary_pattern in ["MVC", "Feature-Based Architecture"]
        
        # Should have confidence scores
        assert "MVC" in result.confidence_scores
        assert "Feature-Based Architecture" in result.confidence_scores
        
        # Should have signals for all patterns tested
        assert len(result.signals) == 4  # All 4 detectors ran
