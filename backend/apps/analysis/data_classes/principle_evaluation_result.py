"""
Principle evaluation result data class.

Stores SOLID principle and code smell analysis results.

Layer: Analysis Layer
"""

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class PrincipleViolation:
    """
    Represents a single principle violation or code smell.
    
    Attributes:
        principle: Name of principle (e.g., "Single Responsibility", "God Class")
        severity: HIGH, MEDIUM, LOW
        file_path: File where violation detected
        description: What was detected
        suggestion: How to fix
    """
    principle: str
    severity: str  # "HIGH", "MEDIUM", "LOW"
    file_path: Optional[str] = None
    description: str = ""
    suggestion: str = ""


@dataclass
class PrincipleEvaluationResult:
    """
    Complete principle evaluation results.
    
    Contains violations, code smells, and overall principle adherence score.
    
    Attributes:
        violations: List of detected violations
        principle_score: Overall adherence score (0-100)
        solid_scores: Individual SOLID principle scores
        code_smells: List of code smell detections
        total_violations: Total number of violations
        high_severity_count: Count of high severity issues
    """
    violations: list[PrincipleViolation] = field(default_factory=list)
    principle_score: float = 0.0
    solid_scores: dict[str, float] = field(default_factory=dict)
    code_smells: list[str] = field(default_factory=list)
    total_violations: int = 0
    high_severity_count: int = 0
    
    def get_grade(self) -> str:
        """Get letter grade for principle adherence."""
        score = self.principle_score
        
        if score >= 95:
            return "A+"
        elif score >= 90:
            return "A"
        elif score >= 85:
            return "A-"
        elif score >= 80:
            return "B+"
        elif score >= 75:
            return "B"
        elif score >= 70:
            return "B-"
        elif score >= 65:
            return "C+"
        elif score >= 60:
            return "C"
        else:
            return "F"
    
    def has_critical_issues(self) -> bool:
        """Check if there are critical (high severity) issues."""
        return self.high_severity_count > 0
    
    def get_quality_level(self) -> str:
        """Get human-readable quality level."""
        score = self.principle_score
        
        if score >= 90:
            return "Excellent"
        elif score >= 80:
            return "Very Good"
        elif score >= 70:
            return "Good"
        elif score >= 60:
            return "Fair"
        else:
            return "Poor"
    
    def to_dict(self) -> dict:
        """Convert to dictionary for JSON serialization."""
        return {
            'principle_score': round(self.principle_score, 1),
            'grade': self.get_grade(),
            'quality_level': self.get_quality_level(),
            'total_violations': self.total_violations,
            'high_severity_count': self.high_severity_count,
            'solid_scores': {k: round(v, 1) for k, v in self.solid_scores.items()},
            'code_smells': self.code_smells,
            'violations': [
                {
                    'principle': v.principle,
                    'severity': v.severity,
                    'file': v.file_path,
                    'description': v.description,
                    'suggestion': v.suggestion,
                }
                for v in self.violations
            ],
        }
