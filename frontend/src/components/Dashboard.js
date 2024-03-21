import React, { useEffect, } from 'react';
import axios from 'axios';
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { useParams  } from 'react-router-dom';

function Dashboard() {
  const { userId } = useParams(); // Obtiene userId de la ruta

  useEffect(() => {
    console.log(userId)
    if (userId) {
      const url = `http://127.0.0.1:8000/api/usuarios/${userId}/`;
      axios.get(url, {
        withCredentials: true,
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
    }
  }, [userId]);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Perfil del Usuario</Typography>
            <Button component="a" href={`/dashboard/profile/${userId}`} style={{ marginTop: '10px' }}>
              Ver Perfil
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Calendario de Actividades</Typography>
            <Button component="a" href="/dashboard/activities" style={{ marginTop: '10px' }}>
              Ver Actividades
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
