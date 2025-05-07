from rest_framework import generics
from api.serializers.user import AbstractUserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers.user import UserSerializer
from rest_framework import viewsets, permissions
import random

from ..models.category import Category
from ..models.user import User

def _generate_random_color(self):
    return "#{:06x}".format(random.randint(0, 0xFFFFFF))

class UserListView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = AbstractUserSerializer
    #permission_classes = [permissions.IsAuthenticated]

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = AbstractUserSerializer

# class SetupView(APIView):
#     def post(self, request, user_id):
#         # get init main currency
#         # get init additional currencies?
#         # get list of category objects.
#             # loop through each and create them.
#         # remember to set isNewUserFlag to false. and return the user.
#         try:
#             user = User.objects.get(id=user_id)
#         except User.DoesNotExist:
#             return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
#         pass




class SetupView(APIView):
    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        main_currency = request.data.get("main_currency")
        additional_currencies = request.data.get("additional_currencies", [])
        categories = request.data.get("categories", [])

        if not main_currency or not isinstance(main_currency, str):
            return Response({"detail": "main_currency is required and must be a string."},
                            status=status.HTTP_400_BAD_REQUEST)

        # if not isinstance(additional_currencies, list) or \
        #    not all(isinstance(cur, str) for cur in additional_currencies):
        #     return Response({"detail": "additional_currencies must be a list of strings."},
        #                     status=status.HTTP_400_BAD_REQUEST)
        
        if not isinstance(additional_currencies, list) or \
            not all(isinstance(cur, str) for cur in additional_currencies) or \
            main_currency in additional_currencies:
                return Response({"detail": "additional_currencies must be a list of strings and must not include the main_currency."}, 
                                status=status.HTTP_400_BAD_REQUEST)

        user.main_currency = main_currency
        user.additional_currencies = additional_currencies
        user.complete_setup = True
        user.save()

        for cat_data in categories:
            try:
                title = cat_data["title"]
                monthly_budget = cat_data["monthly_budget"]
                currency = cat_data.get("currency", main_currency)
                color = cat_data.get("color") or self._generate_random_color()
            except KeyError as e:
                return Response({"detail": f"Missing field in category: {e.args[0]}"},
                                status=status.HTTP_400_BAD_REQUEST)

            Category.objects.create(
                user=user,
                title=title,
                monthly_budget=monthly_budget,
                currency=currency,
                color=color
            )

        serializer = UserSerializer(user)

        return Response({
            "user": serializer.data,
        }, status=status.HTTP_200_OK)
    
        # return Response({
        #     "message": "Setup complete",
        #     "user": {
        #         "id": user.id,
        #         "email": user.email,
        #         "main_currency": user.main_currency,
        #         "additional_currencies": user.additional_currencies,
        #         "complete_setup": user.complete_setup
        #     }
        # }, status=status.HTTP_200_OK)
