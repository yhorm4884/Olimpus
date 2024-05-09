from .serializers import UsuarioSerializer, EmpresaSerializer, ActividadSerializer, NotificacionSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import get_object_or_404
from notifications.models import Notificacion
from rest_framework.response import Response
from activities.models import  Actividad
from companies.models import  Empresa
from django.http import JsonResponse
from rest_framework import viewsets, status
from users.models import  Usuario
from django.conf import settings
import requests

#csrf
@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def set_csrf_cookie(request):
    return Response("CSRF Cookie set.")
    
def geocode_address(request):
    address = request.GET.get('address', '')
    if not address:
        return JsonResponse({'error': 'Address parameter is missing'}, status=400)

    params = {
        'address': address,
        'key': settings.GOOGLE_MAPS_API_KEY
    }
    response = requests.get('https://maps.googleapis.com/maps/api/geocode/json', params=params)

    if response.status_code == 200:
        data = response.json()
        if data['status'] == 'OK':
            return JsonResponse(data['results'][0]['geometry']['location'])
        else:
            return JsonResponse({'error': 'Geocoding failed', 'message': data['status']}, status=500)
    else:
        return JsonResponse({'error': 'Failed to contact Google Maps API'}, status=response.status_code)

class UsuarioViewSet(viewsets.ModelViewSet):
    # authentication_classes=[ SessionAuthentication ]
    # permission_classes = [IsAuthenticated]
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class EmpresaViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    # authentication_classes = [SessionAuthentication]
    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer
   

    # def get_queryset(self):
    #     return self.queryset.filter(client=self.request.user.client)

class ActividadViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    # authentication_classes = [SessionAuthentication]
    queryset = Actividad.objects.all()
    serializer_class = ActividadSerializer
    

    # def get_queryset(self):
    #     return self.queryset.filter(client=self.request.user.client)
class NotificacionViewSet(viewsets.ViewSet):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer

   