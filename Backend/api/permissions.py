# from rest_framework.permissions import BasePermission

# class IsOwner(BasePermission):
#     def has_object_permission(self, request, view, obj):
#         return obj.user == request.user


from rest_framework.permissions import BasePermission
import requests
from .models import User

class IsClerkAuthenticated(BasePermission):
    def has_permission(self, request, view):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.split(" ")[-1]

        response = requests.get("https://api.clerk.dev/v1/me", headers={
            "Authorization": f"Bearer {token}"
        })

        if response.status_code != 200:
            return False

        data = response.json()
        user = User.objects.filter(clerk_id=data["id"]).first()
        if user:
            request.user = user
            return True
        return False
