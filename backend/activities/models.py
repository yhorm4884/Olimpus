from django.db import models
from django.utils.translation import gettext_lazy as _

class Actividad(models.Model):
    codigo_actividad = models.CharField(max_length=100, verbose_name=_('Código de Actividad'))
    nombre = models.CharField(max_length=100, verbose_name=_('Nombre'))
    hora_entrada = models.DateTimeField(verbose_name=_('Hora de Entrada'))
    hora_salida = models.DateTimeField(verbose_name=_('Hora de Salida'))
    personas = models.IntegerField(verbose_name=_('Capacidad de Personas'))
    lugar = models.CharField(max_length=100, verbose_name=_('Lugar'))
    observaciones = models.TextField(blank=True, verbose_name=_('Observaciones'))
    empresas = models.ManyToManyField('companies.Empresa', verbose_name=_('Empresas'))
    participantes_actividad = models.ManyToManyField(
        'users.Usuario',
        related_name='actividades',  # Cambiado de 'actividades_participadas' a 'actividades'
        verbose_name=_('Participantes')
    )
    def __str__(self):
        return f"{self.nombre} ({self.codigo_actividad})"