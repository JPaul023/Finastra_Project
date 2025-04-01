from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, ShipmentViewSet, WarehouseViewSet, VehicleViewSet, ProofOfDeliveryViewSet

router = DefaultRouter()
router.register(r'warehouses', WarehouseViewSet)
router.register(r'vehicles', VehicleViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'shipments', ShipmentViewSet)
router.register(r'proof-of-delivery', ProofOfDeliveryViewSet) 

urlpatterns = [
    path('', include(router.urls)),
]