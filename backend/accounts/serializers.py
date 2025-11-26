from rest_framework import serializers

from .models import MyUser ,EmployerProfile, EmployeeProfile

class MyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'is_employer']



class EmployerProfileSerializer(serializers.ModelSerializer):
    user = MyUserSerializer()
    predicted_category_name = serializers.CharField(source='predicted_category.name', read_only=True)

    class Meta:
        model = EmployerProfile
        fields = '__all__'



from job.serializers import JobSerializer
class EmployeeProfileSerializer(serializers.ModelSerializer):
    user = MyUserSerializer()
    saved_jobs = JobSerializer(many=True)
    class Meta:
        model = EmployeeProfile
        fields = '__all__'
