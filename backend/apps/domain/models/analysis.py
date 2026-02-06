"""
Analysis model for tracking repository analysis requests.

This module defines the Analysis model which tracks the lifecycle of a
repository analysis from submission to completion. It stores metadata
about the analysis request and maintains status information.

Layer: Domain Layer
Dependencies: Django models only
"""

from django.db import models
from django.core.validators import URLValidator
from django.utils import timezone
import uuid


class AnalysisStatus(models.TextChoices):
    """Status choices for analysis lifecycle."""
    PENDING = 'PENDING', 'Pending'
    IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
    COMPLETED = 'COMPLETED', 'Completed'
    FAILED = 'FAILED', 'Failed'


class Analysis(models.Model):
    """
    Tracks repository analysis requests and their status.
    
    Each Analysis represents a single request to analyze a GitHub repository.
    It maintains the complete lifecycle from submission through completion,
    including error tracking and timing information.
    
    Attributes:
        id: UUID primary key
        repo_url: GitHub repository URL
        user_type: Type of user requesting analysis (recruiter/developer)
        status: Current status of the analysis
        created_at: When analysis was requested
        started_at: When analysis processing began
        completed_at: When analysis finished (success or failure)
        error_message: Error details if analysis failed
    """
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for this analysis"
    )
    
    repo_url = models.URLField(
        max_length=500,
        validators=[URLValidator()],
        help_text="GitHub repository URL to analyze"
    )
    
    user_type = models.CharField(
        max_length=20,
        choices=[
            ('recruiter', 'Recruiter'),
            ('developer', 'Developer')
        ],
        default='recruiter',
        help_text="Type of user requesting the analysis"
    )
    
    status = models.CharField(
        max_length=20,
        choices=AnalysisStatus.choices,
        default=AnalysisStatus.PENDING,
        db_index=True,
        help_text="Current status of the analysis"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text="When the analysis was requested"
    )
    
    started_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the analysis processing began"
    )
    
    completed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the analysis finished"
    )
    
    error_message = models.TextField(
        blank=True,
        null=True,
        help_text="Error details if analysis failed"
    )
    
    class Meta:
        db_table = 'analyses'
        ordering = ['-created_at']
        verbose_name = 'Analysis'
        verbose_name_plural = 'Analyses'
        indexes = [
            models.Index(fields=['-created_at', 'status']),
        ]
    
    def __str__(self) -> str:
        """String representation showing repo and status."""
        repo_name = self.get_repo_name()
        return f"Analysis of {repo_name} - {self.status}"
    
    def get_repo_name(self) -> str:
        """
        Extract repository name from URL.
        
        Returns:
            Repository name in format 'owner/repo' or full URL if parsing fails
            
        Example:
            >>> analysis.repo_url = "https://github.com/user/repo"
            >>> analysis.get_repo_name()
            'user/repo'
        """
        try:
            # Extract from GitHub URL format
            parts = self.repo_url.rstrip('/').split('/')
            if len(parts) >= 2:
                return f"{parts[-2]}/{parts[-1]}"
            return self.repo_url
        except Exception:
            return self.repo_url
    
    def mark_started(self) -> None:
        """
        Mark analysis as started and update timestamp.
        
        This should be called when analysis processing begins.
        """
        self.status = AnalysisStatus.IN_PROGRESS
        self.started_at = timezone.now()
        self.save(update_fields=['status', 'started_at'])
    
    def mark_completed(self) -> None:
        """
        Mark analysis as successfully completed.
        
        This should be called when analysis finishes successfully
        and the report has been generated.
        """
        self.status = AnalysisStatus.COMPLETED
        self.completed_at = timezone.now()
        self.save(update_fields=['status', 'completed_at'])
    
    def mark_failed(self, error_message: str) -> None:
        """
        Mark analysis as failed with error details.
        
        Args:
            error_message: Description of what went wrong
            
        Example:
            >>> analysis.mark_failed("Repository not found or inaccessible")
        """
        self.status = AnalysisStatus.FAILED
        self.completed_at = timezone.now()
        self.error_message = error_message
        self.save(update_fields=['status', 'completed_at', 'error_message'])
    
    def get_duration_seconds(self) -> float | None:
        """
        Calculate analysis duration in seconds.
        
        Returns:
            Duration in seconds if analysis has started, None otherwise
            
        Example:
            >>> duration = analysis.get_duration_seconds()
            >>> print(f"Analysis took {duration:.2f} seconds")
        """
        if not self.started_at:
            return None
        
        end_time = self.completed_at or timezone.now()
        duration = end_time - self.started_at
        return duration.total_seconds()
    
    def is_pending(self) -> bool:
        """Check if analysis is pending."""
        return self.status == AnalysisStatus.PENDING
    
    def is_in_progress(self) -> bool:
        """Check if analysis is currently running."""
        return self.status == AnalysisStatus.IN_PROGRESS
    
    def is_completed(self) -> bool:
        """Check if analysis completed successfully."""
        return self.status == AnalysisStatus.COMPLETED
    
    def is_failed(self) -> bool:
        """Check if analysis failed."""
        return self.status == AnalysisStatus.FAILED
