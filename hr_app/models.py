from django.utils import timezone
from django.db import models
from datetime import time

class Employee(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    position = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    date_hired = models.DateField()
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Performance-related fields
    evaluated = models.BooleanField(default=False)
    performance_score = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Payroll(models.Model):  # ✅ Keeping payroll unchanged
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
    
class Attendance(models.Model):
    STATUS_CHOICES = [
        ('Present', 'Present'),
        ('Absent', 'Absent'),
        ('Late', 'Late'),
    ]

    employee = models.ForeignKey(
        'Employee', 
        on_delete=models.CASCADE, 
        related_name='attendance_records'
    )
    date = models.DateField(auto_now_add=True)
    status = models.CharField(
        max_length=10, 
        choices=STATUS_CHOICES, 
        default='Present'
    )
    time = models.TimeField(default=time(9, 0))  # Default to 09:00 AM

    def __str__(self):
        return f"{self.employee.first_name} {self.employee.last_name} - {self.date} - {self.status} - {self.time}"
    
class Leave(models.Model):
    LEAVE_TYPES = [
        ('Sick', 'Sick Leave'),
        ('Vacation', 'Vacation Leave'),
        ('Emergency', 'Emergency Leave'),
    ]

    employee = models.ForeignKey('Employee', on_delete=models.CASCADE, related_name='leave_records')
    date = models.DateField()
    reason = models.TextField()
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPES, default='Sick')
    remaining_leaves = models.IntegerField(default=20)  # Stores remaining sick leaves

    def save(self, *args, **kwargs):
        if self.leave_type == 'Sick':
            used_leaves = Leave.objects.filter(employee=self.employee, leave_type='Sick').count()
            self.remaining_leaves = max(20 - used_leaves, 0)  # Store remaining leaves

            if used_leaves >= 20:
                raise ValueError("Cannot take more than 20 sick leaves.")

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.employee.first_name} {self.employee.last_name} - {self.date} - {self.leave_type} (Remaining: {self.remaining_leaves})"
    
class Candidate(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Hired', 'Hired'),
        ('Rejected', 'Rejected'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    position_applied = models.CharField(max_length=100)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')
    date_applied = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.position_applied} ({self.status})"
