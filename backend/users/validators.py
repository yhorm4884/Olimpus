from django.core.validators import RegexValidator
from django.core.validators import EmailValidator

from django.utils.translation import gettext_lazy as _
dni_validator = RegexValidator(
    regex=r"^\d{8}[A-Z]$",
    message=_("El DNI debe consistir en 8 dígitos seguidos de una letra mayúscula."),
)

telefono_validator = RegexValidator(
    regex=r"^\+?\d{9,15}$",
    message=_("El teléfono debe ser un número válido."),
)


email_validator = EmailValidator(
    message=_("Introduzca una dirección de correo electrónico válida."),
)