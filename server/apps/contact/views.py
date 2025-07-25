"""
Contact app views
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import UserRateThrottle
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
import logging

from .models import ContactSubmission
from .serializers import ContactSubmissionSerializer, ContactSubmissionResponseSerializer

logger = logging.getLogger(__name__)

class ContactRateThrottle(UserRateThrottle):
    scope = 'contact'

class ContactSubmissionView(APIView):
    """Handle contact form submissions"""
    
    throttle_classes = [ContactRateThrottle]
    
    def post(self, request):
        """Create a new contact submission"""
        try:
            # Get client info
            ip_address = self.get_client_ip(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            
            # Validate and save submission
            serializer = ContactSubmissionSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({
                    'status': 'error',
                    'message': 'Invalid form data',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create contact submission
            contact = ContactSubmission(
                name=serializer.validated_data['name'],
                email=serializer.validated_data['email'],
                message=serializer.validated_data['message'],
                ip_address=ip_address,
                user_agent=user_agent
            )
            contact.save()
            
            # Send email
            try:
                self.send_contact_email(contact)
                contact.email_sent = True
                contact.email_sent_at = timezone.now()
                contact.save()
                
                logger.info(f"Contact form submission successful from {contact.name} ({contact.email})")
                
                return Response({
                    'status': 'success',
                    'message': 'Message sent successfully!'
                }, status=status.HTTP_201_CREATED)
                
            except Exception as email_error:
                logger.error(f"Failed to send email for contact {contact.id}: {str(email_error)}")
                return Response({
                    'status': 'partial_success',
                    'message': 'Message received but email notification failed. We will still get back to you!'
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            logger.error(f"Contact form submission error: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Failed to send message. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def send_contact_email(self, contact):
        """Send email notification for contact submission"""
        subject = f"Portfolio Contact: {contact.name}"
        message = f"""
New message from your portfolio website:

Name: {contact.name}
Email: {contact.email}
Message: 
{contact.message}

---
Sent via MazzLabs.works contact form
Time: {contact.submitted_at.strftime('%Y-%m-%d %H:%M:%S UTC')}
IP: {contact.ip_address}
        """
        
        recipient_email = settings.EMAIL_HOST_USER
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            fail_silently=False
        )
    
    def get_client_ip(self, request):
        """Get client IP address from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class ContactListView(APIView):
    """List contact submissions (admin only)"""
    
    def get(self, request):
        """Get list of contact submissions"""
        # In production, add authentication/permission checks
        contacts = ContactSubmission.objects.all()[:50]  # Limit to last 50
        
        serializer = ContactSubmissionResponseSerializer([
            contact.to_dict() for contact in contacts
        ], many=True)
        
        return Response({
            'status': 'success',
            'data': serializer.data
        })
