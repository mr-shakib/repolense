"""
Code quality metrics data class.

Stores metrics about code quality, complexity, tests, and documentation.

Layer: Analysis Layer
Dependencies: None (pure Python)
"""

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class QualityMetrics:
    """
    Code quality metrics for a repository.
    
    This aggregates various quality metrics:
    - File size and complexity
    - Test presence and coverage
    - Documentation quality
    - Code organization
    
    Metrics are both raw values and normalized scores (0-100).
    
    Attributes:
        total_files: Total number of code files
        total_lines: Total lines of code
        avg_file_length: Average lines per file
        median_file_length: Median lines per file
        large_files_count: Files over threshold (e.g., 500 lines)
        max_file_length: Longest file in lines
        
        has_tests: Whether repository has test files
        test_files_count: Number of test files
        test_ratio: Ratio of test files to total files (0-1)
        
        has_readme: Whether README exists
        has_docs_folder: Whether docs/ folder exists
        documented_files_count: Files with docstrings/comments
        doc_ratio: Ratio of documented files (0-1)
        
        complexity_score: Overall complexity score (0-100, higher=better)
        test_score: Test coverage score (0-100)
        documentation_score: Documentation score (0-100)
        overall_quality_score: Weighted average of all scores
        
    Example:
        >>> metrics = QualityMetrics(
        ...     total_files=100,
        ...     total_lines=5000,
        ...     avg_file_length=50.0,
        ...     has_tests=True,
        ...     test_ratio=0.3,
        ...     complexity_score=75.0
        ... )
    """
    # File size metrics
    total_files: int = 0
    total_lines: int = 0
    avg_file_length: float = 0.0
    median_file_length: float = 0.0
    large_files_count: int = 0
    max_file_length: int = 0
    
    # Test metrics
    has_tests: bool = False
    test_files_count: int = 0
    test_ratio: float = 0.0
    
    # Documentation metrics
    has_readme: bool = False
    has_docs_folder: bool = False
    documented_files_count: int = 0
    doc_ratio: float = 0.0
    
    # Normalized scores (0-100)
    complexity_score: float = 0.0
    test_score: float = 0.0
    documentation_score: float = 0.0
    overall_quality_score: float = 0.0
    
    # Additional insights
    issues: list[str] = field(default_factory=list)
    strengths: list[str] = field(default_factory=list)
    
    def get_quality_grade(self) -> str:
        """
        Get letter grade for overall quality.
        
        Returns:
            Letter grade (A+ to F)
        """
        score = self.overall_quality_score
        
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
        elif score >= 55:
            return "C-"
        elif score >= 50:
            return "D"
        else:
            return "F"
    
    def has_good_quality(self) -> bool:
        """
        Check if repository has good quality.
        
        Returns:
            True if overall score >= 70 (B- or better)
        """
        return self.overall_quality_score >= 70.0
    
    def get_quality_level(self) -> str:
        """
        Get human-readable quality level.
        
        Returns:
            Quality level description
        """
        score = self.overall_quality_score
        
        if score >= 90:
            return "Excellent"
        elif score >= 80:
            return "Very Good"
        elif score >= 70:
            return "Good"
        elif score >= 60:
            return "Fair"
        elif score >= 50:
            return "Poor"
        else:
            return "Critical"
    
    def to_dict(self) -> dict:
        """
        Convert to dictionary for JSON serialization.
        
        Returns:
            Dictionary with all metrics
        """
        return {
            'file_metrics': {
                'total_files': self.total_files,
                'total_lines': self.total_lines,
                'avg_file_length': round(self.avg_file_length, 1),
                'median_file_length': round(self.median_file_length, 1),
                'large_files_count': self.large_files_count,
                'max_file_length': self.max_file_length,
            },
            'test_metrics': {
                'has_tests': self.has_tests,
                'test_files_count': self.test_files_count,
                'test_ratio': round(self.test_ratio, 2),
            },
            'documentation_metrics': {
                'has_readme': self.has_readme,
                'has_docs_folder': self.has_docs_folder,
                'documented_files_count': self.documented_files_count,
                'doc_ratio': round(self.doc_ratio, 2),
            },
            'scores': {
                'complexity': round(self.complexity_score, 1),
                'tests': round(self.test_score, 1),
                'documentation': round(self.documentation_score, 1),
                'overall': round(self.overall_quality_score, 1),
            },
            'grade': self.get_quality_grade(),
            'quality_level': self.get_quality_level(),
            'issues': self.issues,
            'strengths': self.strengths,
        }
