"""
Contact app serializers for REST API
"""

from rest_framework import serializers
from .models import ContactSubmission

class ContactSubmissionSerializer(serializers.Serializer):
    """Serializer for contact form submissions"""
    
    name = serializers.CharField(max_length=100, required=True)
    email = serializers.EmailField(required=True)
    message = serializers.CharField(required=True)
    
    def validate_name(self, value):
        """Validate name field"""
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long")
        return value
    
    def validate_message(self, value):
        """Validate message field"""
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters long")
        if len(value) > 5000:
            raise serializers.ValidationError("Message must be less than 5000 characters")
        return value
    
    def create(self, validated_data):
        """Create a new contact submission"""
        return ContactSubmission.objects.create(**validated_data)

class ContactSubmissionResponseSerializer(serializers.Serializer):
    """Serializer for contact submission responses"""
    
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    message = serializers.CharField(read_only=True)
    submitted_at = serializers.DateTimeField(read_only=True)
    email_sent = serializers.BooleanField(read_only=True)
