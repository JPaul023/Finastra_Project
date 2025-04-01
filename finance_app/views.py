from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum
from datetime import date, timedelta, datetime
from dateutil.relativedelta import relativedelta
from django.db.models.functions import TruncMonth, TruncQuarter, TruncYear
from django.utils.dateparse import parse_date
import traceback

from .models import Income, Expense, ReportHistory
from .serializers import IncomeSerializer, ExpenseSerializer, ReportHistorySerializer

@api_view(['GET', 'POST'])
def income_list_create(request):
    if request.method == 'GET':
        try:
            incomes = Income.objects.all().order_by('-date')
            serializer = IncomeSerializer(incomes, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error fetching incomes: {str(e)}")
            return Response([])
    
    elif request.method == 'POST':
        try:
            print(f"Received income data: {request.data}")
            
            # Create a complete data object with reference_number
            income_data = {
                'source': request.data.get('source', 'Unknown'),
                'amount': request.data.get('amount', 0),
                'date': request.data.get('date'),
                'description': request.data.get('description', ''),
                'category': request.data.get('category', 'other_income'),
                'reference_number': request.data.get('reference_number', '')  # Added reference_number
            }
            
            # Validate data
            if not income_data['date']:
                return Response({"error": "Date is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                # Convert amount to float if it's a string
                if isinstance(income_data['amount'], str):
                    income_data['amount'] = float(income_data['amount'])
            except ValueError:
                return Response({"error": "Amount must be a valid number"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create serializer
            serializer = IncomeSerializer(data=income_data)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            print(f"Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            error_msg = f"Error creating income: {str(e)}"
            print(error_msg)
            traceback.print_exc()
            return Response({"error": error_msg}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT', 'DELETE'])
def income_detail(request, pk):
    try:
        income = Income.objects.get(pk=pk)
    except Income.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error retrieving income with pk={pk}: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if request.method == 'GET':
        serializer = IncomeSerializer(income)
        return Response(serializer.data)

    elif request.method == 'PUT':
        try:
            # Include reference_number in update data
            update_data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
            
            if 'reference_number' not in update_data and hasattr(income, 'reference_number'):
                update_data['reference_number'] = income.reference_number
                
            serializer = IncomeSerializer(income, data=update_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error updating income: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'DELETE':
        try:
            income.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print(f"Error deleting income: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'POST'])
def expense_list_create(request):
    if request.method == 'GET':
        try:
            expenses = Expense.objects.all().order_by('-date')
            serializer = ExpenseSerializer(expenses, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error fetching expenses: {str(e)}")
            return Response([])
    
    elif request.method == 'POST':
        try:
            print(f"Received expense data: {request.data}")
            
            # Create a complete data object with payment_method and expense_type
            expense_data = {
                'payee': request.data.get('payee', 'Unknown'),
                'amount': request.data.get('amount', 0),
                'date': request.data.get('date'),
                'description': request.data.get('description', ''),
                'category': request.data.get('category', 'operational_expenses'),
                'payment_method': request.data.get('payment_method', ''),  # Added payment_method
                'expense_type': request.data.get('expense_type', '')       # Added expense_type
            }
            
            # Validate data
            if not expense_data['date']:
                return Response({"error": "Date is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                # Convert amount to float if it's a string
                if isinstance(expense_data['amount'], str):
                    expense_data['amount'] = float(expense_data['amount'])
            except ValueError:
                return Response({"error": "Amount must be a valid number"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create serializer
            serializer = ExpenseSerializer(data=expense_data)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            print(f"Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            error_msg = f"Error creating expense: {str(e)}"
            print(error_msg)
            traceback.print_exc()
            return Response({"error": error_msg}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT', 'DELETE'])
def expense_detail(request, pk):
    try:
        expense = Expense.objects.get(pk=pk)
    except Expense.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error retrieving expense with pk={pk}: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if request.method == 'GET':
        serializer = ExpenseSerializer(expense)
        return Response(serializer.data)

    elif request.method == 'PUT':
        try:
            # Include payment_method and expense_type in update data
            update_data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
            
            if 'payment_method' not in update_data and hasattr(expense, 'payment_method'):
                update_data['payment_method'] = expense.payment_method
            if 'expense_type' not in update_data and hasattr(expense, 'expense_type'):
                update_data['expense_type'] = expense.expense_type
                
            serializer = ExpenseSerializer(expense, data=update_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error updating expense: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'DELETE':
        try:
            expense.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print(f"Error deleting expense: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def financial_summary(request):
    try:
        # Get time range from query params
        time_range = request.query_params.get('timeRange', '3months')
        
        # Calculate date ranges based on time_range
        today = date.today()
        if time_range == '30days':
            start_date = today - timedelta(days=30)
        elif time_range == '3months':
            start_date = today - timedelta(days=90)
        elif time_range == '6months':
            start_date = today - timedelta(days=180)
        elif time_range == '1year':
            start_date = today - timedelta(days=365)
        else:
            # Default to current month
            start_date = today.replace(day=1)
        
        end_date = today
        
        # Get previous period for comparison
        period_length = (end_date - start_date).days
        prev_start_date = start_date - timedelta(days=period_length)
        prev_end_date = start_date - timedelta(days=1)
        
        # Calculate current period totals
        total_income = Income.objects.filter(date__range=[start_date, end_date]).aggregate(total=Sum('amount'))['total'] or 0
        total_expenses = Expense.objects.filter(date__range=[start_date, end_date]).aggregate(total=Sum('amount'))['total'] or 0
        net_income = total_income - total_expenses
        
        # Calculate previous period totals for comparison
        prev_income = Income.objects.filter(date__range=[prev_start_date, prev_end_date]).aggregate(total=Sum('amount'))['total'] or 0
        prev_expenses = Expense.objects.filter(date__range=[prev_start_date, prev_end_date]).aggregate(total=Sum('amount'))['total'] or 0
        prev_profit = prev_income - prev_expenses
        
        # Calculate percent changes
        income_change = ((total_income - prev_income) / prev_income * 100) if prev_income else 0
        expense_change = ((total_expenses - prev_expenses) / prev_expenses * 100) if prev_expenses else 0
        profit_change = ((net_income - prev_profit) / prev_profit * 100) if prev_profit else 0
        
        # Get income by category
        income_by_category = []
        income_categories = Income.objects.filter(date__range=[start_date, end_date]).values('category').annotate(total=Sum('amount'))
        for category in income_categories:
            income_by_category.append({
                'category': category['category'],
                'amount': category['total']
            })
        
        # Get expenses by category
        expenses_by_category = []
        expense_categories = Expense.objects.filter(date__range=[start_date, end_date]).values('category').annotate(total=Sum('amount'))
        for category in expense_categories:
            expenses_by_category.append({
                'category': category['category'],
                'amount': category['total']
            })
        
        data = {
            'totalIncome': total_income,
            'totalExpenses': total_expenses,
            'netIncome': net_income,
            'incomeByCategory': income_by_category,
            'expensesByCategory': expenses_by_category,
            'comparisonToPreviousPeriod': {
                'income': income_change,
                'expenses': expense_change,
                'profit': profit_change
            },
            'timeRange': time_range,
            'startDate': start_date.isoformat(),
            'endDate': end_date.isoformat()
        }
        
        return Response(data)
    except Exception as e:
        print(f"Error in financial_summary: {str(e)}")
        traceback.print_exc()
        # Return empty data structure
        return Response({
            'totalIncome': 0,
            'totalExpenses': 0,
            'netIncome': 0,
            'incomeByCategory': [],
            'expensesByCategory': [],
            'comparisonToPreviousPeriod': {
                'income': 0,
                'expenses': 0,
                'profit': 0
            },
            'timeRange': request.query_params.get('timeRange', '3months'),
            'startDate': (date.today() - timedelta(days=90)).isoformat(),
            'endDate': date.today().isoformat()
        })

@api_view(['GET'])
def cash_flow(request):
    try:
        period = request.query_params.get('period', 'monthly')
        time_range = request.query_params.get('timeRange', '3months')
        
        # Determine time frame based on period and time_range
        today = date.today()
        if time_range == '30days':
            start_date = today - timedelta(days=30)
        elif time_range == '3months':
            start_date = today - timedelta(days=90)
        elif time_range == '6months':
            start_date = today - timedelta(days=180)
        elif time_range == '1year':
            start_date = today - timedelta(days=365)
        else:
            start_date = today - timedelta(days=90)  # Default to 3 months
        
        if period == 'monthly':
            # Group by month
            income_data = (
                Income.objects.filter(date__gte=start_date, date__lte=today)
                .annotate(month=TruncMonth('date'))
                .values('month')
                .annotate(total=Sum('amount'))
                .order_by('month')
            )
            
            expense_data = (
                Expense.objects.filter(date__gte=start_date, date__lte=today)
                .annotate(month=TruncMonth('date'))
                .values('month')
                .annotate(total=Sum('amount'))
                .order_by('month')
            )
            
            # Create a merged dataset
            merged_data = {}
            
            # Process income data
            for entry in income_data:
                month_str = entry['month'].strftime('%b %Y')
                if month_str not in merged_data:
                    merged_data[month_str] = {'income': 0, 'expenses': 0, 'net': 0}
                merged_data[month_str]['income'] = float(entry['total'])
            
            # Process expense data
            for entry in expense_data:
                month_str = entry['month'].strftime('%b %Y')
                if month_str not in merged_data:
                    merged_data[month_str] = {'income': 0, 'expenses': 0, 'net': 0}
                merged_data[month_str]['expenses'] = float(entry['total'])
            
            # Calculate net for each month
            for month in merged_data:
                merged_data[month]['net'] = merged_data[month]['income'] - merged_data[month]['expenses']
            
            # Convert to lists for chart data
            labels = list(merged_data.keys())
            income_values = [entry['income'] for entry in merged_data.values()]
            expense_values = [entry['expenses'] for entry in merged_data.values()]
            net_values = [entry['net'] for entry in merged_data.values()]
            
            data = {
                'labels': labels,
                'incomeData': income_values,
                'expensesData': expense_values,
                'netData': net_values,
                'period': period,
                'timeRange': time_range
            }
            
            return Response(data)
        
        elif period == 'quarterly':
            # Group by quarter
            income_data = (
                Income.objects.filter(date__gte=start_date, date__lte=today)
                .annotate(quarter=TruncQuarter('date'))
                .values('quarter')
                .annotate(total=Sum('amount'))
                .order_by('quarter')
            )
            
            expense_data = (
                Expense.objects.filter(date__gte=start_date, date__lte=today)
                .annotate(quarter=TruncQuarter('date'))
                .values('quarter')
                .annotate(total=Sum('amount'))
                .order_by('quarter')
            )
            
            # Create a merged dataset
            merged_data = {}
            
            # Process income data
            for entry in income_data:
                quarter_str = f"Q{(entry['quarter'].month-1)//3+1} {entry['quarter'].year}"
                if quarter_str not in merged_data:
                    merged_data[quarter_str] = {'income': 0, 'expenses': 0, 'net': 0}
                merged_data[quarter_str]['income'] = float(entry['total'])
            
            # Process expense data
            for entry in expense_data:
                quarter_str = f"Q{(entry['quarter'].month-1)//3+1} {entry['quarter'].year}"
                if quarter_str not in merged_data:
                    merged_data[quarter_str] = {'income': 0, 'expenses': 0, 'net': 0}
                merged_data[quarter_str]['expenses'] = float(entry['total'])
            
            # Calculate net for each quarter
            for quarter in merged_data:
                merged_data[quarter]['net'] = merged_data[quarter]['income'] - merged_data[quarter]['expenses']
            
            # Convert to lists for chart data
            labels = list(merged_data.keys())
            income_values = [entry['income'] for entry in merged_data.values()]
            expense_values = [entry['expenses'] for entry in merged_data.values()]
            net_values = [entry['net'] for entry in merged_data.values()]
            
            data = {
                'labels': labels,
                'incomeData': income_values,
                'expensesData': expense_values,
                'netData': net_values,
                'period': period,
                'timeRange': time_range
            }
            
            return Response(data)
            
        elif period == 'yearly':
            # Group by year
            income_data = (
                Income.objects.filter(date__gte=start_date, date__lte=today)
                .annotate(year=TruncYear('date'))
                .values('year')
                .annotate(total=Sum('amount'))
                .order_by('year')
            )
            
            expense_data = (
                Expense.objects.filter(date__gte=start_date, date__lte=today)
                .annotate(year=TruncYear('date'))
                .values('year')
                .annotate(total=Sum('amount'))
                .order_by('year')
            )
            
            # Create a merged dataset
            merged_data = {}
            
            # Process income data
            for entry in income_data:
                year_str = str(entry['year'].year)
                if year_str not in merged_data:
                    merged_data[year_str] = {'income': 0, 'expenses': 0, 'net': 0}
                merged_data[year_str]['income'] = float(entry['total'])
            
            # Process expense data
            for entry in expense_data:
                year_str = str(entry['year'].year)
                if year_str not in merged_data:
                    merged_data[year_str] = {'income': 0, 'expenses': 0, 'net': 0}
                merged_data[year_str]['expenses'] = float(entry['total'])
            
            # Calculate net for each year
            for year in merged_data:
                merged_data[year]['net'] = merged_data[year]['income'] - merged_data[year]['expenses']
            
            # Convert to lists for chart data
            labels = list(merged_data.keys())
            income_values = [entry['income'] for entry in merged_data.values()]
            expense_values = [entry['expenses'] for entry in merged_data.values()]
            net_values = [entry['net'] for entry in merged_data.values()]
            
            data = {
                'labels': labels,
                'incomeData': income_values,
                'expensesData': expense_values,
                'netData': net_values,
                'period': period,
                'timeRange': time_range
            }
            
            return Response(data)
            
        else:
            return Response({"error": "Invalid period parameter"}, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        print(f"Error in cash_flow: {str(e)}")
        traceback.print_exc()
        return Response({
            'labels': [],
            'incomeData': [],
            'expensesData': [],
            'netData': [],
            'period': period,
            'timeRange': time_range
        })

@api_view(['GET'])
def balance_sheet(request):
    try:
        # Get the balance sheet as of a specific date
        as_of_date_str = request.query_params.get('as_of_date')
        
        if as_of_date_str:
            as_of_date = parse_date(as_of_date_str)
        else:
            as_of_date = date.today()
        
        # Assets (all income)
        total_assets = Income.objects.filter(date__lte=as_of_date).aggregate(total=Sum('amount'))['total'] or 0
        
        # Liabilities (all expenses)
        total_liabilities = Expense.objects.filter(date__lte=as_of_date).aggregate(total=Sum('amount'))['total'] or 0
        
        # Equity (assets - liabilities)
        total_equity = total_assets - total_liabilities
        
        data = {
            'assets': {
                'total': total_assets,
                'breakdown': [
                    {'category': 'Cash & Equivalents', 'amount': total_assets}
                ]
            },
            'liabilities': {
                'total': total_liabilities,
                'breakdown': [
                    {'category': 'Accounts Payable', 'amount': total_liabilities}
                ]
            },
            'equity': {
                'total': total_equity,
                'breakdown': [
                    {'category': 'Retained Earnings', 'amount': total_equity}
                ]
            },
            'asOfDate': as_of_date.isoformat()
        }
        
        return Response(data)
    except Exception as e:
        print(f"Error in balance_sheet: {str(e)}")
        traceback.print_exc()
        return Response({
            'assets': {'total': 0, 'breakdown': []},
            'liabilities': {'total': 0, 'breakdown': []},
            'equity': {'total': 0, 'breakdown': []},
            'asOfDate': date.today().isoformat()
        })

@api_view(['GET'])
def financial_reports(request):
    try:
        report_type = request.query_params.get('type', 'income_statement')
        
        # Get date range from query params, defaulting to current month
        today = date.today()
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')
        
        # Parse dates if provided
        if start_date_str:
            start_date = parse_date(start_date_str)
        else:
            start_date = today.replace(day=1)  # First day of current month
            
        if end_date_str:
            end_date = parse_date(end_date_str)
        else:
            end_date = today
        
        if report_type == 'income_statement':
            # Get revenue breakdown
            revenues = Income.objects.filter(
                date__gte=start_date, 
                date__lte=end_date
            ).values('category').annotate(
                total=Sum('amount')
            ).order_by('-total')
            
            revenue_list = []
            for item in revenues:
                revenue_list.append({
                    'category': item['category'],
                    'amount': item['total']
                })
            
            # Get expense breakdown
            expenses = Expense.objects.filter(
                date__gte=start_date, 
                date__lte=end_date
            ).values('category').annotate(
                total=Sum('amount')
            ).order_by('-total')
            
            expense_list = []
            for item in expenses:
                expense_list.append({
                    'category': item['category'],
                    'amount': item['total']
                })
            
            # Calculate totals
            total_revenue = sum(item['amount'] for item in revenue_list)
            total_expenses = sum(item['amount'] for item in expense_list)
            net_income = total_revenue - total_expenses
            
            report_data = {
                'reportType': 'Income Statement',
                'startDate': start_date.isoformat(),
                'endDate': end_date.isoformat(),
                'revenues': revenue_list,
                'expenses': expense_list,
                'totalRevenue': total_revenue,
                'totalExpenses': total_expenses,
                'netIncome': net_income,
                'generatedAt': datetime.now().isoformat()
            }
            
            return Response(report_data)
        
        else:
            return Response({"error": "Invalid report type"}, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        print(f"Error in financial_reports: {str(e)}")
        traceback.print_exc()
        return Response({
            'reportType': 'Error',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'POST'])
def report_history(request):
    """
    Get all report history or create a new report entry.
    """
    if request.method == 'GET':
        try:
            reports = ReportHistory.objects.all().order_by('-created_at')
            serializer = ReportHistorySerializer(reports, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error retrieving report history: {str(e)}")
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        try:
            print(f"Received report history data: {request.data}")
            
            # Create a complete data object
            report_data = {
                'report_name': request.data.get('report_name', 'Unnamed Report'),
                'report_type': request.data.get('report_type', 'income_statement'),
                'start_date': request.data.get('start_date'),
                'end_date': request.data.get('end_date'),
                'report_summary': request.data.get('report_summary', ''),
                'report_data': request.data.get('report_data', {})
            }
            
            # Validate required fields
            if not report_data['start_date']:
                return Response({"error": "Start date is required"}, status=status.HTTP_400_BAD_REQUEST)
            if not report_data['end_date']:
                return Response({"error": "End date is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = ReportHistorySerializer(data=report_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            print(f"Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            error_msg = f"Error creating report history: {str(e)}"
            print(error_msg)
            traceback.print_exc()
            return Response({"error": error_msg}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'DELETE'])
def report_history_detail(request, pk):
    """
    Get or delete a specific report from history.
    """
    try:
        report = ReportHistory.objects.get(pk=pk)
    except ReportHistory.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error retrieving report with pk={pk}: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if request.method == 'GET':
        serializer = ReportHistorySerializer(report)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        try:
            report.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print(f"Error deleting report: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def test_api(request):
    """Simple endpoint to test API connectivity"""
    return Response({
        "status": "success",
        "message": "Finance API is operational",
        "timestamp": datetime.now().isoformat()
    })