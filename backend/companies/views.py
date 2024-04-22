from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.http import JsonResponse
from users.models import Usuario
from .models import Empresa
import json


# @api_view(['POST'])
# @permission_classes([AllowAny])
@csrf_exempt
def register_empresa_view(request):
    if request.method == 'POST':
        try:
            user_related = request.user
            usuario_actual = User.objects.get(pk=user_related.pk)

            nombre = request.POST.get('nombre')
            codigo_empresa = request.POST.get('codigo_empresa')
            cif = request.POST.get('cif')
            direccion = request.POST.get('direccion')
            empresa_existente = Empresa.objects.filter(codigo_empresa=codigo_empresa).first()
            if empresa_existente:
                return JsonResponse({'error': 'La empresa ya existe'}, status=400)

            empresa = Empresa.objects.create(nombre=nombre, codigo_empresa=codigo_empresa, cif=cif, direccion=direccion)
            usuario_actual = Usuario.objects.get(user=usuario_actual)


            empresa.usuarios.add(usuario_actual)
            usuario_actual.tipo_usuario = 'propietario'
            usuario_actual.save()
            
            
            return JsonResponse({'message': 'Empresa creada exitosamente', 'userid':usuario_actual.id}, status=201)
        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'Usuario no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Solicitud inválida'}, status=405)

@csrf_exempt
def empresa_detail(request, user_id):
    if request.method == 'GET':
        try:
            usuario = Usuario.objects.get(id=user_id, tipo_usuario='propietario')
            empresa = Empresa.objects.get(usuarios=usuario)
            empresa_data = {
                'id': empresa.id_empresa,
                'nombre': empresa.nombre,
                'estado': empresa.estado,
                'direccion': empresa.direccion,
                'photo': empresa.photo.url if empresa.photo else None
            }
            return JsonResponse(empresa_data)
        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'Usuario no encontrado'}, status=404)
        except Empresa.DoesNotExist:
            return JsonResponse({'error': 'Empresa no encontrada'}, status=404)

    elif request.method == 'POST':
        data = json.loads(request.body)
        usuario = Usuario.objects.get(id=user_id, tipo_usuario='propietario')
        empresa = Empresa.objects.get(usuarios=usuario)
        empresa.nombre = data.get('nombre', empresa.nombre)
        empresa.estado = data.get('estado', empresa.estado)
        empresa.direccion = data.get('direccion', empresa.direccion)
        empresa.save()
        return JsonResponse({'message': 'Datos de la empresa actualizados con éxito'}, status=200)
    

@csrf_exempt
def join(request, company_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id = data.get('userId')
        print(data)
        print(company_id)  # Debería mostrar el ID de la empresa
        print(user_id)  # Debería mostrar el ID del usuario

        usuario = get_object_or_404(Usuario, pk=user_id)
        empresa = get_object_or_404(Empresa, pk=company_id)

        empresa.usuarios.add(usuario)
        empresa.save()

        return JsonResponse({'message': 'Usuario unido a la empresa con éxito.'}, status=200)

    return JsonResponse({'error': 'Método no permitido'}, status=400)