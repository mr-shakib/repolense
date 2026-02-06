"""
Test coverage analyzer.

Layer: Analysis Layer
"""

from apps.analysis.data_classes import RepoStructure


class TestCoverageAnalyzer:
    """Analyzes test presence and coverage."""
    
    TEST_PATTERNS = ['test_', '_test.', '.test.', '.spec.', 'Test', 'Spec']
    TEST_DIRS = ['test', 'tests', '__tests__', 'spec', 'specs']
    TEST_CONFIGS = ['pytest.ini', 'jest.config.js', 'vitest.config.js', '.rspec']
    
    def analyze(self, repo: RepoStructure) -> dict:
        """Analyze test coverage."""
        all_files = [f for f in repo.files if f.is_file()]
        
        if not all_files:
            return self._empty()
        
        test_files = self._detect_test_files(all_files)
        has_test_dirs = self._has_test_dirs(repo)
        has_config = self._has_config(all_files)
        
        total = len(all_files)
        count = len(test_files)
        ratio = count / total if total > 0 else 0.0
        
        return {
            'has_tests': count > 0,
            'test_files_count': count,
            'test_ratio': ratio,
            'has_test_directories': has_test_dirs,
            'has_test_config': has_config,
            'test_score': self._calc_score(ratio, has_test_dirs, has_config),
            'issues': self._get_issues(count, ratio),
            'strengths': self._get_strengths(count, ratio, has_test_dirs),
        }
    
    def _detect_test_files(self, files) -> list:
        """Detect test files."""
        test_files = []
        for f in files:
            name_low = f.name.lower()
            path_low = f.path.lower()
            
            is_test = any(p.lower() in name_low for p in self.TEST_PATTERNS)
            in_test_dir = any(f'/{d}/' in path_low for d in self.TEST_DIRS)
            
            if is_test or in_test_dir:
                test_files.append(f)
        return test_files
    
    def _has_test_dirs(self, repo) -> bool:
        """Check for test directories."""
        for f in repo.files:
            if f.is_directory() and f.name.lower() in self.TEST_DIRS:
                return True
        return False
    
    def _has_config(self, files) -> bool:
        """Check for test config."""
        configs_low = [c.lower() for c in self.TEST_CONFIGS]
        return any(f.name.lower() in configs_low for f in files)
    
    def _calc_score(self, ratio: float, has_dirs: bool, has_cfg: bool) -> float:
        """Calculate test score (0-100)."""
        score = min(ratio * 267, 80)  # Up to 80 pts
        if has_dirs:
            score += 10
        if has_cfg:
            score += 10
        return min(score, 100.0)
    
    def _get_issues(self, count: int, ratio: float) -> list[str]:
        """Issues."""
        issues = []
        if count == 0:
            issues.append("No tests detected (critical)")
        elif ratio < 0.10:
            issues.append(f"Very low coverage ({ratio:.1%})")
        elif ratio < 0.20:
            issues.append(f"Below recommended ({ratio:.1%})")
        return issues
    
    def _get_strengths(self, count: int, ratio: float, has_dirs: bool) -> list[str]:
        """Strengths."""
        strengths = []
        if ratio >= 0.30:
            strengths.append(f"Excellent coverage ({ratio:.1%})")
        elif ratio >= 0.20:
            strengths.append(f"Good coverage ({ratio:.1%})")
        if has_dirs:
            strengths.append("Organized test structure")
        if count > 0:
            strengths.append(f"{count} test files")
        return strengths
    
    def _empty(self) -> dict:
        """Empty result."""
        return {
            'has_tests': False, 'test_files_count': 0, 'test_ratio': 0.0,
            'has_test_directories': False, 'has_test_config': False,
            'test_score': 0.0, 'issues': ['No files'], 'strengths': [],
        }
