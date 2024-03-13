from django.contrib import admin
from .models import Actividad

@admin.register(Actividad)
class ActividadAdmin(admin.ModelAdmin):
    list_display = ['codigo_actividad', 'nombre', 'hora_entrada', 'hora_salida', 'personas', 'lugar']
    filter_horizontal = ['empresas']  # Para relaciones ManyToMany sin modelo intermedio
