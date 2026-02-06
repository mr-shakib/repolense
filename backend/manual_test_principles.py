"""
Manual test for principle evaluation system.

Tests SOLID analysis and code smell detection with different repository structures.
"""

import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from apps.analysis.data_classes import FileNode, RepoStructure
from apps.analysis.analyzers import PrincipleEvaluator


def create_test_repo_high_quality():
    """Create a repository with good principle adherence."""
    files = [
        # Small, focused modules
        FileNode(name="user_service.py", path="src/user_service.py", type="file", size=4500, extension=".py"),  # ~100 lines
        FileNode(name="email_service.py", path="src/email_service.py", type="file", size=4000, extension=".py"),
        FileNode(name="auth_service.py", path="src/auth_service.py", type="file", size=5000, extension=".py"),
        
        # Clear domain layer
        FileNode(name="domain", path="domain/", type="dir"),
        FileNode(name="user.py", path="domain/user.py", type="file", size=3000, extension=".py"),
        
        # Infrastructure separate
        FileNode(name="infrastructure", path="infrastructure/", type="dir"),
        FileNode(name="db.py", path="infrastructure/db.py", type="file", size=4000, extension=".py"),
        
        # Configuration
        FileNode(name="config.py", path="config.py", type="file", size=2000, extension=".py"),
        FileNode(name="settings.py", path="settings.py", type="file", size=3000, extension=".py"),
    ]
    
    return RepoStructure(
        owner="test", name="high_quality", url="https://github.com/test/high_quality",
        description="Test", primary_language="Python", languages={"Python": 25500},
        files=files, commits=[], contributors=[]
    )


def create_test_repo_poor_quality():
    """Create a repository with many principle violations."""
    files = [
        # God classes
        FileNode(name="everything.py", path="src/everything.py", type="file", size=90000, extension=".py"),  # ~2000 lines
        FileNode(name="main.py", path="src/main.py", type="file", size=70000, extension=".py"),  # ~1500 lines
        
        # Dead code
        FileNode(name="old_auth.py", path="src/old_auth.py", type="file", size=5000, extension=".py"),
        FileNode(name="backup_user.py", path="src/backup_user.py", type="file", size=4000, extension=".py"),
        FileNode(name="temp_processing.py", path="src/temp_processing.py", type="file", size=3000, extension=".py"),
        
        # Duplicate code
        FileNode(name="user_handler.py", path="src/user_handler.py", type="file", size=5000, extension=".py"),
        FileNode(name="user_handler2.py", path="src/user_handler2.py", type="file", size=5000, extension=".py"),
        FileNode(name="user_handler3.py", path="src/user_handler3.py", type="file", size=5000, extension=".py"),
        
        # No configuration (magic numbers)
        # Infrastructure but no domain (DIP violation)
        FileNode(name="infrastructure", path="infrastructure/", type="dir"),
    ]
    
    return RepoStructure(
        owner="test", name="poor_quality", url="https://github.com/test/poor_quality",
        description="Test", primary_language="Python", languages={"Python": 192000},
        files=files, commits=[], contributors=[]
    )


def create_test_repo_medium_quality():
    """Create a repository with some violations."""
    files = [
        # Mix of sizes
        FileNode(name="handlers.py", path="src/handlers.py", type="file", size=30000, extension=".py"),  # ~600 lines (medium SRP violation)
        FileNode(name="models.py", path="src/models.py", type="file", size=25000, extension=".py"),  # ~500 lines
        FileNode(name="utils.py", path="src/utils.py", type="file", size=6000, extension=".py"),
        
        # Some duplicate code
        FileNode(name="parser.py", path="src/parser.py", type="file", size=5000, extension=".py"),
        FileNode(name="parser2.py", path="src/parser2.py", type="file", size=5000, extension=".py"),
        
        # Has configuration
        FileNode(name="config.yaml", path="config.yaml", type="file", size=1000, extension=".yaml"),
        
        # Proper layering
        FileNode(name="domain", path="domain/", type="dir"),
    ]
    
    return RepoStructure(
        owner="test", name="medium_quality", url="https://github.com/test/medium_quality",
        description="Test", primary_language="Python", languages={"Python": 77000},
        files=files, commits=[], contributors=[]
    )


def test_principle_evaluation():
    """Test principle evaluation with different repositories."""
    evaluator = PrincipleEvaluator()
    
    print("=" * 80)
    print("TEST 1: High Quality Repository (Good Principles)")
    print("=" * 80)
    
    repo_high = create_test_repo_high_quality()
    result_high = evaluator.evaluate(repo_high)
    
    print(f"Principle Score: {result_high.principle_score:.1f}/100 ({result_high.get_grade()})")
    print(f"Quality Level: {result_high.get_quality_level()}")
    print(f"Total Violations: {result_high.total_violations}")
    print(f"High Severity: {result_high.high_severity_count}")
    print(f"Code Smells: {result_high.code_smells}")
    print(f"SOLID Scores: {result_high.solid_scores}")
    print(f"\nViolations:")
    for v in result_high.violations:
        print(f"  - [{v.severity}] {v.principle}: {v.description}")
    
    print("\n" + "=" * 80)
    print("TEST 2: Poor Quality Repository (Many Violations)")
    print("=" * 80)
    
    repo_poor = create_test_repo_poor_quality()
    result_poor = evaluator.evaluate(repo_poor)
    
    print(f"Principle Score: {result_poor.principle_score:.1f}/100 ({result_poor.get_grade()})")
    print(f"Quality Level: {result_poor.get_quality_level()}")
    print(f"Total Violations: {result_poor.total_violations}")
    print(f"High Severity: {result_poor.high_severity_count}")
    print(f"Code Smells: {result_poor.code_smells}")
    print(f"SOLID Scores: {result_poor.solid_scores}")
    print(f"\nViolations:")
    for v in result_poor.violations:
        print(f"  - [{v.severity}] {v.principle}: {v.description}")
    
    print("\n" + "=" * 80)
    print("TEST 3: Medium Quality Repository (Some Violations)")
    print("=" * 80)
    
    repo_medium = create_test_repo_medium_quality()
    result_medium = evaluator.evaluate(repo_medium)
    
    print(f"Principle Score: {result_medium.principle_score:.1f}/100 ({result_medium.get_grade()})")
    print(f"Quality Level: {result_medium.get_quality_level()}")
    print(f"Total Violations: {result_medium.total_violations}")
    print(f"High Severity: {result_medium.high_severity_count}")
    print(f"Code Smells: {result_medium.code_smells}")
    print(f"SOLID Scores: {result_medium.solid_scores}")
    print(f"\nViolations:")
    for v in result_medium.violations:
        print(f"  - [{v.severity}] {v.principle}: {v.description}")
    
    print("\n" + "=" * 80)
    print("All tests completed!")
    print("=" * 80)


if __name__ == "__main__":
    test_principle_evaluation()
