from django.urls import path
from api.views.transaction import TransactionListView, TransactionDetailView
from api.views.category import CategoryListView, CategoryDetailView

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='transaction-list'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='transaction-detail'),

]


