"""
Analysis API serializers.

Handles serialization/deserialization for analysis and report endpoints.

Layer: API Layer
"""

from rest_framework import serializers
from apps.domain.models import Analysis, Report


class AnalysisSerializer(serializers.ModelSerializer):
    """
    Serializer for Analysis model.
    
    Used for analysis status checks and listing.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Analysis
        fields = [
            'id',
            'repository_url',
            'status',
            'status_display',
            'overall_score',
            'started_at',
            'completed_at',
            'error_message',
        ]
        read_only_fields = ['id', 'status', 'overall_score', 'started_at', 'completed_at', 'error_message']


class AnalysisCreateSerializer(serializers.Serializer):
    """
    Serializer for creating new analysis.
    
    Accepts repository URL and optional GitHub token.
    """
    repository_url = serializers.URLField(
        required=True,
        help_text="GitHub repository URL (e.g., https://github.com/owner/repo)"
    )
    github_token = serializers.CharField(
        required=False,
        allow_blank=True,
        write_only=True,
        help_text="Optional GitHub personal access token for higher rate limits"
    )


class ReportSerializer(serializers.ModelSerializer):
    """
    Serializer for Report model.
    
    Returns complete analysis results with all metrics.
    """
    analysis = AnalysisSerializer(read_only=True)
    
    class Meta:
        model = Report
        fields = [
            'id',
            'analysis',
            'repository_name',
            'repository_owner',
            'primary_language',
            'stars',
            'forks',
            'architecture_patterns',
            'quality_score',
            'complexity_metrics',
            'principle_score',
            'principle_violations',
            'collaboration_score',
            'collaboration_metrics',
            'overall_score',
            'created_at',
        ]
        read_only_fields = '__all__'
