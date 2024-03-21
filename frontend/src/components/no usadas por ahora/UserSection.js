import React from 'react';
import { Grid } from '@mui/material';
import UserCard from './UserCards';

// Mock de los datos del usuario
const userData = {
  name: 'John Doe',
  email: 'john.doe@example.com'
};

// Mock de los datos de actividades y empresas
const activitiesData = [
  { day: 'Lunes', activities: ['Yoga', 'Pilates'] },
  // Más datos aquí
];

const companiesData = [
  { name: 'Company A', reservations: 5 },
  // Más datos aquí
];

export default function UsersSection() {
    return (
        <Grid container spacing={3}>
        {/* Tarjeta de Usuario */}
        <Grid item xs={12}>
        <UserCard user={userData} />
        </Grid>
         {/* Calendario de Actividades */}
        <Grid item xs={12} md={8}>
            <div style={{ backgroundColor: '#FFF', padding: '20px' }}>
            <h2>Calendario de Actividades</h2>
            {/* Aquí puedes expandir el componente de calendario, por ahora es solo un marcador de posición */}
            {activitiesData.map((activity, index) => (
                <div key={index}>
                <h3>{activity.day}</h3>
                <ul>
                    {activity.activities.map((act, idx) => (
                    <li key={idx}>{act}</li>
                    ))}
                </ul>
                </div>
            ))}
            </div>
        </Grid>

  {/* Empresas Contratadas */}
  <Grid item xs={12} md={4}>
    <div style={{ backgroundColor: '#FFF', padding: '20px' }}>
      <h2>Empresas Contratadas</h2>
      {/* Lista de empresas */}
      {companiesData.map((company, index) => (
        <div key={index}>
          <h3>{company.name}</h3>
          <p>Lugares reservados: {company.reservations}</p>
        </div>
      ))}
    </div>
  </Grid>
</Grid>
);
}