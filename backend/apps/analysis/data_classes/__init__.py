"""
Data classes package.

Exports repository structure data classes for use across analysis components.
"""

from .file_node import FileNode
from .commit_info import CommitInfo, ContributorInfo
from .repo_structure import RepoStructure

__all__ = [
    'FileNode',
    'CommitInfo',
    'ContributorInfo',
    'RepoStructure',
]
