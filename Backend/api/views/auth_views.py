from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings
from api.models import User
import requests
import jwt

from rest_framework.permissions import IsAuthenticated
from ..serializers.user import UserSerializer
import environ
env = environ.Env()
CLERK_JWKS_URL = f"{env('CLERK_FRONTEND_API_URL')}.well-known/jwks.json"  # Replace with your Clerk instance

class ClerkUserSyncView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response({"error": "No token provided"}, status=401)

        token = auth_header.split(" ")[1]
        print(token)
        
        try:
            jwks = requests.get(CLERK_JWKS_URL).json()
            public_keys = {
                key['kid']: jwt.algorithms.RSAAlgorithm.from_jwk(key)
                for key in jwks['keys']
            }
            
            header = jwt.get_unverified_header(token)
            key = public_keys[header['kid']]

            decoded = jwt.decode(
                token,
                key=key,
                algorithms=["RS256"],
                audience=env("CLERK_FRONTEND_API_URL")
            )
        except Exception as e:
            return Response({"error": f"Invalid token: {str(e)}"}, status=403)
            

        # 3. Sync or create user
        data = request.data
        clerk_id = data.get("clerk_id")
        email = data.get("email")
        first_name = data.get("first_name", "")
        last_name = data.get("last_name", "")

        if not clerk_id or not email:
            return Response({"error": "Missing clerk_id or email"}, status=400)

        user, created = User.objects.update_or_create(
            clerk_id=clerk_id,
            defaults={
                "email": email,
                "first_name": first_name,
                "last_name": last_name,
            },
        )

        return Response({
            "success": True,
            "created": created,
            "user_id": user.id
        })







class OnboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
