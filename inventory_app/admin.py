# inventory/admin.py
from django.contrib import admin
from .models import Category, Item

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name',)

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('item_no', 'name', 'category', 'price', 'stock_quantity', 'created_at', 'updated_at')
    list_filter = ('category',)
    search_fields = ('item_no', 'name', 'description')