import random
from faker import Faker
from datetime import datetime, timedelta
from django.utils import timezone
from users.models import Usuario
from companies.models import Empresa
from activities.models import Actividad, ParticipanteActividad
from django.core.exceptions import ValidationError
import re

fake = Faker()

# Función para generar usuarios con datos válidos
def generate_users(num_users):
    users = []
    for _ in range(num_users):
        try:
            user = Usuario.objects.create(
                tipo_usuario=random.choice(['cliente', 'propietario', 'administrador']),
                nombre=fake.first_name(),
                apellidos=fake.last_name(),
                telefono=fake.numerify(text='#########'),  # Teléfono de 9 dígitos
                DNI=generate_random_dni(),
                correo=fake.email(),
                contraseña=fake.password(),
            )
            users.append(user)
        except ValidationError:
            pass  # Ignorar usuarios con datos no válidos
    return users

# Función para generar un número de DNI aleatorio
def generate_random_dni():
    # Generar 8 dígitos aleatorios
    dni = ''.join(random.choices('0123456789', k=8))
    # Calcular la letra del DNI
    letras = 'TRWAGMYFPDXBNJZSQVHLCKE'
    dni += letras[int(dni) % 23]
    return dni

# Función para generar empresas con datos válidos
def generate_companies(num_companies):
    companies = []
    for _ in range(num_companies):
        try:
            cif = str(fake.unique.random_number(digits=8)) + fake.random_letter().upper()
            company = Empresa.objects.create(
                codigo_empresa=fake.uuid4(),
                nombre=fake.company(),
                cif=cif,
                direccion=fake.address(),
            )
            companies.append(company)
        except ValidationError:
            pass  # Ignorar empresas con datos no válidos
    return companies


# Función para generar actividades con datos válidos
def generate_activities(num_activities, users, companies):
    activities = []
    for _ in range(num_activities):
        try:
            activity = Actividad.objects.create(
                codigo_actividad=fake.uuid4(),
                nombre=fake.catch_phrase(),  # Frase descriptiva de actividad deportiva
                hora_entrada=timezone.now() + timedelta(days=random.randint(1, 30)),
                hora_salida=timezone.now() + timedelta(days=random.randint(31, 60)),
                personas=random.randint(1, 20),
                lugar=fake.random_element(elements=('Gimnasio', 'Pista de tenis', 'Campo de fútbol', 'Piscina')),  # Lugares deportivos
                observaciones=fake.text(max_nb_chars=100),  # Limitar la longitud de las observaciones
            )
            activity.empresas.add(random.choice(companies))
            participants = random.sample(users, random.randint(1, len(users)))
            for participant in participants:
                ParticipanteActividad.objects.create(usuario=participant, actividad=activity, fecha_inscripcion=timezone.now())
            activities.append(activity)
        except ValidationError:
            pass  # Ignorar actividades con datos no válidos
    return activities

if __name__ == "__main__":
    # Generar usuarios
    num_users = 50
    users = generate_users(num_users)
    print(f"Generated {len(users)} users")

    # Generar empresas
    num_companies = 20
    companies = generate_companies(num_companies)
    print(f"Generated {len(companies)} companies")

    # Generar actividades
    num_activities = 100
    activities = generate_activities(num_activities, users, companies)
    print(f"Generated {len(activities)} activities")
