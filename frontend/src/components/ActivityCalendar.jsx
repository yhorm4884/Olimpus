import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const ActivityCalendar = () => {
  const [actividades, setActividades] = useState([]);

  useEffect(() => {
    // Ruta del endpoint para obtener las actividades, ajusta según tu configuración de backend
    const fetchActividades = async () => {
      try {
        const response = await axios.get('http://backend.olimpus.arkania.es/api/actividades');
        console.log(response.data);
        setActividades(response.data); // Asume que la respuesta viene en un formato adecuado
      } catch (error) {
        console.error('Error al obtener actividades:', error);
        // Aquí podrías manejar el error, por ejemplo, mostrando un mensaje al usuario
      }
    };

    fetchActividades();
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez al montar el componente

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Calendario de Actividades
        </Typography>
        <Grid container spacing={2}>
          {actividades.map((actividad) => (
            <Grid item xs={12} md={4} key={actividad.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h3">{actividad.nombre}</Typography>
                  <Typography variant="body1">Fecha: {actividad.hora_entrada.split('T')[0]}</Typography>
                  <Typography variant="body1">Hora: {actividad.hora_entrada.split('T')[1].split('Z')[0]}</Typography>
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