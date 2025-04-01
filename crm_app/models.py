from django.db import models
from datetime import datetime



{"Client Database and Interaction Tracking Model"}
class Client(models.Model):
    client_id = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    status = models.CharField(max_length=10, choices=[('Prospect', 'Prospect'), ('New', 'New'), ('Regular', 'Regular'), ('Key', 'Key')])
    address = models.TextField(blank=True, null=True)  # New field for storing address

    def save(self, *args, **kwargs):
        if not self.client_id:
            last_client = Client.objects.order_by('-id').first()
            if last_client:
                last_id = int(last_client.client_id[2:])  # Extract numeric part
                new_id = f"24{last_id + 1:03d}"
            else:
                new_id = "24001"
            self.client_id = new_id
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.client_id} - {self.name}"

class ClientContact(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="contacts")
    contact_number = models.CharField(max_length=20)

    def __str__(self):
        return self.contact_number

class ClientEmail(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="client_emails")  # Renamed related_name
    email = models.EmailField()

    def __str__(self):
        return self.email
    




{"Customer Ticketing Support"}
class Ticket(models.Model):
    STATUS_CHOICES = [
        ('Open', 'Open'),
        ('In Progress', 'In Progress'),
        ('Closed', 'Closed'),
    ]

    PRIORITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Urgent', 'Urgent'),
    ]

    id = models.CharField(max_length=10, primary_key=True, unique=True)
    subject = models.CharField(max_length=255)
    description = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='Low')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='Open')
    created_at = models.DateTimeField(default=datetime.now)

    def save(self, *args, **kwargs):
        if not self.id:
            last_ticket = Ticket.objects.order_by('-id').first()
            last_id = int(last_ticket.id.split('-')[1]) if last_ticket else 24000
            self.id = f'CS-{last_id + 1}'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id} - {self.subject}"