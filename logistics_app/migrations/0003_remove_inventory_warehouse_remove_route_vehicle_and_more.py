# Generated by Django 5.1.7 on 2025-03-07 08:19

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logistics_app', '0002_rename_delivered_at_delivery_delivery_time_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='inventory',
            name='warehouse',
        ),
        migrations.RemoveField(
            model_name='route',
            name='vehicle',
        ),
        migrations.RenameField(
            model_name='order',
            old_name='created_at',
            new_name='order_date',
        ),
        migrations.RemoveField(
            model_name='order',
            name='customer_email',
        ),
        migrations.RemoveField(
            model_name='order',
            name='order_number',
        ),
        migrations.RemoveField(
            model_name='order',
            name='total_price',
        ),
        migrations.RemoveField(
            model_name='shipment',
            name='carrier',
        ),
        migrations.RemoveField(
            model_name='shipment',
            name='delivered_at',
        ),
        migrations.RemoveField(
            model_name='shipment',
            name='estimated_delivery',
        ),
        migrations.RemoveField(
            model_name='vehicle',
            name='last_maintenance',
        ),
        migrations.RemoveField(
            model_name='vehicle',
            name='plate_number',
        ),
        migrations.RemoveField(
            model_name='vehicle',
            name='type',
        ),
        migrations.RemoveField(
            model_name='warehouse',
            name='capacity',
        ),
        migrations.RemoveField(
            model_name='warehouse',
            name='location',
        ),
        migrations.AddField(
            model_name='order',
            name='warehouse',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='orders', to='logistics_app.warehouse'),
        ),
        migrations.AddField(
            model_name='shipment',
            name='delivered_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='shipment',
            name='shipped_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='shipment',
            name='vehicle',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='shipments', to='logistics_app.vehicle'),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='current_location',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='license_plate',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='warehouse',
            name='address',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='order',
            name='customer_name',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('shipped', 'Shipped'), ('delivered', 'Delivered'), ('canceled', 'Canceled')], max_length=20),
        ),
        migrations.AlterField(
            model_name='shipment',
            name='order',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='shipments', to='logistics_app.order'),
        ),
        migrations.AlterField(
            model_name='shipment',
            name='tracking_number',
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='vehicle',
            name='capacity',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='warehouse',
            name='name',
            field=models.CharField(max_length=255),
        ),
        migrations.CreateModel(
            name='ProofOfDelivery',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('delivered_by', models.CharField(max_length=255)),
                ('delivered_date', models.DateTimeField(auto_now_add=True)),
                ('signature', models.ImageField(upload_to='signatures/')),
                ('shipment', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='proof', to='logistics_app.shipment')),
            ],
        ),
        migrations.DeleteModel(
            name='Delivery',
        ),
        migrations.DeleteModel(
            name='Inventory',
        ),
        migrations.DeleteModel(
            name='Route',
        ),
    ]
