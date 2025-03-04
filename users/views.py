# users/views.py
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from .forms import CustomUserCreationForm

def register_request(request):
    if request.method == "POST":
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect("dashboard")  # Redirect to dashboard after registration
    else:
        form = CustomUserCreationForm()
    return render(request, "users/register.html", {"form": form})

def login_request(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect("dashboard") # Redirect to dashboard after login
            else:
                return render(request, "users/login.html", {"form": form, "error": "Invalid username or password"})
    else:
        form = AuthenticationForm()
    return render(request, "users/login.html", {"form": form})

@login_required(login_url="/login")
def dashboard(request):
    return render(request, "users/dashboard.html", {"user": request.user})

def logout_request(request):
    logout(request)
    return redirect("login") # Redirect to login page after logout

def index(request):
    return redirect('login')
