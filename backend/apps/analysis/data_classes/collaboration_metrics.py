"""
Collaboration metrics data class.

Stores team collaboration and contribution analysis results.

Layer: Analysis Layer
"""

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class ContributorStats:
    """
    Statistics for a single contributor.
    
    Attributes:
        name: Contributor name
        commits: Number of commits
        percentage: Percentage of total commits
        files_touched: Number of unique files modified
        is_key_contributor: True if >20% of commits (bus factor risk)
    """
    name: str
    commits: int
    percentage: float
    files_touched: int = 0
    is_key_contributor: bool = False


@dataclass
class CollaborationMetrics:
    """
    Complete collaboration analysis results.
    
    Contains commit patterns, team metrics, and bus factor analysis.
    
    Attributes:
        total_commits: Total number of commits analyzed
        total_contributors: Number of unique contributors
        commit_frequency: Commits per week (average)
        bus_factor: Number of people who own 50% of commits
        top_contributors: Top 5 contributors with stats
        ownership_concentration: % of commits by top contributor
        collaboration_score: Overall score (0-100)
        has_bus_factor_risk: True if bus_factor < 3
        active_contributors: Contributors with >5% commits
    """
    total_commits: int = 0
    total_contributors: int = 0
    commit_frequency: float = 0.0
    bus_factor: int = 0
    top_contributors: list[ContributorStats] = field(default_factory=list)
    ownership_concentration: float = 0.0
    collaboration_score: float = 0.0
    has_bus_factor_risk: bool = False
    active_contributors: int = 0
    
    def get_grade(self) -> str:
        """Get letter grade for collaboration."""
        score = self.collaboration_score
        
        if score >= 90:
            return "A"
        elif score >= 80:
            return "B"
        elif score >= 70:
            return "C"
        elif score >= 60:
            return "D"
        else:
            return "F"
    
    def get_collaboration_level(self) -> str:
        """Get human-readable collaboration level."""
        score = self.collaboration_score
        
        if score >= 85:
            return "Excellent"
        elif score >= 70:
            return "Good"
        elif score >= 55:
            return "Fair"
        else:
            return "Poor"
    
    def get_bus_factor_severity(self) -> str:
        """Get bus factor risk severity."""
        if self.bus_factor >= 5:
            return "LOW"
        elif self.bus_factor >= 3:
            return "MEDIUM"
        else:
            return "HIGH"
    
    def to_dict(self) -> dict:
        """Convert to dictionary for JSON serialization."""
        return {
            'collaboration_score': round(self.collaboration_score, 1),
            'grade': self.get_grade(),
            'level': self.get_collaboration_level(),
            'total_commits': self.total_commits,
            'total_contributors': self.total_contributors,
            'commit_frequency': round(self.commit_frequency, 1),
            'bus_factor': self.bus_factor,
            'bus_factor_severity': self.get_bus_factor_severity(),
            'has_bus_factor_risk': self.has_bus_factor_risk,
            'ownership_concentration': round(self.ownership_concentration, 1),
            'active_contributors': self.active_contributors,
            'top_contributors': [
                {
                    'name': c.name,
                    'commits': c.commits,
                    'percentage': round(c.percentage, 1),
                    'files_touched': c.files_touched,
                    'is_key': c.is_key_contributor,
                }
                for c in self.top_contributors
            ],
        }
