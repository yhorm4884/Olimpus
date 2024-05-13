from django.conf.urls.static import static
from django.conf import settings
from django.urls import path
from . import views

urlpatterns = [
    path('solicitar-unirse-actividad/', views.solicitar_unirse_actividad, name='solicitar_unirse_actividad'),
    path('list/<int:user_id>/', views.notificaciones_list, name='notificaciones_list'),
    path('update/<int:notificacion_id>/', views.notificacion_update, name='notificacion_update'),
    path('count/<int:user_id>/', views.notificaciones_count, name='notificaciones_count'),
    path('client-list/<int:user_id>/', views.notificaciones_client_list, name='notificaciones_client_list'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)