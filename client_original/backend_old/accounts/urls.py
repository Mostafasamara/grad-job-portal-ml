from django.urls import include, path
from . import views ,api

app_name = 'job'

urlpatterns = [
    # path('signup/', views.get_user_type , name = 'signup'),
    # path('signup/employee/', views.singup_employee , name = 'signup_employee'),
    # path('signup/employer/', views.singup_employer , name = 'signup_employer'),
    # path('profile/', views.profile , name = 'profile'),
    # path('profile/edit', views.profile_edit , name = 'profile_edit'),



    #APIS
    path('signup/',api.UserSignupView.as_view(),name="signup"),
    path('authenticated/',api.CkeckAuthenticatedView.as_view(),name="authenticated"),
    path('login/',api.LoginView.as_view(),name="login"),
    path('logout/',api.LogoutView.as_view(),name="logout"),
    path('delete/',api.DeleteUserView.as_view(),name="delete"),
    path('profile/',api.GetProfile.as_view(),name="profile"),
    path('profile/<int:user_id>/',api.VisitProfile.as_view(),name="visit_profile"),
    path('profile/update/',api.UpdateProfileView.as_view(),name="profile_update"),
    
    
    path('api/token',api.GetCSRFToken.as_view(),name="token"),

    path('api/employer/<int:id>/',api.EmployerProfileAPI.as_view(),name="employer-api"),
    path('api/employee/<int:id>/',api.EmployeeProfileAPI.as_view(),name="employee-api"),
]