"""
Games app URL configuration
"""

from django.urls import path
from .views import BlackjackGameView, RoshamboGameView, GameStatsView

app_name = 'games'

urlpatterns = [
    path('blackjack/', BlackjackGameView.as_view(), name='blackjack'),
    path('roshambo/', RoshamboGameView.as_view(), name='roshambo'),
    path('stats/', GameStatsView.as_view(), name='game_stats'),
]
