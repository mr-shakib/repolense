"""
Repository ingestion exceptions.

Custom exceptions for repository ingestion errors.

Layer: Analysis Layer
"""


class RepoIngestionError(Exception):
    """
    Base exception for repository ingestion errors.
    
    Why custom exception?
    - Distinguish our errors from library errors
    - Add context (user-friendly messages)
    - Handle gracefully in upper layers
    """
    pass


class InvalidRepoUrlError(RepoIngestionError):
    """Raised when repository URL is invalid or malformed."""
    pass


class RepoAccessError(RepoIngestionError):
    """Raised when repository is not accessible (private, deleted, etc)."""
    pass
