"""
Analysis API views.

REST API endpoints for repository analysis and reports.

Layer: API Layer
"""

from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.conf import settings

from apps.domain.models import Analysis, Report
from apps.domain.services import AnalysisService
from apps.api.serializers import (
    AnalysisSerializer,
    AnalysisCreateSerializer,
    ReportSerializer,
)


class AnalysisCreateView(APIView):
    """
    POST /api/analyze/
    
    Submit a repository for analysis.
    Returns analysis ID and status.
    """
    
    def post(self, request):
        """Create new analysis."""
        serializer = AnalysisCreateSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        repo_url = serializer.validated_data['repository_url']
        # Get GitHub token from environment variables
        github_token = getattr(settings, 'GITHUB_ACCESS_TOKEN', None)
        
        try:
            service = AnalysisService()
            analysis = service.analyze_repository(
                repo_url=repo_url,
                github_token=github_token
            )
            
            response_serializer = AnalysisSerializer(analysis)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
            
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': f'Analysis failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AnalysisDetailView(generics.RetrieveAPIView):
    """
    GET /api/analyze/{id}/
    
    Get analysis status and basic information.
    """
    queryset = Analysis.objects.all()
    serializer_class = AnalysisSerializer


class AnalysisListView(generics.ListAPIView):
    """
    GET /api/analyze/
    
    List all analyses (optional, for admin/debugging).
    """
    queryset = Analysis.objects.all().order_by('-started_at')
    serializer_class = AnalysisSerializer


class ReportDetailView(generics.RetrieveAPIView):
    """
    GET /api/reports/{id}/
    
    Get full analysis report with all metrics.
    """
    queryset = Report.objects.select_related('analysis').all()
    serializer_class = ReportSerializer


class ReportByAnalysisView(APIView):
    """
    GET /api/analyze/{analysis_id}/report/
    
    Get report by analysis ID (convenience endpoint).
    """
    
    def get(self, request, analysis_id):
        """Get report for analysis."""
        report = get_object_or_404(Report, analysis_id=analysis_id)
        serializer = ReportSerializer(report)
        return Response(serializer.data)
