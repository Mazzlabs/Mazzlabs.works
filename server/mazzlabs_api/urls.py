"""
URL configuration for mazzlabs_api project.
"""

from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse, HttpResponse
import json

@api_view(['GET'])
def health_check(request):
    """Health check endpoint for monitoring - returns 200 OK"""
    try:
        # Ensure we return a proper 200 status
        response_data = {
            'status': 'healthy',
            'service': 'mazzlabs-api',
            'timestamp': '2025-07-25',
            'version': '1.0'
        }
        return Response(response_data, status=status.HTTP_200_OK)
    except Exception as e:
        # Fallback to plain Django response if DRF fails
        return JsonResponse({
            'status': 'healthy',
            'service': 'mazzlabs-api'
        }, status=200)

def simple_health_check(request):
    """Simple health check without DRF dependencies"""
    return HttpResponse('OK', status=200, content_type='text/plain')

urlpatterns = [
    path('api/health/', health_check, name='health_check'),
    path('health/', simple_health_check, name='simple_health_check'),
    path('api/contact/', include('apps.contact.urls')),
    path('api/games/', include('apps.games.urls')),
    path('api/resume/', include('apps.resume.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
