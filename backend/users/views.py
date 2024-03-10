from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django_otp.plugins.otp_totp.models import TOTPDevice
import json
import qrcode
import base64
from io import BytesIO
from .models import Usuario
from django.contrib.auth import authenticate, login
from django_otp import devices_for_user

@csrf_exempt
def register_request(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        # Verifica que las contraseñas coincidan
        if data['password1'] != data['password2']:
            return JsonResponse({'errors': 'Las contraseñas no coinciden'}, status=400)

        # Crea el usuario en el modelo User, usando el correo como username
        try:
            user = User.objects.create_user(username=data['username'], email=data['correo'], password=data['password1'])
            user.save()
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
        device = TOTPDevice.objects.create(user=user, name='default', confirmed=True)

        # Aquí, accedemos directamente a config_url como un atributo, no como un método
        otpauth_url = device.config_url

        # Generar el código QR para el dispositivo TOTP
        img = qrcode.make(otpauth_url)
        buffer = BytesIO()
        img.save(buffer, format="PNG")
        qr_code = base64.b64encode(buffer.getvalue()).decode('utf-8')
        return JsonResponse({'qr_code': qr_code}, status=201)
    return JsonResponse({'error': 'Invalid Request'}, status=405)


@csrf_exempt
def login_view(request):
    if request.method == 'GET':
        username = request.GET.get('username')
        password = request.GET.get('password')
        otp_token = request.GET.get('otp_token')

        # Autenticación básica de usuario
        user = authenticate(username=username, password=password)

        if user is not None:
            # Obtiene el dispositivo TOTP asociado al usuario
            device = TOTPDevice.objects.filter(user=user).first()
            if device:
                # Verifica el token OTP
                if device.verify_token(otp_token):
                    login(request, user)
                    return JsonResponse({'success': 'User authenticated'})
                else:
                    return JsonResponse({'error': 'Invalid OTP token'}, status=400)
            else:
                return JsonResponse({'error': 'No TOTP device associated with the user'}, status=400)
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    else:
        return JsonResponse({'error': 'This method is not allowed'}, status=405)