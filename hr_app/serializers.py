from rest_framework import serializers
from .models import Employee
from .models import Payroll

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'  # ✅ Ensure this includes all fields

class PayrollSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField(source="employee.__str__")

    class Meta:
        model = Payroll
        fields = "__all__"
