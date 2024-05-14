import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Avatar, TextField, Button, Paper, Typography, IconButton } from '@mui/material';
import { Save as SaveIcon, PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';

const CompanyEdit = ({ userId }) => {
  const [company, setCompany] = useState({ nombre: '', estado: true, photo: '', direccion: '', descripcion: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    axios.get(`https://backend.olimpus.arkania.es/companies/empresa/${userId}/`)
      .then(response => {
        const data = response.data;
        // Añadir el dominio al principio de la URL de la imagen si existe
        if (data.photo) {
          data.photo = `https://backend.olimpus.arkania.es${data.photo}`;
        }
        setCompany(data);
        console.log("Initial data from backend:", data);
      });
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === 'file') {
      const file = e.target.files[0];
      setCompany(prev => ({ ...prev, photo: file }));
    } else if (type === 'checkbox') {
      setCompany(prev => ({ ...prev, [name]: checked }));  // Asegúrate que esto es lo que pasa
    } else {
      setCompany(prev => ({ ...prev, [name]: value }));
    }
    console.log(`Updated ${name}:`, type === 'checkbox' ? checked : value);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', company.nombre);
    formData.append('estado', company.estado.toString()); // Convertir booleano a string
    formData.append('direccion', company.direccion);
    formData.append('descripcion', company.descripcion);
    if (company.photo instanceof File) {
      formData.append('photo', company.photo);
    }

    axios.post(`https://backend.olimpus.arkania.es/companies/empresa/${userId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(() => alert('Empresa actualizada con éxito'))
      .catch(err => alert('Error al actualizar la empresa: ' + err.message));
  };




  return (
    <Paper style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h6" style={{ alignSelf: 'start' }}>Editar Empresa</Typography>
      <IconButton onClick={() => fileInputRef.current.click()} style={{ margin: '20px' }}>
        <Avatar src={company.photo} style={{ width: 90, height: 90 }} />
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
        <TextField
          label="Dirección de la empresa"
          name="direccion"
          variant="outlined"
          fullWidth
          margin="normal"
          value={company.direccion || ''}
          onChange={handleInputChange}
        />
        <TextField
          label="Descripción de la empresa"
          name="descripcion"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={company.descripcion || ''}
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
