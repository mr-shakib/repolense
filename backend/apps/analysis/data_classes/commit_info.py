"""
Commit and contributor data classes.

Represents git commit history and contributor information.

Layer: Analysis Layer
Dependencies: None (pure Python)
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class CommitInfo:
    """
    Represents a single git commit.
    
    Used for collaboration analysis (commit frequency, ownership patterns).
    We extract metadata only, not diff content.
    
    Attributes:
        sha: Unique commit hash
        message: Commit message (first line only for brevity)
        author: Commit author name
        author_email: Commit author email
        date: When commit was made
        files_changed: Number of files modified (if available)
        
    Example:
        >>> commit = CommitInfo(
        ...     sha="abc123",
        ...     message="Add user authentication",
        ...     author="Jane Doe",
        ...     author_email="jane@example.com",
        ...     date=datetime.now(),
        ...     files_changed=5
        ... )
    """
    sha: str
    message: str
    author: str
    author_email: str
    date: datetime
    files_changed: Optional[int] = None
    
    def get_short_sha(self) -> str:
        """Get abbreviated commit hash (first 7 chars)."""
        return self.sha[:7] if len(self.sha) >= 7 else self.sha


@dataclass
class ContributorInfo:
    """
    Represents a repository contributor.
    
    Used for collaboration analysis (bus factor, ownership distribution).
    
    Attributes:
        username: GitHub username
        name: Full name (may be None)
        email: Email address
        commit_count: Total commits by this contributor
        lines_added: Total lines added (if available)
        lines_deleted: Total lines deleted (if available)
        
    Example:
        >>> contributor = ContributorInfo(
        ...     username="janedoe",
        ...     name="Jane Doe",
        ...     email="jane@example.com",
        ...     commit_count=150
        ... )
    """
    username: str
    name: Optional[str]
    email: str
    commit_count: int
    lines_added: Optional[int] = None
    lines_deleted: Optional[int] = None
    
    def contribution_percentage(self, total_commits: int) -> float:
        """
        Calculate what percentage of total commits this contributor made.
        
        Args:
            total_commits: Total commits across all contributors
            
        Returns:
            Percentage (0-100)
            
        Example:
            >>> contributor.commit_count = 30
            >>> contributor.contribution_percentage(100)
            30.0
        """
        if total_commits == 0:
            return 0.0
        return (self.commit_count / total_commits) * 100
