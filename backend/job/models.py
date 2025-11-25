from django.db import models
from django.utils.text import slugify
from accounts.models import MyUser
from django.db.models.signals import post_save
from django.dispatch import receiver



# Create your models here.

JOB_TYPE = (
    ('Full time','Full time'),
    ('Part time','Part time'),
)

APPLICATION_STATUS = (
    ('Pending','Pending'),
    ('Accepted','Accepted'),
    ('Rejected','Rejected'),
)

def image_upload(instance,filename):
    imagename , extension = filename.split(".")
    return "jobs/%s/%s.%s"%(instance.title, imagename, extension)


class Category(models.Model):
    name = models.CharField(max_length=25)

    def __str__(self):
        return self.name


class Job(models.Model):
    class Meta:
        ordering=["-published_at"]

    owner = models.ForeignKey(MyUser, related_name='job_owner', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    job_type = models.CharField(max_length=15 , choices=JOB_TYPE)
    description = models.TextField(max_length=1000)
    published_at = models.DateTimeField(auto_now=True)
    vacancy = models.IntegerField(default=1)
    salary = models.IntegerField(default=0)
    experience = models.IntegerField(default=1)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, blank=True, null=True)
    slug = models.SlugField(blank=True, null=True)
    
    ## overriding save() method ##
    def save(self,*args,**kwargs):
        self.slug = slugify(self.title)
        super(Job,self).save(*args, **kwargs)

    def __str__(self):
        return self.title


class Application(models.Model):
    job = models.ForeignKey(Job, related_name='application_job' , on_delete=models.CASCADE)
    applicant = models.ForeignKey(MyUser, on_delete=models.CASCADE, blank=True, null=True)
    full_name = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(max_length=100, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    cv = models.FileField(upload_to='application/', blank=True, null=True)
    cover_letter = models.TextField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=APPLICATION_STATUS, default="Pending")

    
    def __str__(self):
        if self.applicant:
            return f"{self.applicant.email} application for {self.job}"
        return f"{self.email} application for {self.job}"


class Interview(models.Model):
    application = models.OneToOneField(Application, related_name="application", on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    time = models.DateTimeField()
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.application.applicant:
            return f"Interviewee: {self.application.applicant.email} | Position: {self.application.job}"
        return f"Interviewee: {self.application.email} | Position: {self.application.job}"




# @receiver(post_save, sender=Interview)
# def setup_interview_signals(sender, instance, created, **kwargs):
#     if created:
#         application = Application.objects.filter(id=instance.application.id)[0]
#         application.status="Accepted"
#         application.save()
#         instance.save()
        