from rest_framework import serializers
from django.contrib.auth.models import AbstractUser
from ..models import User
from ..models.user import User
class AbstractUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AbstractUser
        fields = ['id', 'first_name', 'last_name', 'email']



# class SignUpSerializer(serializers.ModelSerializer):
# 	class Meta:
# 		model = User
# 		fields = [
# 			'username',
# 			'first_name',
# 			'last_name',
# 			'password'
# 		]
# 		extra_kwargs = {
# 			'password': {
# 				'write_only': True
# 			}
# 		}

# 	def create(self, validated_data):
# 		# Clean all values, set as lowercase
# 		username   = validated_data['username'].lower()
# 		first_name = validated_data['first_name'].lower()
# 		last_name  = validated_data['last_name'].lower()
# 		# Create new user
# 		user = User.objects.create(
# 			username=username,
# 			first_name=first_name,
# 			last_name=last_name
# 		)
# 		password = validated_data['password']
# 		user.set_password(password)
# 		user.save()
# 		return user

class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'email',  # This will act as the username
            'first_name',
            'last_name',
            'password'
        ]
        extra_kwargs = {
            'password': {'write_only': True},  # Ensures the password is write-only
        }

    def create(self, validated_data):
        email = validated_data['email'].lower() 
        first_name = validated_data['first_name'].lower() 
        last_name = validated_data['last_name'].lower()
        password = validated_data.pop('password') 

        user = User.objects.create(
            email=email, 
            first_name=first_name,
            last_name=last_name
        )
        
        # Set the password securely (hash it before saving)
        user.set_password(password)
        user.save()

        return user


# class UserSerializer(serializers.ModelSerializer):
# 	name = serializers.SerializerMethodField()

# 	class Meta:
# 		model = User
# 		fields = [
# 			'username',
# 			'name',
# 		]

# 	def get_name(self, obj):
# 		fname = obj.first_name.capitalize()
# 		lname = obj.last_name.capitalize()
# 		return fname + ' ' + lname

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = [
            'email', 
            'first_name',
            'last_name',
            'name',
        ]
        
    def get_name(self, obj):
        return f'{obj.first_name.capitalize()} {obj.last_name.capitalize()}'
