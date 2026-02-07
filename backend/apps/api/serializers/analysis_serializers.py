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
    repository_url = serializers.URLField(source='repo_url', read_only=True)
    overall_score = serializers.FloatField(read_only=True)
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
        read_only_fields = ['id', 'status', 'started_at', 'completed_at', 'error_message']


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
    
    # Add computed fields from raw_data for convenience
    architecture_data = serializers.SerializerMethodField()
    quality_data = serializers.SerializerMethodField()
    principles_data = serializers.SerializerMethodField()
    collaboration_data = serializers.SerializerMethodField()
    
    class Meta:
        model = Report
        fields = [
            'id',
            'analysis',
            'architecture_data',
            'quality_data',
            'principles_data',
            'collaboration_data',
            'created_at',
        ]
    
    def get_architecture_data(self, obj):
        """Extract architecture analysis from raw_data."""
        return obj.raw_data.get('architecture', {})
    
    def get_quality_data(self, obj):
        """Extract quality metrics from raw_data."""
        return obj.raw_data.get('quality', {})
    
    def get_principles_data(self, obj):
        """Extract principles evaluation from raw_data."""
        return obj.raw_data.get('principles', {})
    
    def get_collaboration_data(self, obj):
        """Extract collaboration metrics from raw_data."""
        return obj.raw_data.get('collaboration', {})
