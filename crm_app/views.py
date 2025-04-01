from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Ticket
from .serializers import TicketSerializer

# Create your views here.
from rest_framework import viewsets
from .models import Client, ClientContact, ClientEmail
from .serializers import ClientSerializer, ClientContactSerializer, ClientEmailSerializer

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

class ClientContactViewSet(viewsets.ModelViewSet):
    queryset = ClientContact.objects.all()
    serializer_class = ClientContactSerializer

class ClientEmailViewSet(viewsets.ModelViewSet):
    queryset = ClientEmail.objects.all()
    serializer_class = ClientEmailSerializer


@api_view(["GET", "POST"])  # Ensure this decorator is present
def ticket_list_create(request):  # Ensure correct indentation
    if request.method == 'GET':
        tickets = Ticket.objects.all()
        serializer = TicketSerializer(tickets, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = TicketSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    
@api_view(['GET', 'PUT', 'DELETE'])
def ticket_detail(request, ticket_id):
    try:
        ticket = Ticket.objects.get(id=ticket_id)
    except Ticket.DoesNotExist:
        return Response({'error': 'Ticket not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TicketSerializer(ticket)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = TicketSerializer(ticket, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        ticket.delete()
        return Response({'message': 'Ticket deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
