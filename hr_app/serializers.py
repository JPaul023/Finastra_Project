from rest_framework import serializers
from .models import Candidate, Employee, Leave, Payroll  # ✅ Fixed import
from rest_framework import serializers
from .models import Attendance

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

class PayrollSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField(source="employee.__str__")

    class Meta:
        model = Payroll
        fields = "__all__"

class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.first_name', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'employee', 'employee_name', 'date', 'status', 'time']

class LeaveSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    remaining_leaves = serializers.SerializerMethodField()

    class Meta:
        model = Leave
        fields = ['id', 'employee', 'employee_name', 'date', 'reason', 'leave_type', 'remaining_leaves']

    def get_employee_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"

    def get_remaining_leaves(self, obj):
        used_leaves = Leave.objects.filter(employee=obj.employee, leave_type='Sick').count()
        return max(20 - used_leaves, 0)

class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = '__all__'

