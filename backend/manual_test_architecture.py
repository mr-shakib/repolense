"""
Manual test script for architecture detection system.

Run this to see the architecture detection in action!

Usage:
    cd backend
    python manual_test_architecture.py
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.analysis.data_classes import FileNode, RepoStructure
from apps.analysis.detectors import ArchitectureAnalyzer


def create_mock_repo(name: str, folders: list[str]) -> RepoStructure:
    """Create a mock repository structure for testing."""
    # Create directory nodes for each folder
    folder_nodes = [
        FileNode(
            path=folder,
            name=folder,
            type="dir",
            size=None,
            extension=None
        )
        for folder in folders
    ]
    
    return RepoStructure(
        owner="test-owner",
        name=name,
        url=f"https://github.com/test-owner/{name}",
        description="Test repository",
        primary_language="Python",
        languages={"Python": 10000},
        files=folder_nodes,
        commits=[],
        contributors=[]
    )


def test_mvc_pattern():
    """Test MVC pattern detection (Rails, Laravel, Django)."""
    print("\n" + "="*70)
    print("🔍 Test 1: MVC Pattern (Ruby on Rails style)")
    print("="*70)
    
    repo = create_mock_repo(
        "Rails App",
        ["models", "views", "controllers", "routes", "config"]
    )
    
    analyzer = ArchitectureAnalyzer()
    result = analyzer.analyze(repo)
    
    print(f"\n✅ Primary Pattern: {result.primary_pattern}")
    print(f"📊 Detected Patterns: {', '.join(result.detected_patterns)}")
    print(f"\n📈 Confidence Scores:")
    for pattern, confidence in result.confidence_scores.items():
        if confidence > 0:
            print(f"   {pattern}: {confidence}%")
    
    print(f"\n🔎 Evidence for {result.primary_pattern}:")
    for evidence in result.evidence.get(result.primary_pattern, []):
        print(f"   • {evidence}")


def test_clean_architecture():
    """Test Clean Architecture detection."""
    print("\n" + "="*70)
    print("🔍 Test 2: Clean Architecture (Uncle Bob)")
    print("="*70)
    
    repo = create_mock_repo(
        "Clean Arch App",
        ["domain", "application", "infrastructure", "interfaces"]
    )
    
    analyzer = ArchitectureAnalyzer()
    result = analyzer.analyze(repo)
    
    print(f"\n✅ Primary Pattern: {result.primary_pattern}")
    print(f"📊 Detected Patterns: {', '.join(result.detected_patterns)}")
    print(f"\n📈 Confidence Scores:")
    for pattern, confidence in result.confidence_scores.items():
        if confidence > 0:
            print(f"   {pattern}: {confidence}%")
    
    print(f"\n🔎 Evidence for {result.primary_pattern}:")
    for evidence in result.evidence.get(result.primary_pattern, []):
        print(f"   • {evidence}")


def test_layered_architecture():
    """Test Layered/N-Tier detection."""
    print("\n" + "="*70)
    print("🔍 Test 3: Layered Architecture (Enterprise N-Tier)")
    print("="*70)
    
    repo = create_mock_repo(
        "Enterprise App",
        ["presentation", "business", "data", "services"]
    )
    
    analyzer = ArchitectureAnalyzer()
    result = analyzer.analyze(repo)
    
    print(f"\n✅ Primary Pattern: {result.primary_pattern}")
    print(f"📊 Detected Patterns: {', '.join(result.detected_patterns)}")
    print(f"\n📈 Confidence Scores:")
    for pattern, confidence in result.confidence_scores.items():
        if confidence > 0:
            print(f"   {pattern}: {confidence}%")
    
    print(f"\n🔎 Evidence for {result.primary_pattern}:")
    for evidence in result.evidence.get(result.primary_pattern, []):
        print(f"   • {evidence}")


def test_feature_based():
    """Test Feature-Based/Modular detection."""
    print("\n" + "="*70)
    print("🔍 Test 4: Feature-Based Architecture (Modular Monolith)")
    print("="*70)
    
    repo = create_mock_repo(
        "Modular App",
        ["users", "products", "orders", "auth", "billing", "cart"]
    )
    
    analyzer = ArchitectureAnalyzer()
    result = analyzer.analyze(repo)
    
    print(f"\n✅ Primary Pattern: {result.primary_pattern}")
    print(f"📊 Detected Patterns: {', '.join(result.detected_patterns)}")
    print(f"\n📈 Confidence Scores:")
    for pattern, confidence in result.confidence_scores.items():
        if confidence > 0:
            print(f"   {pattern}: {confidence}%")
    
    print(f"\n🔎 Evidence for {result.primary_pattern}:")
    for evidence in result.evidence.get(result.primary_pattern, []):
        print(f"   • {evidence}")


def test_mixed_patterns():
    """Test mixed architecture (common in real projects)."""
    print("\n" + "="*70)
    print("🔍 Test 5: Mixed Patterns (Django-like: MVC + Feature-based)")
    print("="*70)
    
    repo = create_mock_repo(
        "Django App",
        ["models", "views", "users", "products", "orders", "auth"]
    )
    
    analyzer = ArchitectureAnalyzer()
    result = analyzer.analyze(repo)
    
    print(f"\n✅ Primary Pattern: {result.primary_pattern}")
    print(f"📊 All Detected Patterns: {', '.join(result.detected_patterns)}")
    print(f"\n📈 Confidence Scores:")
    for pattern, confidence in sorted(
        result.confidence_scores.items(),
        key=lambda x: x[1],
        reverse=True
    ):
        if confidence > 0:
            emoji = "🏆" if pattern == result.primary_pattern else "  "
            print(f"   {emoji} {pattern}: {confidence}%")
    
    print(f"\n🔎 All Evidence:")
    for pattern, evidence_list in result.evidence.items():
        print(f"\n   {pattern}:")
        for evidence in evidence_list:
            print(f"      • {evidence}")


def test_unknown_pattern():
    """Test unknown/custom architecture."""
    print("\n" + "="*70)
    print("🔍 Test 6: Unknown Pattern (No recognizable structure)")
    print("="*70)
    
    repo = create_mock_repo(
        "Custom App",
        ["src", "lib", "utils", "config"]
    )
    
    analyzer = ArchitectureAnalyzer()
    result = analyzer.analyze(repo)
    
    print(f"\n✅ Primary Pattern: {result.primary_pattern}")
    print(f"📊 Detected Patterns: {', '.join(result.detected_patterns) or 'None'}")
    print(f"\n📈 Confidence Scores:")
    for pattern, confidence in result.confidence_scores.items():
        if confidence > 0:
            print(f"   {pattern}: {confidence}%")
        else:
            print(f"   {pattern}: {confidence}% (below threshold)")


if __name__ == "__main__":
    print("\n" + "="*70)
    print("🚀 RepoLense AI - Architecture Detection System Test")
    print("="*70)
    print("\nThis script demonstrates how the architecture detection works.")
    print("It creates mock repositories with different folder structures")
    print("and shows what patterns are detected with confidence scores.\n")
    
    try:
        test_mvc_pattern()
        test_clean_architecture()
        test_layered_architecture()
        test_feature_based()
        test_mixed_patterns()
        test_unknown_pattern()
        
        print("\n" + "="*70)
        print("✅ All tests completed successfully!")
        print("="*70)
        print("\n💡 Key Insights:")
        print("   • Confidence scores range from 0-100%")
        print("   • Multiple patterns can be detected simultaneously")
        print("   • Primary pattern = highest confidence above 30% threshold")
        print("   • Evidence lists explain WHY each pattern was detected")
        print("   • Real repos often mix multiple architectural patterns\n")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
