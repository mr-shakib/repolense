"""
Principle evaluator orchestrator.

Coordinates SOLID analysis and code smell detection to evaluate overall
principle adherence.

Layer: Analysis Layer
"""

from apps.analysis.data_classes import RepoStructure, PrincipleEvaluationResult
from apps.analysis.analyzers.solid_analyzer import SOLIDAnalyzer
from apps.analysis.analyzers.code_smell_detector import CodeSmellDetector


class PrincipleEvaluator:
    """
    Orchestrates principle evaluation.
    
    Runs SOLID analysis and code smell detection, then combines results
    into comprehensive evaluation with overall score.
    
    Scoring weights:
    - SOLID principles: 60%
    - Code smells: 40%
    """
    
    SOLID_WEIGHT = 0.60
    SMELL_WEIGHT = 0.40
    
    def __init__(self):
        self.solid_analyzer = SOLIDAnalyzer()
        self.smell_detector = CodeSmellDetector()
    
    def evaluate(self, repo: RepoStructure) -> PrincipleEvaluationResult:
        """
        Evaluate principle adherence.
        
        Args:
            repo: Repository structure to analyze
        
        Returns:
            PrincipleEvaluationResult with violations and scores
        """
        # Run SOLID analysis
        solid_results = self.solid_analyzer.analyze(repo)
        
        # Run code smell detection
        smell_results = self.smell_detector.analyze(repo)
        
        # Combine violations
        all_violations = []
        all_violations.extend(solid_results['violations'])
        all_violations.extend(smell_results['violations'])
        
        # Calculate overall score
        solid_score = solid_results['overall_score']
        smell_score = smell_results['smell_score']
        overall_score = (solid_score * self.SOLID_WEIGHT + 
                        smell_score * self.SMELL_WEIGHT)
        
        # Count severity
        high_severity = sum(1 for v in all_violations if v.severity == "HIGH")
        
        return PrincipleEvaluationResult(
            violations=all_violations,
            principle_score=overall_score,
            solid_scores=solid_results['solid_scores'],
            code_smells=smell_results['smells'],
            total_violations=len(all_violations),
            high_severity_count=high_severity,
        )
