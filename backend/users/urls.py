# users/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_request, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('check_user_authenticated/', views.check_user_authenticated, name='check_user_authenticated'),

]
