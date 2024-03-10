# users/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_request, name='register'),
    path('login/', views.login_view, name='login'),
]
