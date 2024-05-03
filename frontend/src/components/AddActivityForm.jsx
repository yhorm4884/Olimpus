import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert
} from '@mui/material';

const AddActivityForm = ({ userId, onSave, onClose }) => {
  const [activityData, setActivityData] = useState({
    codigo_actividad: '',
    nombre: '',
    hora_entrada: '',
    hora_salida: '',
    personas: '',
    lugar: '',
    observaciones: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivityData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateAllFields = () => {
    let tempErrors = {};
    Object.keys(activityData).forEach((key) => {
      validateField(key, activityData[key]);
      if (!activityData[key] && key !== 'observaciones') {
        tempErrors[key] = 'Este campo es obligatorio.';
      }
    });
    return tempErrors;
  };

  const validateField = (name, value) => {
    if (!value) {
      setErrors(prev => ({ ...prev, [name]: 'Este campo es obligatorio.' }));
      return;
    }

    if (name === 'codigo_actividad' || name === 'nombre') {
      if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
        setErrors(prev => ({ ...prev, [name]: 'Solo puede contener letras y números.' }));
        return;
      }
    }

    if (name === 'personas' && value < 1) {
      setErrors(prev => ({ ...prev, [name]: 'Debe ser un número positivo.' }));
      return;
    }

    if (name === 'hora_entrada' || name === 'hora_salida') {
      // Asegúrate de que el formato de la fecha y hora sea correcto (YYYY-MM-DDTHH:MM)
      if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9])$/.test(value)) {
          setErrors(prev => ({ ...prev, [name]: 'No se cumple el formato de fecha y hora' }));
          return;
      }
      // Verifica que la hora de salida sea mayor que la hora de entrada
      if (name === 'hora_salida' && new Date(value) <= new Date(activityData.hora_entrada)) {
          setErrors(prev => ({ ...prev, [name]: 'La hora de salida debe ser mayor que la hora de entrada.' }));
          return;
      }
  }
  

    setErrors(prev => {
      const newState = { ...prev };
      delete newState[name];
      return newState;
    });
  };

  const handleSubmit = () => {
    const newErrors = validateAllFields();
    if (Object.keys(newErrors).length === 0 && Object.keys(errors).length === 0) {
        console.log("Form data to save:", activityData);
        onSave({ userId, activityData, isEdit: false });
        onClose();
    } else {
        setErrors(newErrors);
        alert('Por favor, corrija los errores antes de enviar.');
    }
  };



  return (
    <Dialog open onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Añadir Nueva Actividad</DialogTitle>
      <DialogContent>
        {Object.values(errors).map((error, index) => (
          <Alert severity="error" key={index}>{error}</Alert>
        ))}
        <TextField
          autoFocus
          margin="dense"
          id="codigo_actividad"
          label="Código de Actividad"
          type="text"
          fullWidth
          name="codigo_actividad"
          value={activityData.codigo_actividad}
          onChange={handleChange}
          error={!!errors.codigo_actividad}
          helperText={errors.codigo_actividad}
        />
        <TextField
          margin="dense"
          id="nombre"
          label="Nombre de la Actividad"
          type="text"
          fullWidth
          name="nombre"
          value={activityData.nombre}
          onChange={handleChange}
          error={!!errors.nombre}
          helperText={errors.nombre}
        />
        <TextField
          margin="dense"
          id="hora_entrada"
          label="Hora de Entrada"
          type="datetime-local"
          fullWidth
          name="hora_entrada"
          value={activityData.hora_entrada}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="dense"
          id="hora_salida"
          label="Hora de Salida"
          type="datetime-local"
          fullWidth
          name="hora_salida"
          value={activityData.hora_salida}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          error={!!errors.hora_salida}
          helperText={errors.hora_salida}
        />
        <TextField
          margin="dense"
          id="personas"
          label="Capacidad de Personas"
          type="number"
          fullWidth
          name="personas"
          value={activityData.personas}
          onChange={handleChange}
          error={!!errors.personas}
          helperText={errors.personas}
        />
        <TextField
          margin="dense"
          id="lugar"
          label="Lugar"
          type="text"
          fullWidth
          name="lugar"
          value={activityData.lugar}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          id="observaciones"
          label="Observaciones"
          type="text"
          fullWidth
          multiline
          rows={4}
          name="observaciones"
          value={activityData.observaciones}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Añadir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddActivityForm;
