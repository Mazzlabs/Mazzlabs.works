from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import json

@require_http_methods(["GET"])
def health_check(request):
    """Health check endpoint for monitoring and load balancers"""
    return JsonResponse({
        'status': 'healthy',
        'service': 'mazzlabs-api',
        'version': '1.0.0'
    })

@require_http_methods(["GET"])
def api_info(request):
    """API information endpoint"""
    return JsonResponse({
        'name': 'MazzLabs Portfolio API',
        'version': '1.0.0',
        'description': 'Modern Django REST API for portfolio and games',
        'endpoints': {
            'contact': '/api/contact/',
            'games': '/api/games/',
            'resume': '/api/resume/',
            'health': '/api/health/'
        }
    })
