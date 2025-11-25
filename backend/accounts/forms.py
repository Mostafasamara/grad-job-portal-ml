from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import MyUser
# from .models import Profile


USER_TYPE = [
    ('employer','As A Company'),
    ('employee','As An Employee'),
]

class UserTypeForm(forms.Form):
    user_type = forms.ChoiceField(choices=USER_TYPE)


class SignupForm (UserCreationForm):
    class Meta :
        model = MyUser 
        fields = ['username' , 'email' , 'password1' , 'password2']


# class UserForm(forms.ModelForm):
#     class Meta:
#         model = MyUser
#         fields = ['username' , 'first_name' , 'last_name' , 'email']

# class ProfileForm(forms.ModelForm):
#     class Meta:
#         model = Profile
#         fields = ['city', 'phone_number' , 'image']
