from rest_framework import serializers
from activities.models import Actividad
from users.models import Usuario
from companies.models import Empresa
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from notifications.models import Notificacion


class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__'

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']

class UsuarioSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Usuario
        fields = ['id', 'DNI', 'telefono', 'tipo_usuario', 'estado', 'photo', 'user', 'actividades']
        depth = 1  

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(**user_data)
        usuario = Usuario.objects.create(user=user, **validated_data)
        return usuario

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        user = instance.user

        instance.DNI = validated_data.get('DNI', instance.DNI)
        instance.telefono = validated_data.get('telefono', instance.telefono)
        # Continúa con los demás campos
        instance.save()

        user.username = user_data.get('username', user.username)
        user.email = user_data.get('email', user.email)
        # Actualiza los campos restantes de User
        user.save()

        return instance
class EmpresaSerializer(serializers.ModelSerializer):
    usuarios = UsuarioSerializer(many=True, read_only=True)

    class Meta:
        model = Empresa
        fields = ['id_empresa', 'codigo_empresa', 'nombre', 'cif', 'usuarios', 'direccion', 'estado', 'photo']


class ActividadSerializer(serializers.ModelSerializer):
    empresas = EmpresaSerializer(many=True, read_only=True)
    participantes_actividad = UsuarioSerializer(many=True, read_only=True, source='participantes')

    class Meta:
        model = Actividad
        fields = ['codigo_actividad', 'nombre', 'hora_entrada', 'hora_salida', 'personas', 'lugar', 'observaciones', 'empresas', 'participantes_actividad']
