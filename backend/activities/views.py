from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
import json
# Create your views here.
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .models import Actividad, Usuario

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
