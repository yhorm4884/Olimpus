from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['id_usuario', 'nombre', 'apellidos', 'tipo_usuario', 'telefono', 'DNI', 'correo']
    search_fields = ['nombre', 'apellidos', 'DNI', 'correo']
