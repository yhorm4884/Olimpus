
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('actividades-empresa/<int:user_id>/', views.actividades_disponibles, name='actividades_disponibles'),
    path('misactividades/<int:user_id>/', views.mostrarActividades, name='misactividades'),
    path('actividades/<int:user_id>/', views.actividades, name='actividades'),
    path('actividad/<int:actividad_id>/', views.actividad_detail, name='actividad_detail'),
    path('edit_actividad/<int:actividad_id>/', views.edit_actividad, name='edit_actividad'),
    path('add_actividad/<int:user_id>/', views.add_actividad, name='add_actividad'),
    path('delete/', views.delete_activities, name='delete_activities'),
    path('delete_single/', views.delete_activity, name='delete_single_activity'),
]   
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)