"""
SOLID principles analyzer.

Detects potential SOLID principle violations through heuristics.

Layer: Analysis Layer
"""

from apps.analysis.data_classes import RepoStructure, PrincipleViolation


class SOLIDAnalyzer:
    """
    Analyzes SOLID principle adherence.
    
    Uses heuristics to detect potential violations:
    - Single Responsibility: Very large files likely do multiple things
    - Open/Closed: Hard to detect without AST (scored neutrally)
    - Liskov Substitution: Hard to detect without type analysis (scored neutrally)
    - Interface Segregation: Check for large interface files
    - Dependency Inversion: Check for proper layering (domain/ independent of infrastructure/)
    """
    
    # Thresholds
    VERY_LARGE_FILE = 1000  # Likely SRP violation
    LARGE_FILE = 500  # Possible SRP violation
    
    def analyze(self, repo: RepoStructure) -> dict:
        """Analyze SOLID principles."""
        violations = []
        
        # Single Responsibility Principle
        srp_violations = self._check_srp(repo)
        violations.extend(srp_violations)
        
        # Dependency Inversion Principle
        dip_violations = self._check_dip(repo)
        violations.extend(dip_violations)
        
        # Calculate scores
        srp_score = self._calc_srp_score(repo, len(srp_violations))
        dip_score = self._calc_dip_score(repo, len(dip_violations))
        
        # Other principles scored neutrally (need AST for accurate detection)
        ocp_score = 75.0  # Open/Closed - hard to detect
        lsp_score = 75.0  # Liskov - needs type analysis
        isp_score = 75.0  # Interface Segregation - needs interface analysis
        
        overall_score = (srp_score * 0.4 + dip_score * 0.3 + ocp_score * 0.1 + 
                        lsp_score * 0.1 + isp_score * 0.1)
        
        return {
            'violations': violations,
            'solid_scores': {
                'single_responsibility': srp_score,
                'open_closed': ocp_score,
                'liskov_substitution': lsp_score,
                'interface_segregation': isp_score,
                'dependency_inversion': dip_score,
            },
            'overall_score': overall_score,
        }
    
    def _check_srp(self, repo: RepoStructure) -> list[PrincipleViolation]:
        """Check Single Responsibility Principle."""
        violations = []
        code_files = [f for f in repo.files if f.is_file()]
        
        for file in code_files:
            if not file.size:
                continue
            
            estimated_lines = file.size // 45
            
            if estimated_lines > self.VERY_LARGE_FILE:
                violations.append(PrincipleViolation(
                    principle="Single Responsibility Principle",
                    severity="HIGH",
                    file_path=file.path,
                    description=f"File has ~{estimated_lines} lines, likely handles multiple responsibilities",
                    suggestion="Split into smaller, focused modules (aim for <300 lines)"
                ))
            elif estimated_lines > self.LARGE_FILE:
                violations.append(PrincipleViolation(
                    principle="Single Responsibility Principle",
                    severity="MEDIUM",
                    file_path=file.path,
                    description=f"File has ~{estimated_lines} lines, may violate SRP",
                    suggestion="Review if file has single, well-defined purpose"
                ))
        
        return violations
    
    def _check_dip(self, repo: RepoStructure) -> list[PrincipleViolation]:
        """Check Dependency Inversion Principle."""
        violations = []
        
        # Check for proper layer separation
        has_domain = any(f.is_directory() and 'domain' in f.name.lower() for f in repo.files)
        has_infra = any(f.is_directory() and 'infrastructure' in f.name.lower() for f in repo.files)
        
        # If has layered architecture but no clear separation, flag it
        if has_infra and not has_domain:
            violations.append(PrincipleViolation(
                principle="Dependency Inversion Principle",
                severity="MEDIUM",
                description="Has infrastructure/ but no domain/ layer - dependencies may point wrong direction",
                suggestion="Create domain/ layer independent of infrastructure details"
            ))
        
        return violations
    
    def _calc_srp_score(self, repo: RepoStructure, violation_count: int) -> float:
        """Calculate SRP score."""
        code_files = [f for f in repo.files if f.is_file()]
        if not code_files:
            return 100.0
        
        # Penalty based on violation ratio
        violation_ratio = violation_count / len(code_files)
        score = 100.0 - (violation_ratio * 200)  # Heavy penalty
        
        return max(score, 0.0)
    
    def _calc_dip_score(self, repo: RepoStructure, violation_count: int) -> float:
        """Calculate DIP score."""
        if violation_count == 0:
            return 100.0
        elif violation_count == 1:
            return 75.0
        else:
            return 50.0
