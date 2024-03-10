from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from .models import Usuario

class UserRegistrationForm(UserCreationForm):
    DNI = forms.CharField(max_length=9, required=True)
    telefono = forms.CharField(max_length=20, required=True)
    tipo_usuario = forms.ChoiceField(choices=Usuario.TIPO_USUARIO_OPCIONES, required=True)
    estado = forms.ChoiceField(choices=Usuario.ESTADO_OPCIONES, required=True)
    photo = forms.ImageField(required=False)

    class Meta(UserCreationForm.Meta):
        model = get_user_model()
        fields = UserCreationForm.Meta.fields + ('email', 'first_name', 'last_name', 'DNI', 'telefono', 'tipo_usuario', 'estado', 'photo')

    def save(self, commit=True):
        user = super().save(commit=commit)
        dni = self.cleaned_data['DNI']
        telefono = self.cleaned_data['telefono']
        tipo_usuario = self.cleaned_data['tipo_usuario']
        estado = self.cleaned_data['estado']
        photo = self.cleaned_data.get('photo', None)
        
        usuario, created = Usuario.objects.update_or_create(
            user=user,
            defaults={'DNI': dni, 'telefono': telefono, 'tipo_usuario': tipo_usuario, 'estado': estado, 'photo': photo}
        )
        return user
