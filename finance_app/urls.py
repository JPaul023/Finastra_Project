from django.urls import path
from . import views

urlpatterns = [
    path('incomes/', views.income_list_create, name='income-list-create'),
    path('incomes/<int:pk>/', views.income_detail, name='income-detail'),
    path('expenses/', views.expense_list_create, name='expense-list-create'),
    path('expenses/<int:pk>/', views.expense_detail, name='expense-detail'),
    path('summary/', views.financial_summary, name='financial-summary'),
    path('cash-flow/', views.cash_flow, name='cash-flow'),
    path('balance-sheet/', views.balance_sheet, name='balance-sheet'),
    path('reports/', views.financial_reports, name='financial-reports'),
    path('report-history/', views.report_history, name='report-history'),
    path('report-history/<int:pk>/', views.report_history_detail, name='report-history-detail'),
    path('test/', views.test_api, name='test-api'),
]