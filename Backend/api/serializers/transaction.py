from rest_framework import serializers
from api.models.transaction import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'title', 'category', 'cost', 'transaction_date']
