from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from .serializers import UsuarioSerializer, EmpresaSerializer, ActividadSerializer
from activities.models import  Actividad
from users.models import  Usuario
from companies.models import  Empresa

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    # permission_classes = [IsAuthenticated]
    # authentication_classes = [SessionAuthentication]

    # def get_queryset(self):
    #     return self.queryset.filter(client=self.request.user.client)

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
