
from django.shortcuts import redirect, render
from .models import Notification
from django.contrib.auth.decorators import login_required

@login_required
def notifications(request):
    goto=request.GET.get('goto','')
    notification_id=request.GET.get('notification',0)
    extra_id=request.GET.get('extra_id',0)
    if goto !='':
        notification=Notification.objects.get(pk=notification_id)
        notification.is_read=True
        notification.save()
        if notification.notifications_type==Notification.MESSAGE:
            return redirect('view_applictaions',notification_id=notification.extra_id)
        elif notification.notifications_type==Notification.APPLICATION:
            return redirect('view_applictaions',notification_id=notification.extra_id)
    return render('notifications/notifications.html')

# Create your views here.
