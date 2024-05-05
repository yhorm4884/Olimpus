from django.contrib import admin
from notifications.models import Notificacion

@admin.register(Notificacion)
class NotificacionAdmin(admin.ModelAdmin):
    list_display = ('usuario_cliente', 'usuario_propietario', 'actividad', 'estado', 'fecha_creacion')
    list_filter = ('estado', 'usuario_propietario')
    search_fields = ('usuario_cliente__user__username', 'usuario_propietario__user__username', 'actividad__nombre')
    actions = ['aprobar_solicitud', 'rechazar_solicitud']

    def aprobar_solicitud(self, request, queryset):
        queryset.update(estado='aceptada')

    def rechazar_solicitud(self, request, queryset):
        queryset.update(estado='rechazada')

    aprobar_solicitud.short_description = 'Aprobar las solicitudes seleccionadas'
    rechazar_solicitud.short_description = 'Rechazar las solicitudes seleccionadas'
