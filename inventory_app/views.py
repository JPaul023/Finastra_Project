# inventory/views.py
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from .models import Category, Item
from .serializers import CategorySerializer, ItemSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    @action(detail=True, methods=['get'])
    def items(self, request, pk=None):
        """Get all items for a specific category"""
        category = self.get_object()
        items = Item.objects.filter(category=category)
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    
    def get_queryset(self):
        """Allow filtering by category"""
        queryset = Item.objects.all()
        category_id = self.request.query_params.get('category', None)
        if category_id:
            queryset = queryset.filter(category__id=category_id)
        return queryset