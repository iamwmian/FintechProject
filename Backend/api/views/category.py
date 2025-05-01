from rest_framework import generics
from api.models.category import Category
from api.serializers.category import CategorySerializer
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from api.models.user import User
# from api.permissions import IsOwner

class CategoryListView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    # permission_classes = [IsOwner]

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        category_id = instance.id
        category_title = instance.title
        instance.delete()
        return Response({"message": f"Category '{category_title}', id: {category_id} deleted successfully"}, status=status.HTTP_200_OK)
    
    # permission_classes = [IsOwner]

# Get Category
# Create Category
# Edit Category
# Delete Category

# Get Categories From User    
class UserCategoryView(APIView):
    def get(self, request, user_id):
        """Get all categories for a user"""
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        
        categories = Category.objects.filter(user=user)
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, user_id, category_id):
        """Edit a category for a user"""
        try:
            category = Category.objects.get(id=category_id, user_id=user_id)
        except Category.DoesNotExist:
            return Response({"detail": "Category not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CategorySerializer(category, data=request.data, partial=False)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, user_id, category_id):
        """Partially edit a category for a user"""
        try:
            category = Category.objects.get(id=category_id, user_id=user_id)
        except Category.DoesNotExist:
            return Response({"detail": "Category not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CategorySerializer(category, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id, category_id):
        """Delete a category for a user"""
        try:
            category = Category.objects.get(id=category_id, user_id=user_id)
        except Category.DoesNotExist:
            return Response({"detail": "Category not found."}, status=status.HTTP_404_NOT_FOUND)

        category.delete()
        return Response({"detail": "Category deleted successfully."}, status=status.HTTP_200_OK)