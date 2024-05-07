import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  List, ListItem, ListItemText, ListItemAvatar, Avatar, ListItemSecondaryAction, IconButton,
  CircularProgress, Alert, TextField, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';

const GestionUsuarios = ({ idEmpresa }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usuarioEliminar, setUsuarioEliminar] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://127.0.0.1:8000/companies/listar-usuarios/${idEmpresa}`)
      .then(response => {
        setUsuarios(response.data.usuarios);
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar los usuarios');
        setLoading(false);
      });
  }, [idEmpresa]);

  const bloquearUsuario = (idUsuario) => {
    axios.post(`http://127.0.0.1:8000/companies/bloquear-usuarios/${idUsuario}`)
      .then(() => {
        setUsuarios(usuarios.map(user => 
          user.id === idUsuario ? { ...user, estado: 'bloqueado' } : user
        ));
      })
      .catch(err => {
        setError('Error al bloquear el usuario');
      });
  };

  const confirmarEliminarUsuario = (idUsuario) => {
    setUsuarioEliminar(idUsuario);
  };

  const cancelarEliminarUsuario = () => {
    setUsuarioEliminar(null);
  };

  const eliminarUsuario = () => {
    axios.delete(`http://127.0.0.1:8000/companies/eliminar-usuarios/${usuarioEliminar}`)
      .then(() => {
        setUsuarios(usuarios.filter(user => user.id !== usuarioEliminar));
        setUsuarioEliminar(null); // Resetear el usuario a eliminar
      })
      .catch(err => {
        setError('Error al eliminar el usuario');
        setUsuarioEliminar(null); // Resetear el usuario a eliminar
      });
  };

  const handleSearchChange = (event) => {
    setFiltro(event.target.value.toLowerCase());
  };

  const filteredUsers = usuarios.filter(user =>
    user.username.toLowerCase().includes(filtro)
  );

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
      <TextField
        fullWidth
        label="Buscar Usuario"
        variant="outlined"
        value={filtro}
        onChange={handleSearchChange}
        margin="normal"
      />
      <List sx={{ bgcolor: 'white' }}>
        {filteredUsers.map(usuario => (
          <ListItem key={usuario.id} sx={{ bgcolor: 'white' }}>
            <ListItemAvatar>
              <Avatar src={usuario.foto || "/default-profile.png"} />
            </ListItemAvatar>
            <ListItemText primary={usuario.username} secondary={`Estado: ${usuario.estado}`} />
            <ListItemSecondaryAction>
              
              <IconButton edge="end" onClick={() => confirmarEliminarUsuario(usuario.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* Confirmación de eliminar usuario */}
      <Dialog open={usuarioEliminar !== null} onClose={cancelarEliminarUsuario}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <p>¿Estás seguro de que deseas eliminar este usuario?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelarEliminarUsuario}>Cancelar</Button>
          <Button onClick={eliminarUsuario} variant="contained" color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GestionUsuarios;
