### get data from models --> generate Json 

from django.db.models import fields
from django.db.models.base import Model
from rest_framework import serializers
# تم إزالة NullBooleanField - لم نعد نحتاجه

from accounts.models import MyUser
from accounts.serializers import MyUserSerializer
from .models import Interview, Job , Application, Category

class StringSerializer(serializers.StringRelatedField):
    def to_internal_value(self, value):
        return value


class JobSerializer(serializers.ModelSerializer):
    # username = serializers.PrimaryKeyRelatedField(source='owner.username', queryset=MyUser.objects.all())
    # first_name = serializers.PrimaryKeyRelatedField(source='owner.first_name', queryset=MyUser.objects.all())
    # last_name = serializers.PrimaryKeyRelatedField(source='owner.last_name', queryset=MyUser.objects.all())
    image = serializers.ImageField(source='owner.employerprofile.image', default="media/default-profile-image.jpg", read_only=True)
    applications = serializers.IntegerField(source="application_job.count", default=0, read_only=True)
    published_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
    owner = MyUserSerializer()
    category = StringSerializer(many=False)
    
    class Meta:
        model = Job
        fields = '__all__'



class ApplicationSerializer(serializers.ModelSerializer):
    applicant_email = serializers.CharField(source='applicant.email', default="")
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
    job = JobSerializer()
    class Meta:
        model=Application
        fields='__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class InterviewSerializer(serializers.ModelSerializer):
    application = ApplicationSerializer()
    time = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
    created = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
    class Meta:
        model = Interview
        fields = "__all__"