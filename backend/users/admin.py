from django.contrib import admin
from .models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['get_email', 'get_name', 'tipo_usuario', 'telefono', 'DNI', 'estado']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'DNI']

    def get_email(self, obj):
        return obj.user.email
    get_email.admin_order_field = 'user__email'  # Permite ordenar por este campo en el admin
    get_email.short_description = 'Correo electrónico'

    def get_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
    get_name.short_description = 'Nombre completo'
