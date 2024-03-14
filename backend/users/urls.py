# users/urls.py

from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('check_user_authenticated/', views.check_user_authenticated, name='check_user_authenticated'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='login'),
    path('logout/', views.logout_view, name='logout'),

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)