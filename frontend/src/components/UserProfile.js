import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-widgets/Calendar';
import { Paper, Typography, Avatar, Grid, Box, TextField, Button, Card, CardContent, IconButton, Fab, Badge} from '@mui/material';
import { Edit, Notifications, ChatBubbleOutline } from '@mui/icons-material';

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
  const [showAlert, setShowAlert] = useState(false); // Estado para controlar la visibilidad del Alert
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

    const formData = new FormData();
    formData.append('username', editData.username);
    formData.append('email', editData.email);
    formData.append('telefono', editData.telefono);
    if (editData.photo instanceof File) {
      formData.append('photo', editData.photo, editData.photo.name);
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/users/update-profile/", formData, {
            withCredentials: true,
      });

      console.log("Perfil actualizado", response.data);
      setMessage("Perfil actualizado");
      setError(false);
      setShowAlert(true);
      setIsEditing(false);
      setTimeout(() => {
        setMessage('');
        setShowAlert(false);
      }, 3000);

      // Recargar los datos del usuario después de la actualización exitosa
      const updatedUserData = await axios.get(`http://127.0.0.1:8000/api/usuarios/${userId}/`, { withCredentials: true });
      setUserData(updatedUserData.data);
      window.location.reload();
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
      setMessage("Error al actualizar el perfil");
      setError(true);
      setShowAlert(true);
      setTimeout(() => {
        setMessage('');
        setShowAlert(false);
      }, 3000);
    }
  };

  const handleAvatarChange = (event) => {
    if (event.target.files[0]) {
        setEditData((prevData) => ({
            ...prevData,
            photo: event.target.files[0]
        }));
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

  const activityCards = selectedDateActivities.map((activity, index) => (
    <Card key={index} sx={{ minWidth: 275, mb: 2 }}>
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
  ));

  if (!userData) {
    return <div>Cargando...</div>;
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper elevation={3} sx={{ p: 4, position: 'relative', mb: 4 }}>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={3} align="center">
            <Card sx={{ p: 2 }}>
              {isEditing ? (
                <>
                  <input
                    accept="image/png, image/jpeg"
                    type="file"
                    hidden
                    id="avatar-upload"
                    onChange={handleAvatarChange}
                  />
                  <label htmlFor="avatar-upload">
                    <Avatar src={editData.photo || ''} alt="Foto del Usuario" sx={{ width: 128, height: 128, mb: 2 }} />
                    <IconButton color="primary" component="span">
                      <Edit />
                    </IconButton>
                  </label>
                  <TextField
                    name="username"
                    defaultValue={editData.username}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                  />
                  <TextField
                    name="email"
                    defaultValue={editData.email}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                  />
                  <TextField
                    name="telefono"
                    defaultValue={editData.telefono}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ mt: 2 }}
                  >
                    Save
                  </Button>
                  {showAlert && (
                    <Alert color={error ? 'danger' : 'success'} style={{ margin: '16px 0' }}>
                      {message}
                    </Alert>
                  )}
                </>

              ) : (
                <>
                  <Avatar src={userData.photo || ''} alt="Foto del Usuario" sx={{ width: 128, height: 128, mb: 2 }} />
                  <Typography variant="h6">{userData.user?.username}</Typography>
                  <Typography variant="body1" color="textSecondary">{userData.DNI}</Typography>
                  <Typography variant="body1" color="textSecondary">{userData.telefono}</Typography>
                  <Typography variant="body1" color="textSecondary">{userData.user?.email}</Typography>
                  <Typography variant="body1">{userData.estado}</Typography>
                  <Box mt={2}>
                    <IconButton color="primary" onClick={handleEditClick}>
                      <Edit />
                    </IconButton>
                    <IconButton color="primary">
                      <Badge color="secondary" badgeContent={1000} max={999}>
                        <Notifications />
                      </Badge>
                    </IconButton>
                  </Box>
                  {showAlert && (
                    <Alert color={error ? 'danger' : 'success'} style={{ margin: '16px 0' }}>
                      {message}
                    </Alert>
                  )}
                </>
              )}
            </Card>
          </Grid>
          <Grid item xs={12} md={8} lg={9}>
            <Box sx={{ mb: 2 }}>
              <Calendar
                value={selectedDate}
                onChange={handleDateChange}
                min={minDate}
                dayPropGetter={(date) => ({
                  className: date < minDate ? 'disabled-date' : '',
                })}
              />
            </Box>
            <Typography variant="h6" gutterBottom>
              Actividades del día {selectedDate.toLocaleDateString()}
            </Typography>
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              {activityCards.length > 0 ? activityCards : <Typography>No hay actividades para este día.</Typography>}
            </Box>
          </Grid>
        </Grid>

      </Paper>
      <Fab color="primary" aria-label="help" sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <ChatBubbleOutline />
      </Fab>
    </Box>
  );
};

export default UserProfile;