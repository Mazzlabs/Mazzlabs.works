"""
Contact app URL configuration
"""

from django.urls import path
from .views import ContactSubmissionView, ContactListView

app_name = 'contact'

urlpatterns = [
    path('', ContactSubmissionView.as_view(), name='contact_submit'),
    path('list/', ContactListView.as_view(), name='contact_list'),
]
