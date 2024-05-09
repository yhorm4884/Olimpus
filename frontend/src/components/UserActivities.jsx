import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Divider,
  Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UserActivities = () => {
  const { userId } = useParams();
  const [availableActivities, setAvailableActivities] = useState([]);
  const [participatingActivities, setParticipatingActivities] = useState([]);
  const [requestedActivities, setRequestedActivities] = useState(new Set()); // Nuevo estado para manejar solicitudes
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchAvailableActivities();
    fetchParticipatingActivities();
  }, [userId]);

  const fetchAvailableActivities = async () => {
    try {
      const response = await axios.get(`https://backend.olimpus.arkania.es/activities/actividades-empresa/${userId}`);
      setAvailableActivities(response.data.actividades);
    } catch (error) {
      console.error('Error al obtener actividades disponibles:', error);
    }
  };

  const fetchParticipatingActivities = async () => {
    try {
      const response = await axios.get(`https://backend.olimpus.arkania.es/activities/misactividades/${userId}`);
      setParticipatingActivities(response.data.actividades);
    } catch (error) {
      console.error('Error al obtener actividades participadas:', error);
    }
  };

  const handleJoinActivity = async (actividadId) => {
    try {
      const response = await axios.post('https://backend.olimpus.arkania.es/notifications/solicitar-unirse-actividad/', {
        user_id: userId,
        actividad_id: actividadId
      });
      setRequestedActivities(new Set(requestedActivities.add(actividadId))); // Agregar la actividad al conjunto de solicitudes
      setSnackbarMessage(response.data.message);
      setSnackbarOpen(true);
      fetchAvailableActivities();
      fetchParticipatingActivities();
    } catch (error) {
      console.error('Error al solicitar unirse a la actividad:', error);
      setSnackbarMessage('Error al procesar la solicitud.');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>Actividades de la Empresa</Typography>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6">Actividades Disponibles</Typography>
        <List>
          {availableActivities.map((activity) => (
            <ListItem key={activity.codigo_actividad} secondaryAction={
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleJoinActivity(activity.codigo_actividad)}
                disabled={requestedActivities.has(activity.codigo_actividad)}  // Deshabilitar si ya se ha solicitado
              >
                Unirse
              </Button>
            }>
              <ListItemText
                primary={activity.nombre}
                secondary={`Hora de inicio: ${activity.hora_entrada} - Hora de fin: ${activity.hora_salida}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Divider sx={{ my: 4 }} />
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6">Mis Actividades</Typography>
        <List>
          {participatingActivities.map((activity) => (
            <ListItem key={activity.codigo_actividad}>
              <ListItemText
                primary={activity.nombre}
                secondary={`Hora de inicio: ${activity.hora_entrada} - Hora de fin: ${activity.hora_salida}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserActivities;
