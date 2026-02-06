"""Django app configuration for the API layer."""

from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.api'
    verbose_name = 'API Gateway Layer'
