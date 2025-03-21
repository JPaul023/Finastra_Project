# users/urls.py
from django.urls import path, include
from . import views

urlpatterns = [
    path("register/", views.register_request, name="register"),
    path("login/", views.login_request, name="login"),
    path("logout/", views.logout_request, name="logout"),
    path("dashboard/", views.dashboard, name="dashboard"),
    path('', views.index, name='index'), # Map root URL to index view
]
