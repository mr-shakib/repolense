"""
Health check endpoint.

Simple endpoint to verify the API is running.
"""

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint.
    
    Returns basic system status. Used by load balancers
    and monitoring systems.
    
    Returns:
        Response with status and version info
    """
    return Response({
        'status': 'healthy',
        'version': '0.1.0',
        'message': 'RepoLense AI API'
    }, status=status.HTTP_200_OK)
