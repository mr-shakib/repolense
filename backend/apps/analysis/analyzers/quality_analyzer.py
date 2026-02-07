"""
Quality analyzer orchestrator.

Coordinates all quality analyzers and produces final quality metrics.

Layer: Analysis Layer
"""

from apps.analysis.data_classes import RepoStructure, QualityMetrics
from .complexity_analyzer import ComplexityAnalyzer
from .test_coverage_analyzer import TestCoverageAnalyzer
from .documentation_analyzer import DocumentationAnalyzer


class QualityAnalyzer:
    """
    Orchestrates all code quality analyzers.
    
    Runs three specialized analyzers:
    1. ComplexityAnalyzer - file sizes, complexity
    2. TestCoverageAnalyzer - test presence and coverage
    3. DocumentationAnalyzer - documentation quality
    
    Then aggregates results into single QualityMetrics object
    with overall quality score.
    
    Scoring weights:
    - Complexity: 40% (most important for maintainability)
    - Tests: 35% (critical for confidence)
    - Documentation: 25% (important for onboarding)
    
    Why these weights?
    - Complexity directly impacts development speed
    - Tests prevent regressions and enable refactoring
    - Docs help but code speaks loudest
    
    Usage:
        analyzer = QualityAnalyzer()
        metrics = analyzer.analyze(repo_structure)
        print(metrics.overall_quality_score)  # 75.0
        print(metrics.get_quality_grade())    # "B"
    """
    
    # Scoring weights (must sum to 1.0)
    COMPLEXITY_WEIGHT = 0.40
    TEST_WEIGHT = 0.35
    DOCUMENTATION_WEIGHT = 0.25
    
    def __init__(self):
        """Initialize all sub-analyzers."""
        self.complexity_analyzer = ComplexityAnalyzer()
        self.test_analyzer = TestCoverageAnalyzer()
        self.doc_analyzer = DocumentationAnalyzer()
    
    def analyze(self, repo: RepoStructure) -> QualityMetrics:
        """
        Analyze repository code quality.
        
        Args:
            repo: Repository structure to analyze
            
        Returns:
            QualityMetrics with all quality scores and metrics
        """
        # Run all analyzers
        complexity_results = self.complexity_analyzer.analyze(repo)
        test_results = self.test_analyzer.analyze(repo)
        doc_results = self.doc_analyzer.analyze(repo)
        
        # Calculate overall quality score
        overall_score = self._calculate_overall_score(
            complexity_results['complexity_score'],
            test_results['test_score'],
            doc_results['documentation_score']
        )
        
        # Aggregate issues and strengths
        all_issues = (
            complexity_results.get('issues', []) +
            test_results.get('issues', []) +
            doc_results.get('issues', [])
        )
        
        all_strengths = (
            complexity_results.get('strengths', []) +
            test_results.get('strengths', []) +
            doc_results.get('strengths', [])
        )
        
        # Build QualityMetrics object
        return QualityMetrics(
            # File metrics from complexity analyzer
            total_files=complexity_results.get('total_files', 0),
            total_lines=complexity_results.get('total_lines', 0),
            avg_file_length=complexity_results.get('avg_file_length', 0.0),
            median_file_length=complexity_results.get('median_file_length', 0.0),
            large_files_count=complexity_results.get('large_files_count', 0),
            max_file_length=complexity_results.get('max_file_length', 0),
            
            # Test metrics from test analyzer
            has_tests=test_results.get('has_tests', False),
            test_files_count=test_results.get('test_files_count', 0),
            test_ratio=test_results.get('test_ratio', 0.0),
            
            # Documentation metrics from doc analyzer
            has_readme=doc_results.get('has_readme', False),
            has_docs_folder=doc_results.get('has_docs_folder', False),
            documented_files_count=doc_results.get('doc_files_count', 0),
            doc_ratio=doc_results.get('doc_ratio', 0.0),
            
            # Scores
            complexity_score=complexity_results.get('complexity_score', 0.0),
            test_score=test_results.get('test_score', 0.0),
            documentation_score=doc_results.get('documentation_score', 0.0),
            overall_quality_score=overall_score,
            
            # Insights
            issues=all_issues,
            strengths=all_strengths,
        )
    
    def _calculate_overall_score(
        self,
        complexity_score: float,
        test_score: float,
        doc_score: float
    ) -> float:
        """
        Calculate weighted overall quality score.
        
        Args:
            complexity_score: Complexity score (0-100)
            test_score: Test score (0-100)
            doc_score: Documentation score (0-100)
            
        Returns:
            Weighted average score (0-100)
        """
        overall = (
            complexity_score * self.COMPLEXITY_WEIGHT +
            test_score * self.TEST_WEIGHT +
            doc_score * self.DOCUMENTATION_WEIGHT
        )
        
        return round(overall, 1)
