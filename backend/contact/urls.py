from django.urls import include, path
from . import api
import turtle

app_name = 'contact'

urlpatterns = [   
    path('api/contact/',api.InfoCreateApi.as_view(), name= "contact"),
]

 
