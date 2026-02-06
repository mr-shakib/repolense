"""
Manual test for collaboration analysis system.

Tests collaboration metrics calculation with different team structures.
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta

sys.path.insert(0, str(Path(__file__).parent))

from apps.analysis.data_classes import RepoStructure, CommitInfo, ContributorInfo
from apps.analysis.analyzers import CollaborationAnalyzer


def create_healthy_team_repo():
    """Create repo with healthy team collaboration."""
    # 5 active contributors, good distribution
    contributors = [
        ContributorInfo(username="alice", name="Alice", email="alice@test.com", commit_count=30),
        ContributorInfo(username="bob", name="Bob", email="bob@test.com", commit_count=25),
        ContributorInfo(username="charlie", name="Charlie", email="charlie@test.com", commit_count=20),
        ContributorInfo(username="diana", name="Diana", email="diana@test.com", commit_count=15),
        ContributorInfo(username="eve", name="Eve", email="eve@test.com", commit_count=10),
    ]
    
    # 100 commits distributed across team
    commits = []
    for contrib in contributors:
        for _ in range(contrib.commit_count):
            commits.append(CommitInfo(
                sha=f"commit{len(commits)}",
                message="Feature",
                author=contrib.name,
                author_email=contrib.email,
                date=datetime.now(),
            ))
    
    return RepoStructure(
        owner="test", name="healthy_team", url="https://github.com/test/healthy_team",
        description="Test", primary_language="Python", languages={"Python": 100000},
        files=[], commits=commits, contributors=contributors,
        created_at=datetime.now() - timedelta(days=365),
    )


def create_bus_factor_risk_repo():
    """Create repo with high bus factor risk (knowledge concentrated)."""
    # 1 dominant contributor with 80% of commits
    contributors = [
        ContributorInfo(username="superdev", name="SuperDev", email="super@test.com", commit_count=80),
        ContributorInfo(username="helper1", name="Helper1", email="h1@test.com", commit_count=12),
        ContributorInfo(username="helper2", name="Helper2", email="h2@test.com", commit_count=8),
    ]
    
    commits = []
    for contrib in contributors:
        for _ in range(contrib.commit_count):
            commits.append(CommitInfo(
                sha=f"commit{len(commits)}",
                message="Feature",
                author=contrib.name,
                author_email=contrib.email,
                date=datetime.now(),
            ))
    
    return RepoStructure(
        owner="test", name="bus_factor_risk", url="https://github.com/test/bus_factor_risk",
        description="Test", primary_language="Python", languages={"Python": 100000},
        files=[], commits=commits, contributors=contributors,
        created_at=datetime.now() - timedelta(days=180),
    )


def create_large_team_repo():
    """Create repo with large, well-distributed team."""
    # 10 contributors with good distribution
    contributors = [
        ContributorInfo(username=f"dev{i}", name=f"Dev{i}", email=f"dev{i}@test.com", commit_count=15 - i)
        for i in range(10)
    ]
    
    commits = []
    for contrib in contributors:
        for _ in range(contrib.commit_count):
            commits.append(CommitInfo(
                sha=f"commit{len(commits)}",
                message="Feature",
                author=contrib.name,
                author_email=contrib.email,
                date=datetime.now(),
            ))
    
    return RepoStructure(
        owner="test", name="large_team", url="https://github.com/test/large_team",
        description="Test", primary_language="Python", languages={"Python": 100000},
        files=[], commits=commits, contributors=contributors,
        created_at=datetime.now() - timedelta(days=365),
    )


def test_collaboration_analysis():
    """Test collaboration analysis with different team structures."""
    analyzer = CollaborationAnalyzer()
    
    print("=" * 80)
    print("TEST 1: Healthy Team (Good Collaboration)")
    print("=" * 80)
    
    repo_healthy = create_healthy_team_repo()
    result_healthy = analyzer.analyze(repo_healthy)
    
    print(f"Collaboration Score: {result_healthy.collaboration_score:.1f}/100 ({result_healthy.get_grade()})")
    print(f"Level: {result_healthy.get_collaboration_level()}")
    print(f"Total Commits: {result_healthy.total_commits}")
    print(f"Total Contributors: {result_healthy.total_contributors}")
    print(f"Bus Factor: {result_healthy.bus_factor} ({result_healthy.get_bus_factor_severity()} risk)")
    print(f"Has Bus Factor Risk: {result_healthy.has_bus_factor_risk}")
    print(f"Active Contributors: {result_healthy.active_contributors}")
    print(f"Ownership Concentration: {result_healthy.ownership_concentration:.1f}%")
    print(f"Commit Frequency: {result_healthy.commit_frequency:.1f} commits/week")
    print(f"\nTop Contributors:")
    for c in result_healthy.top_contributors:
        print(f"  - {c.name}: {c.commits} commits ({c.percentage:.1f}%) {'[KEY]' if c.is_key_contributor else ''}")
    
    print("\n" + "=" * 80)
    print("TEST 2: Bus Factor Risk (Knowledge Concentrated)")
    print("=" * 80)
    
    repo_risk = create_bus_factor_risk_repo()
    result_risk = analyzer.analyze(repo_risk)
    
    print(f"Collaboration Score: {result_risk.collaboration_score:.1f}/100 ({result_risk.get_grade()})")
    print(f"Level: {result_risk.get_collaboration_level()}")
    print(f"Total Commits: {result_risk.total_commits}")
    print(f"Total Contributors: {result_risk.total_contributors}")
    print(f"Bus Factor: {result_risk.bus_factor} ({result_risk.get_bus_factor_severity()} risk)")
    print(f"Has Bus Factor Risk: {result_risk.has_bus_factor_risk}")
    print(f"Active Contributors: {result_risk.active_contributors}")
    print(f"Ownership Concentration: {result_risk.ownership_concentration:.1f}%")
    print(f"Commit Frequency: {result_risk.commit_frequency:.1f} commits/week")
    print(f"\nTop Contributors:")
    for c in result_risk.top_contributors:
        print(f"  - {c.name}: {c.commits} commits ({c.percentage:.1f}%) {'[KEY]' if c.is_key_contributor else ''}")
    
    print("\n" + "=" * 80)
    print("TEST 3: Large Team (Excellent Distribution)")
    print("=" * 80)
    
    repo_large = create_large_team_repo()
    result_large = analyzer.analyze(repo_large)
    
    print(f"Collaboration Score: {result_large.collaboration_score:.1f}/100 ({result_large.get_grade()})")
    print(f"Level: {result_large.get_collaboration_level()}")
    print(f"Total Commits: {result_large.total_commits}")
    print(f"Total Contributors: {result_large.total_contributors}")
    print(f"Bus Factor: {result_large.bus_factor} ({result_large.get_bus_factor_severity()} risk)")
    print(f"Has Bus Factor Risk: {result_large.has_bus_factor_risk}")
    print(f"Active Contributors: {result_large.active_contributors}")
    print(f"Ownership Concentration: {result_large.ownership_concentration:.1f}%")
    print(f"Commit Frequency: {result_large.commit_frequency:.1f} commits/week")
    print(f"\nTop Contributors:")
    for c in result_large.top_contributors:
        print(f"  - {c.name}: {c.commits} commits ({c.percentage:.1f}%) {'[KEY]' if c.is_key_contributor else ''}")
    
    print("\n" + "=" * 80)
    print("All tests completed!")
    print("=" * 80)


if __name__ == "__main__":
    test_collaboration_analysis()
