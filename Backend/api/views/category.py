from rest_framework import generics
from api.models.category import Category
from api.serializers.category import CategorySerializer
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
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
    