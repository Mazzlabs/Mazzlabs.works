"""
Resume app URL configuration
"""

from django.urls import path
from .views import ResumeDownloadView, ResumeStatsView

app_name = 'resume'

urlpatterns = [
    path('download/', ResumeDownloadView.as_view(), name='resume_download'),
    path('stats/', ResumeStatsView.as_view(), name='resume_stats'),
]
