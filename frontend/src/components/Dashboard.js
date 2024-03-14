// src/components/Dashboard.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UsersSection from './UserSection';
import { Link } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';

export default function Dashboard() {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">Usuarios</Typography>
              <Typography color="textSecondary">Administrar usuarios</Typography>
              <Button component={Link} to="/dashboard/users" variant="contained" color="primary" style={{ marginTop: '10px' }}>Ir a Usuarios</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">Empresa</Typography>
              <Typography color="textSecondary">Administrar usuarios</Typography>
              <Button component={Link} to="/dashboard/users" variant="contained" color="primary" style={{ marginTop: '10px' }}>Ir a Usuarios</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">Usuarios</Typography>
              <Typography color="textSecondary">Actividades</Typography>
              <Button component={Link} to="/dashboard/users" variant="contained" color="primary" style={{ marginTop: '10px' }}>Ir a Usuarios</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Routes>
        <Route path="users" element={<UsersSection />} />
        {/* Aquí puedes añadir más rutas para otras secciones del dashboard */}
      </Routes>
    </div>
  );
}
