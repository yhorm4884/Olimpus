// src/components/ActivityCalendar.js
import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

// Datos de ejemplo para actividades. Deberías reemplazar esto con datos reales posiblemente obtenidos de tu backend
const actividadesEjemplo = [
  { id: 1, nombre: "Yoga", fecha: "2024-03-25", hora: "10:00" },
  { id: 2, nombre: "Crossfit", fecha: "2024-03-26", hora: "12:00" },
  { id: 3, nombre: "Spinning", fecha: "2024-03-27", hora: "08:00" },
];

const ActivityCalendar = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Calendario de Actividades
        </Typography>
        <Grid container spacing={2}>
          {actividadesEjemplo.map((actividad) => (
            <Grid item xs={12} md={4} key={actividad.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h3">{actividad.nombre}</Typography>
                  <Typography variant="body1">Fecha: {actividad.fecha}</Typography>
                  <Typography variant="body1">Hora: {actividad.hora}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ActivityCalendar;
