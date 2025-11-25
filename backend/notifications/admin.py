from django.contrib import admin
from .models import Notification, EmployeeNotification


admin.site.register(Notification)
admin.site.register(EmployeeNotification)
