from rest_framework import generics
from rest_framework import viewsets
from rest_framework import filters
from api.models.transaction import Transaction
from api.serializers.transaction import TransactionSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from ..filters.transactions import TransactionFilter
from datetime import date
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
# from api.permissions import IsOwner

class TransactionListView(generics.ListCreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    # permission_classes = [IsOwner]

class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    # permission_classes = [IsOwner]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        transaction_id = instance.id
        transaction_title = instance.title
        instance.delete()
        return Response({"message": f"Transaction '{transaction_title}', id: {transaction_id} deleted successfully"}, status=status.HTTP_200_OK)

# Get Transaction
# Create Transaction
# Update Transaction
# Delete Transaction

# Get Transactions From User

# Get Transactions Before Date -> End Date
# Get Transactions After Date -> Start Date
# Get Transactions Between Dates -> Both Start and End
# Get Transactions For Given Month -> will be Month for specific year not just month in general -> (Month & Year)
# Get Transactions For Given Week -> Week
# Get Transactions For Given Year -> Year

# Get Transactions In Category -> Category
# Get Transactions In Country -> Country
# Get Transactions In Currency -> Currency

# Get Transactions With Title

# Delete Multiple Transactions
# Edit Multiple Transactions Category


class TransactionViewSet(viewsets.ViewSet):
    
    def list(self, request):
        queryset = Transaction.objects.all()
        serializer = TransactionSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        queryset = Transaction.objects.all()
        transaction = queryset.get(pk=pk)
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def query(self, request, pk=None):
        # Custom query logic for filtered data
        queryset = Transaction.objects.filter(title__icontains=request.query_params.get('title', ''))
        serializer = TransactionSerializer(queryset, many=True)
        return Response(serializer.data)
    
