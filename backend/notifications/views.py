from django.views.decorators.csrf import csrf_exempt
from notifications.models import Notificacion
from django.http import JsonResponse
from django.utils import timezone
from users.models import Usuario
import json

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

@csrf_exempt
def notificacion_update(request, notificacion_id):
    try:
        notificacion = Notificacion.objects.get(id=notificacion_id)
        data = json.loads(request.body)
        action = data.get('action')

        if action == 'aceptar':
            if "Solicitud de unión a la empresa" in notificacion.actividad.nombre:
                print("La actividad es una solicitud de unión a la empresa")
                empresa = notificacion.actividad.empresa
                empresa.usuarios.add(notificacion.usuario_cliente)
                empresa.save()
            else:
                notificacion.actividad.participantes_actividad.add(notificacion.usuario_cliente)
            notificacion.delete()
            return JsonResponse({'message': 'Solicitud aceptada, usuario añadido a la actividad.'}, status=200)

        elif action == 'rechazar':
            # Crear una nueva notificación para el usuario cliente y eliminar la solicitud actual
            Notificacion.objects.create(
                actividad=notificacion.actividad,
                usuario_cliente=notificacion.usuario_cliente,
                usuario_propietario=notificacion.usuario_cliente,  # Enviar la notificación al mismo usuario que solicitó
                estado='rechazada',
                fecha_creacion=timezone.now()
            )
            notificacion.delete()
            return JsonResponse({'message': 'Solicitud rechazada, el usuario ha sido informado.'}, status=200)

    except Notificacion.DoesNotExist:
        return JsonResponse({'error': 'Notificación no encontrada'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

