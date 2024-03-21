import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Paper, Typography, Avatar, Grid, Box } from '@mui/material';

const UserProfile = () => {
  const { userId } = useParams(); // Extrae userId de la URL
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (userId) {
      const url = `http://127.0.0.1:8000/api/usuarios/${userId}/`;
      axios.get(url, {
        withCredentials: true,
        // Configura aquí tus headers si son necesarios
      })
      .then(response => {
        console.log(response.data);
        setUserData(response.data); // Ajusta esto según la estructura de tus datos
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
    }
  }, [userId]);

  if (!userData) {
    return <div>Cargando...</div>; // O algún tipo de indicador de carga
  }

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={6} md={4} lg={3} align="center">
          <Avatar src={userData.photo || ''} alt="Foto del Usuario" sx={{ width: 128, height: 128 }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {userData.user?.username || 'Nombre de Usuario'} 
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={8} lg={9}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="body1"><strong>DNI:</strong> {userData.DNI}</Typography>
            <Typography variant="body1"><strong>Teléfono:</strong> {userData.telefono}</Typography>
            <Typography variant="body1"><strong>Correo electrónico:</strong> {userData.email || 'usuario@ejemplo.com'}</Typography>
            <Typography variant="body1"><strong>Estado:</strong> {userData.estado}</Typography>
            <Typography variant="body1"><strong>Descripción:</strong> {userData.descripcion || 'Una breve descripción del usuario...'}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserProfile;
