"""
Collaboration analyzer.

Analyzes team collaboration patterns, commit frequency, and bus factor.

Layer: Analysis Layer
"""

from datetime import datetime
from apps.analysis.data_classes import RepoStructure, CollaborationMetrics, ContributorStats


class CollaborationAnalyzer:
    """
    Analyzes collaboration patterns in repository.
    
    Calculates commit frequency, bus factor, and ownership patterns.
    Bus Factor = minimum contributors who own 50% of commits.
    """
    
    KEY_CONTRIBUTOR_THRESHOLD = 0.20  # >20% of commits
    ACTIVE_CONTRIBUTOR_THRESHOLD = 0.05  # >5% of commits
    
    def analyze(self, repo: RepoStructure) -> CollaborationMetrics:
        """Analyze collaboration metrics."""
        if not repo.commits:
            return CollaborationMetrics(collaboration_score=0.0, has_bus_factor_risk=True)
        
        contributor_stats = self._calc_contributor_stats(repo)
        bus_factor = self._calc_bus_factor(contributor_stats, len(repo.commits))
        commit_freq = self._calc_commit_frequency(repo)
        active_count = sum(1 for c in contributor_stats if c.percentage >= self.ACTIVE_CONTRIBUTOR_THRESHOLD * 100)
        ownership = contributor_stats[0].percentage if contributor_stats else 0.0
        
        score = self._calc_score(bus_factor, ownership, active_count, len(repo.contributors))
        
        return CollaborationMetrics(
            total_commits=len(repo.commits),
            total_contributors=len(repo.contributors),
            commit_frequency=commit_freq,
            bus_factor=bus_factor,
            top_contributors=contributor_stats[:5],
            ownership_concentration=ownership,
            collaboration_score=score,
            has_bus_factor_risk=bus_factor < 3,
            active_contributors=active_count,
        )
    
    def _calc_contributor_stats(self, repo: RepoStructure) -> list[ContributorStats]:
        """Calculate statistics for each contributor."""
        total_commits = len(repo.commits)
        if total_commits == 0:
            return []
        
        # Count commits per contributor
        contributor_commits = {}
        for commit in repo.commits:
            contributor_commits[commit.author] = contributor_commits.get(commit.author, 0) + 1
        
        # Create stats objects
        stats = []
        for contributor_info in repo.contributors:
            name = contributor_info.name
            commits = contributor_commits.get(name, 0)
            percentage = (commits / total_commits) * 100
            
            stats.append(ContributorStats(
                name=name,
                commits=commits,
                percentage=percentage,
                files_touched=0,
                is_key_contributor=percentage >= (self.KEY_CONTRIBUTOR_THRESHOLD * 100),
            ))
        
        stats.sort(key=lambda x: x.commits, reverse=True)
        return stats
    
    def _calc_bus_factor(self, stats: list[ContributorStats], total_commits: int) -> int:
        """Calculate bus factor (minimum contributors who own 50% of commits)."""
        if not stats or total_commits == 0:
            return 0
        
        cumulative_commits = 0
        threshold = total_commits * 0.5
        
        for i, contributor in enumerate(stats, start=1):
            cumulative_commits += contributor.commits
            if cumulative_commits >= threshold:
                return i
        
        return len(stats)
    
    def _calc_commit_frequency(self, repo: RepoStructure) -> float:
        """Calculate average commits per week."""
        if not repo.commits or not repo.created_at:
            return 0.0
        
        age_days = (datetime.now() - repo.created_at).days
        if age_days == 0:
            age_days = 1
        
        age_weeks = age_days / 7
        return len(repo.commits) / age_weeks
    
    def _calc_score(self, bus_factor: int, ownership: float, active_count: int, total_contributors: int) -> float:
        """
        Calculate collaboration score (0-100).
        
        Weights: Bus factor 40%, Ownership 30%, Active contributors 20%, Total 10%
        """
        # Bus factor score
        if bus_factor >= 5:
            bf_score = 100.0
        elif bus_factor >= 3:
            bf_score = 75.0
        elif bus_factor >= 2:
            bf_score = 50.0
        else:
            bf_score = 25.0
        
        # Ownership concentration score (inverse - lower is better)
        if ownership <= 30:
            own_score = 100.0
        elif ownership <= 50:
            own_score = 75.0
        elif ownership <= 70:
            own_score = 50.0
        else:
            own_score = 25.0
        
        # Active contributors score
        if active_count >= 5:
            active_score = 100.0
        elif active_count >= 3:
            active_score = 75.0
        elif active_count >= 2:
            active_score = 50.0
        else:
            active_score = 25.0
        
        # Total contributors score
        if total_contributors >= 10:
            total_score = 100.0
        elif total_contributors >= 5:
            total_score = 75.0
        elif total_contributors >= 2:
            total_score = 50.0
        else:
            total_score = 25.0
        
        return bf_score * 0.40 + own_score * 0.30 + active_score * 0.20 + total_score * 0.10
