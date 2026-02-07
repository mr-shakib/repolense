"""
GitHub data fetcher.

Fetches specific types of data from GitHub repositories.

Layer: Analysis Layer
Dependencies: PyGithub, data classes
"""

from github import GithubException
from github.Repository import Repository

from apps.analysis.data_classes import (
    FileNode,
    CommitInfo,
    ContributorInfo,
)


class GitHubDataFetcher:
    """
    Fetches files, commits, and contributor data from GitHub.
    
    Separated from GitHubClient for Single Responsibility Principle:
    - GitHubClient: Connection and authentication
    - GitHubDataFetcher: Data extraction and transformation
    
    Example:
        >>> fetcher = GitHubDataFetcher()
        >>> files = fetcher.fetch_file_tree(repo)
        >>> print(f"Found {len(files)} files")
    """
    
    MAX_COMMITS = 100  # Limit commit history
    MAX_FILE_DEPTH = 10  # Prevent infinite recursion
    
    # Files/directories to exclude from analysis (generated/build artifacts)
    EXCLUDED_PATHS = {
        'node_modules',
        '__pycache__',
        '.git',
        'venv',
        'env',
        '.venv',
        'dist',
        'build',
        '.next',
        '.nuxt',
        'coverage',
        '.pytest_cache',
        '.mypy_cache',
        'vendor',
        'target',  # Rust/Java
    }
    
    # File patterns to exclude
    EXCLUDED_FILES = {
        'package-lock.json',
        'yarn.lock',
        'pnpm-lock.yaml',
        'poetry.lock',
        'Pipfile.lock',
        'Gemfile.lock',
        'composer.lock',
        'Cargo.lock',
    }
    
    @staticmethod
    def should_exclude_path(path: str) -> bool:
        """
        Check if path should be excluded from analysis.
        
        Args:
            path: File or directory path
            
        Returns:
            True if path should be excluded
        """
        path_parts = path.split('/')
        
        # Check if any part of path matches excluded directories
        for part in path_parts:
            if part in GitHubDataFetcher.EXCLUDED_PATHS:
                return True
        
        # Check if filename matches excluded files
        filename = path_parts[-1] if path_parts else ""
        if filename in GitHubDataFetcher.EXCLUDED_FILES:
            return True
        
        return False
    
    def fetch_file_tree(
        self,
        repo: Repository,
        path: str = "",
        depth: int = 0
    ) -> list[FileNode]:
        """
        Recursively fetch complete file tree structure.
        
        Why recursive?
        - GitHub API returns one directory level at a time
        - Must traverse directories to build complete tree
        
        Why depth limit?
        - Prevents infinite loops
        - Some repos have 20+ nesting levels
        - Each level = API request (expensive)
        
        Args:
            repo: GitHub repository object
            path: Current path (for recursion)
            depth: Current recursion depth
            
        Returns:
            List of all  files and directories
        """
        if depth > self.MAX_FILE_DEPTH:
            return []
        
        files: list[FileNode] = []
        
        try:
            contents = repo.get_contents(path)
            
            # Handle single file or list
            if not isinstance(contents, list):
                contents = [contents]
            
            for content in contents:
                # Skip excluded paths (generated files, build artifacts)
                if self.should_exclude_path(content.path):
                    continue
                
                # Extract extension
                extension = None
                if content.type == "file" and "." in content.name:
                    extension = "." + content.name.rsplit(".", 1)[1]
                
                # Create node
                node = FileNode(
                    path=content.path,
                    name=content.name,
                    type=content.type,
                    size=content.size if content.type == "file" else None,
                    extension=extension,
                )
                
                files.append(node)
                
                # Recurse into directories
                if content.type == "dir":
                    subdirectory_files = self.fetch_file_tree(
                        repo,
                        path=content.path,
                        depth=depth + 1
                    )
                    files.extend(subdirectory_files)
        
        except GithubException as e:
            print(f"Warning: Failed to fetch path '{path}': {e}")
        
        return files
    
    def fetch_commits(self, repo: Repository) -> list[CommitInfo]:
        """
        Fetch recent commit history.
        
        Why limit commits?
        - Large repos have 100K+ commits
        - Each commit = API request
        - Recent commits more relevant
        
        Args:
            repo: GitHub repository object
            
        Returns:
            List of recent commits (up to MAX_COMMITS)
        """
        commits: list[CommitInfo] = []
        
        try:
            commit_iterator = repo.get_commits()
            
            for i, commit in enumerate(commit_iterator):
                if i >= self.MAX_COMMITS:
                    break
                
                commit_info = CommitInfo(
                    sha=commit.sha,
                    message=commit.commit.message.split('\n')[0],
                    author=commit.commit.author.name or "Unknown",
                    author_email=commit.commit.author.email or "",
                    date=commit.commit.author.date,
                    files_changed=len(commit.files) if commit.files else None,
                )
                
                commits.append(commit_info)
        
        except GithubException as e:
            print(f"Warning: Failed to fetch commits: {e}")
        
        return commits
    
    def fetch_contributors(self, repo: Repository) -> list[ContributorInfo]:
        """
        Fetch repository contributors with statistics.
        
        Args:
            repo: GitHub repository object
            
        Returns:
            List of contributors sorted by contribution count
        """
        contributors: list[ContributorInfo] = []
        
        try:
            for contrib in repo.get_contributors():
                contributor_info = ContributorInfo(
                    username=contrib.login,
                    name=contrib.name,
                    email=contrib.email or "",
                    commit_count=contrib.contributions,
                )
                
                contributors.append(contributor_info)
        
        except GithubException as e:
            print(f"Warning: Failed to fetch contributors: {e}")
        
        return contributors
    
    def fetch_languages(self, repo: Repository) -> dict[str, int]:
        """
        Fetch programming languages used in repository.
        
        GitHub calculates this based on file extensions.
        
        Args:
            repo: GitHub repository object
            
        Returns:
            Dictionary mapping language to byte count
            
        Example:
            {'Python': 500000, 'JavaScript': 25000}
        """
        try:
            return repo.get_languages()
        except GithubException as e:
            print(f"Warning: Failed to fetch languages: {e}")
            return {}
