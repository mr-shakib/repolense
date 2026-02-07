"""
Documentation analyzer.

Layer: Analysis Layer
"""

from apps.analysis.data_classes import RepoStructure


class DocumentationAnalyzer:
    """Analyzes documentation quality."""
    
    README_FILES = ['readme.md', 'readme.txt', 'readme.rst', 'readme']
    DOC_DIRS = ['docs', 'doc', 'documentation', 'wiki']
    DOC_EXTS = ['.md', '.rst', '.txt', '.adoc']
    IMPORTANT = ['contributing', 'license', 'changelog', 'code_of_conduct', 'security']
    
    def analyze(self, repo: RepoStructure) -> dict:
        """Analyze documentation."""
        all_files = [f for f in repo.files if f.is_file()]
        
        if not all_files:
            return self._empty()
        
        has_readme = self._has_readme(all_files)
        has_docs = self._has_docs(repo)
        doc_count = sum(1 for f in all_files if f.extension and f.extension.lower() in self.DOC_EXTS)
        important = self._check_important(all_files)
        
        code_files = [f for f in all_files if not self._is_test(f)]
        ratio = doc_count / len(code_files) if code_files else 0.0
        
        return {
            'has_readme': has_readme,
            'has_docs_folder': has_docs,
            'doc_files_count': doc_count,
            'doc_ratio': ratio,
            'has_contributing': 'contributing' in important,
            'has_license': 'license' in important,
            'has_changelog': 'changelog' in important,
            'documentation_score': self._calc_score(has_readme, has_docs, ratio, important),
            'issues': self._get_issues(has_readme, has_docs, doc_count),
            'strengths': self._get_strengths(has_readme, has_docs, important, doc_count),
        }
    
    def _has_readme(self, files) -> bool:
        """Check for README."""
        return any(f.name.lower() in self.README_FILES for f in files)
    
    def _has_docs(self, repo) -> bool:
        """Check for docs folder."""
        for f in repo.files:
            if f.is_directory() and f.name.lower() in self.DOC_DIRS:
                return True
        return False
    
    def _check_important(self, files) -> list[str]:
        """Check for important docs."""
        found = []
        for f in files:
            name_low = f.name.lower()
            for doc in self.IMPORTANT:
                if doc in name_low and doc not in found:
                    found.append(doc)
        return found
    
    def _is_test(self, file) -> bool:
        """Check if test file."""
        patterns = ['test_', '_test.', '.test.', '/test/', '/tests/']
        name_low = file.name.lower()
        path_low = file.path.lower()
        return any(p in name_low or p in path_low for p in patterns)
    
    def _calc_score(self, has_readme: bool, has_docs: bool, ratio: float, important: list) -> float:
        """Calculate doc score (0-100)."""
        score = 0.0
        if has_readme:
            score += 40
        if has_docs:
            score += 20
        score += min(ratio * 200, 20)
        score += min(len(important) * 5, 20)
        return min(score,  100.0)
    
    def _get_issues(self, has_readme: bool, has_docs: bool, count: int) -> list[str]:
        """Issues."""
        issues = []
        if not has_readme:
            issues.append("Missing README")
        if not has_docs and count < 3:
            issues.append("No docs folder and few doc files")
        if count == 0:
            issues.append("No documentation files")
        return issues
    
    def _get_strengths(self, has_readme: bool, has_docs: bool, important: list, count: int) -> list[str]:
        """Strengths."""
        strengths = []
        if has_readme:
            strengths.append("README present")
        if has_docs:
            strengths.append("Dedicated docs folder")
        if 'contributing' in important:
            strengths.append("Contributing guide")
        if count >= 5:
            strengths.append(f"{count} doc files")
        return strengths
    
    def _empty(self) -> dict:
        """Empty result."""
        return {
            'has_readme': False, 'has_docs_folder': False, 'doc_files_count': 0,
            'doc_ratio': 0.0, 'has_contributing': False, 'has_license': False,
            'has_changelog': False, 'documentation_score': 0.0,
            'issues': ['No files'], 'strengths': [],
        }
