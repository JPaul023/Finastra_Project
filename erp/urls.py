# erp/urls.py
from django.contrib import admin
from django.urls import path, include
# from django.shortcuts import redirect
# from logistics_app.views import logisticsHome

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include("users.urls")), # Include the users app's URLs
    path('logistics/api/', include('logistics_app.urls')),
    path('hr/', include('hr_app.urls')),
    path('api/finance/', include('finance_app.urls')),
]
