"""
Report model for storing completed repository analysis results.

This module defines the Report model which stores the complete output of
a repository analysis, including scores, insights, and raw analysis data.
Each Report is linked to an Analysis request.

Layer: Domain Layer
Dependencies: Django models, Analysis model
"""

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid


class Report(models.Model):
    """
    Stores completed repository analysis results.
    
    Each Report represents the final output of a successful repository analysis.
    It contains scores across different dimensions, AI-generated insights,
    and the raw structured data that was analyzed.
    
    Attributes:
        id: UUID primary key
        analysis: Link to the Analysis request
        overall_score: Final weighted score (0-100)
        architecture_score: Architecture pattern quality score
        quality_score: Code quality metrics score
        principles_score: SOLID principles adherence score
        collaboration_score: Team collaboration metrics score
        insights: AI-generated insights and recommendations
        raw_data: Complete analysis data as JSON
        created_at: When report was generated
        updated_at: Last modification time
    """
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for this report"
    )
    
    analysis = models.OneToOneField(
        'domain.Analysis',
        on_delete=models.CASCADE,
        related_name='report',
        help_text="The analysis request this report belongs to"
    )
    
    # Score fields (0-100 scale)
    overall_score = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        help_text="Final weighted score (0-100)"
    )
    
    architecture_score = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        help_text="Architecture pattern quality score"
    )
    
    quality_score = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        help_text="Code quality metrics score"
    )
    
    principles_score = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        help_text="SOLID principles adherence score"
    )
    
    collaboration_score = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        help_text="Team collaboration metrics score"
    )
    
    # AI-generated content
    insights = models.JSONField(
        default=dict,
        help_text="AI-generated insights and recommendations"
    )
    
    # Raw analysis data
    raw_data = models.JSONField(
        default=dict,
        help_text="Complete structured analysis data"
    )
    
    # Timestamps
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text="When the report was generated"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Last modification time"
    )
    
    class Meta:
        db_table = 'reports'
        ordering = ['-created_at']
        verbose_name = 'Report'
        verbose_name_plural = 'Reports'
    
    def __str__(self) -> str:
        """String representation showing repo and score."""
        repo_name = self.analysis.get_repo_name()
        return f"Report for {repo_name} - Score: {self.overall_score:.1f}"
    
    def get_grade(self) -> str:
        """
        Convert overall score to letter grade.
        
        Returns:
            Letter grade (A+ to F)
            
        Grading scale:
            A+: 95-100
            A:  90-94
            B+: 85-89
            B:  80-84
            C+: 75-79
            C:  70-74
            D:  60-69
            F:  0-59
        """
        score = self.overall_score
        
        if score >= 95:
            return 'A+'
        elif score >= 90:
            return 'A'
        elif score >= 85:
            return 'B+'
        elif score >= 80:
            return 'B'
        elif score >= 75:
            return 'C+'
        elif score >= 70:
            return 'C'
        elif score >= 60:
            return 'D'
        else:
            return 'F'
    
    def is_passing(self) -> bool:
        """
        Check if repository meets minimum quality threshold.
        
        Returns:
            True if overall score is 70 or above
        """
        return self.overall_score >= 70.0
    
    def get_risk_level(self) -> str:
        """
        Assess project risk level based on overall score.
        
        Returns:
            Risk level: 'LOW', 'MEDIUM', or 'HIGH'
            
        Risk levels:
            LOW: Score >= 70 (passing)
            MEDIUM: Score 50-69
            HIGH: Score < 50
        """
        if self.overall_score >= 70:
            return 'LOW'
        elif self.overall_score >= 50:
            return 'MEDIUM'
        else:
            return 'HIGH'
    
    def get_weakest_area(self) -> str:
        """
        Identify the dimension with the lowest score.
        
        Returns:
            Name of the weakest area
            
        Example:
            >>> report.get_weakest_area()
            'principles'
        """
        scores = {
            'architecture': self.architecture_score,
            'quality': self.quality_score,
            'principles': self.principles_score,
            'collaboration': self.collaboration_score,
        }
        return min(scores, key=scores.get)
    
    def get_strongest_area(self) -> str:
        """
        Identify the dimension with the highest score.
        
        Returns:
            Name of the strongest area
            
        Example:
            >>> report.get_strongest_area()
            'quality'
        """
        scores = {
            'architecture': self.architecture_score,
            'quality': self.quality_score,
            'principles': self.principles_score,
            'collaboration': self.collaboration_score,
        }
        return max(scores, key=scores.get)
    
    def get_score_breakdown(self) -> dict[str, float]:
        """
        Get all dimensional scores as dictionary.
        
        Returns:
            Dictionary mapping dimension names to scores
            
        Example:
            >>> breakdown = report.get_score_breakdown()
            >>> print(breakdown)
            {
                'architecture': 85.0,
                'quality': 72.5,
                'principles': 68.0,
                'collaboration': 90.0
            }
        """
        return {
            'architecture': self.architecture_score,
            'quality': self.quality_score,
            'principles': self.principles_score,
            'collaboration': self.collaboration_score,
        }
