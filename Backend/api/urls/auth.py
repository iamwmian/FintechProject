from django.urls import path
from ..views.auth_views import SignInView, SignUpView


urlpatterns = [
    path('signin/', SignInView.as_view()),
	path('signup/', SignUpView.as_view())
]

