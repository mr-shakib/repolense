"""
Data classes package.

Exports repository structure data classes for use across analysis components.
"""

from .file_node import FileNode
from .commit_info import CommitInfo, ContributorInfo
from .repo_structure import RepoStructure
from .architecture_signal import ArchitectureSignal
from .architecture_analysis_result import ArchitectureAnalysisResult
from .quality_metrics import QualityMetrics

__all__ = [
    'FileNode',
    'CommitInfo',
    'ContributorInfo',
    'RepoStructure',
    'ArchitectureSignal',
    'ArchitectureAnalysisResult',
    'QualityMetrics',
]
