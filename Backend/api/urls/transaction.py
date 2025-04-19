from django.urls import path
from api.views.transaction import TransactionListView, TransactionDetailView, TransactionViewSet


urlpatterns = [
    path('transactions/', TransactionListView.as_view(), name='transaction-list'),
    path('transactions/<int:pk>/', TransactionDetailView.as_view(), name='transaction-detail'),
    path('transactions/query/', TransactionViewSet.as_view({'get': 'query'}), name='transaction-query'),
]


