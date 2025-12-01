from django.contrib import admin

# Register your models here.

from .models import Job , Category , Application, Interview

admin.site.register(Job)
admin.site.register(Category)
admin.site.register(Application)
admin.site.register(Interview)