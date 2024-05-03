import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Avatar, TextField, Button, Paper, Typography, IconButton } from '@mui/material';
import { Save as SaveIcon, PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';

const CompanyEdit = ({ userId }) => {
  const [company, setCompany] = useState({ nombre: '', estado: true, photo: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/companies/empresa/${userId}`)
      .then(response => {
        setCompany(response.data);
      });
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === 'file') {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompany(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setCompany(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', company.nombre);
    formData.append('estado', company.estado);
    formData.append('photo', company.photo);
    axios.post(`http://127.0.0.1:8000/companies/empresa/${userId}/`, formData)
      .then(() => alert('Empresa actualizada con éxito'));
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Paper style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h6" style={{ alignSelf: 'start' }}>Editar Empresa</Typography>
      <IconButton onClick={handleAvatarClick} style={{ margin: '20px' }}>
        <Avatar src={company.photo || '/path/to/default/avatar.jpg'} style={{ width: 90, height: 90 }} />
        <PhotoCameraIcon style={{ position: 'absolute', color: 'rgba(255, 255, 255, 0.7)' }} />
      </IconButton>
      <input
        ref={fileInputRef}
        accept="image/*"
        type="file"
        name="photo"
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField
          label="Nombre de la empresa"
          name="nombre"
          variant="outlined"
          fullWidth
          margin="normal"
          value={company.nombre || ''}
          onChange={handleInputChange}
        />
        <div>
          <label>
            Estado (activa):
            <input
              type="checkbox"
              name="estado"
              checked={company.estado || false}
              onChange={handleInputChange}
              style={{ marginLeft: 10 }}
            />
          </label>
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          style={{ marginTop: 20 }}
        >
          Guardar Cambios
        </Button>
      </form>
    </Paper>
  );
};

export default CompanyEdit;
