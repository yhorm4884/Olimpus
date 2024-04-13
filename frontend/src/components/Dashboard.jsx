import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Grid, Paper, Typography, Button, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from 'react-router-dom';

function Dashboard() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(true);

  useEffect(() => {
    console.log(userId);
    if (userId) {
      const url = `http://127.0.0.1:8000/api/usuarios/${userId}/`;
      axios.get(url, { withCredentials: true })
        .then(response => {
          console.log("Datos", response.data);
          setUserData(response.data);
          if (response.data.tipo_usuario !== 'cliente') {
            setOpenSnackbar(false);
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [userId]);
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const renderMessageForUserType = () => {
    if (userData?.tipo_usuario === 'cliente') {
      return (
      <Snackbar
        open={openSnackbar}
        autoHideDuration={15000}
        onClose={handleCloseSnackbar}
        message={
          <span>
            Bienvenido a tu Dashboard. Aquí puedes ver tu perfil y las actividades en las que participas.
            {userData?.tipo_usuario === 'cliente' && (
              <Button color="secondary" size="small" onClick={() => alert('Navigate to register as a propietario')}>
                Si quieres ser propietario, pulsa este botón.
              </Button>
            )}
          </span>
        }
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />
    );
  } else if (userData?.tipo_usuario === 'propietario') {
      return (
        <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Bienvenido a tu Dashboard. Aquí puedes ver tu perfil y  gestionar las actividades de tu empresa."
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />
      );
    } else if (userData?.tipo_usuario === 'administrador') {
      return (
        <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Bienvenido a tu Dashboard. Aquí puedes ver tu perfil y las actividades en las que participas."
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />
      );
    }
    return null;
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      {renderMessageForUserType()}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Perfil del Usuario</Typography>
            <Button component="a" href={`/dashboard/profile/${userId}`} style={{ marginTop: '10px' }}>
              Ver Perfil
            </Button>
          </Paper>
        </Grid>
        {/* Condicionalmente renderizamos esta parte solo si el tipo de usuario es 'cliente' o 'administrador' */}
        {['cliente', 'administrador'].includes(userData?.tipo_usuario) && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Calendario de Actividades</Typography>
              <Button component="a" href="/dashboard/activities" style={{ marginTop: '10px' }}>
                Ver Actividades
              </Button>
            </Paper>
          </Grid>
        )}
        {/* Condicionalmente renderizamos esta parte solo si el tipo de usuario es 'propietario' */}
        {userData?.tipo_usuario === 'propietario' && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Gestión de Empresa</Typography>
              <Button component="a" href="/dashboard/company-management" style={{ marginTop: '10px' }}>
                Ver Empresa
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default Dashboard;
