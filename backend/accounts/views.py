from django.shortcuts import redirect, render

from accounts.models import EmployeeProfile, EmployerProfile
from .forms import  UserTypeForm, SignupForm
from django.contrib.auth import authenticate, login
# from .models import Profile
# from accounts.forms import  UserForm
from django.urls import reverse
# Create your views here.


def get_user_type(request):
    if request.method == 'POST':
        form = UserTypeForm(request.POST)
        if form.is_valid():
            if form.cleaned_data['user_type'] == 'employer':
                return redirect('employer/')
            else:
                return redirect('employee/')
            
    else:
        form = UserTypeForm()
    return render (request , 'registration/signup.html' , {'form':form})


def singup_employee(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']
            user = authenticate(username=username ,password=password)
            login(request , user)
            return redirect('/accounts/profile/')
    else:
        form = SignupForm()
    return render (request , 'registration/signup_employee.html' , {'form':form})


def singup_employer(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            new_user = form.save(commit=False)
            new_user.is_employer = True
            new_user.save()
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']
            user = authenticate(username=username ,password=password)
            login(request , user)
            return redirect('/accounts/profile')
    else:
        form = SignupForm()
    return render (request , 'registration/signup_employer.html' , {'form':form})



def profile(request):
    if request.user.is_employer:
        profile = EmployerProfile.objects.get(user = request.user)
    else:
        profile = EmployeeProfile.objects.get(user = request.user)
    return render (request , 'accounts/profile.html' , {'profile':profile})

# def profile_edit(request):
#     profile = Profile.objects.get(user = request.user)
#     if request.method == 'POST':
#         userform = UserForm(request.POST , instance= request.user)
#         profileform = ProfileForm(request.POST ,request.FILES , instance = profile)

#         if userform.is_valid and profileform.is_valid:
#             userform.save()
#             myprofile = profileform.save(commit=False)
#             myprofile.user = request.user
#             myprofile.save()
#             return redirect(reverse('accounts:profile'))

#     else:
#         userform = UserForm(instance= request.user)
#         profileform = ProfileForm(instance = profile)
#     return render(request,'accounts/profile_edit.html',{'userform':userform , 'profileform':profileform})