import datetime
from datetime import datetime

import environ
import jwt
import pytz
import requests
from ..models.user import User
from django.core.cache import cache
from jwt.algorithms import RSAAlgorithm
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import json
env = environ.Env()

CLERK_API_URL = "https://api.clerk.com/v1"
CLERK_FRONTEND_API_URL = env("CLERK_FRONTEND_API_URL")
CLERK_SECRET_KEY = env("CLERK_SECRET_KEY")
CACHE_KEY = "jwks_data"


class JWTAuthenticationMiddleware(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return None
        try:
            token = auth_header.split(" ")[1]
        except IndexError:
            raise AuthenticationFailed("Bearer token not provided.")
        user = self.decode_jwt(token)
        clerk = ClerkSDK()
        #info, found = clerk.fetch_user_info(user.username)
        info, found = clerk.fetch_user_info(user.clerk_id)
        if not user:
            return None
        else:
            if found:
                user.email = info["email_address"]
                user.first_name = info["first_name"]
                user.last_name = info["last_name"]
                # user.last_login = info["last_login"]
            user.save()

        return user, None

    def decode_jwt(self, token):
        clerk = ClerkSDK()
        # jwks_data = clerk.get_jwks()
        # print(jwks_data)
        # public_key = RSAAlgorithm.from_jwk(jwks_data["keys"][0])
        headers = jwt.get_unverified_header(token)
        print(f"JWT Header: {headers}")
        print(token)
        jwks = clerk.get_jwks()["keys"]
        print(f"JWKS: {jwks}")
        jwk = next(j for j in jwks if j["kid"] == headers["kid"])
        public_key = RSAAlgorithm.from_jwk(json.dumps(jwk))
        try:
            payload = jwt.decode(
                token,
                public_key,
                algorithms=["RS256"],
                leeway=300,
                # options={"verify_signature": True},
                # issuer=CLERK_FRONTEND_API_URL,
            )
        except jwt.ExpiredSignatureError:
            print("EXPIRED")
            raise AuthenticationFailed("Token has expired.")
        except jwt.DecodeError as e:
            print("DECODE")
            raise AuthenticationFailed("Token decode error.")
        # except jwt.InvalidTokenError:
        #     print("INVALID")
        #     raise AuthenticationFailed("Invalid token.")

        user_id = payload.get("sub")
        if user_id:
            user, created = User.objects.select_for_update().get_or_create(clerk_id=user_id)
            if created:
                user.clerk_id = user_id  # Add this if creating new users
            user._was_created = created  # temporary flag for user object
            return user
        return None

class ClerkSDK:
    def fetch_user_info(self, user_id: str):
        response = requests.get(
            f"{CLERK_API_URL}/users/{user_id}",
            headers={"Authorization": f"Bearer {CLERK_SECRET_KEY}"},
        )
        if response.status_code == 200:
            data = response.json()
            return {
                "email_address": data["email_addresses"][0]["email_address"],
                "first_name": data["first_name"],
                "last_name": data["last_name"],
                # "last_login": datetime.datetime.fromtimestamp(
                #     data["last_sign_in_at"] / 1000, tz=pytz.UTC
                # ),
            }, True
        else:
            return {
                "email_address": "",
                "first_name": "",
                "last_name": "",
                # "last_login": None,
            }, False

    def get_jwks(self):
        jwks_data = cache.get(CACHE_KEY)
        if not jwks_data:
            response = requests.get(f"{CLERK_FRONTEND_API_URL}/.well-known/jwks.json")
            if response.status_code == 200:
                jwks_data = response.json()
                cache.set(CACHE_KEY, jwks_data)  # cache indefinitely
            else:
                raise AuthenticationFailed("Failed to fetch JWKS.")
        return jwks_data