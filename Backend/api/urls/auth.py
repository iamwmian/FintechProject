from django.urls import path
from ..views.auth_views import  ClerkUserSyncView, OnboardView


urlpatterns = [
    path("sync-user/", ClerkUserSyncView.as_view(), name="sync_user"),
    path('onboard/', OnboardView.as_view(), name='onboard'),
]

