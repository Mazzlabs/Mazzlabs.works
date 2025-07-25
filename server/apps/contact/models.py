"""
Contact app models using MongoEngine
"""

from mongoengine import Document, StringField, EmailField, DateTimeField, BooleanField
from datetime import datetime

class ContactSubmission(Document):
    """Model for storing contact form submissions"""
    
    name = StringField(max_length=100, required=True)
    email = EmailField(required=True)
    message = StringField(required=True)
    submitted_at = DateTimeField(default=datetime.utcnow)
    ip_address = StringField(max_length=45)  # Support IPv6
    user_agent = StringField(max_length=500)
    email_sent = BooleanField(default=False)
    email_sent_at = DateTimeField()
    
    meta = {
        'collection': 'contact_submissions',
        'indexes': [
            'submitted_at',
            'email',
            'email_sent'
        ],
        'ordering': ['-submitted_at']
    }
    
    def __str__(self):
        return f"Contact from {self.name} ({self.email}) at {self.submitted_at}"
    
    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            'id': str(self.id),
            'name': self.name,
            'email': self.email,
            'message': self.message,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
            'email_sent': self.email_sent
        }
