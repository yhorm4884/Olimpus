from rest_framework.decorators import api_view, permission_classes
from django_otp.plugins.otp_totp.models import TOTPDevice
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import AllowAny
from django.middleware.csrf import get_token
from django.contrib.auth.models import User
from django.http import JsonResponse
from .models import Usuario
from io import BytesIO
import qrcode
import base64
import json


@api_view(['GET'])
@permission_classes([AllowAny])
def check_user_authenticated(request):
    is_authenticated = request.user.is_authenticated
    print(is_authenticated)
    return JsonResponse({'isAuthenticated': is_authenticated})

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    if request.method == 'POST':
        data = request.data

        # Verifica que las contraseñas coincidan
        if data['password1'] != data['password2']:
            return JsonResponse({'errors': 'Las contraseñas no coinciden'}, status=400)

        # Crea el usuario en el modelo User, usando el correo como username
        try:
            user = User.objects.create_user(username=data['username'], email=data['correo'], password=data['password1'])
        except Exception as e:
            return JsonResponse({'errors': str(e)}, status=400)

        # A continuación, crea tu modelo de Usuario personalizado asociado a este usuario
        try:
            usuario = Usuario(user=user, DNI=data['DNI'], telefono=data['telefono'], tipo_usuario=data.get('tipo_usuario', 'cliente'), estado=data.get('estado', 'activo'))
            usuario.save()
        except Exception as e:
            user.delete()  # Elimina el usuario de User si falla la creación del Usuario personalizado
            return JsonResponse({'errors': str(e)}, status=400)

        # Crea el dispositivo TOTP para el nuevo usuario
        try:
            device = TOTPDevice.objects.create(user=user, name='default', confirmed=True)

            # Generar el código QR para el dispositivo TOTP
            otpauth_url = device.config_url
            img = qrcode.make(otpauth_url)
            buffer = BytesIO()
            img.save(buffer, format="PNG")
            qr_code = base64.b64encode(buffer.getvalue()).decode('utf-8')

            return JsonResponse({'qr_code': qr_code}, status=201)
        except Exception as e:
            # Considera manejar este error también, posiblemente eliminando el usuario y el usuario personalizado si es necesario
            return JsonResponse({'errors': 'Error al crear el dispositivo TOTP: ' + str(e)}, status=400)

    else:
        return JsonResponse({'error': 'Invalid Request'}, status=405)
@csrf_protect
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    otp_token = data.get('otpToken')

    user = authenticate(username=username, password=password)
    
    if user:
        device = TOTPDevice.objects.filter(user=user, name='default').first()
        print(device)
        print(otp_token)
        if device and device.verify_token(otp_token):
            login(request, user)  # Esto establecerá la sesión para el usuario
            return JsonResponse({'success': 'User authenticated','id':user.id,}, status=200)
        else:
            # Maneja el caso donde el dispositivo TOTP no existe o el token OTP es inválido
            return JsonResponse({'error': 'Invalid OTP token or no TOTP device associated'}, status=400)
    else:
        # Maneja el caso de credenciales inválidas
        return JsonResponse({'error': 'Invalid credentials'}, status=400)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def logout_view(request):
    logout(request)
    return JsonResponse({'csrfToken': get_token(request)})