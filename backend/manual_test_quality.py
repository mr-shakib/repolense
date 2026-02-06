"""
Manual test script for code quality analysis.

Usage:
    cd backend
    python manual_test_quality.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.analysis.data_classes import FileNode, RepoStructure
from apps.analysis.analyzers import QualityAnalyzer


def create_test_repo(name: str, structure: dict) -> RepoStructure:
    """Create mock repository for testing."""
    files = []
    
    # Add regular files
    for path, size in structure.get('files', {}).items():
        name_only = path.split('/')[-1]
        extension = '.' + name_only.split('.')[-1] if '.' in name_only else None
        files.append(FileNode(path=path, name=name_only, type="file", size=size, extension=extension))
    
    # Add directories
    for dir_path in structure.get('dirs', []):
        files.append(FileNode(path=dir_path, name=dir_path, type="dir"))
    
    return RepoStructure(
        owner="test", name=name, url=f"https://github.com/test/{name}",
        description="Test", primary_language="Python", languages={"Python": 10000},
        files=files, commits=[], contributors=[]
    )


def test_high_quality_repo():
    """Test well-maintained repository."""
    print("\n" + "="*70)
    print("🔍 Test 1: High Quality Repository")
    print("="*70)
    
    repo = create_test_repo("awesome-project", {
        'files': {
            'src/main.py': 5000,  # ~111 lines
            'src/utils.py': 3000,
            'src/models.py': 4000,
            'tests/test_main.py': 2000,
            'tests/test_utils.py': 1500,
            'README.md': 500,
            'CONTRIBUTING.md': 300,
            'LICENSE': 200,
        },
        'dirs': ['src', 'tests', 'docs']
    })
    
    analyzer = QualityAnalyzer()
    metrics = analyzer.analyze(repo)
    
    print(f"\n📊 Overall Score: {metrics.overall_quality_score}/100")
    print(f"🎓 Grade: {metrics.get_quality_grade()}")
    print(f"⭐ Quality Level: {metrics.get_quality_level()}")
    
    print(f"\n📈 Individual Scores:")
    print(f"   Complexity: {metrics.complexity_score:.1f}/100")
    print(f"   Tests: {metrics.test_score:.1f}/100")
    print(f"   Documentation: {metrics.documentation_score:.1f}/100")
    
    print(f"\n💪 Strengths:")
    for strength in metrics.strengths[:5]:
        print(f"   • {strength}")
    
    if metrics.issues:
        print(f"\n⚠️  Issues:")
        for issue in metrics.issues[:5]:
            print(f"   • {issue}")


def test_poor_quality_repo():
    """Test poorly maintained repository."""
    print("\n" + "="*70)
    print("🔍 Test 2: Poor Quality Repository")
    print("="*70)
    
    repo = create_test_repo("legacy-mess", {
        'files': {
            'main.py': 50000,  # ~1111 lines (huge file!)
            'utils.py': 30000,
            'helpers.py': 25000,
            'config.py': 2000,
        },
        'dirs': []
    })
    
    analyzer = QualityAnalyzer()
    metrics = analyzer.analyze(repo)
    
    print(f"\n📊 Overall Score: {metrics.overall_quality_score}/100")
    print(f"🎓 Grade: {metrics.get_quality_grade()}")
    print(f"⭐ Quality Level: {metrics.get_quality_level()}")
    
    print(f"\n📈 Individual Scores:")
    print(f"   Complexity: {metrics.complexity_score:.1f}/100")
    print(f"   Tests: {metrics.test_score:.1f}/100")
    print(f"   Documentation: {metrics.documentation_score:.1f}/100")
    
    print(f"\n⚠️  Issues:")
    for issue in metrics.issues:
        print(f"   • {issue}")


def test_medium_quality_repo():
    """Test average quality repository."""
    print("\n" + "="*70)
    print("🔍 Test 3: Medium Quality Repository")
    print("="*70)
    
    repo = create_test_repo("average-app", {
        'files': {
            'app/main.py': 8000,  # ~178 lines
            'app/models.py': 12000,  # ~267 lines
            'app/views.py': 10000,
            'app/utils.py': 5000,
            'tests/test_main.py': 3000,
            'README.md': 400,
        },
        'dirs': ['app', 'tests']
    })
    
    analyzer = QualityAnalyzer()
    metrics = analyzer.analyze(repo)
    
    print(f"\n📊 Overall Score: {metrics.overall_quality_score}/100")
    print(f"🎓 Grade: {metrics.get_quality_grade()}")
    print(f"⭐ Quality Level: {metrics.get_quality_level()}")
    
    print(f"\n📈 Individual Scores:")
    print(f"   Complexity: {metrics.complexity_score:.1f}/100")
    print(f"   Tests: {metrics.test_score:.1f}/100")
    print(f"   Documentation: {metrics.documentation_score:.1f}/100")
    
    print(f"\n📊 Metrics:")
    print(f"   Total files: {metrics.total_files}")
    print(f"   Avg file length: {metrics.avg_file_length:.0f} lines")
    print(f"   Test ratio: {metrics.test_ratio:.1%}")
    print(f"   Has README: {metrics.has_readme}")
    print(f"   Has tests: {metrics.has_tests}")
    
    if metrics.strengths:
        print(f"\n💪 Strengths:")
        for strength in metrics.strengths[:3]:
            print(f"   • {strength}")
    
    if metrics.issues:
        print(f"\n⚠️  Issues:")
        for issue in metrics.issues[:3]:
            print(f"   • {issue}")


if __name__ == "__main__":
    print("\n" + "="*70)
    print("🚀 RepoLense AI - Code Quality Analysis Test")
    print("="*70)
    print("\nTesting quality analyzer with different repository scenarios.\n")
    
    try:
        test_high_quality_repo()
        test_poor_quality_repo()
        test_medium_quality_repo()
        
        print("\n" + "="*70)
        print("✅ All tests completed successfully!")
        print("="*70)
        print("\n💡 Key Insights:")
        print("   • Quality score = weighted average (Complexity 40%, Tests 35%, Docs 25%)")
        print("   • Files >500 lines significantly impact score")
        print("   • Test ratio ~20-30% is healthy")
        print("   • README is critical (40 points for docs score)")
        print("   • Issues and strengths provide actionable insights\n")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
