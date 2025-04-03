from rest_framework import generics
from api.models.user import User
from api.serializers.user import AbstractUserSerializer

class UserListView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = AbstractUserSerializer

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = AbstractUserSerializer
