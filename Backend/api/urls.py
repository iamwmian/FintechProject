from django.urls import path, include
from .views import HelloWorldView, RandomTransaction, RandomTransactions

urlpatterns = [
    path('hello/', HelloWorldView.as_view(), name='hello_world'),
    path('random-transaction/', RandomTransaction.as_view(), name='random_transaction'),
    path('random-transactions/', RandomTransactions.as_view(), name='random_transactions'),

    path('user/', include('api.urls.users')), 
    path('transaction/', include('api.urls.transactions')), 
]
