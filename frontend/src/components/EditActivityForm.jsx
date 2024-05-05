import React, { useEffect, useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { format } from 'date-fns';

const EditActivityForm = ({ activity, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    codigo_actividad: '',
    nombre: '',
    hora_entrada: '',
    hora_salida: '',
    personas: '',
    lugar: '',
    observaciones: ''
  });

  useEffect(() => {
    if (activity) {
      console.log(activity)
      setFormData({
        codigo_actividad: activity.codigo_actividad || '',
        nombre: activity.nombre || '',
        hora_entrada: format(new Date(activity.hora_entrada), 'yyyy-MM-dd\'T\'HH:mm') || '',
        hora_salida: format(new Date(activity.hora_salida), 'yyyy-MM-dd\'T\'HH:mm') || '',
        personas: activity.personas.toString() || '',
        lugar: activity.lugar || '',
        observaciones: activity.observaciones || ''
      });
      console.log("Formulario inicializado con datos de actividad:", activity);
    } else {
      // Limpiar el formulario si está en modo 'add'
      setFormData({
        codigo_actividad: '',
        nombre: '',
        hora_entrada: '',
        hora_salida: '',
        personas: '',
        lugar: '',
        observaciones: ''
      });
      console.log("Formulario limpiado para nueva actividad");
    }
  }, [activity]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'hora_entrada' || name === 'hora_salida') {
      // Convertir la fecha a ISO string con zona horaria
      const isoDateString = new Date(value).toISOString();
      setFormData(prev => ({ ...prev, [name]: isoDateString }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form data to save:", formData);
    onSave({ activityData: formData, isEdit: true });
  };


  return (
  <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{activity ? 'Editar Actividad' : 'Crear Actividad'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Código de Actividad"
            name="codigo_actividad"
            value={formData.codigo_actividad}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Hora de Entrada"
            name="hora_entrada"
            type="datetime-local"
            value={formData.hora_entrada}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Hora de Salida"
            name="hora_salida"
            type="datetime-local"
            value={formData.hora_salida}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Capacidad de Personas"
            name="personas"
            type="number"
            value={formData.personas}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Lugar"
            name="lugar"
            value={formData.lugar}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
          />
           <DialogActions>
            <Button onClick={onClose} color="secondary">Cancelar</Button>
            <Button type="submit" color="primary">Guardar Cambios</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditActivityForm;
