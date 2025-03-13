from django.utils import timezone  #
from django.db import models

class Employee(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    position = models.CharField(max_length=100)
    department = models.CharField(max_length=100)  # ✅ Added department
    date_hired = models.DateField(default=timezone.now)  # ✅ FIXED: Auto-fill if missing
    salary = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Payroll(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name="payroll")
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    bonuses = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True)
    payment_date = models.DateField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.net_salary = self.basic_salary + self.bonuses - self.deductions
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Payroll for {self.employee.first_name} {self.employee.last_name}"
