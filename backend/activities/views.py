from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from django.http import JsonResponse, HttpResponse

from activities.models import Actividad
from django.http import JsonResponse
from companies.models import Empresa
from users.models import Usuario
from datetime import datetime
import json

@csrf_exempt
def mostrarActividades(request, user_id):
    try:
        usuario = Usuario.objects.get(pk=user_id)  # Asegurando que buscamos por el ID correcto en el User
        empresas_usuario = Empresa.objects.filter(usuarios__id=usuario.id)  # Obtenemos las empresas del usuario
    except Usuario.DoesNotExist:
        return JsonResponse({'error': 'Usuario no encontrado'}, status=404)

    actividades_participadas = Actividad.objects.filter(empresa__in=empresas_usuario, participantes_actividad=usuario)
    actividades = [{
        'codigo_actividad': actividad.codigo_actividad,
        'nombre': actividad.nombre,
        'hora_entrada': actividad.hora_entrada.isoformat(),
        'hora_salida': actividad.hora_salida.isoformat(),
        'personas': actividad.personas,
        'lugar': actividad.lugar,
        'observaciones': actividad.observaciones,
        'empresa': actividad.empresa.nombre  # Asumiendo que quieres mostrar el nombre de la empresa
    } for actividad in actividades_participadas]

    return JsonResponse({'actividades': actividades})

@csrf_exempt
def mostrarActividadesFecha(request, user_id, date):
    try:
        usuario = Usuario.objects.get(pk=user_id)
        empresas_usuario = Empresa.objects.filter(usuarios__id=usuario.id)
    except Usuario.DoesNotExist:
        return JsonResponse({'error': 'Usuario no encontrado'}, status=404)

    # Convertir la cadena de fecha en un objeto de fecha
    try:
        fecha_seleccionada = datetime.strptime(date, '%Y-%m-%d').date()
    except ValueError:
        return JsonResponse({'error': 'Formato de fecha no válido'}, status=400)

    # Filtrar las actividades por la empresa del usuario y la fecha seleccionada
    actividades_participadas = Actividad.objects.filter(
        empresa__in=empresas_usuario,
        participantes_actividad=usuario,
        hora_entrada=fecha_seleccionada
    )

    actividades = [{
        'codigo_actividad': actividad.codigo_actividad,
        'nombre': actividad.nombre,
        'hora_entrada': actividad.hora_entrada.isoformat(),
        'hora_salida': actividad.hora_salida.isoformat(),
        'personas': actividad.personas,
        'lugar': actividad.lugar,
        'observaciones': actividad.observaciones,
        'empresa': actividad.empresa.nombre
    } for actividad in actividades_participadas]

    return JsonResponse({'actividades': actividades})
@csrf_exempt
def actividades_disponibles(request, user_id):
    try:
        usuario = Usuario.objects.get(pk=user_id)
        
        # Buscar las empresas relacionadas con el usuario
        empresas_usuario = Empresa.objects.filter(usuarios__id=usuario.id)
        
        print("Usuario", usuario, "Empresa usuario", empresas_usuario)
       
        # Filtrar actividades por las empresas del usuario y que no incluyan al usuario como participante
        actividades = Actividad.objects.filter(empresa__in=empresas_usuario).exclude(participantes_actividad=usuario)
        
        data = [{
            'codigo_actividad': act.codigo_actividad,
            'nombre': act.nombre,
            'hora_entrada': act.hora_entrada.isoformat(),
            'hora_salida': act.hora_salida.isoformat(),
            'personas': act.personas,
            'lugar': act.lugar,
            'observaciones': act.observaciones,
            'empresa': act.empresa.nombre  # Asumiendo que cada actividad está vinculada a una empresa
        } for act in actividades]

        return JsonResponse({'actividades': data}, safe=False)

    except Usuario.DoesNotExist:
        return JsonResponse({'error': 'Usuario no encontrado'}, status=404)
    
@csrf_exempt
def actividades(request, user_id):
    usuario = Usuario.objects.get(id=user_id)
    if request.method == 'GET':
        actividades = Actividad.objects.filter(empresa__usuarios=usuario)
        actividades_data = [{'id': act.id,'codigo_actividad':act.codigo_actividad, 'nombre': act.nombre, 'hora_entrada': act.hora_entrada, 'hora_salida': act.hora_salida, 'personas': act.personas, 'lugar': act.lugar, 'observaciones': act.observaciones} for act in actividades]
        return JsonResponse(actividades_data, safe=False)

    elif request.method == 'POST':
        data = json.loads(request.body)
        empresa = Empresa.objects.get(usuarios=usuario)
        nueva_actividad = Actividad.objects.create(
            empresa=empresa,
            nombre=data['nombre'],
            hora_entrada=data['hora_entrada'],
            hora_salida=data['hora_salida'],
            personas=data['personas'],
            lugar=data['lugar'],
            observaciones=data.get('observaciones', '')
        )
        return JsonResponse({'message': 'Actividad creada con éxito', 'id': nueva_actividad.id}, status=201)

@csrf_exempt
def actividad_detail(request, actividad_id):
    actividad = Actividad.objects.get(id=actividad_id)
    if request.method == 'POST':
        data = json.loads(request.body)
        actividad.nombre = data.get('nombre', actividad.nombre)
        actividad.hora_entrada = data.get('hora_entrada', actividad.hora_entrada)
        actividad.hora_salida = data.get('hora_salida', actividad.hora_salida)
        actividad.personas = data.get('personas', actividad.personas)
        actividad.lugar = data.get('lugar', actividad.lugar)
        actividad.observaciones = data.get('observaciones', actividad.observaciones)
        actividad.save()
        return JsonResponse({'message': 'Actividad actualizada con éxito'}, status=200)
    elif request.method == 'DELETE':
        actividad.delete()
        return JsonResponse({'message': 'Actividad eliminada con éxito'}, status=200)

@csrf_exempt
def add_actividad(request, user_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        response = HttpResponse("\n\n\n\n\n\n Datos:" + str(data), content_type="text/plain")

        
        empresa = Empresa.objects.get(usuarios__id=user_id)  # Asumimos que el usuario pertenece a una empresa
        nueva_actividad = Actividad.objects.create(
            codigo_actividad = data['codigo_actividad'],
            nombre=data['nombre'],
            hora_entrada=data['hora_entrada'],
            hora_salida=data['hora_salida'],
            personas=data['personas'],
            lugar=data['lugar'],
            observaciones=data.get('observaciones', ''),
            empresa=empresa
        )
        return JsonResponse({'message': 'Actividad creada con éxito', 'id': nueva_actividad.id}, status=201)

    return JsonResponse({'error': 'Método no permitido'}, status=405)
@csrf_exempt
def edit_actividad(request, actividad_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            actividad = Actividad.objects.get(id=actividad_id)
        except Actividad.DoesNotExist:
            return JsonResponse({'error': 'Actividad no encontrada'}, status=400)

        actividad.nombre = data.get('nombre', actividad.nombre)
        actividad.codigo_actividad = data.get('codigo_actividad', actividad.codigo_actividad)
        actividad.hora_entrada = data.get('hora_entrada', actividad.hora_entrada)
        actividad.hora_salida = data.get('hora_salida', actividad.hora_salida)
        actividad.personas = data.get('personas', actividad.personas)
        actividad.lugar = data.get('lugar', actividad.lugar)
        actividad.observaciones = data.get('observaciones', actividad.observaciones)
        actividad.save()
        return JsonResponse({'message': 'Actividad actualizada con éxito'}, status=200)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    
@csrf_exempt
def delete_activity(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        activity_id = data.get('id')
        try:
            activity = Actividad.objects.get(id=activity_id)
            activity.delete()
            return JsonResponse({'message': 'Actividad eliminada con éxito'}, status=200)
        except Actividad.DoesNotExist:
            return JsonResponse({'error': 'Actividad no encontrada'}, status=404)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)
@csrf_exempt
def delete_activities(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            activity_ids = data['ids']
            Actividad.objects.filter(id__in=activity_ids).delete()
            return JsonResponse({'message': 'Actividades eliminadas con éxito.'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)