from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.http import JsonResponse
from users.models import Usuario
from .models import Empresa
from notifications.models import Notificacion
from activities.models import Actividad
import json
from datetime import datetime
import random
import string
from django.http import JsonResponse
import stripe
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import Empresa
from users.models import Usuario
from django.core.exceptions import ValidationError

stripe.api_key = "sk_test_51PBBogCeiEB5qy1OvG85xg5TB7VS8IdY9SliIhcAsELju1EYV2X2mzuzbUcVw4wOhiaQPV3a8D7okSboJxhwY0A700wh486jwP"





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
            usuario = get_object_or_404(Usuario, id=user_id, tipo_usuario='propietario')
            empresa = get_object_or_404(Empresa, usuarios=usuario)
            empresa_data = {
                'id_empresa': empresa.id_empresa,
                'codigo_empresa': empresa.codigo_empresa,
                'nombre': empresa.nombre,
                'cif': empresa.cif,
                'direccion': empresa.direccion,
                'estado': empresa.estado,
                'descripcion': empresa.descripcion,
                'photo': empresa.photo.url if empresa.photo else None
            }
            return JsonResponse(empresa_data)
        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'Usuario no encontrado'}, status=404)
        except Empresa.DoesNotExist:
            return JsonResponse({'error': 'Empresa no encontrada'}, status=404)

    elif request.method == 'POST':
        usuario = get_object_or_404(Usuario, id=user_id, tipo_usuario='propietario')
        empresa = get_object_or_404(Empresa, usuarios=usuario)

        empresa.nombre = request.POST.get('nombre', empresa.nombre)
        empresa.estado = request.POST.get('estado', empresa.estado) == 'True'
        empresa.direccion = request.POST.get('direccion', empresa.direccion)
        empresa.codigo_empresa = request.POST.get('codigo_empresa', empresa.codigo_empresa)
        empresa.cif = request.POST.get('cif', empresa.cif)
        empresa.photo = request.FILES.get('photo')
        # Manejar la carga de archivos
        if 'photo' in request.FILES:
            
            empresa.photo = request.FILES.get('photo')

        # Opcional: Validar CIF si decides habilitar validación nuevamente
        # try:
        #     validar_cif(empresa.cif)
        # except ValidationError as e:
        #     return JsonResponse({'error': str(e)}, status=400)

        empresa.save()
        return JsonResponse({'message': 'Datos de la empresa actualizados con éxito'}, status=200)


    
def generar_codigo_unico():
    codigo = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return codigo
def crear_notificacion_solicitud_unión_empresa(usuario_solicitante, empresa):
    if Notificacion.objects.filter(actividad__empresa=empresa, usuario_cliente=usuario_solicitante).exists():
        return  
    
    nombre_actividad = 'Solicitud de unión a la empresa'
    actividad_existente = Actividad.objects.filter(nombre=nombre_actividad, empresa=empresa).first()
    if actividad_existente:
        actividad = actividad_existente
    else:
        codigo_actividad = generar_codigo_unico()
        while Actividad.objects.filter(codigo_actividad=codigo_actividad).exists():
            codigo_actividad = generar_codigo_unico()

        actividad = Actividad.objects.create(
            codigo_actividad=codigo_actividad,
            nombre=nombre_actividad,
            hora_entrada=datetime.now(),
            hora_salida=datetime.now(),
            personas=1000,
            lugar='Oficina',
            empresa=empresa
        )

    notificacion = Notificacion.objects.create(
        actividad=actividad,
        usuario_cliente=usuario_solicitante,
        usuario_propietario=empresa.usuarios.filter(tipo_usuario='propietario').first(),
        estado='pendiente'
    )
    notificacion.save()

@csrf_exempt
def join(request):
    if request.method == 'POST':

        try:
            
            codigo_empresa = request.POST.get('codigoEmpresa')
            user_id = request.POST.get('userId')
          
            print(codigo_empresa)  

            try:
                usuario = Usuario.objects.get(pk=user_id)
                empresa = Empresa.objects.get(codigo_empresa=codigo_empresa)
            except Usuario.DoesNotExist:
                return JsonResponse({'error': 'El usuario especificado no existe.'}, status=404)
            except Empresa.DoesNotExist:
                return JsonResponse({'error': 'La empresa especificada no existe.'}, status=404)

            try:
                crear_notificacion_solicitud_unión_empresa(usuario, empresa)
                
            except Exception as e:
                return JsonResponse({'error': f'Error al unir usuario a la empresa: {str(e)}'}, status=500)

            return JsonResponse({'message': 'Usuario unido a la empresa con éxito.'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Los datos enviados no son válidos JSON.'}, status=400)

    return JsonResponse({'error': 'Método no permitido'}, status=400)



@csrf_exempt
def crear_sesion_checkout(request):

    if request.method == "POST":
        data = request.POST
        
        try:
            
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'eur',
                            'product_data': {
                                'name': data.get('plan'),  
                            },
                            'unit_amount': int(data.get('cantidad'))*100,  #Multiplicar el rollo por 100 pa pasarlo a centimos
                        },
                        'quantity': 1,
                    },
                ],
                mode='payment',
                
                success_url='https://olimpus.arkania.es/dashboard/link-to-companie/'+str(data.get('userId')), #esto son urls que gestiona el react
                cancel_url='https://olimpus.arkania.es/choose-plan/'+str(data.get('userId')),
            )
            
            return JsonResponse({'sessionId': session.id})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def lista_usuarios(request, id_empresa):
    usuario_actual = request.user.usuario
    # Comprobamos si el usuario actual tiene acceso a la empresa solicitada
    if usuario_actual.empresas.filter(id_empresa=id_empresa).exists() and usuario_actual.tipo_usuario in ['propietario', 'administrador']:
        empresa = Empresa.objects.get(id_empresa=id_empresa)
        usuarios = empresa.usuarios.filter(tipo_usuario='cliente')
        usuarios_data = [{'username': u.user.username, 'id': u.id, 'estado': u.estado} for u in usuarios]
        return JsonResponse({'usuarios': usuarios_data}, safe=False)
    else:
        return JsonResponse({'error': 'No autorizado'}, status=403)
    
@csrf_exempt
def bloquear_usuario(request, id_usuario):
    if request.method == 'POST':
        usuario_a_bloquear = Usuario.objects.get(id=id_usuario)
        usuario_actual = request.user.usuario
        empresa = usuario_actual.empresas.get()
       
        if usuario_a_bloquear in empresa.usuarios.all() and usuario_actual.tipo_usuario in ['propietario', 'administrador']:
            usuario_a_bloquear.estado = 'bloqueado'
            usuario_a_bloquear.save()
            return JsonResponse({'mensaje': 'Usuario bloqueado exitosamente'})
        else:
            return JsonResponse({'error': 'No autorizado'}, status=403)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def eliminar_usuario(request, id_usuario):
    if request.method == 'DELETE':
        usuario_a_eliminar = Usuario.objects.get(id=id_usuario)
        usuario_actual = request.user.usuario
        empresa = usuario_actual.empresas.get()
       
        if usuario_a_eliminar in empresa.usuarios.all() and usuario_actual.tipo_usuario in ['propietario', 'administrador']:

           
            empresa.usuarios.remove(usuario_a_eliminar)
            return JsonResponse({'mensaje': 'Usuario eliminado exitosamente'})
        else:
            return JsonResponse({'error': 'No autorizado'}, status=403)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)