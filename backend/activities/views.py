from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from activities.models import Actividad
from django.http import JsonResponse
from companies.models import Empresa
from users.models import Usuario
import json


@api_view(['GET'])
@permission_classes([AllowAny])
def mostrarActividades(request):
    data = json.loads(request.body)
    username = data.get('username')
    
    try:
        usuario = Usuario.objects.get(user__username=username)
    except Usuario.DoesNotExist:
        return JsonResponse({'error': 'Usuario no encontrado'}, status=404)

    actividades_participadas = usuario.actividades_participadas.all()
    
    actividades = []
    for actividad in actividades_participadas:
        actividades.append({
            'codigo_actividad': actividad.codigo_actividad,
            'nombre': actividad.nombre,
            'hora_entrada': actividad.hora_entrada,
            'hora_salida': actividad.hora_salida,
            'personas': actividad.personas,
            'lugar': actividad.lugar,
            'observaciones': actividad.observaciones,
            'empresas': [empresa.nombre for empresa in actividad.empresas.all()],
            
        })
    
    return JsonResponse({'actividades': actividades})

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
        print("\n\n\n\n\n\n Datos:", data)
        empresa = Empresa.objects.get(usuarios__id=user_id)  # Asumimos que el usuario pertenece a una empresa
        nueva_actividad = Actividad.objects.create(
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