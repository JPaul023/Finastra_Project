# inventory/tests.py
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Category, Item
import uuid

class CategoryAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category_data = {
            'name': 'Test Category',
            'description': 'Test Description'
        }
        self.category = Category.objects.create(
            name='Existing Category',
            description='Existing Description'
        )

    def test_create_category(self):
        response = self.client.post(
            '/api/inventory/categories/',
            self.category_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 2)

    def test_get_categories(self):
        response = self.client.get('/api/inventory/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_category_detail(self):
        response = self.client.get(f'/api/inventory/categories/{self.category.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Existing Category')

    def test_update_category(self):
        response = self.client.put(
            f'/api/inventory/categories/{self.category.id}/',
            {'name': 'Updated Category', 'description': 'Updated Description'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.category.refresh_from_db()
        self.assertEqual(self.category.name, 'Updated Category')

    def test_delete_category(self):
        response = self.client.delete(f'/api/inventory/categories/{self.category.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Category.objects.count(), 0)

class ItemAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(
            name='Test Category',
            description='Test Description'
        )
        self.item_data = {
            'item_no': 'ITEM001',
            'name': 'Test Item',
            'category': self.category.id,
            'price': '19.99',
            'stock_quantity': 10,
            'description': 'Test Description'
        }
        self.item = Item.objects.create(
            item_no='ITEM002',
            name='Existing Item',
            category=self.category,
            price='29.99',
            stock_quantity=5
        )

    def test_create_item(self):
        response = self.client.post(
            '/api/inventory/items/',
            self.item_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Item.objects.count(), 2)

    def test_get_items(self):
        response = self.client.get('/api/inventory/items/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_item_detail(self):
        response = self.client.get(f'/api/inventory/items/{self.item.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Existing Item')

    def test_update_item(self):
        response = self.client.put(
            f'/api/inventory/items/{self.item.id}/',
            {
                'item_no': 'ITEM002',
                'name': 'Updated Item',
                'category': self.category.id,
                'price': '39.99',
                'stock_quantity': 15,
                'description': 'Updated Description'
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.item.refresh_from_db()
        self.assertEqual(self.item.name, 'Updated Item')
        self.assertEqual(self.item.price, 39.99)

    def test_delete_item(self):
        response = self.client.delete(f'/api/inventory/items/{self.item.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Item.objects.count(), 0)

    def test_filter_by_category(self):
        # Create another category and item
        category2 = Category.objects.create(name='Category 2')
        Item.objects.create(
            item_no='ITEM003',
            name='Item in Category 2',
            category=category2,
            price='49.99',
            stock_quantity=20
        )
        
        # Check filtering works
        response = self.client.get(f'/api/inventory/items/?category={self.category.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Existing Item')