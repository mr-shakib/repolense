"""
Base detector for architecture pattern detection.

Provides common utilities for all architecture detectors.

Layer: Analysis Layer  
Dependencies: RepoStructure, ArchitectureSignal
"""

from abc import ABC, abstractmethod
from apps.analysis.data_classes import RepoStructure, ArchitectureSignal


class BaseDetector(ABC):
    """
    Abstract base class for architecture pattern detectors.
    
    Provides common helper methods for folder/file checking that
    all detectors need. Each concrete detector implements detect().
    
    Why abstract base class?
    - Enforces consistent interface across all detectors
    - DRY principle: Common logic in one place
    - Makes adding new detectors easier
    
    Example:
        >>> class MVCDetector(BaseDetector):
        ...     def detect(self, repo: RepoStructure) -> ArchitectureSignal:
        ...         if self.has_folder(repo, "models"):
        ...             # ... detection logic
    """
    
    @abstractmethod
    def detect(self, repo: RepoStructure) -> ArchitectureSignal:
        """
        Detect architecture pattern in repository.
        
        Each concrete detector must implement this method.
        
        Args:
            repo: Repository structure to analyze
            
        Returns:
            ArchitectureSignal with confidence and evidence
        """
        pass
    
    def has_folder(self, repo: RepoStructure, folder_name: str) -> bool:
        """
        Check if repository has a specific top-level or nested folder.
        
        Args:
            repo: Repository structure
            folder_name: Folder name to search for
            
        Returns:
            True if f older exists
            
        Example:
            >>> self.has_folder(repo, "models")
            True
        """
        folder_name_lower = folder_name.lower()
        
        for file_node in repo.files:
            if file_node.is_directory():
                # Check exact match or nested match
                path_parts = file_node.path.lower().split('/')
                if folder_name_lower in path_parts:
                    return True
        
        return False

    def has_path_pattern(self, repo: RepoStructure, pattern: str) -> bool:
        """
        Check if any file path contains the specified pattern.
        
        More flexible than has_folder() - can match partial paths like "apps/domain".
        
        Args:
            repo: Repository structure
            pattern: Path pattern to search for (e.g., "apps/domain")
            
        Returns:
            True if pattern found in any path
            
        Example:
            >>> self.has_path_pattern(repo, "apps/domain")  # matches "backend/apps/domain/models.py"
            True
        """
        pattern_lower = pattern.lower()
        
        for file_node in repo.files:
            if pattern_lower in file_node.path.lower():
                return True
        
        return False

    def has_any_folder(self, repo: RepoStructure, folder_names: list[str]) -> bool:
        """
        Check if repository has any of the specified folders.
        
        Args:
            repo: Repository structure
            folder_names: List of folder names
            
        Returns:
            True if at least one folder exists
        """
        return any(self.has_folder(repo, name) for name in folder_names)
    
    def count_folders_present(
        self,
        repo: RepoStructure,
        folder_names: list[str]
    ) -> int:
        """
        Count how many of the specified folders exist.
        
        Args:
            repo: Repository structure
            folder_names: List of folder names to check
            
        Returns:
            Number of folders found
        """
        return sum(1 for name in folder_names if self.has_folder(repo, name))
    
    def get_folder_names(self, repo: RepoStructure) -> set[str]:
        """
        Get all folder names in repository (case-insensitive).
        
        Args:
            repo: Repository structure
            
        Returns:
            Set of folder names
        """
        folders = set()
        for file_node in repo.files:
            if file_node.is_directory():
                # Add all parts of the path
                parts = file_node.path.lower().split('/')
                folders.update(parts)
        return folders
