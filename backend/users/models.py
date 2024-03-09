import re
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator

# Validadores
dni_validator = RegexValidator(
    regex=r"^\d{8}[A-Z]$",
    message=_("El DNI debe consistir en 8 dígitos seguidos de una letra mayúscula.")
)

telefono_validator = RegexValidator(
    regex=r"^\+?\d{9,15}$",
    message=_("El teléfono debe ser un número válido.")
)

email_validator = RegexValidator(
    regex=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",
    message=_("El correo debe ser una dirección válida.")
)

class Usuario(models.Model):
    TIPO_USUARIO_OPCIONES = [
        ('cliente', _('Cliente')),
        ('propietario', _('Propietario de Empresa')),
        ('administrador', _('Administrador')),
    ]
    id_usuario = models.AutoField(primary_key=True)
    tipo_usuario = models.CharField(max_length=20, choices=TIPO_USUARIO_OPCIONES, default='cliente')
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20, validators=[telefono_validator])
    DNI = models.CharField(max_length=9, validators=[dni_validator])
    correo = models.EmailField(unique=True, validators=[email_validator])
    contraseña = models.CharField(max_length=100)
    actividades_participadas = models.ManyToManyField('activities.Actividad', related_name='usuarios_participantes', verbose_name=_('Actividades Participadas'))


    def __str__(self):
        return f"{self.nombre} {self.apellidos} ({self.get_tipo_usuario_display()})"
