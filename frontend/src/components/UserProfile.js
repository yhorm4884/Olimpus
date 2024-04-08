import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-widgets/Calendar';
import { Paper, Typography, Avatar, Grid, Box, TextField, Button, Card, CardContent } from '@mui/material';
import 'react-widgets/styles.css';
import { Alert } from 'reactstrap';

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [selectedDateActivities, setSelectedDateActivities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    email: '',
    telefono: '',
    photo: '',
  });

  useEffect(() => {
    if (userId) {
      const url = `http://127.0.0.1:8000/api/usuarios/${userId}/`;
      axios.get(url, { withCredentials: true })
        .then(response => {
          console.log(response.data);
          setUserData(response.data);
          setEditData({
            username: response.data.user?.username || '',
            email: response.data.user?.email || '',
            telefono: response.data.telefono || '',
            photo: response.data.photo || '',
          });
          setActivities(response.data.actividades || []);
          filterActivitiesByDate(response.data.actividades || [], new Date());
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, [userId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/users/update-profile/", {
        user: {
          username: editData.username,
          email: editData.email,
        },
        telefono: editData.telefono,
      });
      console.log("Perfil actualizado");
      console.log("Perfil actualizado");
      setMessage("Perfil actualizado");
      setError(false);
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
      setMessage("Error al actualizar el perfil");
      setError(true);
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0); // Remover las horas para comparar solo fechas

  const filterActivitiesByDate = (activities, date) => {
    const activitiesForDate = activities.filter((activity) => {
      const startDate = new Date(activity.hora_entrada);
      const endDate = new Date(activity.hora_salida);
      return (
        startDate.toDateString() === date.toDateString() ||
        (startDate <= date && endDate >= date)
      );
    });
    setSelectedDateActivities(activitiesForDate);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    filterActivitiesByDate(activities, date);
  };

  const ActivityCard = ({ activity }) => {
    return (
      <Card sx={{ minWidth: 275, mb: 2 }}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {activity.nombre}
          </Typography>
          <Typography color="textSecondary">
            Entrada: {new Date(activity.hora_entrada).toLocaleTimeString()}
          </Typography>
          <Typography color="textSecondary">
            Salida: {new Date(activity.hora_salida).toLocaleTimeString()}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  if (!userData) {
    return <div>Cargando...</div>;
  }
  const alertColor = message.includes('Perfil actualizado') ? 'error' : 'error';
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={6} md={4} lg={3} align="center">
            <Avatar src={editData.photo || ''} alt="Foto del Usuario" sx={{ width: 128, height: 128 }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              {isEditing ? <TextField name="username" value={editData.username} onChange={handleChange} /> : userData.user?.username}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={8} lg={9}>
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography variant="body1"><strong>DNI:</strong> {userData.DNI}</Typography>
              <Typography variant="body1">
                <strong>Teléfono:</strong>
                {isEditing ? <TextField name="telefono" value={editData.telefono} onChange={handleChange} /> : userData.telefono}
              </Typography>
              <Typography variant="body1">
                <strong>Correo electrónico:</strong>
                {isEditing ? <TextField name="email" value={editData.email} onChange={handleChange} /> : userData.user?.email}
              </Typography>
              <Typography variant="body1"><strong>Estado:</strong> {userData.estado}</Typography>
              {isEditing && (
                <Button variant="contained" color="primary" onClick={handleSubmit}>Actualizar</Button>
              )}
              {!isEditing && (
                <Button variant="outlined" onClick={handleEditClick}>Editar</Button>
              )}
              {error ? (
                <Alert color="danger">{message}</Alert> // Muestra un mensaje de error si ocurre uno
              ) : (
                <Alert color="success">{message}</Alert> // Muestra un mensaje de éxito en caso contrario
              )}
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Calendar
              value={selectedDate}
              onChange={handleDateChange}
              min={minDate}
              dayPropGetter={(date) => ({
                className: date < minDate ? 'disabled-date' : '',
              })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Actividades del día {selectedDate.toLocaleDateString()}
            </Typography>
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              {selectedDateActivities.length > 0 ? (
                selectedDateActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))
              ) : (
                <Typography>No hay actividades para este día.</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserProfile;