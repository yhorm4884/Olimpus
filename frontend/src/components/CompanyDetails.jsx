import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Card, CardContent, CardMedia, CardActions } from '@mui/material';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

function CompanyDetails() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [coords, setCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyApOpETUbx2DCzD58lLsYc-bMHHT9yvpu8", // Replace with your actual API key
    libraries: ['places'], // Specify necessary libraries here
  });

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await axios.get(`AIzaSyApOpETUbx2DCzD58lLsYc-bMHHT9yvpu8/api/empresas/${companyId}`);
        setCompany(response.data);
        if (response.data.direccion) {
          const locationResponse = await axios.get('https://backend.olimpus.arkania.es/api/geocode/', { params: { address: response.data.direccion } });
          setCoords(locationResponse.data);
        }
        setIsLoading(false);
      } catch (err) {
        setError('Error al cargar los detalles de la empresa o las coordenadas');
        setIsLoading(false);
        console.error(err);
      }
    };

    if (isLoaded && !loadError) {
      fetchCompanyDetails();
    }
  }, [isLoaded, loadError, companyId]);

  const mapStyles = {
    height: "300px",
    width: "100%"
  };

  if (isLoading || !isLoaded) {
    return <Typography>Cargando detalles de la empresa...</Typography>;
  }

  if (error || loadError) {
    return <Typography>Error: {error || loadError}</Typography>;
  }

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Card sx={{ maxWidth: 600 }}>
        <CardMedia
          component="img"
          height="140"
          image={company?.foto || "https://via.placeholder.com/150"}
          alt="Imagen de la Empresa"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {company?.nombre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dirección: {company?.direccion}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Descripción: {company?.descripcion}
          </Typography>
        </CardContent>
        {coords && (
          <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={15}
            center={coords}
          >
            <Marker position={coords} />
          </GoogleMap>
        )}
        <CardActions>
          <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ margin: '20px' }}>
            Volver
          </Button>
          <Button variant="outlined" color="primary" onClick={() => navigate(`/choose-plan/${companyId}`, { state: { userId: localStorage.getItem('userId') } })}>
            Unirse a esta Empresa
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default CompanyDetails;
