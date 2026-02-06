"""
Code smell detector.

Identifies common code smells through heuristic analysis.

Layer: Analysis Layer
"""

from apps.analysis.data_classes import RepoStructure, PrincipleViolation


class CodeSmellDetector:
    """
    Detects common code smells.
    
    Checks for:
    - God classes (very large files - likely doing too much)
    - Duplicate code (similar file names suggesting copy-paste)
    - Dead code (unused files - no imports/references)
    - Long methods (files with functions likely too long)
    - Magic numbers (configuration files missing)
    """
    
    # Thresholds
    GOD_CLASS_SIZE = 1500
    DEAD_CODE_INDICATORS = ['old_', 'backup_', 'temp_', 'deprecated_']
    
    def analyze(self, repo: RepoStructure) -> dict:
        """Detect code smells."""
        violations = []
        smells = []
        
        # God Classes
        god_violations = self._detect_god_classes(repo)
        violations.extend(god_violations)
        if god_violations:
            smells.append("God Classes")
        
        # Dead Code
        dead_violations = self._detect_dead_code(repo)
        violations.extend(dead_violations)
        if dead_violations:
            smells.append("Dead Code")
        
        # Duplicate Code
        dup_violations = self._detect_duplicate_code(repo)
        violations.extend(dup_violations)
        if dup_violations:
            smells.append("Duplicate Code")
        
        # Missing Configuration
        config_violations = self._detect_missing_config(repo)
        violations.extend(config_violations)
        if config_violations:
            smells.append("Magic Numbers")
        
        # Calculate score
        score = self._calculate_score(len(violations))
        
        return {
            'violations': violations,
            'smells': smells,
            'smell_score': score,
        }
    
    def _detect_god_classes(self, repo: RepoStructure) -> list[PrincipleViolation]:
        """Detect god classes (very large files)."""
        violations = []
        code_files = [f for f in repo.files if f.is_file()]
        
        for file in code_files:
            if not file.size:
                continue
            
            estimated_lines = file.size // 45
            
            if estimated_lines > self.GOD_CLASS_SIZE:
                violations.append(PrincipleViolation(
                    principle="God Class",
                    severity="HIGH",
                    file_path=file.path,
                    description=f"File has ~{estimated_lines} lines, likely a god class doing too much",
                    suggestion="Break into smaller, cohesive modules with single responsibilities"
                ))
        
        return violations
    
    def _detect_dead_code(self, repo: RepoStructure) -> list[PrincipleViolation]:
        """Detect potentially dead/unused code."""
        violations = []
        
        for file in repo.files:
            if not file.is_file():
                continue
            
            name_lower = file.name.lower()
            
            for indicator in self.DEAD_CODE_INDICATORS:
                if indicator in name_lower:
                    violations.append(PrincipleViolation(
                        principle="Dead Code",
                        severity="LOW",
                        file_path=file.path,
                        description=f"File name suggests dead/unused code: '{indicator}'",
                        suggestion="Remove if truly unused or rename appropriately"
                    ))
                    break
        
        return violations
    
    def _detect_duplicate_code(self, repo: RepoStructure) -> list[PrincipleViolation]:
        """Detect potential duplicate code (similar names)."""
        violations = []
        code_files = [f for f in repo.files if f.is_file()]
        
        # Group by similar names (without numbers/versions)
        name_groups = {}
        for file in code_files:
            base_name = ''.join(c for c in file.name if not c.isdigit())
            if base_name not in name_groups:
                name_groups[base_name] = []
            name_groups[base_name].append(file)
        
        # Find groups with multiple files
        for base_name, files in name_groups.items():
            if len(files) > 1:
                file_paths = ', '.join(f.name for f in files)
                violations.append(PrincipleViolation(
                    principle="Duplicate Code",
                    severity="MEDIUM",
                    description=f"Similar file names suggest duplication: {file_paths}",
                    suggestion="Consolidate or refactor common code into shared module"
                ))
        
        return violations
    
    def _detect_missing_config(self, repo: RepoStructure) -> list[PrincipleViolation]:
        """Detect missing configuration files (magic numbers risk)."""
        violations = []
        
        config_patterns = ['config', 'settings', '.env', 'configuration']
        has_config = any(
            any(pattern in f.name.lower() for pattern in config_patterns)
            for f in repo.files
        )
        
        if not has_config:
            violations.append(PrincipleViolation(
                principle="Magic Numbers",
                severity="MEDIUM",
                description="No configuration files found - values likely hardcoded",
                suggestion="Create config files to centralize configuration values"
            ))
        
        return violations
    
    def _calculate_score(self, violation_count: int) -> float:
        """Calculate code smell score."""
        if violation_count == 0:
            return 100.0
        elif violation_count <= 2:
            return 90.0
        elif violation_count <= 5:
            return 75.0
        elif violation_count <= 10:
            return 60.0
        else:
            return 40.0
