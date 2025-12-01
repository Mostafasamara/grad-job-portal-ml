from django.db.models.signals import post_save
from django.dispatch.dispatcher import receiver
from job.models import Application, Interview


@receiver(post_save, sender=Interview)
def setup_interview_signals(sender, instance, created, **kwargs):
    if created:
        application = Application.objects.filter(id=instance.application.id)[0]
        application.status="Accepted"
        application.save()
        instance.save()
        