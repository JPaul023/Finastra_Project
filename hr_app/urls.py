from django.urls import path
from .views import AttendanceDetailView, AttendanceListCreateView, CandidateDetailView, CandidateListCreateView, EmployeeListCreateView, EmployeeDetailView, LeaveDetailView, LeaveListCreateView, edit_attendance, edit_performance_score, get_employee_attendance, reset_employee_evaluation
from .views import PayrollListCreateView, PayrollDetailView
from .views import get_unevaluated_employees, get_evaluated_employees, evaluate_employee

urlpatterns = [
    path("api/employees/", EmployeeListCreateView.as_view(), name="employee-list-create"),
    path("api/employees/<int:pk>/", EmployeeDetailView.as_view(), name="employee-detail"),
    path("api/payroll/", PayrollListCreateView.as_view(), name="payroll-list-create"),
    path("api/payroll/<int:pk>/", PayrollDetailView.as_view(), name="payroll-detail"),
    path('api/unevaluated-employees/', get_unevaluated_employees, name='unevaluated-employees'),
    path('api/evaluated-employees/', get_evaluated_employees, name='evaluated-employees'),
    path('api/evaluate-employee/<int:employee_id>/', evaluate_employee, name='evaluate-employee'),
    path('api/edit-performance/<int:employee_id>/', edit_performance_score, name='edit-performance'),
    path('api/reset-evaluation/<int:employee_id>/', reset_employee_evaluation, name='reset-evaluation'),
    
    path("api/attendance/", AttendanceListCreateView.as_view(), name="attendance-list-create"),
    path("api/attendance/<int:pk>/", AttendanceDetailView.as_view(), name="attendance-detail"),
    path("api/attendance/employee/<int:employee_id>/", get_employee_attendance, name="employee-attendance"),
    path("api/attendance/edit/<int:attendance_id>/", edit_attendance, name="edit-attendance"),

    path("api/leave/", LeaveListCreateView.as_view(), name="leave-list-create"),
    path("api/leave/<int:pk>/", LeaveDetailView.as_view(), name="leave-detail"),

    path('api/candidates/', CandidateListCreateView.as_view(), name='candidate-list-create'),
    path('api/candidates/<int:pk>/', CandidateDetailView.as_view(), name='candidate-detail'),
    
]
