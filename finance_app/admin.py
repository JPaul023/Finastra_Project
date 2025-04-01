from django.contrib import admin
from .models import Income, Expense, ReportHistory

@admin.register(Income)
class IncomeAdmin(admin.ModelAdmin):
    list_display = ('source', 'amount', 'date', 'category', 'reference_number')
    list_filter = ('category', 'date')
    search_fields = ('source', 'description', 'reference_number')
    date_hierarchy = 'date'

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('payee', 'amount', 'date', 'category', 'payment_method', 'expense_type')
    list_filter = ('category', 'payment_method', 'expense_type', 'date')
    search_fields = ('payee', 'description')
    date_hierarchy = 'date'

@admin.register(ReportHistory)
class ReportHistoryAdmin(admin.ModelAdmin):
    list_display = ('report_name', 'report_type', 'start_date', 'end_date', 'created_at')
    list_filter = ('report_type', 'created_at')
    search_fields = ('report_name', 'report_summary')
    date_hierarchy = 'created_at'