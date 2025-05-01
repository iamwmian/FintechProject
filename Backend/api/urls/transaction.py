from django.urls import path
from api.views.transaction import TransactionListView, TransactionDetailView, TransactionViewSet, TransactionActionView, GeneralTransactionView, TransactionSearchView


urlpatterns = [
    path('transactions/', TransactionListView.as_view(), name='transaction-list'),
    path('transactions/<int:pk>/', TransactionDetailView.as_view(), name='transaction-detail'),
    path('transactions/query/', TransactionViewSet.as_view({'get': 'query'}), name='transaction-query'),

    # Path to get all transactions or create a new transaction for a specific user
    path('transactions/user/<int:user_id>/', GeneralTransactionView.as_view(), name='user-transactions'),
    
    # Path to get, update, partially update or delete a specific transaction for a user
    path('transactions/user/<int:user_id>/transaction/<int:transaction_id>/', TransactionActionView.as_view(), name='user-transaction-detail'),

    path('transactions/user/<int:user_id>/search/', TransactionSearchView.as_view(), name='search-transactions'),
]


