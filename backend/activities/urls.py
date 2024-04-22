
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('misactividades/', views.mostrarActividades, name='misactividades'),
    path('actividades/<int:user_id>/', views.actividades, name='actividades'),
    path('actividad/<int:actividad_id>/', views.actividad_detail, name='actividad_detail'),
    path('add_actividad/<int:user_id>/', views.add_actividad, name='add_actividad'),

]   
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)