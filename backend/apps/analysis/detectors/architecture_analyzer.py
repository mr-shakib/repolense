"""
Architecture pattern analyzer orchestrator.

Runs all detectors and aggregates results.

Layer: Analysis Layer
"""

from typing import Dict

from apps.analysis.data_classes import (
    RepoStructure,
    ArchitectureSignal,
    ArchitectureAnalysisResult
)
from .mvc_detector import MVCDetector
from .clean_architecture_detector import CleanArchitectureDetector
from .layered_detector import LayeredDetector
from .feature_based_detector import FeatureBasedDetector


class ArchitectureAnalyzer:
    """
    Orchestrates all architecture pattern detectors.
    
    Runs all detectors, aggregates results, and determines
    the primary architectural pattern.
    
    Detection strategy:
    1. Run all detectors in parallel
    2. Collect confidence scores
    3. Select primary pattern (highest confidence)
    4. Return all detected patterns above threshold
    
    Why multiple detectors?
    - Repositories often mix patterns
    - Example: Django (MVC + Feature-based via apps)
    - Confidence scores capture uncertainty
    
    Usage:
        analyzer = ArchitectureAnalyzer()
        result = analyzer.analyze(repo_structure)
        print(result.primary_pattern)  # "MVC"
        print(result.detected_patterns)  # ["MVC", "Feature-Based"]
    """
    
    # Minimum confidence to consider pattern "detected"
    DETECTION_THRESHOLD = 30.0
    
    def __init__(self):
        """Initialize all detectors."""
        self.detectors = [
            MVCDetector(),
            CleanArchitectureDetector(),
            LayeredDetector(),
            FeatureBasedDetector()
        ]
    
    def analyze(self, repo: RepoStructure) -> ArchitectureAnalysisResult:
        """
        Analyze repository architecture patterns.
        
        Args:
            repo: Repository structure to analyze
            
        Returns:
            ArchitectureAnalysisResult with primary pattern and all detections
        """
        # Run all detectors
        signals = self._run_all_detectors(repo)
        
        # Return result with all signals
        # (ArchitectureAnalysisResult computes patterns and evidence from signals)
        return ArchitectureAnalysisResult(signals=signals)
    
    def _run_all_detectors(self, repo: RepoStructure) -> list[ArchitectureSignal]:
        """
        Run all detectors and collect signals.
        
        Args:
            repo: Repository structure
            
        Returns:
            List of ArchitectureSignals from all detectors
        """
        signals = []
        for detector in self.detectors:
            signal = detector.detect(repo)
            signals.append(signal)
        return signals
    
    def _determine_primary_pattern(
        self,
        signals: list[ArchitectureSignal]
    ) -> str:
        """
        Determine primary architecture pattern.
        
        Selects pattern with highest confidence score.
        
        Args:
            signals: List of detection signals
            
        Returns:
            Primary pattern name, or "Unknown" if none detected
        """
        # Filter signals above threshold
        valid_signals = [
            s for s in signals
            if s.confidence >= self.DETECTION_THRESHOLD
        ]
        
        if not valid_signals:
            return "Unknown"
        
        # Sort by confidence (highest first)
        valid_signals.sort(key=lambda s: s.confidence, reverse=True)
        
        return valid_signals[0].pattern
    
    def _get_detected_patterns(
        self,
        signals: list[ArchitectureSignal]
    ) -> list[str]:
        """
        Get all detected patterns above threshold.
        
        Args:
            signals: List of detection signals
            
        Returns:
            List of pattern names above detection threshold
        """
        return [
            s.pattern for s in signals
            if s.confidence >= self.DETECTION_THRESHOLD
        ]
    
    def _aggregate_evidence(
        self,
        signals: list[ArchitectureSignal]
    ) -> Dict[str, list[str]]:
        """
        Aggregate evidence from all detectors.
        
        Args:
            signals: List of detection signals
            
        Returns:
            Dict mapping pattern name to evidence list
        """
        return {
            signal.pattern: signal.evidence
            for signal in signals
            if signal.confidence >= self.DETECTION_THRESHOLD
        }
