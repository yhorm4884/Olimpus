from django.views.decorators.csrf import csrf_exempt
from notifications.models import Notificacion
from activities.models import Actividad
from django.http import JsonResponse
from django.utils import timezone
from users.models import Usuario
import json

@csrf_exempt
def solicitar_unirse_actividad(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Carga los datos JSON de la solicitud
            print(data)
            user_id = data.get('user_id')
            actividad_id = data.get('actividad_id')

            usuario = Usuario.objects.get(id=user_id)
            actividad = Actividad.objects.get(codigo_actividad=actividad_id)

            # Verificar que el usuario no esté ya inscrito
            if actividad.participantes_actividad.filter(id=user_id).exists():
                return JsonResponse({'error': 'Ya estás inscrito en esta actividad'}, status=400)

            # Asumimos que hay un propietario por empresa y es del tipo 'propietario'
            usuario_propietario = actividad.empresa.usuarios.filter(tipo_usuario='propietario').first()

            # Crear una nueva notificación
            Notificacion.objects.create(
                actividad=actividad,
                usuario_cliente=usuario,
                usuario_propietario=usuario_propietario,
                estado='pendiente'
            )
            return JsonResponse({'message': 'Solicitud enviada'}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Formato de JSON inválido'}, status=400)
        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'Usuario no encontrado'}, status=404)
        except Actividad.DoesNotExist:
            return JsonResponse({'error': 'Actividad no encontrada'}, status=404)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)
@csrf_exempt
def notificaciones_list(request, user_id):
    if request.method == 'GET':
        usuario = Usuario.objects.get(id=user_id)
        notificaciones = Notificacion.objects.filter(usuario_propietario=usuario)
        data = [
            {
                'id': n.id,
                'actividad_nombre': n.actividad.nombre,
                'usuario_cliente': n.usuario_cliente.user.username,
                'estado': n.estado,
                'fecha_creacion': n.fecha_creacion.strftime('%Y-%m-%d %H:%M')
            } for n in notificaciones
        ]
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def notificacion_update(request, notificacion_id):
    try:
        notificacion = Notificacion.objects.get(id=notificacion_id)
        data = json.loads(request.body)
        action = data.get('action')

        if action == 'aceptar':
            actividad = notificacion.actividad
            current_participants_count = actividad.participantes_actividad.count()

            if current_participants_count >= actividad.personas:
                # Si se alcanza o supera la capacidad máxima, envía un mensaje de error
                return JsonResponse({'error': 'Debe aumentar la cantidad de personas para poder aceptarlo'}, status=400)

            if "Solicitud de unión a la empresa" in actividad.nombre:
                print("La actividad es una solicitud de unión a la empresa")
                empresa = actividad.empresa
                empresa.usuarios.add(notificacion.usuario_cliente)
                empresa.save()
            else:
                actividad.participantes_actividad.add(notificacion.usuario_cliente)

            # No eliminamos la notificación aquí, solo cambiamos su estado
            notificacion.estado = 'aceptada'
            notificacion.save()

            return JsonResponse({'message': 'Solicitud aceptada, usuario añadido a la actividad.'}, status=200)

        elif action == 'rechazar':
            # Crear una nueva notificación para el usuario cliente
            Notificacion.objects.create(
                actividad=notificacion.actividad,
                usuario_cliente=notificacion.usuario_cliente,
                usuario_propietario=notificacion.usuario_cliente,  # Enviar la notificación al mismo usuario que solicitó
                estado='rechazada',
                fecha_creacion=timezone.now()
            )
            notificacion.estado = 'rechazada'
            notificacion.save()
            return JsonResponse({'message': 'Solicitud rechazada, el usuario ha sido informado.'}, status=200)

    except Notificacion.DoesNotExist:
        return JsonResponse({'error': 'Notificación no encontrada'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

