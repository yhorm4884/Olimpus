import re
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import FileExtensionValidator

def validar_cif(value):
    # Expresión regular para verificar la estructura básica del CIF
    regex = re.compile(r'^[A-HJ-NP-SUVW][0-9]{7}[0-9A-J]$')

    if not regex.match(value):
        raise ValidationError(_('%(value)s no tiene un formato de CIF válido'), params={'value': value})

    # Cálculo y validación del dígito de control
    match = regex.match(value)
    cif = match.group(0)
    letras = "JABCDEFGHI"
    digitos = cif[1:8]
    control = cif[8]

    # Calcular el dígito de control
    suma_par = sum(int(digitos[i]) for i in range(1, len(digitos), 2))
    suma_impar = sum(sum(divmod(2 * int(digitos[i]), 10)) for i in range(0, len(digitos), 2))
    suma_total = suma_par + suma_impar
    digito_control = 10 - (suma_total % 10)
    digito_control = 0 if digito_control == 10 else digito_control

    if control.isdigit():
        if digito_control != int(control):
            raise ValidationError(_('%(value)s no tiene un dígito de control válido'), params={'value': value})
    else:
        if control != letras[digito_control]:
            raise ValidationError(_('%(value)s no tiene un dígito de control válido'), params={'value': value})

class Empresa(models.Model):
    id_empresa = models.AutoField(primary_key=True)
    codigo_empresa = models.CharField(max_length=100)
    nombre = models.CharField(max_length=100)
    # cif = models.CharField(max_length=9, validators=[validar_cif])
    cif = models.CharField(max_length=9)
    usuarios = models.ManyToManyField('users.Usuario', related_name='empresas', verbose_name=_('Usuarios'))
    direccion = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='user/%d/',
        blank=True,
        validators=[FileExtensionValidator(['jpg', 'png'])],)

    # def clean(self):
    #     # Método de validación personalizada para validar el CIF
    #     validar_cif(self.cif)
    
    def __str__(self) -> str:
        return f"{self.id_empresa} - {self.cif} "