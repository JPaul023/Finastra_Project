# Generated by Django 5.1.7 on 2025-03-13 08:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hr_app', '0003_remove_employee_phone_employee_date_hired_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='payroll',
            old_name='other_deductions',
            new_name='deductions',
        ),
        migrations.RenameField(
            model_name='payroll',
            old_name='pay_date',
            new_name='payment_date',
        ),
        migrations.RemoveField(
            model_name='payroll',
            name='tax_deduction',
        ),
        migrations.AlterField(
            model_name='employee',
            name='first_name',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='employee',
            name='last_name',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='employee',
            name='phone_number',
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
        migrations.AlterField(
            model_name='employee',
            name='salary',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
        migrations.AlterField(
            model_name='payroll',
            name='net_salary',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10),
        ),
    ]
