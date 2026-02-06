"""
File node data class.

Represents files and directories in repository structure.

Layer: Analysis Layer
Dependencies: None (pure Python)
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class FileNode:
    """
    Represents a single file or directory in the repository.
    
    This is a lightweight structure for tracking file metadata.
    We don't store file content (security + size concerns).
    
    Attributes:
        path: Relative path from repo root (e.g., "src/models/user.py")
        name: File/folder name (e.g., "user.py")
        type: Either "file" or "dir"
        size: File size in bytes (None for directories)
        extension: File extension (e.g., ".py", ".js") or None
        
    Example:
        >>> node = FileNode(
        ...     path="src/models/user.py",
        ...     name="user.py",
        ...     type="file",
        ...     size=1024,
        ...     extension=".py"
        ... )
    """
    path: str
    name: str
    type: str  # "file" or "dir"
    size: Optional[int] = None
    extension: Optional[str] = None
    
    def is_file(self) -> bool:
        """Check if this node represents a file."""
        return self.type == "file"
    
    def is_directory(self) -> bool:
        """Check if this node represents a directory."""
        return self.type == "dir"
    
    def is_python_file(self) -> bool:
        """Check if this is a Python file."""
        return self.extension == ".py"
    
    def is_javascript_file(self) -> bool:
        """Check if this is a JavaScript/TypeScript file."""
        return self.extension in [".js", ".jsx", ".ts", ".tsx"]
    
    def is_test_file(self) -> bool:
        """
        Detect if this is likely a test file.
        
        Common patterns:
        - test_*.py
        - *_test.py
        - *.test.js
        - *.spec.ts
        """
        name_lower = self.name.lower()
        return (
            name_lower.startswith("test_") or
            name_lower.endswith("_test.py") or
            ".test." in name_lower or
            ".spec." in name_lower
        )
