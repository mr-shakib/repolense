"""
Repository structure data class.

Main data structure containing all repository metadata.

Layer: Analysis Layer
Dependencies: FileNode, CommitInfo, ContributorInfo
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from django.utils import timezone

from .file_node import FileNode
from .commit_info import CommitInfo, ContributorInfo


@dataclass
class RepoStructure:
    """
    Complete repository metadata structure.
    
    This is the main data class that contains all extracted repository
    information. It's passed between analysis components.
    
    Why one big structure instead of separate fetches?
    - Consistency: All data from same point in time
    - Efficiency: One API call sequence
    - Simplicity: Pass one object around
    
    Attributes:
        owner: Repository owner (user or organization)
        name: Repository name
        url: Full GitHub URL
        description: Repository description
        primary_language: Main programming language
        languages: All languages with byte counts
        files: List of all files and directories
        commits: Recent commit history (limited for performance)
        contributors: All contributors with stats
        stars: Number of GitHub stars
        forks: Number of forks
        open_issues: Number of open issues
        created_at: When repository was created
        updated_at: Last update timestamp
        default_branch: Main branch name (usually "main" or "master")
        
    Example:
        >>> repo = RepoStructure(
        ...     owner="django",
        ...     name="django",
        ...     url="https://github.com/django/django",
        ...     primary_language="Python",
        ...     languages={"Python": 500000, "JavaScript": 10000},
        ...     files=[...],
        ...     commits=[...],
        ...     contributors=[...]
        ... )
    """
    owner: str
    name: str
    url: str
    description: Optional[str]
    primary_language: Optional[str]
    languages: dict[str, int]  # language -> byte count
    files: list[FileNode]
    commits: list[CommitInfo]
    contributors: list[ContributorInfo]
    stars: int = 0
    forks: int = 0
    open_issues: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    default_branch: str = "main"
    
    def get_full_name(self) -> str:
        """
        Get repository full name (owner/name format).
        
        Returns:
            Repository identifier (e.g., "django/django")
        """
        return f"{self.owner}/{self.name}"
    
    def get_total_files(self) -> int:
        """Count total number of files (excluding directories)."""
        return sum(1 for f in self.files if f.is_file())
    
    def get_total_directories(self) -> int:
        """Count total number of directories."""
        return sum(1 for f in self.files if f.is_directory())
    
    def get_files_by_extension(self, extension: str) -> list[FileNode]:
        """
        Get all files with a specific extension.
        
        Args:
            extension: File extension including dot (e.g., ".py")
            
        Returns:
            List of files with that extension
            
        Example:
            >>> python_files = repo.get_files_by_extension(".py")
            >>> len(python_files)
            150
        """
        return [f for f in self.files if f.extension == extension]
    
    def get_test_files(self) -> list[FileNode]:
        """Get all files that appear to be test files."""
        return [f for f in self.files if f.is_test_file()]
    
    def get_language_distribution(self) -> dict[str, float]:
        """
        Calculate percentage distribution of languages.
        
        Returns:
            Dictionary mapping language to percentage (0-100)
            
        Example:
            >>> repo.get_language_distribution()
            {'Python': 85.5, 'JavaScript': 12.3, 'CSS': 2.2}
        """
        total_bytes = sum(self.languages.values())
        if total_bytes == 0:
            return {}
        
        return {
            lang: (bytes_count / total_bytes) * 100
            for lang, bytes_count in self.languages.items()
        }
    
    def get_top_contributors(self, n: int = 5) -> list[ContributorInfo]:
        """
        Get top N contributors by commit count.
        
        Args:
            n: Number of contributors to return
            
        Returns:
            List of top contributors, sorted by commit count descending
        """
        return sorted(
            self.contributors,
            key=lambda c: c.commit_count,
            reverse=True
        )[:n]
    
    def get_commit_count(self) -> int:
        """Get total number of commits fetched."""
        return len(self.commits)
    
    def calculate_repo_age_days(self) -> Optional[int]:
        """
        Calculate repository age in days.
        
        Returns:
            Number of days since repository creation, or None if unknown
        """
        if not self.created_at:
            return None
        
        delta = timezone.now() - self.created_at
        return delta.days
