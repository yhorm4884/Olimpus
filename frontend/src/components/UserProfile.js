import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Paper, Typography, Avatar, Grid, Box, TextField, Button } from '@mui/material';

const UserProfile = () => {
  axios.defaults.withCredentials = true;
  axios.defaults.xsrfCookieName = 'csrftoken';
  axios.defaults.xsrfHeaderName = 'X-CSRFToken';
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
          try{
            axios.get("http://127.0.0.1:8000/users/prueba").then(respuesta=> {
              console.log(respuesta.data)
            })
            
          }catch (error) {
            console.log(error);
          }
          setUserData(response.data);
          setEditData({
            username: response.data.user?.username || '',
            email: response.data.user?.email || '',
            telefono: response.data.telefono || '',
            photo: response.data.photo || '',
          });
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
  const updateData = {
    user: {
        username: editData.username,
        email: editData.email,
    },
    telefono: editData.telefono,
  };
  console.log(updateData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{

      await axios.post("http://127.0.0.1:8000/users/update-profile/", {
        user: {
          username: editData.username,
          email: editData.email,
        },
        telefono: editData.telefono,
      });
      console.log("Enviado la bicha");
    }catch (error){
      console.error("Error:", error.response? error.response.data : error);
    }
  };


  if (!userData) {
    return <div>Cargando...</div>;
  }

  return (
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
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserProfile;