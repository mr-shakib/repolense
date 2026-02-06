"""
Main URL configuration for RepoLense AI.

This module defines the root URL patterns and includes
app-specific URL configurations.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.api.urls')),
]

# Add debug toolbar in development
if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
