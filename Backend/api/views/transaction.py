from rest_framework import generics
from rest_framework import viewsets
from rest_framework import filters
from api.models.transaction import Transaction
from api.models.user import User
from api.models.category import Category
from api.serializers.transaction import TransactionSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from ..filters.transactions import TransactionFilter
from datetime import date
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from datetime import datetime
from django.utils import timezone
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
    


class GeneralTransactionView(APIView):
    
    def get(self, request, user_id):
        """Get all transactions for a user"""
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        transactions = Transaction.objects.filter(user=user)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, user_id):
        """Create a new transaction for a user"""
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Add the user to the request data before saving
        request.data['user'] = user.id
        serializer = TransactionSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TransactionActionView(APIView):

    def get(self, request, user_id, transaction_id):
        """Get a specific transaction for a user"""
        try:
            user = User.objects.get(id=user_id)
            transaction = Transaction.objects.get(id=transaction_id, user=user)
        except (User.DoesNotExist, Transaction.DoesNotExist):
            return Response({"detail": "Transaction not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = TransactionSerializer(transaction)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, user_id, transaction_id):
        """Update a specific transaction for a user"""
        try:
            user = User.objects.get(id=user_id)
            transaction = Transaction.objects.get(id=transaction_id, user=user)
        except (User.DoesNotExist, Transaction.DoesNotExist):
            return Response({"detail": "Transaction not found."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the data from the request and update the transaction
        serializer = TransactionSerializer(transaction, data=request.data, partial=False)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, user_id, transaction_id):
        """Partially update a specific transaction for a user"""
        try:
            user = User.objects.get(id=user_id)
            transaction = Transaction.objects.get(id=transaction_id, user=user)
        except (User.DoesNotExist, Transaction.DoesNotExist):
            return Response({"detail": "Transaction not found."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the data from the request and update the transaction (partial update)
        serializer = TransactionSerializer(transaction, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id, transaction_id):
        """Delete a specific transaction for a user"""
        try:
            user = User.objects.get(id=user_id)
            transaction = Transaction.objects.get(id=transaction_id, user=user)
        except (User.DoesNotExist, Transaction.DoesNotExist):
            return Response({"detail": "Transaction not found."}, status=status.HTTP_404_NOT_FOUND)

        transaction.delete()
        return Response({"detail": "Transaction deleted successfully."}, status=status.HTTP_200_OK)
    
class TransactionSearchView(APIView):
    
    def get(self, request, user_id):
        """Search transactions for a user with multiple filters"""
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Initialize the base query
        transactions = Transaction.objects.filter(user=user)
        
        # Handle filters
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)
        category = request.query_params.get('category', None)
        location = request.query_params.get('location', None)
        currency = request.query_params.get('currency', None)
        title = request.query_params.get('title', None)
        
        # Filter by start_date and end_date if provided
        if start_date:
            try:
                start_date = datetime.strptime(start_date, '%Y-%m-%d')
                start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
                transactions = transactions.filter(transaction_date__gte=start_date)
            except ValueError:
                return Response({"detail": "Invalid start_date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)
        
        if end_date:
            try:
                end_date = datetime.strptime(end_date, '%Y-%m-%d')
                end_date = timezone.make_aware(end_date, timezone.get_current_timezone())
                transactions = transactions.filter(transaction_date__lte=end_date)
            except ValueError:
                return Response({"detail": "Invalid end_date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Filter by category if provided
        # if category:
        #     try:
        #         category = Category.objects.get(id=category)
        #         transactions = transactions.filter(category=category)
        #     except Category.DoesNotExist:
        #         return Response({"detail": "Category not found."}, status=status.HTTP_404_NOT_FOUND)

        if category:
            try:
                # get the category by title and ensure it belongs to the user
                category = Category.objects.get(title=category, user=user)
                transactions = transactions.filter(category=category)
            except Category.DoesNotExist:
                return Response({"detail": "Category not found or does not belong to the user."}, status=status.HTTP_404_NOT_FOUND)
        
        # Filter by location if provided
        if location:
            transactions = transactions.filter(location__icontains=location)
        
        # Filter by currency if provided
        if currency:
            transactions = transactions.filter(currency__icontains=currency)
        
        # Filter by title if provided
        if title:
            transactions = transactions.filter(title__icontains=title)
        
        # Serialize the filtered transactions
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)