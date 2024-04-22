import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const AddActivityForm = ({ userId, open, handleClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    hora_entrada: '',
    hora_salida: '',
    personas: '',
    lugar: '',
    observaciones: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/activities/add_actividad/${userId}/`, formData);
      console.log(response.data.message);
      handleClose(true);  // Close the modal and optionally refresh the list
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  return (
    <Dialog open={open} onClose={() => handleClose(false)}>
      <DialogTitle>Añadir Actividad</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="nombre"
          label="Nombre de Actividad"
          type="text"
          fullWidth
          variant="standard"
          value={formData.nombre}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="hora_entrada"
          label="Hora de Entrada"
          type="datetime-local"
          fullWidth
          variant="standard"
          value={formData.hora_entrada}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="dense"
          name="hora_salida"
          label="Hora de Salida"
          type="datetime-local"
          fullWidth
          variant="standard"
          value={formData.hora_salida}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="dense"
          name="personas"
          label="Capacidad de Personas"
          type="number"
          fullWidth
          variant="standard"
          value={formData.personas}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="lugar"
          label="Lugar"
          type="text"
          fullWidth
          variant="standard"
          value={formData.lugar}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="observaciones"
          label="Observaciones"
          type="text"
          fullWidth
          variant="standard"
          multiline
          rows={2}
          value={formData.observaciones}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)}>Cancelar</Button>
        <Button onClick={handleSubmit}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddActivityForm;
