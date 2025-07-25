"""
URL configuration for mazzlabs_api project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def health_check(request):
    """Health check endpoint for monitoring"""
    return Response({'status': 'healthy', 'service': 'mazzlabs-api'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),
    path('api/contact/', include('apps.contact.urls')),
    path('api/games/', include('apps.games.urls')),
    path('api/resume/', include('apps.resume.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
