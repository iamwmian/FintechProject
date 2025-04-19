from api.urls.transaction import urlpatterns as transaction_urls
from api.urls.user import urlpatterns as user_urls
from .auth import urlpatterns as auth_urls
from api.urls.category import urlpatterns as category_urls

from api.views.test import HelloWorldView, RandomTransaction, RandomTransactions
from django.urls import path

tempurlpatterns = [
    path('hello/', HelloWorldView.as_view(), name='hello_world'),
    path('random-transaction/', RandomTransaction.as_view(), name='random_transaction'),
    path('random-transactions/', RandomTransactions.as_view(), name='random_transactions'),
]

urlpatterns = tempurlpatterns + transaction_urls + user_urls + auth_urls + category_urls

