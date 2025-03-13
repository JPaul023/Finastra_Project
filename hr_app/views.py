from rest_framework import generics
from .models import Employee
from .serializers import EmployeeSerializer
from .models import Payroll
from .serializers import PayrollSerializer
from rest_framework.response import Response  #
from rest_framework import status  # ✅ FIXED: Add this
from rest_framework.response import Response  # ✅ FIXED: Also add this

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


class PayrollListCreateView(generics.ListCreateAPIView):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer

class PayrollDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer
