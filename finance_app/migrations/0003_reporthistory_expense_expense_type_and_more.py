# Generated by Django 5.1.7 on 2025-04-01 09:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finance_app', '0002_delete_financialaccount'),
    ]

    operations = [
        migrations.CreateModel(
            name='ReportHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('report_name', models.CharField(max_length=255)),
                ('report_type', models.CharField(max_length=100)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('report_summary', models.TextField(blank=True, null=True)),
                ('report_data', models.JSONField(blank=True, default=dict)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddField(
            model_name='expense',
            name='expense_type',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='expense',
            name='payment_method',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='income',
            name='reference_number',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
