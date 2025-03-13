from rest_framework import viewsets
from .models import Order, Shipment, Vehicle, Warehouse, ProofOfDelivery
from .serializers import OrderSerializer, ShipmentSerializer, VehicleSerializer, WarehouseSerializer, ProofOfDeliverySerializer

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class ShipmentViewSet(viewsets.ModelViewSet):
    queryset = Shipment.objects.all()
    serializer_class = ShipmentSerializer


class ProofOfDeliveryViewSet(viewsets.ModelViewSet):
    queryset = ProofOfDelivery.objects.all()
    serializer_class = ProofOfDeliverySerializer