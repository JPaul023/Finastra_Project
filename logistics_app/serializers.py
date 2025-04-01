from rest_framework import serializers
from .models import Order, Shipment, Vehicle, Warehouse, ProofOfDelivery

class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = '__all__'


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    warehouse = WarehouseSerializer(read_only=True) 
    vehicle = VehicleSerializer(read_only=True) 

    class Meta:
        model = Order
        fields = '__all__'


class ShipmentSerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only=True)

    class Meta:
        model = Shipment
        fields = '__all__'


class ProofOfDeliverySerializer(serializers.ModelSerializer):

    class Meta:
        model = ProofOfDelivery
        fields = '__all__'
    
    def validate(self, data):
        """
        Validate that failed deliveries include a reason
        """
        if data.get('delivery_status') == 'failed' and not data.get('failed_reason'):
            raise serializers.ValidationError({"failed_reason": "Reason is required for failed deliveries"})
        return data