# inventory/serializers.py
from rest_framework import serializers
from .models import Category, Item

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class ItemSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    
    class Meta:
        model = Item
        fields = ['id', 'item_no', 'name', 'category', 'category_name', 'price', 
                 'description', 'stock_quantity', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']