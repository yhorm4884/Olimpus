import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CompanyEdit from './CompanyEdit';
import AddActivityForm from './AddActivityForm';
import axios from 'axios';
import { List, ListItem, ListItemText, ListItemIcon, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Fab } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import EditActivityForm from './EditActivityForm';

const Notifications = ({ userId }) => {
  
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/notifications/list/${userId}/`)
      .then(response => {
        console.log(response.data)
        setNotifications(response.data);
      });
  }, [userId]);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdateNotification = (action) => {
    axios.post(`http://127.0.0.1:8000/notifications/update/${selectedNotification.id}/`, { action })
      .then(response => {
        alert(response.data.message);
        handleCloseDialog();
        setNotifications(notifications.filter(n => n.id !== selectedNotification.id));
      })
      .catch(error => console.error('Error processing notification:', error));
  };

  return (
    <>
      <List>
        {notifications.map(notification => (
          <ListItem key={notification.id} button onClick={() => handleNotificationClick(notification)}>
            <ListItemIcon>
              <NotificationsIcon style={{ color: '#1976d2' }} />  {/* Color directo sin theme */}
            </ListItemIcon>
            <ListItemText 
              primary={`${notification.usuario_cliente} solicita unirse a ${notification.actividad_nombre}`} 
              secondary={`Estado: ${notification.estado} - ${notification.fecha_creacion}`} 
              primaryTypographyProps={{ style: { color: '#333' } }}  
              secondaryTypographyProps={{ style: { color: '#666' } }}
            />
          </ListItem>
        ))}
      </List>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Detalles de la Notificación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedNotification ? `${selectedNotification.usuario_cliente} ha solicitado unirse a la actividad '${selectedNotification.actividad_nombre}' creada el ${selectedNotification.fecha_creacion}. Estado: ${selectedNotification.estado}` : 'Cargando...'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleUpdateNotification('aceptar')} style={{ color: '#4CAF50' }}>Aceptar</Button>
          <Button onClick={() => handleUpdateNotification('rechazar')} style={{ color: '#F44336' }}>Rechazar</Button>
          <Button onClick={handleCloseDialog} style={{ color: '#555' }}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};



const ActivityList = ({ userId }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/activities/actividades/${userId}`)
      .then(response => {
        setActivities(response.data);
      });
  }, [userId]);

  return (
    <List>
      {activities.map(activity => (
        <ListItem key={activity.id} secondaryAction={
          <>
            <IconButton edge="end" aria-label="edit" onClick={() => alert('Edit')}>
              <EditIcon />
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={() => alert('Delete')}>
              <DeleteIcon />
            </IconButton>
          </>
        }>
          <ListItemText
            primary={activity.nombre}
            secondary={`Hora de entrada: ${new Date(activity.hora_entrada).toLocaleTimeString()} - Hora de salida: ${new Date(activity.hora_salida).toLocaleTimeString()}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

const CompanyManagement = () => {
  const { userId } = useParams();  
  const [openForm, setOpenForm] = useState(false);
  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = (refresh = false) => {
    setOpenForm(false);
    if (refresh) {
      // Opcional: refrescar lista de actividades si es necesario
    }
  };
  return (
    <div>
      <h1>Gestión de la Empresa</h1>
      <CompanyEdit userId={userId} />
      <ActivityList userId={userId} />
      <Notifications userId={userId} />
      <Fab color="primary" aria-label="add" style={{ position: 'fixed', right: 20, bottom: 20 }} onClick={handleOpenForm}>
        <AddIcon />
      </Fab>
      <AddActivityForm userId={userId} open={openForm} handleClose={handleCloseForm} />
    </div>
  );
};

export default CompanyManagement;
