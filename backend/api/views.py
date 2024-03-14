from .serializers import UsuarioSerializer, EmpresaSerializer, ActividadSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.response import Response
from activities.models import  Actividad
from companies.models import  Empresa
from rest_framework import viewsets
from users.models import  Usuario

#csrf
@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def set_csrf_cookie(request):
    return Response("CSRF Cookie set.")
    
class UsuarioViewSet(viewsets.ModelViewSet):
    authentication_classes=[ SessionAuthentication ]
    permission_classes = [IsAuthenticated]
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class EmpresaViewSet(viewsets.ModelViewSet):
    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer
    # permission_classes = [IsAuthenticated]
    # authentication_classes = [SessionAuthentication]

    # def get_queryset(self):
    #     return self.queryset.filter(client=self.request.user.client)

class ActividadViewSet(viewsets.ModelViewSet):
    queryset = Actividad.objects.all()
    serializer_class = ActividadSerializer
    # permission_classes = [IsAuthenticated]
    # authentication_classes = [SessionAuthentication]

    # def get_queryset(self):
    #     return self.queryset.filter(client=self.request.user.client)
