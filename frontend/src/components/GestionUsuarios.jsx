import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, CircularProgress, Alert } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';

const GestionUsuarios = ({ idEmpresa }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log(`Cargando usuarios para la empresa ID: ${idEmpresa}`);
    setLoading(true);
    axios.get(`http://127.0.0.1:8000/companies/listar-usuarios/${idEmpresa}`)
      .then(response => {
        console.log('Usuarios cargados:', response.data.usuarios);
        setUsuarios(response.data.usuarios);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar los usuarios:', err);
        setError('Error al cargar los usuarios');
        setLoading(false);
      });
  }, [idEmpresa]);

  const bloquearUsuario = (idUsuario) => {
    console.log(`Intentando bloquear al usuario ID: ${idUsuario}`);
    axios.post(`http://127.0.0.1:8000/companies/bloquear-usuarios/${idUsuario}`)
      .then(() => {
        console.log(`Usuario ID: ${idUsuario} bloqueado correctamente.`);
        setUsuarios(usuarios.map(user => user.id === idUsuario ? { ...user, estado: 'bloqueado' } : user));
      })
      .catch(err => {
        console.error('Error al bloquear el usuario:', err);
        setError('Error al bloquear el usuario');
      });
  };

  const eliminarUsuario = (idUsuario) => {
    console.log(`Intentando eliminar al usuario ID: ${idUsuario}`);
    axios.delete(`http://127.0.0.1:8000/companies/eliminar-usuarios/${idUsuario}`)
      .then(() => {
        console.log(`Usuario ID: ${idUsuario} eliminado correctamente.`);
        setUsuarios(usuarios.filter(user => user.id !== idUsuario));
      })
      .catch(err => {
        console.error('Error al eliminar el usuario:', err);
        setError('Error al eliminar el usuario');
      });
  };

  if (loading) {
    console.log('Cargando...');
    return <CircularProgress />;
  }
  if (error) {
    console.log('Mostrando error:', error);
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <List>
      {usuarios.map(usuario => (
        <ListItem key={usuario.id}>
          <ListItemText primary={usuario.username} secondary={`Estado: ${usuario.estado}`} />
          <ListItemSecondaryAction>
            <IconButton edge="end" onClick={() => bloquearUsuario(usuario.id)} disabled={usuario.estado === 'bloqueado'}>
              <BlockIcon />
            </IconButton>
            <IconButton edge="end" onClick={() => eliminarUsuario(usuario.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default GestionUsuarios;
