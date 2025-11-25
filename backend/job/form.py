from django import forms 
from .models import Application , Job


class ApplicationForm(forms.ModelForm):
    class Meta:
        model = Application
        fields = ['full_name' , 'email' , 'website' , 'cv' , 'cover_letter']


class JobForm(forms.ModelForm):
    class Meta:
        model = Job
        fields = '__all__'
        exclude = ('owner','slug',)
        