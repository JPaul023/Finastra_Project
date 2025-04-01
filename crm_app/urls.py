from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, ClientContactViewSet, ClientEmailViewSet
from .views import ticket_list_create, ticket_detail

router = DefaultRouter()
router.register(r'clients', ClientViewSet)
router.register(r'contacts', ClientContactViewSet)
router.register(r'emails', ClientEmailViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('tickets/', ticket_list_create, name='ticket-list'),
    path('tickets/<str:ticket_id>/', ticket_detail, name='ticket-detail'),
]
