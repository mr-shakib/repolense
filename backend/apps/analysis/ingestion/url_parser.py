"""
GitHub URL parser and validator.

Handles parsing and validation of GitHub repository URLs.

Layer: Analysis Layer
Dependencies: None (pure Python)
"""

import re
from .exceptions import InvalidRepoUrlError


class GitHubUrlParser:
    """
    Parser for GitHub repository URLs.
    
    Extracts owner and repository name from various GitHub URL formats.
    
    Supported formats:
    - https://github.com/owner/repo
    - https://github.com/owner/repo/
    - https://github.com/owner/repo.git
    - https://github.com/owner/repo/tree/branch
    - http://github.com/owner/repo (less secure, but valid)
    
    Example:
        >>> parser = GitHubUrlParser()
        >>> owner, repo = parser.parse("https://github.com/django/django")
        >>> print(f"{owner}/{repo}")
        'django/django'
    """
    
    # Regular expression pattern for GitHub URLs
    GITHUB_URL_PATTERN = re.compile(
        r'https?://(?:www\.)?github\.com/([^/]+)/([^/]+)/?.*'
    )
    
    def parse(self, url: str) -> tuple[str, str]:
        """
        Extract owner and repository name from GitHub URL.
        
        Args:
            url: GitHub repository URL
            
        Returns:
            Tuple of (owner, repo_name)
            
        Raises:
            InvalidRepoUrlError: If URL doesn't match expected pattern
            
        Example:
            >>> parser = GitHubUrlParser()
            >>> owner, repo = parser.parse("https://github.com/user/repo")
            >>> print(owner, repo)
            'user' 'repo'
        """
        # Strip whitespace
        url = url.strip()
        
        # Match against pattern
        match = self.GITHUB_URL_PATTERN.match(url)
        
        if not match:
            raise InvalidRepoUrlError(
                f"Invalid GitHub URL format: {url}. "
                "Expected format: https://github.com/owner/repo"
            )
        
        owner, repo_name = match.groups()
        
        # Remove .git suffix if present
        if repo_name.endswith('.git'):
            repo_name = repo_name[:-4]
        
        # Validate owner and repo name (basic checks)
        self._validate_component(owner, "owner")
        self._validate_component(repo_name, "repository name")
        
        return owner, repo_name
    
    def _validate_component(self, component: str, component_type: str) -> None:
        """
        Validate that a component (owner or repo name) is reasonable.
        
        GitHub naming rules:
        - Cannot be empty
        - Cannot contain spaces
        - Cannot contain special characters (except hyphen and underscore)
        
        Args:
            component: The owner or repo name to validate
            component_type: Type of component for error message
            
        Raises:
            InvalidRepoUrlError: If component is invalid
        """
        if not component:
            raise InvalidRepoUrlError(
                f"GitHub {component_type} cannot be empty"
            )
        
        if ' ' in component:
            raise InvalidRepoUrlError(
                f"GitHub {component_type} cannot contain spaces: '{component}'"
            )
        
        # Allow alphanumeric, hyphen, underscore, and dot
        if not re.match(r'^[a-zA-Z0-9._-]+$', component):
            raise InvalidRepoUrlError(
                f"GitHub {component_type} contains invalid characters: '{component}'"
            )
