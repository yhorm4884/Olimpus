from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from users.models import Usuario
from activities.models import Actividad
class Notificacion(models.Model):
    ESTADOS = [
        ('pendiente', _('Pendiente')),
        ('aceptada', _('Aceptada')),
        ('rechazada', _('Rechazada')),
    ]
    actividad = models.ForeignKey(Actividad, on_delete=models.CASCADE)
    usuario_cliente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='solicitudes_hechas')
    usuario_propietario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='solicitudes_recibidas')
    estado = models.CharField(max_length=10, choices=ESTADOS, default='pendiente')
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario_cliente.user.username} solicita {self.actividad.nombre} - {self.estado}"

    @property
    def is_expired(self):
        return timezone.now() > self.fecha_creacion + timezone.timedelta(days=3)
