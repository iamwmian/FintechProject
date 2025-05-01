from django.urls import path
from api.views.transaction import TransactionListView, TransactionDetailView
from api.views.category import CategoryListView, CategoryDetailView, UserCategoryView

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='transaction-list'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='transaction-detail'),
    
    # Path to get categories for a specific user
    path('categories/user/<int:user_id>/', UserCategoryView.as_view(), name='user-categories'),
    
    # Path to edit or delete a specific category for a user
    path('categories/user/<int:user_id>/category/<int:category_id>/', UserCategoryView.as_view(), name='user-category-detail'),

]


