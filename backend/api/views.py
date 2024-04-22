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

#csrf
@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def set_csrf_cookie(request):
    return Response("CSRF Cookie set.")
    
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

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset().filter(usuario_propietario=request.user, is_expired=False))
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        notificacion = self.get_object()
        if notificacion.is_expired:
            return Response({'error': 'La notificación ha expirado'}, status=status.HTTP_400_BAD_REQUEST)

        estado = request.data.get('estado')
        if estado in ['aceptada', 'rechazada']:
            notificacion.estado = estado
            notificacion.save()
            return Response({'mensaje': 'Estado actualizado correctamente'}, status=status.HTTP_200_OK)
        return Response({'error': 'Estado no válido'}, status=status.HTTP_400_BAD_REQUEST)