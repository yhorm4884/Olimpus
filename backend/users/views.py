from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from .validators import dni_validator, telefono_validator, email_validator
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.tokens import default_token_generator
from django_otp.plugins.otp_totp.models import TOTPDevice
from django.contrib.auth import authenticate, login, logout
from django.utils.encoding import force_bytes,force_str
from users.models import Usuario, Conversacion, Mensaje
from django.utils.translation import gettext_lazy as _
from django.views.decorators.csrf import csrf_exempt
from django.template.loader import render_to_string
from django.core.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.core.serializers import serialize
from django.middleware.csrf import get_token
from django.contrib.auth.models import User
from django.utils.html import strip_tags
from django.core.mail import send_mail
from django.http import JsonResponse
from companies.models import Empresa


from django.conf import settings
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

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    otp_token = data.get('otpToken')

    user = authenticate(username=username, password=password)
    
    if user:
        usuario_info = Usuario.objects.get(user=user)
        if usuario_info.estado == 'bloqueado':
            return JsonResponse({'error': 'El usuario está bloqueado'}, status=403)
        
        device = TOTPDevice.objects.filter(user=user, name='default').first()

        print("Dispositivo TOTP:", device)
        print("Token OTP recibido:", otp_token)

        resultado_verificacion = device.verify_token(otp_token) if device else False
        print("Resultado de la verificación del token:", resultado_verificacion)

        if device and resultado_verificacion:
            login(request, user)  # Esto establecerá la sesión para el usuario
            actividades = list(usuario_info.actividades_participadas.values('id', 'nombre', 'observaciones'))
            print("Actividades del usuario:", actividades)
            return JsonResponse({'success': 'User authenticated', 'id': usuario_info.id, 'actividades': actividades}, status=200)
        else:
            return JsonResponse({'error': 'Invalid OTP token or no TOTP device associated'}, status=400)
        
    else:
        # Maneja el caso de credenciales inválidas
        return JsonResponse({'error': 'Invalid credentials'}, status=400)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def logout_view(request):
    logout(request)
    return JsonResponse({'csrfToken': get_token(request)})


@csrf_exempt
def forgot_password(request):
    data = json.loads(request.body)
    email = data['email']
    print(email)
    user = User.objects.filter(email=email).first()
    print(user)
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
    
    if request.method == 'POST':
        # Accede a los datos del formulario y al archivo
        
        email = request.POST.get('email')
        username = request.POST.get('username')
        telefono = request.POST.get('telefono')
        photo = request.FILES.get('photo')  # Accede al archivo cargado
        print(request.user)
        try:
            user_related = request.user
            
            # Verificaciones de unicidad para email y teléfono
            if User.objects.exclude(pk=user_related.pk).filter(email=email).exists():
                return JsonResponse({'error': 'El correo electrónico ya está en uso'}, status=400)
            if Usuario.objects.exclude(user=user_related).filter(telefono=telefono).exists():
                return JsonResponse({'error': 'El teléfono ya está en uso'}, status=400)
            
            # Validación del email y teléfono
            email_validator(email)
            telefono_validator(telefono)  # Asume que tienes esta función validadora
            
            # Actualización del usuario
            user_related.username = username
            user_related.email = email
            user_related.save()

            # Actualiza los datos adicionales en el modelo Usuario
            usuario, created = Usuario.objects.get_or_create(user=user_related)
            usuario.telefono = telefono
            if photo:
                usuario.photo.save(photo.name, photo)  # Actualiza la foto si se proporcionó
            usuario.save()

            return JsonResponse({'message': 'Perfil actualizado correctamente'}, status=200)
        except ValidationError as e:
            return JsonResponse({'error': str(e.messages)}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def desactivar_usuario(request, user_id):
    usuario = get_object_or_404(Usuario, pk=user_id)
    
    if usuario.estado != 'activo':
        return JsonResponse({'error': _('El usuario ya está desactivado o bloqueado.')}, status=400)

    usuario.estado = 'bloqueado'
    usuario.save()

    # Genera el token
    token = default_token_generator.make_token(usuario.user)
    # Construye la URL de React para reactivación
    reactivation_url = f"https://olimpus.arkania.es/reactivate/{usuario.user.id}/{token}"

    email_body = _(
        "Tu cuenta ha sido desactivada. Para reactivarla, por favor sigue este enlace: {}"
    ).format(reactivation_url)

    send_mail(
        _('Cuenta Desactivada'),
        email_body,
        settings.EMAIL_HOST_USER,
        [usuario.user.email],
        fail_silently=False,
    )

    return JsonResponse({'mensaje': _('Usuario desactivado exitosamente y correo enviado.')})

def reactivar_usuario(request, user_id, token):
    user = get_object_or_404(get_user_model(), pk=user_id)
    if default_token_generator.check_token(user, token):
        usuario = get_object_or_404(Usuario, user=user)
        if usuario.estado == 'bloqueado':
            usuario.estado = 'activo'
            usuario.save()
            return JsonResponse({'mensaje': _('Cuenta reactivada exitosamente.')})
        else:
            return JsonResponse({'error': _('Esta cuenta no está bloqueada.')}, status=400)
    else:
        return JsonResponse({'error': _('El enlace de reactivación no es válido o ha expirado.')}, status=400)
    
def lista_conversaciones(request, user_id):
    if request.method == 'GET':
        usuario = get_object_or_404(Usuario, id=user_id)
        if usuario.tipo_usuario == 'propietario':
            conversaciones = Conversacion.objects.filter(propietario=usuario)
        else:
            conversaciones = Conversacion.objects.filter(cliente=usuario)
        data = serialize('json', conversaciones, use_natural_foreign_keys=True, fields=('id', 'propietario', 'cliente'))
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    
@csrf_exempt  # Considerar el manejo adecuado de CSRF si es una aplicación en producción
def detalle_conversacion(request, id):
    if request.method == 'GET':
        conversacion = get_object_or_404(Conversacion, id=id)
        mensajes = Mensaje.objects.filter(conversacion=conversacion).order_by('fecha_hora')
        data = serialize('json', mensajes, use_natural_foreign_keys=True, fields=('sender', 'contenido', 'fecha_hora', 'leido'))
        return JsonResponse(data, safe=False)

    elif request.method == 'POST':
        contenido = request.POST.get('contenido')
        mensaje = Mensaje.objects.create(
            conversacion=get_object_or_404(Conversacion, id=id),
            sender=request.user,
            contenido=contenido,
            leido=False
        )
        return JsonResponse({'id': mensaje.id, 'contenido': mensaje.contenido, 'sender': mensaje.sender.username, 'fecha_hora': mensaje.fecha_hora.isoformat()}, status=201)
    
def iniciar_conversacion(request):
    usuario = request.user
    # Asumiendo que el ID del propietario está enviado en el POST request (ajustar según la lógica de negocio)
    propietario_id = request.POST.get('propietario_id')
    propietario = get_object_or_404(Usuario, id=propietario_id, tipo_usuario='propietario')

    # Verificar si ya existe una conversación entre el cliente y el propietario
    conversacion, created = Conversacion.objects.get_or_create(
        propietario=propietario,
        cliente=usuario.usuario
    )

    if created:
        return JsonResponse({'message': 'Conversación iniciada.', 'id': conversacion.id}, status=201)
    else:
        return JsonResponse({'message': 'Conversación ya existe.', 'id': conversacion.id}, status=200)
