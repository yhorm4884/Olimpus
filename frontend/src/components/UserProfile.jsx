import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-widgets/Calendar';
import { Modal, InputBase, Paper, Typography, Avatar, Grid, Box, TextField, Button, Card, CardContent, IconButton, Fab, Badge } from '@mui/material';
import { Edit, Notifications, Send, Block } from '@mui/icons-material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
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
  const [showAlert, setShowAlert] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);


  const navigate = useNavigate();
  const logoutUser = () => {
    localStorage.removeItem('token');
    navigate('/logout');
  };

  const [editData, setEditData] = useState({
    username: '',
    email: '',
    telefono: '',
    photo: '',
  });

  useEffect(() => {
    if (userId) {
      const url = `http://backend.olimpus.arkania.es/api/usuarios/${userId}/`;
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
      const response = await axios.post("http://backend.olimpus.arkania.es/users/update-profile/", formData);

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
      const updatedUserData = await axios.get(`http://backend.olimpus.arkania.es/api/usuarios/${userId}/`, { withCredentials: true });
      setUserData(updatedUserData.data);

    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
      setMessage(error.response.data.error.toString().slice(2, -2));
      setError(true);
      setShowAlert(true);
      setTimeout(() => {
        setMessage('');
        setShowAlert(false);
      }, 3000);
    }
  };

  const handleSendMessage = (message) => {
    console.log(message); // Simula enviar mensaje
    setMessages([...messages, { content: message, sender: "Usuario", senderId: userId, isCurrentUser: true }]);
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

  

  const handleDateChange = (date) => {
    setSelectedDate(date);
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

  const handleDisableUser = async () => {
    try {
      const response = await axios.post(`http://backend.olimpus.arkania.es/users/deactivate/${userId}/`);
      console.log(response)
      setMessage("Usuario desactivado exitosamente. Serás redirigido a la página de inicio.");
      setError(false);
      setShowAlert(true);
      setTimeout(() => {
        setMessage('');
        setShowAlert(false);
        logoutUser(); // Llama a la función de logout para manejar la limpieza y redirección
      }, 5000); // Espera 5 segundos antes de redirigir
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.error
        ? error.response.data.error.toString()
        : "Error desconocido al desactivar el usuario";
      setMessage(errorMessage);
      setError(true);
      setShowAlert(true);
      setTimeout(() => {
        setMessage('');
        setShowAlert(false);
      }, 3000);
    }
  };

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
                    <IconButton color="primary" onClick={handleDisableUser}>
                      <Block />
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
                // min={minDate}
                // dayPropGetter={(date) => ({
                  //className: date < minDate ? 'disabled-date' : '',
                //})}
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
      <Fab color="primary" aria-label="chat" onClick={() => setShowChat(true)} sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <ChatBubbleOutlineIcon />
      </Fab>
      <ChatModal open={showChat} onClose={() => setShowChat(false)} messages={messages} onSendMessage={handleSendMessage} userId={userId} />

    </Box>
  );
};

const ChatMessage = ({ message, userId }) => {
  const isCurrentUser = message.senderId === userId;
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
      mb: 2,
    }}>
      <Paper sx={{
        bgcolor: isCurrentUser ? 'primary.main' : 'grey.200',
        color: isCurrentUser ? 'common.white' : 'text.primary',
        p: 2,
        maxWidth: '70%',
        wordBreak: 'break-word',
      }}>
        <Typography variant="caption">{message.sender}</Typography>
        <Typography variant="body1">{message.content}</Typography>
      </Paper>
    </Box>
  );
};

// Componente de modal de chat
const ChatModal = ({ open, onClose, messages, onSendMessage, userId }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      console.log(input);
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="chat-modal-title">
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '90%', bgcolor: 'background.paper', boxShadow: 24, p: 4, maxHeight: '80%', overflow: 'auto'
      }}>
        <Typography id="chat-modal-title" variant="h6" color="primary" sx={{ mb: 2 }}>
          Chat
        </Typography>
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} isCurrentUser={msg.senderId === userId} />
        ))}
        <Box display="flex" alignItems="center" mt={2}>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Escribe un mensaje..."
            inputProps={{ 'aria-label': 'Escribe un mensaje' }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <IconButton color="primary" sx={{ p: '10px' }} onClick={handleSend}>
            <Send />
          </IconButton>
        </Box>
      </Box>
    </Modal>
  );
};
export default UserProfile;
