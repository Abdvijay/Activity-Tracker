from rest_framework import viewsets, permissions, status
from .models import Task
from .serializers import TaskSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import timedelta
from django.utils import timezone

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.tasks.all().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        today = timezone.now().date()
        week_start = today - timedelta(days=today.weekday())
        
        # Today
        tasks_today = self.get_queryset().filter(created_at__date=today)
        today_completed = tasks_today.filter(is_completed=True).count()
        today_total = tasks_today.count()
        
        # Weekly
        tasks_weekly = self.get_queryset().filter(created_at__date__gte=week_start)
        weekly_completed = tasks_weekly.filter(is_completed=True).count()
        weekly_total = tasks_weekly.count()
        
        return Response({
            "today": {
                "completed": today_completed,
                "total": today_total,
                "pending": today_total - today_completed
            },
            "weekly": {
                "completed": weekly_completed,
                "total": weekly_total,
                "pending": weekly_total - weekly_completed
            }
        })
        
    @action(detail=False, methods=['get'])
    def report(self, request):
        week_ago = timezone.now().date() - timedelta(days=7)
        tasks = self.get_queryset().filter(created_at__date__gte=week_ago)
        
        completed = tasks.filter(is_completed=True).count()
        total = tasks.count()
        
        suggestion = "You are doing great!" if completed > total * 0.7 else "Try to complete more tasks each day to stay on track."
        
        return Response({
            "recent_tasks_count": total,
            "completed_count": completed,
            "suggestion": suggestion
        })

    @action(detail=False, methods=['get'])
    def by_date(self, request):
        date_str = request.query_params.get('date')
        if not date_str:
            return Response({"error": "date parameter required"}, status=status.HTTP_400_BAD_REQUEST)
        tasks = self.get_queryset().filter(created_at__date=date_str)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def streak(self, request):
        from django.db.models.functions import TruncDate
        
        completed_dates = self.get_queryset() \
            .filter(is_completed=True) \
            .annotate(date=TruncDate('created_at')) \
            .values_list('date', flat=True) \
            .distinct() \
            .order_by('-date')
            
        completed_dates_list = list(completed_dates)
        
        streak = 0
        today = timezone.now().date()
        
        if completed_dates_list:
            current_date = today
            if completed_dates_list[0] == today:
                current_date = today
            elif completed_dates_list[0] == today - timedelta(days=1):
                current_date = today - timedelta(days=1)
                
            for date in completed_dates_list:
                if date == current_date:
                    streak += 1
                    current_date -= timedelta(days=1)
                else:
                    break
                    
        return Response({
            "current_streak": streak,
            "active_dates": [d.strftime('%Y-%m-%d') for d in completed_dates_list]
        })
