from rest_framework import viewsets, status
from .models import Order, Shipment, Vehicle, Warehouse, ProofOfDelivery
from .serializers import OrderSerializer, ShipmentSerializer, VehicleSerializer, WarehouseSerializer, ProofOfDeliverySerializer
from rest_framework.decorators import action
from rest_framework.response import Response

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
    queryset = Shipment.objects.select_related('order')
    serializer_class = ShipmentSerializer

    @action(detail=False, methods=["post"])
    def ship_order(self, request):
        """Creates a shipment and updates order status to 'shipped'"""
        order_id = request.data.get("order")
        vehicle_id = request.data.get("vehicle", None)

        try:
            order = Order.objects.get(id=order_id)
            if order.status == "shipped":
                return Response({"error": "Order is already shipped"}, status=status.HTTP_400_BAD_REQUEST)

            shipment = Shipment.objects.create(order=order, vehicle_id=vehicle_id)
            order.status = "shipped"
            order.save()

            return Response({
                "message": "Order shipped successfully",
                "shipment": ShipmentSerializer(shipment).data
            })
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ProofOfDeliveryViewSet(viewsets.ModelViewSet):
    queryset = ProofOfDelivery.objects.all()
    serializer_class = ProofOfDeliverySerializer