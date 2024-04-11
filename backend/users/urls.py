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
    path('forgot-password/', views.forgot_password, name='forgot-password'),
    path('reset-password-confirm/', views.reset_password_confirm, name='reset-password-confirm'),
    path('serve-qr-code/<uidb64>/<token>/', views.serve_qr_code, name='serve-qr-code'),
    path('update-profile/', views.update_profile, name='update-profile'),  
    path('prueba', views.prueba, name='prueba'),
    # path('chat/session/', views.create_chat_session, name='create-chat-session'),
    # path('chat/message/', views.post_message, name='post-message'),

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)