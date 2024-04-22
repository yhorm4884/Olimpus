from django.conf.urls.static import static
from django.conf import settings
from django.urls import path
from . import views

urlpatterns = [
    path('list/<int:user_id>/', views.notificaciones_list, name='notificaciones_list'),
    path('update/<int:notificacion_id>/', views.notificacion_update, name='notificacion_update'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)