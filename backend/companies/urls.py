
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_empresa_view, name='register'),
    path('empresa/<int:user_id>/', views.empresa_detail, name='empresa_detail'),
    path('join/', views.join, name='join'),

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)