import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Grid, Paper, Typography, Button, IconButton, Snackbar, Card, CardMedia, CardContent, Divider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function Dashboard() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [userCompanies, setUserCompanies] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

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
            setUserCompanies(response.data.empresas.map(empresa => empresa.id_empresa));
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });

      const companiesUrl = `http://127.0.0.1:8000/api/empresas`;
      axios.get(companiesUrl)
        .then(response => {
          console.log("Empresas", response.data);
          setCompanies(response.data.filter(company => !userCompanies.includes(company.id_empresa)));
        })
        .catch(error => console.error('Error fetching companies:', error));
    }
  }, [userId, userCompanies]);

  const handleOpenDialog = (company) => {
    setSelectedCompany(company);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  const handleJoinCompany = async (companyId) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('companyId', companyId);
    navigate(`/choose-plan/${companyId}`, { state: { userId } });

  };
  
  const handleButtonClick = () => {
    navigate('/register-companie');
  };

  const renderCompanies = () => {
    return companies.map((company) => (
      <Grid item xs={12} sm={6} md={4} key={company.id_empresa} onClick={() => handleOpenDialog(company)}>
        <Card>
          <CardMedia
            component="img"
            height="140"
            image={company.photo || "https://via.placeholder.com/150"}
            alt="Company Image"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {company.nombre}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {company.direccion}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ));
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
                <Button color="secondary" size="small" onClick={handleButtonClick}>
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
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        />
      );
    } else if (userData?.tipo_usuario === 'propietario') {
      return (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message="Bienvenido a tu Dashboard. Aquí puedes ver tu perfil y gestionar las actividades de tu empresa."
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
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Perfil del Usuario</Typography>
            <Button component="a" href={`/dashboard/profile/${userId}`} style={{ marginTop: '10px' }}>
              Ver Perfil
            </Button>
          </Paper>
        </Grid>
        {['cliente'].includes(userData?.tipo_usuario) && (
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6">Calendario de Actividades</Typography>
                        <Button component="a" href={`/dashboard/my-activities/${userId}`} style={{ marginTop: '10px' }}>
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
              <Button component="a" href={`/dashboard/company-management/${userId}`} style={{ marginTop: '10px' }}>
                Ver Empresa
              </Button>
            </Paper>
          </Grid>
        )}
        {userData?.tipo_usuario === 'cliente' && (
          <>
            <Typography variant="h5" gutterBottom>Empresas Disponibles</Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={3}>
              {renderCompanies()}
            </Grid>
          </>
        )}
      </Grid>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedCompany?.nombre}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Dirección: {selectedCompany?.direccion}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        {selectedCompany?.usuarios.every(u => u.id !== parseInt(userId)) && (
          <Button onClick={() => handleJoinCompany(selectedCompany.id_empresa)} color="primary">
            Unirse a esta Empresa
          </Button>
        )}

        <Button onClick={handleCloseDialog} color="primary">
          Cerrar
        </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Dashboard;