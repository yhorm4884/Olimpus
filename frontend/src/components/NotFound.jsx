// src/components/NotFound.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="xs" style={{ textAlign: 'center', marginTop: '50px' }}>
      <img
        src="https://backend.olimpus.arkania.es/media/404.jpg" // Reemplaza con la URL de una imagen adecuada
        alt="Page not found"
        style={{ width: '100%', marginBottom: '24px' }}
      />
      <Typography variant="h4" gutterBottom>
        Página no encontrada
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(-1)} // Navega una página atrás en el historial
      >
        Volver a la página anterior
      </Button>
    </Container>
  );
};

export default NotFound;
