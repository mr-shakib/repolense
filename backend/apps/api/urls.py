"""
URL configuration for API layer.

This module defines all API endpoints.
"""

from django.urls import path
from apps.api.views import health_view

app_name = 'api'

urlpatterns = [
    path('health/', health_view.health_check, name='health'),
    # Additional endpoints will be added as we build features
]
