from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.tokens import default_token_generator
from django_otp.plugins.otp_totp.models import TOTPDevice
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_protect,csrf_exempt
from django.template.loader import render_to_string
from rest_framework.permissions import AllowAny
from django.utils.encoding import force_bytes
from django.utils.encoding import force_str
from django.middleware.csrf import get_token
from django.contrib.auth.models import User
from django.utils.html import strip_tags
from django.core.mail import send_mail
from django.http import JsonResponse
from .models import Usuario
from io import BytesIO
import qrcode
import base64
import json


@api_view(['GET'])
@permission_classes([AllowAny])
def prueba(request):
    return JsonResponse({'usuario:':request.user.is_authenticated})

@api_view(['GET'])
@permission_classes([AllowAny])
def check_user_authenticated(request):
    is_authenticated = request.user.is_authenticated
    if is_authenticated:
        # El usuario está autenticado, devolver también el ID del usuario.
        user_id = request.user.usuario.id
        return JsonResponse({'isAuthenticated': is_authenticated, 'userId': user_id})
    else:
        # El usuario no está autenticado, solo devolver el estado.
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
        print(device.verify_token(otp_token))
        login(request, user)  # Esto establecerá la sesión para el usuario
            
        actividades = list(user.usuario.actividades_participadas.values('id', 'nombre', 'observaciones'))  # Asume que las actividades tienen estos campos
        print("actividades: ",actividades)
        print("user: ",user.usuario.id)
        return JsonResponse({'success': 'User authenticated','id':user.usuario.id,'actividades':actividades}, status=200)
        # if device and device.verify_token(otp_token):
        #     login(request, user)  # Esto establecerá la sesión para el usuario
            
        #     actividades = list(user.usuario.actividades_participadas.values('id', 'nombre', 'observaciones'))  # Asume que las actividades tienen estos campos
        #     print("actividades: ",actividades)
        #     print("user: ",user.usuario.id)
        #     return JsonResponse({'success': 'User authenticated','id':user.usuario.id,'actividades':actividades}, status=200)
        # else:
        #     # Maneja el caso donde el dispositivo TOTP no existe o el token OTP es inválido
        #     return JsonResponse({'error': 'Invalid OTP token or no TOTP device associated'}, status=400)
    else:
        # Maneja el caso de credenciales inválidas
        return JsonResponse({'error': 'Invalid credentials'}, status=400)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def logout_view(request):
    logout(request)
    return JsonResponse({'csrfToken': get_token(request)})


@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    email = request.data.get('email')
    user = User.objects.filter(email=email).first()

    if user:
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        domain = '127.0.0.1:3000'
        reset_link = f"http://{domain}/reset-password/{uidb64}/{token}"

        context = {'reset_link': reset_link}
        subject = 'Restablecimiento de Contraseña'
        html_message = render_to_string('emails/password_reset.html', context)
        plain_message = strip_tags(html_message)
        from_email = 'from@example.com'

        send_mail(subject, plain_message, from_email, [email], html_message=html_message)

        return JsonResponse({'message': 'Si tu correo electrónico está registrado, se han enviado instrucciones para restablecer tu contraseña.'})

    return JsonResponse({'error': 'No se pudo enviar el correo de restablecimiento de contraseña.'})


@api_view(['GET'])
def serve_qr_code(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)

        if user is not None and default_token_generator.check_token(user, token):
            device, _ = TOTPDevice.objects.get_or_create(user=user, name='default')
            img = qrcode.make(device.config_url)
            buffer = BytesIO()
            img.save(buffer, format="PNG")
            qr_code_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
            return JsonResponse({'qr_code': qr_code_base64})
        else:
            return JsonResponse({'error': 'Token inválido o expirado.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': 'Error al generar el código QR.'}, status=500)

    
@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_confirm(request):
    uidb64 = request.data.get('uidb64')
    token = request.data.get('token')
    new_password = request.data.get('new_password')

    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.set_password(new_password)
        user.save()
        return JsonResponse({'success': 'La contraseña ha sido actualizada correctamente.'}, status=200)
    else: 
        return JsonResponse({'error': 'El token de restablecimiento de contraseña no es válido o ha expirado.'}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_confirm(request):
    uidb64 = request.data.get('uidb64')
    token = request.data.get('token')
    new_password = request.data.get('new_password')

    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.set_password(new_password)
        user.save()
        return JsonResponse({'success': 'La contraseña ha sido actualizada correctamente.'}, status=200)
    else: 
        return JsonResponse({'error': 'El token de restablecimiento de contraseña no es válido o ha expirado.'}, status=400)
@csrf_exempt
def update_profile(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'No autenticado'}, status=401)
    data = json.loads(request.body)
    telefono = data['telefono']

    # Busca el usuario relacionado para evitar conflictos de unicidad
    try:
        user_related = request.user
        if User.objects.exclude(pk=user_related.pk).filter(email=data['user']['email']).exists():
            return JsonResponse({'error': 'El correo electrónico ya está en uso'}, status=400)

        if Usuario.objects.exclude(user=user_related).filter(telefono=telefono).exists():
            return JsonResponse({'error': 'El teléfono ya está en uso'}, status=400)

        # Actualiza los datos del usuario
        user_related.username = data['user']['username']
        user_related.email = data['user']['email']
        user_related.save()

        # Actualiza los datos adicionales en el modelo Usuario
        usuario, created = Usuario.objects.get_or_create(user=user_related)
        usuario.telefono = telefono
        usuario.save()

        return JsonResponse({'message': 'Perfil actualizado correctamente'}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)