from rest_framework import serializers
from api.models.category import Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'user', 'title', 'monthly_budget', 'color', 'currency']
        # read_only_fields = ['id']
