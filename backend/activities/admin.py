from django.contrib import admin
from .models import Actividad, ParticipanteActividad

class ParticipanteActividadInline(admin.TabularInline):
    model = ParticipanteActividad
    extra = 1  # Ajusta esto según las necesidades

@admin.register(Actividad)
class ActividadAdmin(admin.ModelAdmin):
    list_display = ['codigo_actividad', 'nombre', 'hora_entrada', 'hora_salida', 'personas', 'lugar']
    filter_horizontal = ['empresas']  # Para relaciones ManyToMany sin modelo intermedio
    inlines = [ParticipanteActividadInline]  # Para la relación ManyToMany con modelo intermedio
