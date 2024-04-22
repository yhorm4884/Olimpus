import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import axios from 'axios';

const EditActivityForm = ({ activity, open, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: activity.nombre,
    hora_entrada: activity.hora_entrada,
    hora_salida: activity.hora_salida,
    personas: activity.personas,
    lugar: activity.lugar,
    observaciones: activity.observaciones
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/companies/actividad/${activity.id}/update`, formData);
      alert('Actividad actualizada con éxito');
      onClose(true);  // Pass true to indicate successful update
    } catch (error) {
      console.error('Error al actualizar la actividad:', error);
      alert('Error al actualizar la actividad');
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Actividad</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="nombre"
          label="Nombre de la Actividad"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.nombre}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="hora_entrada"
          label="Hora de Entrada"
          type="datetime-local"
          fullWidth
          variant="outlined"
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
          variant="outlined"
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
          variant="outlined"
          value={formData.personas}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="lugar"
          label="Lugar"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.lugar}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="observaciones"
          label="Observaciones"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          value={formData.observaciones}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditActivityForm;
