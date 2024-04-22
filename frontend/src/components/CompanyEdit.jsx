import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Paper, Typography } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

const CompanyEdit = ({ userId }) => {
  const [company, setCompany] = useState({ nombre: '', estado: true });

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/companies/empresa/${userId}`)
      .then(response => {
        setCompany(response.data);
      });
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setCompany(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://127.0.0.1:8000/companies/empresa/${userId}/`, company)
      .then(() => alert('Empresa actualizada con éxito'));
  };

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h6">Editar Empresa</Typography>
      <form onSubmit={handleSubmit}>
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