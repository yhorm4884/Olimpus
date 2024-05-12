from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator
from django.core.validators import FileExtensionValidator

# Definición de validadores, si aún los necesitas
dni_validator = RegexValidator(
    regex=r"^\d{8}[A-Z]$",
    message=_("El DNI debe consistir en 8 dígitos seguidos de una letra mayúscula."),
)

telefono_validator = RegexValidator(
    regex=r"^\+?\d{9,15}$",
    message=_("El teléfono debe ser un número válido."),
)

class Usuario(models.Model):
    ESTADO_OPCIONES = [
        ('activo', _('Activo')),
        ('bloqueado', _('Bloqueado')),
    ]
    TIPO_USUARIO_OPCIONES = [
        ('cliente', _('Cliente')),
        ('propietario', _('Propietario de Empresa')),
        ('administrador', _('Administrador')),
    ]
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    DNI = models.CharField(max_length=9, validators=[dni_validator], unique=True)
    telefono = models.CharField(max_length=20, validators=[telefono_validator])
    tipo_usuario = models.CharField(max_length=20, choices=TIPO_USUARIO_OPCIONES, default='cliente')
    estado = models.CharField(max_length=10, choices=ESTADO_OPCIONES, default='activo')
    photo = models.ImageField(upload_to='user/%d/',
        blank=True,
        validators=[FileExtensionValidator(['jpg', 'png'])],)
    actividades_participadas = models.ManyToManyField('activities.Actividad', blank=True, related_name='usuarios_participantes', verbose_name=_('Actividades Participadas'))

    class Meta:
        verbose_name = _("Usuario")
        verbose_name_plural = _("Usuarios")

    def __str__(self):
        return self.user.get_full_name() or self.user.username

class Conversacion(models.Model):
    propietario = models.ForeignKey(Usuario, related_name='conversaciones_propietario', on_delete=models.CASCADE)
    cliente = models.ForeignKey(Usuario, related_name='conversacion_cliente', on_delete=models.CASCADE)
    
    def __str__(self):
        return f"Conversación entre {self.propietario.user.username} y {self.cliente.user.username}"

class Mensaje(models.Model):
    conversacion = models.ForeignKey(Conversacion, related_name='mensajes', on_delete=models.CASCADE)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='mensajes_enviados', on_delete=models.CASCADE)
    contenido = models.TextField()
    fecha_hora = models.DateTimeField(auto_now_add=True)
    leido = models.BooleanField(default=False)  # Campo para marcar si el mensaje ha sido leído

    def __str__(self):
        return f"Mensaje de {self.sender.username} el {self.fecha_hora.strftime('%Y-%m-%d %H:%M')}"

    class Meta:
        ordering = ['fecha_hora']