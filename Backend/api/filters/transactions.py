import django_filters
from ..models.transaction import Transaction

class TransactionFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(field_name="transaction_date", lookup_expr='gte', label='Start Date')
    end_date = django_filters.DateFilter(field_name="transaction_date", lookup_expr='lte', label='End Date')
    category = django_filters.CharFilter(field_name="category__name", lookup_expr='icontains', label='Category')
    country = django_filters.CharFilter(field_name="country", lookup_expr='icontains', label='Country')
    currency = django_filters.CharFilter(field_name="currency", lookup_expr='icontains', label='Currency')
    title = django_filters.CharFilter(field_name="title", lookup_expr='icontains', label='Title')
    year = django_filters.NumberFilter(field_name="transaction_date__year", label='Year')
    month = django_filters.NumberFilter(field_name="transaction_date__month", label='Month')
    week = django_filters.NumberFilter(field_name="transaction_date__week", label='Week')

    class Meta:
        model = Transaction
        fields = ['start_date', 'end_date', 'category', 'country', 'currency', 'title', 'year', 'month', 'week']
