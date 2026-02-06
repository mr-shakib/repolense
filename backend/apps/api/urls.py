"""
URL configuration for API layer.

This module defines all API endpoints.
"""

from django.urls import path
from apps.api.views import (
    health_check,
    AnalysisCreateView,
    AnalysisDetailView,
    AnalysisListView,
    ReportDetailView,
    ReportByAnalysisView,
)

app_name = 'api'

urlpatterns = [
    # Health check
    path('health/', health_check, name='health'),
    
    # Analysis endpoints
    path('analyze/', AnalysisCreateView.as_view(), name='analysis-create'),
    path('analyze/<int:pk>/', AnalysisDetailView.as_view(), name='analysis-detail'),
    path('analyze/<int:analysis_id>/report/', ReportByAnalysisView.as_view(), name='analysis-report'),
    path('analyses/', AnalysisListView.as_view(), name='analysis-list'),
    
    # Report endpoints
    path('reports/<int:pk>/', ReportDetailView.as_view(), name='report-detail'),
]
