"""
Architecture signal data class.

Represents the result of a single architecture pattern detection.

Layer: Analysis Layer
Dependencies: None (pure Python)
"""

from dataclasses import dataclass, field


@dataclass
class ArchitectureSignal:
    """
    Result of architecture pattern detection.
    
    This class represents the confidence score and evidence for
    a specific architectural pattern detected in a repository.
    
    Why confidence scores instead of boolean?
    - Real repos rarely follow one pattern 100%
    - Repos can exhibit multiple patterns simultaneously
    - Confidence allows ranking patterns
    - Evidence provides explainability (PROJECT_SRS.md requirement)
    
    Attributes:
        pattern: Name of the architectural pattern
        confidence: Confidence score 0-100 (0=not detected, 100=perfect match)
        evidence: List of observations supporting this detection
        indicators: Dictionary of specific indicators found
        
    Confidence score interpretation:
        0-39: Pattern not detected
        40-49: Weak pattern presence
        50-89: Strong pattern presence (detected)
        90-100: Textbook implementation
        
    Example:
        >>> signal = ArchitectureSignal(
        ...     pattern="MVC",
        ...     confidence=85,
        ...     evidence=[
        ...         "Has models/ directory",
        ...         "Has views/ directory",
        ...         "Has controllers/ directory"
        ...     ],
        ...     indicators={"has_models": True, "has_views": True}
        ... )
        >>> print(f"{signal.pattern}: {signal.confidence}%")
        'MVC: 85%'
    """
    pattern: str
    confidence: float  # 0-100
    evidence: list[str] = field(default_factory=list)
    indicators: dict[str, bool] = field(default_factory=dict)
    
    def is_detected(self) -> bool:
        """
        Check if pattern is detected with reasonable confidence.
        
        Returns:
            True if confidence >= 50 (strong evidence)
        """
        return self.confidence >= 50.0
    
    def is_weak_detection(self) -> bool:
        """
        Check if pattern shows weak/partial presence.
        
        Returns:
            True if confidence is between 40-49
        """
        return 40.0 <= self.confidence < 50.0
    
    def get_confidence_level(self) -> str:
        """
        Get human-readable confidence level.
        
        Returns:
            String describing confidence level
            
        Example:
            >>> signal.confidence = 85
            >>> signal.get_confidence_level()
            'Strong'
        """
        if self.confidence >= 90:
            return "Very Strong"
        elif self.confidence >= 50:
            return "Strong"
        elif self.confidence >= 40:
            return "Weak"
        else:
            return "Not Detected"
    
    def to_dict(self) -> dict:
        """
        Convert to dictionary for JSON serialization.
        
        Returns:
            Dictionary representation
        """
        return {
            'pattern': self.pattern,
            'confidence': self.confidence,
            'confidence_level': self.get_confidence_level(),
            'evidence': self.evidence,
            'indicators': self.indicators,
        }
