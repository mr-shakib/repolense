"""
Custom exception handler for DRF.

This module provides centralized error handling for the API layer.
"""

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """
    Custom exception handler for consistent error responses.
    
    Args:
        exc: The exception that was raised
        context: The context in which the exception occurred
        
    Returns:
        Response object with standardized error format
    """
    # Call DRF's default exception handler first
    response = exception_handler(exc, context)
    
    if response is not None:
        # Standardize error response format
        response.data = {
            'error': True,
            'message': str(exc),
            'details': response.data
        }
    
    return response
