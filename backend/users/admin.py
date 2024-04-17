from django.contrib import admin
from .models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['DNI','get_email', 'tipo_usuario', 'telefono', 'estado']
    search_fields = ['DNI','user__email', 'user__first_name', 'user__last_name' ]

    def get_email(self, obj):
        return obj.user.email
    get_email.admin_order_field = 'user__email'  # Permite ordenar por este campo en el admin
    get_email.short_description = 'Correo electrónico'

