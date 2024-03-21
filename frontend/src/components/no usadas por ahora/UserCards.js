import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions } from '@mui/material';

const UserCard = ({ user }) => {
  return (
    <Card sx={{ display: 'flex', marginBottom: '20px' }}>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image="https://via.placeholder.com/150" // Aquí va la URL de la imagen del usuario
        alt="User image"
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            {user.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {user.email}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Editar</Button>
        </CardActions>
      </div>
    </Card>
  );
};

export default UserCard;
