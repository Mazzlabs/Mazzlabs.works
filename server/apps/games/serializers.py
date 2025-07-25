"""
Games app serializers for REST API
"""

from rest_framework import serializers

class BlackjackActionSerializer(serializers.Serializer):
    """Serializer for blackjack game actions"""
    
    action = serializers.ChoiceField(choices=['start', 'hit', 'stand'], required=True)
    session_id = serializers.CharField(max_length=100, required=False)

class RoshamboActionSerializer(serializers.Serializer):
    """Serializer for roshambo game actions"""
    
    action = serializers.ChoiceField(choices=['play', 'reset'], required=True)
    choice = serializers.ChoiceField(
        choices=['rock', 'paper', 'scissors'], 
        required=False,
        help_text="Required when action is 'play'"
    )
    session_id = serializers.CharField(max_length=100, required=False)
    
    def validate(self, data):
        """Custom validation"""
        if data.get('action') == 'play' and not data.get('choice'):
            raise serializers.ValidationError("Choice is required when action is 'play'")
        return data

class GameStatsSerializer(serializers.Serializer):
    """Serializer for game statistics"""
    
    game_type = serializers.CharField(read_only=True)
    total_sessions = serializers.IntegerField(read_only=True)
    total_rounds = serializers.IntegerField(read_only=True)
    unique_players = serializers.IntegerField(read_only=True)
    average_rounds_per_session = serializers.FloatField(read_only=True)
