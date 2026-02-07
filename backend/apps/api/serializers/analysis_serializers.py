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
    
    # Extract structured data from raw_data
    repository = serializers.SerializerMethodField()
    architecture = serializers.SerializerMethodField()
    quality = serializers.SerializerMethodField()
    principles = serializers.SerializerMethodField()
    collaboration = serializers.SerializerMethodField()
    
    class Meta:
        model = Report
        fields = [
            'id',
            'analysis',
            'overall_score',
            'architecture_score',
            'quality_score',
            'principles_score',
            'collaboration_score',
            'repository',
            'architecture',
            'quality',
            'principles',
            'collaboration',
            'insights',
            'ai_executive_summary',
            'ai_developer_guide',
            'ai_hire_recommendation',
            'ai_total_tokens',
            'ai_processing_time_ms',
            'created_at',
        ]
    
    def get_repository(self, obj):
        """Extract repository information from raw_data."""
        return obj.raw_data.get('repository', {
            'name': 'Unknown',
            'owner': 'Unknown',
            'url': obj.analysis.repo_url if obj.analysis else '',
            'description': None,
            'stars': 0,
            'forks': 0,
            'primary_language': 'Unknown',
        })
    
    def get_architecture(self, obj):
        """Extract architecture analysis from raw_data with signals."""
        arch_data = obj.raw_data.get('architecture', {})
        return {
            'signals': arch_data.get('signals', [])
        }
    
    def get_quality(self, obj):
        """Extract quality metrics from raw_data."""
        return obj.raw_data.get('quality', {})
    
    def get_principles(self, obj):
        """Extract principles evaluation from raw_data."""
        return obj.raw_data.get('principles', {})
    
    def get_collaboration(self, obj):
        """Extract collaboration metrics from raw_data."""
        return obj.raw_data.get('collaboration', {})
