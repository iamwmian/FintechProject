from rest_framework import generics
from api.models.user import User
from api.serializers.user import AbstractUserSerializer
from rest_framework import viewsets, permissions
class UserListView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = AbstractUserSerializer
    #permission_classes = [permissions.IsAuthenticated]

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = AbstractUserSerializer

