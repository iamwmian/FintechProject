# api/urls.py
from django.urls import path, include
from .views import HelloWorldView, RandomTransaction, RandomTransactions

# High-level URL patterns
urlpatterns = [
    # Simple views like hello and random transactions
    path('hello/', HelloWorldView.as_view(), name='hello_world'),
    path('random-transaction/', RandomTransaction.as_view(), name='random_transaction'),
    path('random-transactions/', RandomTransactions.as_view(), name='random_transactions'),

    # Include the modular URLs for users and transactions
    path('user/', include('api.urls.users')),  # User-related URLs
    path('transaction/', include('api.urls.transactions')),  # Transaction-related URLs
]
