"""
Resume app views
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import FileResponse, Http404
from django.conf import settings
import os
import logging
from datetime import datetime

from .models import ResumeDownload

logger = logging.getLogger(__name__)

class ResumeDownloadView(APIView):
    """Handle resume download requests"""
    
    def get(self, request):
        """Download resume file with tracking"""
        try:
            # Get client info
            ip_address = self.get_client_ip(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            referrer = request.META.get('HTTP_REFERER', '')
            
            # Track download
            download = ResumeDownload(
                ip_address=ip_address,
                user_agent=user_agent,
                referrer=referrer
            )
            download.save()
            
            # Find resume file
            resume_path = os.path.join(settings.BASE_DIR.parent, 'assets', 'Joseph_Mazzini_Resume.pdf')
            
            if not os.path.exists(resume_path):
                logger.error(f"Resume file not found at {resume_path}")
                raise Http404("Resume file not found")
            
            logger.info(f"Resume downloaded from IP {ip_address} at {datetime.now()}")
            
            # Return file response
            response = FileResponse(
                open(resume_path, 'rb'),
                as_attachment=True,
                filename='Joseph_Mazzini_Resume.pdf'
            )
            response['Content-Type'] = 'application/pdf'
            return response
            
        except Http404:
            raise
        except Exception as e:
            logger.error(f"Resume download error: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Download failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_client_ip(self, request):
        """Get client IP address from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class ResumeStatsView(APIView):
    """Get resume download statistics"""
    
    def get(self, request):
        """Get download statistics"""
        try:
            # Get recent downloads
            recent_downloads = ResumeDownload.objects.all()[:100]
            
            # Calculate stats
            total_downloads = ResumeDownload.objects.count()
            unique_ips = len(set([d.ip_address for d in ResumeDownload.objects.all()]))
            
            # Recent downloads (last 30)
            recent_data = [download.to_dict() for download in recent_downloads[:30]]
            
            return Response({
                'status': 'success',
                'data': {
                    'total_downloads': total_downloads,
                    'unique_ips': unique_ips,
                    'recent_downloads': recent_data
                }
            })
            
        except Exception as e:
            logger.error(f"Resume stats error: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Failed to get statistics'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
