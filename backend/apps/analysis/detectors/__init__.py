"""
Architecture pattern detectors.

Detects common architectural patterns from repository structure.
"""

from .base_detector import BaseDetector
from .mvc_detector import MVCDetector
from .clean_architecture_detector import CleanArchitectureDetector
from .layered_detector import LayeredDetector
from .feature_based_detector import FeatureBasedDetector
from .architecture_analyzer import ArchitectureAnalyzer

__all__ = [
    'BaseDetector',
    'MVCDetector',
    'CleanArchitectureDetector',
    'LayeredDetector',
    'FeatureBasedDetector',
    'ArchitectureAnalyzer',
]
