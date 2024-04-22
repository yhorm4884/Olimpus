from django.contrib import admin
from .models import Empresa

@admin.register(Empresa)
class EmpresaAdmin(admin.ModelAdmin):
    list_display = ['codigo_empresa', 'nombre', 'cif', 'direccion']
    list_filter = ['usuarios']  # Usa el campo correcto aquí, basado en tus relaciones actuales
    