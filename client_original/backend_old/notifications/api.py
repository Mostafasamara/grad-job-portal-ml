from django.dispatch.dispatcher import receiver
from accounts.models import EmployeeProfile, EmployerProfile
from .serializers import EmployeeNotificationSerializer, Notificationserializer
from .models import EmployeeNotification, Notification
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q


class Notificationss(APIView):
    def get(self, request):
        user = self.request.user
        employer = EmployerProfile.objects.get(user=user)
        queryset = Notification.objects.filter(to_user=employer).order_by("-created_at")
        serializer = Notificationserializer(queryset, many=True)
        unread = queryset.filter(is_read=False).count()
        return Response({"notifications": serializer.data, "unread":unread})

class UpdateNotifications(APIView):
    def patch(self, request, id):
        notification = Notification.objects.get(id=id)
        serializer = Notificationserializer(notification, data=self.request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            return Response(serializer.errors, status=400)
    
    
 

class GetEmployeeNotifications(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        user = self.request.user
        employee = EmployeeProfile.objects.get(user=user)
        queryset = EmployeeNotification.objects.filter(receiver=employee).order_by("-created")
        serializer = EmployeeNotificationSerializer(queryset, many=True)
        unread = queryset.filter(is_read=False).count()
        return Response({"notifications": serializer.data, "unread":unread})


class UpdateEmpNotifications(APIView):
    def patch(self, request, id):

        notification = EmployeeNotification.objects.get(id=id)
        serializer = EmployeeNotificationSerializer(notification, data=self.request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            return Response(serializer.errors, status=400)

