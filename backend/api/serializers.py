# serializers.py
from rest_framework import serializers
from activities.models import  Actividad
from users.models import  Usuario
from companies.models import  Empresa

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = ['nombre','__all__']

class ActividadSerializer(serializers.ModelSerializer):
    participantes_actividad = UsuarioSerializer(many=True)  # Utiliza el serializador de Usuario

    class Meta:
        model = Actividad
        fields = ['id', 'codigo_actividad', 'nombre', 'hora_entrada', 'hora_salida', 'personas', 'lugar', 'observaciones', 'empresas', 'participantes_actividad']
