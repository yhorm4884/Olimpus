// src/components/Dashboard.js
import React, {useEffect} from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import UsersSection from './UserSection';
import { Link } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import axios from 'axios';

function Dashboard() {
  axios.defaults.withCredentials = true;
  axios.defaults.xsrfCookieName = 'csrftoken';
  axios.defaults.xsrfHeaderName = 'X-CSRFToken';

  const location = useLocation();
  // Llama a useLocation directamente en el nivel superior del componente
  const queryParams = new URLSearchParams(location.search); // Crea URLSearchParams basado en la ubicación actual
  const userId = queryParams.get('userId'); // Obtiene el userId de los parámetros de la URL

  useEffect(() => {
    if (userId) { // Asegúrate de que userId esté presente
      var url = `http://127.0.0.1:8000/api/usuarios/${userId}/`;
      axios.get(url, {
        method: 'GET',
        credentials: 'include', // Importante para las cookies de sesión
      })
      .then((response) => {
        console.log("Actividades recibidas:", response.data);
        
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
    }
  }, [userId]);
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">Usuarios</Typography>
              <Typography color="textSecondary">Administrar usuarios</Typography>
              <Button component={Link} to="/dashboard/users" variant="contained" color="primary" style={{ marginTop: '10px' }}>Ir a Usuarios</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">Empresa</Typography>
              <Typography color="textSecondary">Administrar usuarios</Typography>
              <Button component={Link} to="/dashboard/users" variant="contained" color="primary" style={{ marginTop: '10px' }}>Ir a Usuarios</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">Usuarios</Typography>
              <Typography color="textSecondary">Actividades</Typography>
              <Button component={Link} to="/dashboard/users" variant="contained" color="primary" style={{ marginTop: '10px' }}>Ir a Usuarios</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Routes>
        <Route path="users" element={<UsersSection />} />
        {/* Aquí puedes añadir más rutas para otras secciones del dashboard */}
      </Routes>
    </div>
  );
}
export default Dashboard;
