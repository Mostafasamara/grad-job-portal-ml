from django.db import models
from accounts.models import EmployeeProfile, EmployerProfile, MyUser
from job.models import Application, Interview, Job
from django.db.models.signals import post_save
from django.dispatch import receiver


class Notification(models.Model):
      to_user=models.ForeignKey(EmployerProfile,related_name='notifications',on_delete=models.CASCADE)
      is_read=models.BooleanField(default=False)
      application=models.ForeignKey(Application, on_delete=models.CASCADE)
      created_at=models.DateTimeField(auto_now_add=True,null=True,blank=True)
      created_by=models.ForeignKey(EmployeeProfile,related_name='creatednotifications',on_delete=models.SET_NULL,null=True)

      def __str__(self):
         return f" application  for {self.application.job.title} job from {self.created_by}"




class EmployeeNotification(models.Model):
    sender = models.ForeignKey(EmployerProfile, null=True, on_delete=models.SET_NULL)
    receiver = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE)
    interview = models.OneToOneField(Interview, on_delete=models.SET_NULL, null=True)
    created = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
      return f"interview notification from {self.sender} to {self.receiver}"



