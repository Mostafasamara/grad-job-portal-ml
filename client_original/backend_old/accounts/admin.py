from django.contrib import admin
from .models import EmployerProfile, EmployeeProfile, City, MyUser

# Register your models here.

admin.site.register(EmployerProfile)
admin.site.register(EmployeeProfile)
admin.site.register(City)
admin.site.register(MyUser)