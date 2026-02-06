"""Django app configuration for the Domain layer."""

from django.apps import AppConfig


class DomainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.domain'
    verbose_name = 'Domain Logic Layer'
