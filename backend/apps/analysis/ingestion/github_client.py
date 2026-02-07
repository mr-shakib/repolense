"""
GitHub API client.

Handles GitHub API connection and repository access.

Layer: Analysis Layer
Dependencies: PyGithub
External Calls: GitHub REST API
"""

from github import Github, GithubException, UnknownObjectException
from github.Repository import Repository
from typing import Optional
import os

from .exceptions import RepoAccessError, RepoIngestionError


class GitHubClient:
    """
    GitHub API client for repository access.
    
    Responsible for:
    - GitHub API authentication
    - Repository retrieval
    - Access verification
    - Rate limit management (implicit via PyGithub)
    
    Example:
        >>> client = GitHubClient()
        >>> repo = client.get_repository("django", "django")
        >>> print(repo.full_name)
        'django/django'
    """
    
    def __init__(self, github_token: Optional[str] = None):
        """
        Initialize GitHub API client.
        
        Args:
            github_token: Optional GitHub personal access token
            
        Rate Limits:
        - Without token: 60 requests/hour
        - With token: 5,000 requests/hour
        """
        token = github_token or os.getenv('GITHUB_TOKEN')
        
        if token:
            self.github = Github(token)
        else:
            # Anonymous access (limited, use only for testing)
            self.github = Github()
    
    def get_repository(self, owner: str, repo_name: str) -> Repository:
        """
        Fetch repository object from GitHub API.
        
        Args:
            owner: Repository owner (user or organization)
            repo_name: Repository name
            
        Returns:
            GitHub repository object
            
        Raises:
            RepoAccessError: If repository not found or not accessible
            RepoIngestionError: For other GitHub API errors
            
        Example:
            >>> client = GitHubClient()
            >>> repo = client.get_repository("python", "cpython")
            >>> print(f"Stars: {repo.stargazers_count}")
        """
        try:
            repo = self.github.get_repo(f"{owner}/{repo_name}")
            
            # Force API call to verify repository is accessible
            # (get_repo is lazy and doesn't hit API until property access)
            _ = repo.full_name
            
            return repo
            
        except UnknownObjectException:
            raise RepoAccessError(
                f"Repository '{owner}/{repo_name}' not found or not accessible. "
                "It may be private, deleted, or the URL may be incorrect."
            )
        except GithubException as e:
            if e.status == 403:
                raise RepoAccessError(
                    "GitHub API rate limit exceeded. "
                    "Please wait or provide an authentication token."
                )
            raise RepoIngestionError(
                f"Failed to access repository: {e.data.get('message', str(e))}"
            )
    
    def check_rate_limit(self) -> dict:
        """
        Check current GitHub API rate limit status.
        
        Returns:
            Dictionary with rate limit information:
            - remaining: Requests remaining
            - limit: Total requests allowed
            - reset: When limit resets (Unix timestamp)
            
        Example:
            >>> client = GitHubClient()
            >>> limits = client.check_rate_limit()
            >>> print(f"Remaining: {limits['remaining']}/{limits['limit']}")
        """
        rate_limit = self.github.get_rate_limit()
        core_limit = rate_limit.core
        
        return {
            'remaining': core_limit.remaining,
            'limit': core_limit.limit,
            'reset': core_limit.reset.timestamp(),
        }
