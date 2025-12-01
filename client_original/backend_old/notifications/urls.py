from django.urls import include, path, re_path
from . import views
from . import api
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('api/',api.Notificationss.as_view(), name="employerNotifications"),
    path('api/<int:id>/update/',api.UpdateNotifications.as_view(), name="UpdateNotifications"),
    
    path('api/employee/notifications/',api.GetEmployeeNotifications.as_view(), name="employeeNotifications"),
    path('api/employee/notifications/<int:id>/update/',api.UpdateEmpNotifications.as_view(), name="UpdateEmployeeNotifications"),
]