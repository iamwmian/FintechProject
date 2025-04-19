from rest_framework import serializers
from django.contrib.auth.models import AbstractUser
from ..models import User
from ..models.user import User
class AbstractUserSerializer(serializers.ModelSerializer):
    class Meta:
        # model = AbstractUser
        model = User
        fields = ['id', 'first_name', 'last_name', 'email']



class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = [
            'email', 
            'first_name',
            'last_name',
            'name',
            'clerk_id',
            'complete_setup'
        ]
        
    def get_name(self, obj):
        return f'{obj.first_name.capitalize()} {obj.last_name.capitalize()}'
