from django.db.models import fields
from rest_framework import serializers

from accounts.serializers import EmployeeProfileSerializer, EmployerProfileSerializer
from job.serializers import ApplicationSerializer, InterviewSerializer
from .models import EmployeeNotification, Notification

class Notificationserializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
    created_by = EmployerProfileSerializer()
    application=ApplicationSerializer()
    class Meta:
        model=Notification
        fields='__all__'


class EmployeeNotificationSerializer(serializers.ModelSerializer):
    sender = EmployerProfileSerializer()
    interview = InterviewSerializer()
    created = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
    class Meta:
        model=EmployeeNotification
        fields='__all__'