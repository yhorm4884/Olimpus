from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, EmpresaViewSet, ActividadViewSet, set_csrf_cookie

# Define el enrutador
router = DefaultRouter()

# Registra las vistas con el enrutador
router.register(r'usuarios', UsuarioViewSet)
router.register(r'empresas', EmpresaViewSet)
router.register(r'actividades', ActividadViewSet)

# Define las rutas de la aplicación
urlpatterns = [
    # Agrega las rutas del enrutador a las rutas principales
    path('', include(router.urls)),
    path('setcsrf/', set_csrf_cookie, name='set-csrf-cookie'),

]
