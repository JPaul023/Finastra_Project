from django.db import models
import uuid
from django.utils.crypto import get_random_string
from decimal import Decimal
from django.utils.timezone import now
from django.core.exceptions import ValidationError

class Warehouse(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name


class Vehicle(models.Model):
    license_plate = models.CharField(max_length=20, null=True, blank=True)
    capacity = models.IntegerField()
    current_location = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.license_plate

class Order(models.Model):
    customer_name = models.CharField(max_length=255)
    warehouse = models.ForeignKey('Warehouse', related_name='orders', on_delete=models.CASCADE, null=True, blank=True)
    vehicle = models.ForeignKey('Vehicle', related_name='orders', on_delete=models.CASCADE, null=True, blank=True)
    category = models.ForeignKey('inventory_app.Category', related_name='orders', on_delete=models.CASCADE, null=True, blank=True)
    item = models.ForeignKey('inventory_app.Item', related_name='orders', on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('canceled', 'Canceled'),
    ])
    order_number = models.CharField(max_length=20, unique=True, blank=True, default=None, null=True)
    delivery_address = models.TextField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = self.generate_order_number()
        super().save(*args, **kwargs)

    def generate_order_number(self):
        """Generate a unique order number with format 'OTN-000001'."""
        last_order = Order.objects.order_by('-id').first()
        if last_order and last_order.order_number:
            last_number = int(last_order.order_number.split('-')[-1])
            new_number = last_number + 1
        else:
            new_number = 1
        return f"OTN-{new_number:06d}"

    def __str__(self):
        return f"{self.customer_name} - {self.order_number}"


class Shipment(models.Model):
    order = models.ForeignKey('Order', related_name='shipments', on_delete=models.CASCADE)
    vehicle = models.ForeignKey('Vehicle', related_name='shipments', on_delete=models.CASCADE, null=True, blank=True)
    tracking_number = models.CharField(max_length=100, unique=True, editable=False, default=None)
    shipped_date = models.DateTimeField(null=True, blank=True)
    delivered_date = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.tracking_number:
            self.tracking_number = str(uuid.uuid4().hex[:12]).upper()  # Generate a 12-character unique ID

        # Set shipped_date if it's not already set
        if not self.shipped_date:
            self.shipped_date = now()

        super().save(*args, **kwargs)

    def __str__(self):
        return self.tracking_number

class ProofOfDelivery(models.Model):
    DELIVERY_STATUS_CHOICES = [
        ('delivered', 'Delivered'),
        ('failed', 'Failed Delivery'),
    ]

    PAYMENT_MODE_CHOICES = [
        ('cash', 'Cash'),
        ('card', 'Credit/Debit Card'),
        ('online', 'Online Payment'),
        ('cod', 'Cash on Delivery'),
        ('other', 'Other'),
    ]

    shipment = models.OneToOneField(Shipment, related_name='proof', on_delete=models.CASCADE)
    delivered_by = models.CharField(max_length=255)
    delivered_date = models.DateTimeField(auto_now_add=True)
    signature = models.ImageField(upload_to='signatures/')
    delivery_status = models.CharField(max_length=10, choices=DELIVERY_STATUS_CHOICES, default='delivered')
    proof_photo = models.ImageField(upload_to='proof_photos/', blank=True, null=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    payment_mode = models.CharField(max_length=10, choices=PAYMENT_MODE_CHOICES, blank=True, null=True)
    failed_reason = models.TextField(blank=True, null=True)

    def clean(self):
        """Ensure 'failed_reason' is required if delivery was unsuccessful."""
        if self.delivery_status == 'failed' and not self.failed_reason:
            raise ValidationError({'failed_reason': 'Reason for failed delivery is required.'})

    def __str__(self):
        return f"Proof of Delivery for {self.shipment.tracking_number}"
