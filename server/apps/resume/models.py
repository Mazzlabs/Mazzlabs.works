"""
Resume app models using MongoEngine
"""

from mongoengine import Document, StringField, DateTimeField, IntField
from datetime import datetime

class ResumeDownload(Document):
    """Model for tracking resume downloads"""
    
    downloaded_at = DateTimeField(default=datetime.utcnow)
    ip_address = StringField(max_length=45)  # Support IPv6
    user_agent = StringField(max_length=500)
    referrer = StringField(max_length=500)
    country = StringField(max_length=2)  # ISO country code
    city = StringField(max_length=100)
    
    meta = {
        'collection': 'resume_downloads',
        'indexes': [
            'downloaded_at',
            'ip_address',
            'country'
        ],
        'ordering': ['-downloaded_at']
    }
    
    def __str__(self):
        return f"Resume download from {self.ip_address} at {self.downloaded_at}"
    
    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            'id': str(self.id),
            'downloaded_at': self.downloaded_at.isoformat() if self.downloaded_at else None,
            'ip_address': self.ip_address,
            'country': self.country,
            'city': self.city
        }

class ResumeStats(Document):
    """Model for storing resume download statistics"""
    
    date = DateTimeField(default=datetime.utcnow)
    total_downloads = IntField(default=0)
    unique_ips = IntField(default=0)
    top_countries = StringField()  # JSON string of country stats
    
    meta = {
        'collection': 'resume_stats',
        'indexes': ['date'],
        'ordering': ['-date']
    }
    
    def __str__(self):
        return f"Resume stats for {self.date.date()}: {self.total_downloads} downloads"
