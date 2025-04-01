from rest_framework import serializers
from .models import Client, ClientContact, ClientEmail
from .models import Ticket

{"Customer Database and Interaction Tracking"}
class ClientContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientContact
        fields = '__all__'
class ClientEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientEmail
        fields = '__all__'
class ClientSerializer(serializers.ModelSerializer):
    contacts = ClientContactSerializer(many=True, read_only=True)
    emails = ClientEmailSerializer(many=True, read_only=True)
    class Meta:
        model = Client
        fields = '__all__'



{"Customer Ticketing Support"}
class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'


