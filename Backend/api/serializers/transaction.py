from rest_framework import serializers
from api.models.transaction import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    category_title = serializers.SerializerMethodField()
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'title', 'category', 'category_title', 'cost', 'currency', 'location', 'transaction_date']

    def get_category_title(self, obj):
        return obj.category.title if obj.category else None
