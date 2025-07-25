"""
Games app models using MongoEngine
"""

from mongoengine import Document, StringField, DateTimeField, IntField, DictField
from datetime import datetime

class GameSession(Document):
    """Model for tracking game sessions"""
    
    game_type = StringField(max_length=50, required=True)  # 'blackjack' or 'roshambo'
    session_id = StringField(max_length=100, required=True)
    started_at = DateTimeField(default=datetime.utcnow)
    ended_at = DateTimeField()
    ip_address = StringField(max_length=45)
    user_agent = StringField(max_length=500)
    
    # Game-specific stats
    total_rounds = IntField(default=0)
    player_wins = IntField(default=0)
    player_losses = IntField(default=0)
    ties = IntField(default=0)
    
    meta = {
        'collection': 'game_sessions',
        'indexes': [
            'game_type',
            'started_at',
            'session_id'
        ],
        'ordering': ['-started_at']
    }
    
    def __str__(self):
        return f"{self.game_type} session {self.session_id} at {self.started_at}"
    
    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            'id': str(self.id),
            'game_type': self.game_type,
            'session_id': self.session_id,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'ended_at': self.ended_at.isoformat() if self.ended_at else None,
            'total_rounds': self.total_rounds,
            'player_wins': self.player_wins,
            'player_losses': self.player_losses,
            'ties': self.ties
        }

class GameStats(Document):
    """Model for storing aggregated game statistics"""
    
    game_type = StringField(max_length=50, required=True)
    date = DateTimeField(default=datetime.utcnow)
    total_sessions = IntField(default=0)
    total_rounds = IntField(default=0)
    unique_players = IntField(default=0)
    average_rounds_per_session = IntField(default=0)
    
    meta = {
        'collection': 'game_stats',
        'indexes': [
            'game_type',
            'date'
        ],
        'ordering': ['-date']
    }
    
    def __str__(self):
        return f"{self.game_type} stats for {self.date.date()}"
