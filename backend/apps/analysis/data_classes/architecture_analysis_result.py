"""
Architecture analysis result data class.

Aggregates results from all pattern detectors.

Layer: Analysis Layer
Dependencies: ArchitectureSignal
"""

from dataclasses import dataclass, field
from .architecture_signal import ArchitectureSignal


@dataclass
class ArchitectureAnalysisResult:
    """
    Complete architecture analysis result containing all detected patterns.
    
    This aggregates results from all pattern detectors and provides
    methods to identify the primary pattern and alternative patterns.
    
    Attributes:
        signals: List of all architecture signals detected
        
    Example:
        >>> result = ArchitectureAnalysisResult(signals=[
        ...     ArchitectureSignal("MVC", 85, [...]),
        ...     ArchitectureSignal("Layered", 60, [...]),
        ...     ArchitectureSignal("Clean", 30, [...])
        ... ])
        >>> result.get_primary_pattern()
        'MVC'
        >>> result.get_detected_patterns()
        ['MVC']  # Only patterns with confidence >= 70
    """
    signals: list[ArchitectureSignal] = field(default_factory=list)
    
    def get_primary_pattern(self) -> str | None:
        """
        Get the most confident architectural pattern.
        
        Returns:
            Pattern name with highest confidence, or None if nothing detected
            
        Example:
            >>> result.get_primary_pattern()
            'MVC'
        """
        if not self.signals:
            return None
        
        # Sort by confidence descending
        sorted_signals = sorted(
            self.signals,
            key=lambda s: s.confidence,
            reverse=True
        )
        
        # Return pattern with highest confidence (if detected)
        top_signal = sorted_signals[0]
        if top_signal.is_detected():
            return top_signal.pattern
        
        return None
    
    def get_detected_patterns(self) -> list[str]:
        """
        Get all patterns with strong detection (confidence >= 70).
        
        Returns:
            List of pattern names, sorted by confidence
            
        Example:
            >>> result.get_detected_patterns()
            ['MVC', 'Layered']
        """
        detected = [s for s in self.signals if s.is_detected()]
        detected.sort(key=lambda s: s.confidence, reverse=True)
        return [s.pattern for s in detected]
    
    def get_signal_by_pattern(self, pattern: str) -> ArchitectureSignal | None:
        """
        Get signal for a specific pattern.
        
        Args:
            pattern: Pattern name to retrieve
            
        Returns:
            ArchitectureSignal if found, None otherwise
        """
        for signal in self.signals:
            if signal.pattern == pattern:
                return signal
        return None
    
    def has_clear_architecture(self) -> bool:
        """
        Check if repository has a clear architectural pattern.
        
        "Clear" means at least one pattern detected with confidence >= 70.
        
        Returns:
            True if at least one pattern strongly detected
        """
        return any(s.is_detected() for s in self.signals)
    
    def to_dict(self) -> dict:
        """
        Convert to dictionary for JSON serialization.
        
        Returns:
            Dictionary with all signals and summary
        """
        return {
            'primary_pattern': self.get_primary_pattern(),
            'detected_patterns': self.get_detected_patterns(),
            'has_clear_architecture': self.has_clear_architecture(),
            'signals': [s.to_dict() for s in self.signals],
        }
