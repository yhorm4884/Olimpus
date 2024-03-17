from rest_framework import serializers
from activities.models import Actividad
from users.models import Usuario
from companies.models import Empresa

# Serializador simplificado para Usuario, para evitar la recursión infinita en ActividadSerializer
class UsuarioSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'DNI', 'telefono', 'tipo_usuario', 'estado', 'photo', 'user']

# Serializador para Empresa
class EmpresaSerializer(serializers.ModelSerializer):
    usuarios = UsuarioSimpleSerializer(many=True, read_only=True)  # Muestra información básica de usuarios

    class Meta:
        model = Empresa
        fields = '__all__'

# Serializador para Actividad
class ActividadSerializer(serializers.ModelSerializer):
    participantes_actividad = UsuarioSimpleSerializer(many=True, read_only=True)
    empresas = EmpresaSerializer(many=True, read_only=True)  # Asegúrate de que este campo coincida con tu modelo

    class Meta:
        model = Actividad
        fields = '__all__'

# Serializador completo para Usuario, para uso donde la recursión no es un problema
class UsuarioSerializer(serializers.ModelSerializer):
    actividades_participadas = ActividadSerializer(many=True, read_only=True, source='actividades_participantes')

    class Meta:
        model = Usuario
        fields = '__all__'
