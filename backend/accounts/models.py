from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver




class MyUser(AbstractUser):
    is_employer = models.BooleanField(default=False)


class City(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class EmployerProfile(models.Model):
    user = models.OneToOneField(MyUser, on_delete=models.CASCADE)
    location = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length = 15)
    image = models.ImageField(upload_to = 'company_profile/images/')
    website = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return str(self.user)


from job.models import Job,Category


class EmployeeProfile(models.Model):
    user = models.OneToOneField(MyUser, on_delete=models.CASCADE)
    saved_jobs = models.ManyToManyField(Job, blank=True)
    predicted_category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True
    )    
    title = models.CharField(max_length=200, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length = 15)
    image = models.ImageField(upload_to = 'employee_profile/images/')
    cv = models.FileField(upload_to = 'employee_profile/cv/')
    website = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return str(self.user)


@receiver(post_save, sender=MyUser)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.is_employer:
            EmployerProfile.objects.create(user=instance)
        else:
            EmployeeProfile.objects.create(user=instance)
