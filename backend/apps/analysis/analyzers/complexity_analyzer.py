"""
File complexity analyzer.

Layer: Analysis Layer
"""

from statistics import mean, median
from apps.analysis.data_classes import RepoStructure


class ComplexityAnalyzer:
    """Analyzes code complexity based on file metrics."""
    
    REASONABLE_SIZE = 300
    LARGE_SIZE = 500
    VERY_LARGE_SIZE = 1000
    
    def analyze(self, repo: RepoStructure) -> dict:
        """Analyze file complexity metrics."""
        code_files = [f for f in repo.files if f.is_file()]
        
        if not code_files:
            return self._empty_result()
        
        file_lengths = self._get_lengths(code_files)
        total_files = len(code_files)
        large_files = sum(1 for l in file_lengths if l > self.LARGE_SIZE)
        very_large = sum(1 for l in file_lengths if l > self.VERY_LARGE_SIZE)
        avg_len = mean(file_lengths)
        
        return {
            'total_files': total_files,
            'total_lines': sum(file_lengths),
            'avg_file_length': avg_len,
            'median_file_length': median(file_lengths),
            'max_file_length': max(file_lengths),
            'large_files_count': large_files,
            'very_large_files_count': very_large,
            'complexity_score': self._calc_score(total_files, large_files, very_large, avg_len),
            'issues': self._get_issues(large_files, very_large, avg_len),
            'strengths': self._get_strengths(large_files, avg_len),
        }
    
    def _get_lengths(self, files) -> list[int]:
        """Estimate file lengths from size."""
        return [f.size // 45 if f.size else 100 for f in files]
    
    def _calc_score(self, total: int, large: int, very_large: int, avg: float) -> float:
        """Calculate complexity score (0-100)."""
        score = 100.0
        score -= min((large / total) * 100, 30)
        score -= min((very_large / total) * 150, 30)
        if avg > self.REASONABLE_SIZE:
            score -= min((avg - self.REASONABLE_SIZE) / 35, 20)
        return max(score, 0.0)
    
    def _get_issues(self, large: int, very_large: int, avg: float) -> list[str]:
        """Identify issues."""
        issues = []
        if very_large > 0:
            issues.append(f"{very_large} files >1000 lines")
        if large > 5:
            issues.append(f"{large} files >500 lines")
        if avg > self.REASONABLE_SIZE:
            issues.append(f"Avg size {avg:.0f} exceeds 300")
        return issues
    
    def _get_strengths(self, large: int, avg: float) -> list[str]:
        """Identify strengths."""
        strengths = []
        if large == 0:
            strengths.append("All files <500 lines")
        if avg < self.REASONABLE_SIZE:
            strengths.append(f"Avg size {avg:.0f} within range")
        return strengths
    
    def _empty_result(self) -> dict:
        """Empty result."""
        return {
            'total_files': 0, 'total_lines': 0, 'avg_file_length': 0.0,
            'median_file_length': 0.0, 'max_file_length': 0,
            'large_files_count': 0, 'very_large_files_count': 0,
            'complexity_score': 0.0, 'issues': ['No files'], 'strengths': [],
        }
