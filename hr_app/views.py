from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from .models import Attendance, Candidate, Employee, Leave, Payroll  # ✅ Fixed model reference
from .serializers import AttendanceSerializer, CandidateSerializer, EmployeeSerializer, LeaveSerializer, PayrollSerializer
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Employee
from .serializers import EmployeeSerializer


# ✅ List & Create Employees
class EmployeeListCreateView(generics.ListCreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

    def create(self, request, *args, **kwargs):
        print("Received Data:", request.data)  # 🔍 Debugging: Prints the incoming request data
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Validation Errors:", serializer.errors)  # 🔍 Debugging: Prints validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Retrieve, Update, Delete Employee
class EmployeeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

# ✅ List & Create Payroll Records
class PayrollListCreateView(generics.ListCreateAPIView):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer

# ✅ Retrieve, Update, Delete Payroll Record
class PayrollDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer

# Fetch all UNEVALUATED employees
@api_view(['GET'])
def get_unevaluated_employees(request):
    employees = Employee.objects.filter(evaluated=False)
    serializer = EmployeeSerializer(employees, many=True)
    return Response(serializer.data)

# Fetch all EVALUATED employees
@api_view(['GET'])
def get_evaluated_employees(request):
    employees = Employee.objects.filter(evaluated=True)
    serializer = EmployeeSerializer(employees, many=True)
    return Response(serializer.data)

# Submit Performance Evaluation
@api_view(['POST'])
def evaluate_employee(request, employee_id):
    try:
        employee = Employee.objects.get(id=employee_id)
        performance_score = request.data.get('performance_score')

        if performance_score is not None:
            employee.performance_score = performance_score
            employee.evaluated = True
            employee.save()
            return Response({"message": "Employee evaluated successfully"}, status=200)
        else:
            return Response({"error": "Performance score is required"}, status=400)
    except Employee.DoesNotExist:
        return Response({"error": "Employee not found"}, status=404)
    
@api_view(['PUT'])
def edit_performance_score(request, employee_id):
    try:
        employee = Employee.objects.get(id=employee_id)
        performance_score = request.data.get('performance_score')

        if performance_score is not None:
            employee.performance_score = performance_score
            employee.save()
            return Response({"message": "Performance score updated successfully"}, status=200)
        else:
            return Response({"error": "Performance score is required"}, status=400)
    except Employee.DoesNotExist:
        return Response({"error": "Employee not found"}, status=404)
    
@api_view(['PUT'])
def reset_employee_evaluation(request, employee_id):
    try:
        employee = Employee.objects.get(id=employee_id)
        employee.performance_score = None
        employee.evaluated = False
        employee.save()
        return Response({"message": "Evaluation reset successfully"}, status=200)
    except Employee.DoesNotExist:
        return Response({"error": "Employee not found"}, status=404)


# ✅ List & Create Attendance Records
class AttendanceListCreateView(generics.ListCreateAPIView):
    queryset = Attendance.objects.all().order_by('-date')
    serializer_class = AttendanceSerializer

    def create(self, request, *args, **kwargs):
        employee_id = request.data.get('employee')
        status_value = request.data.get('status')
        time_value = request.data.get('time', "09:00:00")  # Default if not provided

        try:
            employee = Employee.objects.get(id=employee_id)
            attendance = Attendance.objects.create(
                employee=employee,
                status=status_value,
                time=time_value
            )
            serializer = AttendanceSerializer(attendance)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Retrieve, Update, Delete a specific attendance record
class AttendanceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

# ✅ Fetch attendance records for a specific employee
@api_view(['GET'])
def get_employee_attendance(request, employee_id):
    attendance_records = Attendance.objects.filter(employee_id=employee_id).order_by('-date')
    serializer = AttendanceSerializer(attendance_records, many=True)
    return Response(serializer.data)

# ✅ Edit Attendance Record
@api_view(['PUT'])
def edit_attendance(request, attendance_id):
    try:
        attendance = Attendance.objects.get(id=attendance_id)
    except Attendance.DoesNotExist:
        return Response({"error": "Attendance record not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = AttendanceSerializer(attendance, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LeaveListCreateView(generics.ListCreateAPIView):
    serializer_class = LeaveSerializer

    def get_queryset(self):
        return Leave.objects.select_related('employee').all()

    def perform_create(self, serializer):
        employee = serializer.validated_data['employee']
        used_leaves = Leave.objects.filter(employee=employee, leave_type='Sick').count()
        remaining_leaves = max(20 - used_leaves, 0)

        # Don't pass `remaining_leaves` because it's not a model field
        serializer.save()


class LeaveDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LeaveSerializer

    def get_queryset(self):
        return Leave.objects.select_related('employee').all()

    def perform_update(self, serializer):
        leave = serializer.instance
        employee = leave.employee
        used_leaves = Leave.objects.filter(employee=employee, leave_type='Sick').exclude(id=leave.id).count()
        remaining_leaves = max(20 - used_leaves, 0)

        serializer.save(remaining_leaves=remaining_leaves)


class CandidateListCreateView(generics.ListCreateAPIView):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer

class CandidateDetailView(generics.RetrieveUpdateDestroyAPIView):  # <-- This must exist!
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer


