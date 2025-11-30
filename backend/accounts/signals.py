# backend/accounts/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import EmployeeProfile
from job.models import Category
import logging

logger = logging.getLogger(__name__)

# Import inside the function scope to avoid circular import issues
from .api import run_model_on_cv


@receiver(post_save, sender=EmployeeProfile)
def run_cv_model_on_profile_save(sender, instance, created, **kwargs):
    """
    This runs every time an EmployeeProfile is saved.
    If there is a CV file, we run the ML model and update predicted_category.
    """
    try:
        # If there's no CV file, nothing to do
        if not instance.cv or not instance.cv.name:
            return

        # Run model on the CV file
        predicted_name = run_model_on_cv(instance.cv.path)
        if not predicted_name:
            return

        # Get or create Category
        category_obj, _ = Category.objects.get_or_create(name=predicted_name)

        # Avoid infinite recursion: only save if it actually changed
        if instance.predicted_category != category_obj:
            instance.predicted_category = category_obj
            instance.save(update_fields=['predicted_category'])

    except Exception as e:
        logger.exception(f"Error in CV post_save signal: {e}")
