"""
Ingestion package.

Exports repository ingestion services for fetching data from GitHub.
"""

from .repo_ingestion import RepoIngestionService
from .exceptions import (
    RepoIngestionError,
    InvalidRepoUrlError,
    RepoAccessError,
)

__all__ = [
    'RepoIngestionService',
    'RepoIngestionError',
    'InvalidRepoUrlError',
    'RepoAccessError',
]
