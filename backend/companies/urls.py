
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views

urlpatterns = [
    path('crear-sesion-checkout/', views.crear_sesion_checkout, name='crear-sesion-checkout'),
    path('register/', views.register_empresa_view, name='register'),
    path('empresa/<int:user_id>/', views.empresa_detail, name='empresa_detail'),
    path('join/', views.join, name='join'),
    path('listar-usuarios/<int:id_empresa>/', views.lista_usuarios, name='lista_usuarios'),
    path('bloquear-usuarios/<int:id_usuario>/', views.bloquear_usuario, name='bloquear_usuario'),
    path('eliminar-usuarios/<int:id_usuario>/', views.eliminar_usuario, name='eliminar_usuario'),

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)