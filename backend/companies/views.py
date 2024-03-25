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


from django.http import JsonResponse
from .models import Empresa


@api_view(['POST'])
@permission_classes([AllowAny])
def register_empresa_view(request):
    if request.method == 'POST':
        data = request.data
        try:
            empresa = Empresa.objects.create_empresa(nombre=data['nombre'], codigo_empresa=data['codigo_empresa'], cif=data['cif'], direccion=data['direccion'])
        except Exception as e:
            return JsonResponse({'errors': str(e)}, status=400)

       
        try:
            empresa = Empresa(nombre=data['nombre'], codigo_empresa=data['codigo_empresa'], cif=data['cif'], direccion=data['direccion'])
            empresa.save()
        except Exception as e:
            empresa.delete() 
            return JsonResponse({'errors': str(e)}, status=400)

       

    else:
        return JsonResponse({'error': 'Invalid Request'}, status=405)