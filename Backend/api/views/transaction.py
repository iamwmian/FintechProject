from rest_framework import generics
from api.models.transaction import Transaction
from api.serializers.transaction import TransactionSerializer
# from api.permissions import IsOwner

class TransactionListView(generics.ListCreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    # permission_classes = [IsOwner]

class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    # permission_classes = [IsOwner]
