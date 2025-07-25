"""
Games app views
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import uuid
import logging
from datetime import datetime

from .game_logic import BlackjackGame, RoshamboGame
from .models import GameSession
from .serializers import BlackjackActionSerializer, RoshamboActionSerializer

logger = logging.getLogger(__name__)

# In-memory game storage (in production, use Redis or database)
active_games = {}

class BlackjackGameView(APIView):
    """Handle blackjack game actions"""
    
    def post(self, request):
        """Handle blackjack game actions"""
        try:
            serializer = BlackjackActionSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({
                    'status': 'error',
                    'message': 'Invalid request data',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            action = serializer.validated_data['action']
            session_id = serializer.validated_data.get('session_id')
            
            if action == 'start':
                # Create new game
                session_id = str(uuid.uuid4())
                game = BlackjackGame()
                game_state = game.start_new_game()
                active_games[session_id] = game
                
                # Track session
                self._track_session('blackjack', session_id, request)
                
                return Response({
                    'status': 'success',
                    'session_id': session_id,
                    'game_state': game_state
                })
            
            else:
                # Get existing game
                if not session_id or session_id not in active_games:
                    return Response({
                        'status': 'error',
                        'message': 'Invalid or expired session'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                game = active_games[session_id]
                
                if action == 'hit':
                    game_state = game.hit()
                elif action == 'stand':
                    game_state = game.stand()
                    # Update session stats when game ends
                    if game_state['game_over']:
                        self._update_session_stats(session_id, game_state)
                
                return Response({
                    'status': 'success',
                    'session_id': session_id,
                    'game_state': game_state
                })
                
        except Exception as e:
            logger.error(f"Blackjack game error: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Game error occurred'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _track_session(self, game_type, session_id, request):
        """Track game session"""
        try:
            ip_address = self.get_client_ip(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            
            session = GameSession(
                game_type=game_type,
                session_id=session_id,
                ip_address=ip_address,
                user_agent=user_agent
            )
            session.save()
        except Exception as e:
            logger.error(f"Failed to track session: {str(e)}")
    
    def _update_session_stats(self, session_id, game_state):
        """Update session statistics"""
        try:
            session = GameSession.objects(session_id=session_id).first()
            if session:
                stats = game_state.get('stats', {})
                session.total_rounds = stats.get('player_wins', 0) + stats.get('dealer_wins', 0) + stats.get('ties', 0)
                session.player_wins = stats.get('player_wins', 0)
                session.player_losses = stats.get('dealer_wins', 0)
                session.ties = stats.get('ties', 0)
                session.ended_at = datetime.utcnow()
                session.save()
        except Exception as e:
            logger.error(f"Failed to update session stats: {str(e)}")
    
    def get_client_ip(self, request):
        """Get client IP address from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class RoshamboGameView(APIView):
    """Handle rock-paper-scissors game actions"""
    
    def post(self, request):
        """Handle roshambo game actions"""
        try:
            serializer = RoshamboActionSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({
                    'status': 'error',
                    'message': 'Invalid request data',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            action = serializer.validated_data['action']
            session_id = serializer.validated_data.get('session_id')
            
            if action == 'reset' or not session_id or session_id not in active_games:
                # Create new game
                session_id = str(uuid.uuid4())
                game = RoshamboGame()
                active_games[session_id] = game
                
                # Track session
                self._track_session('roshambo', session_id, request)
                
                if action == 'reset':
                    result = game.reset_game()
                    return Response({
                        'status': 'success',
                        'session_id': session_id,
                        'result': result
                    })
            
            if action == 'play':
                choice = serializer.validated_data['choice']
                game = active_games[session_id]
                result = game.play_round(choice)
                
                return Response({
                    'status': 'success',
                    'session_id': session_id,
                    'result': result
                })
            
            return Response({
                'status': 'success',
                'session_id': session_id,
                'stats': active_games[session_id].get_stats()
            })
                
        except Exception as e:
            logger.error(f"Roshambo game error: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Game error occurred'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _track_session(self, game_type, session_id, request):
        """Track game session"""
        try:
            ip_address = self.get_client_ip(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            
            session = GameSession(
                game_type=game_type,
                session_id=session_id,
                ip_address=ip_address,
                user_agent=user_agent
            )
            session.save()
        except Exception as e:
            logger.error(f"Failed to track session: {str(e)}")
    
    def get_client_ip(self, request):
        """Get client IP address from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class GameStatsView(APIView):
    """Get game statistics"""
    
    def get(self, request):
        """Get aggregated game statistics"""
        try:
            # Get statistics for both games
            blackjack_sessions = GameSession.objects(game_type='blackjack')
            roshambo_sessions = GameSession.objects(game_type='roshambo')
            
            stats = {
                'blackjack': {
                    'total_sessions': blackjack_sessions.count(),
                    'total_rounds': sum([s.total_rounds for s in blackjack_sessions]),
                    'unique_players': len(set([s.ip_address for s in blackjack_sessions]))
                },
                'roshambo': {
                    'total_sessions': roshambo_sessions.count(),
                    'total_rounds': sum([s.total_rounds for s in roshambo_sessions]),
                    'unique_players': len(set([s.ip_address for s in roshambo_sessions]))
                }
            }
            
            return Response({
                'status': 'success',
                'data': stats
            })
            
        except Exception as e:
            logger.error(f"Game stats error: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Failed to get statistics'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
