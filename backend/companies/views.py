from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.tokens import default_token_generator
from django_otp.plugins.otp_totp.models import TOTPDevice
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_protect
from django.template.loader import render_to_string
from rest_framework.permissions import AllowAny
from django.utils.encoding import force_bytes
from django.utils.encoding import force_str
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt

from django.http import JsonResponse
from .models import Empresa
from users.models import Usuario
from django.contrib.auth.models import User


# @api_view(['POST'])
# @permission_classes([AllowAny])
@csrf_exempt
def register_empresa_view(request):
    if request.method == 'POST':
        try:
            user_related = request.user
            usuario_actual = User.objects.get(pk=user_related.pk)

            nombre = request.POST.get('nombre')
            codigo_empresa = request.POST.get('codigo_empresa')
            cif = request.POST.get('cif')
            direccion = request.POST.get('direccion')
            empresa_existente = Empresa.objects.filter(codigo_empresa=codigo_empresa).first()
            if empresa_existente:
                return JsonResponse({'error': 'La empresa ya existe'}, status=400)

            empresa = Empresa.objects.create(nombre=nombre, codigo_empresa=codigo_empresa, cif=cif, direccion=direccion)
            usuario_actual = Usuario.objects.get(user=usuario_actual)


            empresa.usuarios.add(usuario_actual)
            usuario_actual.tipo_usuario = 'propietario'
            usuario_actual.save()
            
            
            return JsonResponse({'message': 'Empresa creada exitosamente', 'userid':usuario_actual.id}, status=201)
        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'Usuario no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Solicitud inválida'}, status=405)