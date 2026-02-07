"""
Repository ingestion service.

Main orchestrator for fetching repository data from GitHub.

Layer: Analysis Layer
Dependencies: GitHubFetcher, GitHubUrlParser, data classes
"""

from typing import Optional

from apps.analysis.data_classes import RepoStructure
from .url_parser import GitHubUrlParser
from .github_client import GitHubClient
from .github_data_fetcher import GitHubDataFetcher


class RepoIngestionService:
    """
    Service for ingesting GitHub repositories.
    
    This is the main entry point for repository data fetching.
    It orchestrates URL parsing, API calls, and data assembly.
    
    Design Pattern: Facade Pattern
    - Provides simple interface to complex subsystem
    - Hides complexity of URL parsing, API calls, error handling
    - Single point of entry for repository ingestion
    
    Responsibility: Orchestration ONLY
    - Delegates URL parsing to GitHubUrlParser
    - Delegates API calls to GitHubFetcher
    - Assembles final RepoStructure
    
    Example:
        >>> service = RepoIngestionService()
        >>> repo = service.ingest_repository("https://github.com/django/django")
        >>> print(f"Fetched {repo.get_total_files()} files")
    """
    
    def __init__(self, github_token: Optional[str] = None):
        """
        Initialize ingestion service.
        
        Args:
            github_token: Optional GitHub token for higher rate limits
        """
        self.url_parser = GitHubUrlParser()
        self.client = GitHubClient(github_token)
        self.fetcher = GitHubDataFetcher()
    
    def ingest_repository(self, repo_url: str) -> RepoStructure:
        """
        Ingest complete repository structure from GitHub.
        
        This is the main entry point. It orchestrates:
        1. URL validation and parsing
        2. Repository access verification
        3. Data fetching from multiple endpoints
        4. Assembly into RepoStructure
        
        Args:
            repo_url: GitHub repository URL
            
        Returns:
            Complete repository structure with all metadata
            
        Raises:
            InvalidRepoUrlError: If URL format is invalid
            RepoAccessError: If repository is not accessible
            RepoIngestionError: For other fetching errors
            
        Flow:
            URL → Parse → Fetch Repo → Fetch Files → Fetch Commits → 
            Fetch Contributors → Fetch Languages → Assemble → Return
            
        Example:
            >>> service = RepoIngestionService()
            >>> repo = service.ingest_repository("https://github.com/user/repo")
            >>> print(f"{repo.get_full_name()}: {repo.primary_language}")
            'user/repo: Python'
        """
        # Step 1: Parse and validate URL
        owner, repo_name = self.url_parser.parse(repo_url)
        
        # Step 2: Fetch repository object
        github_repo = self.client.get_repository(owner, repo_name)
        
        # Step 3: Fetch all data components
        # These could be parallelized in future for better performance
        files = self.fetcher.fetch_file_tree(github_repo)
        commits = self.fetcher.fetch_commits(github_repo)
        contributors = self.fetcher.fetch_contributors(github_repo)
        languages = self.fetcher.fetch_languages(github_repo)
        
        # Step 4: Assemble complete structure
        repo_structure = RepoStructure(
            owner=owner,
            name=repo_name,
            url=repo_url,
            description=github_repo.description,
            primary_language=github_repo.language,
            languages=languages,
            files=files,
            commits=commits,
            contributors=contributors,
            stars=github_repo.stargazers_count,
            forks=github_repo.forks_count,
            open_issues=github_repo.open_issues_count,
            created_at=github_repo.created_at,
            updated_at=github_repo.updated_at,
            default_branch=github_repo.default_branch,
        )
        
        return repo_structure
    
    def validate_repository_url(self, repo_url: str) -> bool:
        """
        Validate URL format without fetching data.
        
        Useful for quick validation before expensive API calls.
        
        Args:
            repo_url: GitHub repository URL to validate
            
        Returns:
            True if URL format is valid, False otherwise
            
        Example:
            >>> service = RepoIngestionService()
            >>> service.validate_repository_url("https://github.com/user/repo")
            True
            >>> service.validate_repository_url("not-a-url")
            False
        """
        try:
            self.url_parser.parse(repo_url)
            return True
        except Exception:
            return False
