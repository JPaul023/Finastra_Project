from rest_framework import viewsets, status
from .models import Order, Shipment, Vehicle, Warehouse, ProofOfDelivery
from .serializers import OrderSerializer, ShipmentSerializer, VehicleSerializer, WarehouseSerializer, ProofOfDeliverySerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
import logging

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


logger = logging.getLogger(__name__)

class ProofOfDeliveryViewSet(viewsets.ModelViewSet):
    queryset = ProofOfDelivery.objects.all()
    serializer_class = ProofOfDeliverySerializer

    def retrieve(self, request, *args, **kwargs):
        """Fetch proof of delivery with additional order details"""
        instance = self.get_object()
        data = self.get_serializer(instance).data  # Serialize proof of delivery

        # Fetch related details without modifying serializer
        if instance.shipment and instance.shipment.order:
            order = instance.shipment.order
            data["customer_name"] = order.customer_name if order else "N/A"
            data["order_number"] = order.order_number if order else "N/A"
            data["warehouse_name"] = order.warehouse.name if order.warehouse else "N/A"
            data["vehicle_plate"] = order.vehicle.license_plate if order.vehicle else "N/A"

        return Response(data)

    @action(detail=False, methods=["post"])
    def submit(self, request):
        """Handles proof of delivery submission and updates order status"""
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            proof = serializer.save()
            
            # Fetch the associated shipment and order
            shipment = proof.shipment
            order = shipment.order if shipment else None

            # Update order and shipment status
            if proof.failed_reason:
                shipment.status = "failed"
                if order:
                    order.status = "failed"
            else:
                shipment.status = "delivered"
                if order:
                    order.status = "delivered"

            # Log before saving
            logger.info(f"Updating shipment {shipment.id} status to {shipment.status}")
            if order:
                logger.info(f"Updating order {order.id} status to {order.status}")

            with transaction.atomic():  # Ensures changes are saved together
                shipment.save()
                if order:
                    order.save()

            return Response({"message": "Proof of delivery submitted successfully."}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  