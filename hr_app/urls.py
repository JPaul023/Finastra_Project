from django.urls import path
from .views import EmployeeListCreateView, EmployeeDetailView
from .views import PayrollListCreateView, PayrollDetailView

urlpatterns = [
    path("api/employees/", EmployeeListCreateView.as_view(), name="employee-list-create"),
    path("api/employees/<int:pk>/", EmployeeDetailView.as_view(), name="employee-detail"),
    path("api/payroll/", PayrollListCreateView.as_view(), name="payroll-list-create"),
    path("api/payroll/<int:pk>/", PayrollDetailView.as_view(), name="payroll-detail"),
]
