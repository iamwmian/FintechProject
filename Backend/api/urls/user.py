from django.urls import path
from api.views.user import UserListView, UserDetailView, SetupView

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('users/setup/user/<int:user_id>/', SetupView.as_view(), name='setup'),
]
