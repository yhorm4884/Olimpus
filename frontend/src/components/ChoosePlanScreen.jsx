import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button, Typography, Box, Card, CardContent, CardActions, useMediaQuery, useTheme } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';  // MUI Icons
import { loadStripe } from '@stripe/stripe-js';

const ChoosePlanScreen = () => {
  const { companyId } = useParams();
  const location = useLocation();
  const state = location.state || {};  // Prevenir errores si state es undefined

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const userId = state.userId;


const handleJoinCompany = async (plan,cantidad) => {
  try {
    
    const stripe = await loadStripe('pk_test_51PBBogCeiEB5qy1OhkW7TkY7h8gcMkNRT0wpwJaOwcKoszgJRzjCQBaycVNBynhbL4tq51IWKZdLrUSHLP4epx26000xfbFJ8r');

    const formData = new FormData();
        formData.append('userId', userId);
        formData.append('plan', plan);
        formData.append('cantidad', cantidad);
    

    const response = await axios.post('http://127.0.0.1:8000/companies/crear-sesion-checkout/', formData, { withCredentials: true });
    

    
    
    if (response.data.sessionId) {
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      if (error) {
        console.error('Error al redirigir a la página de pago de Stripe:', error);
      }
    } else {
      console.error('Error al crear la sesión de checkout en Stripe');
    }
  } catch (error) {
    console.error('Error al unirse a la empresa:', error);
  }
};



 

  return (
    <Box sx={{ py: 6, backgroundColor: 'none !important;', color: 'text.primary' }}>
      <Box className="container mx-auto px-4 sm:px-10" sx={{ maxWidth: '100%' }}>
        <Typography variant="h4" component="h1" textAlign="center" mb={2} fontWeight="bold">
          Planes de Precios
        </Typography>
        <Typography variant="subtitle1" textAlign="center" mb={4}>
          Elige el plan que mejor se adapte a tus necesidades.
        </Typography>
        <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '11px !important',
          width: '101%',
         
        }}>
          <PlanCard
            title="Básico"
            price="30€ / mes"
            description="Perfecto para individuos que empiezan."
            features={[
              "Acceso básico a la plataforma",
              "Acceso a todas las actividades públicas"
            ]}
            onJoin={() => handleJoinCompany('Básico',30)} 
          />
          <PlanCard
            title="Estándar"
            price="48€ / mes"
            description="Para profesionales que buscan más funcionalidades."
            features={[
              "Todo en Básico, más:",
              "Accesso a lugares exclusivos",
              "Más importancia que los usuarios base",
              "Entrenador Personal"
            ]}
            onJoin={() => handleJoinCompany('Estándar',48)} 
            highlighted
          />
          <PlanCard
            title="Premium"
            price="99€ / mes"
            description="Ideal para locos del deporte."
            features={[
              "Todo en Estándar, más:",
              "Soporte prioritario",
              "Análisis de datos en profundidad",
              "Nutricionista Personal",
              "Entrenador Personal",
              "Espacio Privado"
            ]}
            onJoin={() => handleJoinCompany('Premium',99)} 
          />
        </Box>
      </Box>
    </Box>
  );
};

const PlanCard = ({ title, price, description, features, onJoin, highlighted }) => {
  return (
    <Card sx={{ maxWidth: 345, border: 1, borderColor: highlighted ? 'primary.main' : 'grey.300', boxShadow: 3, bgcolor: 'background.paper' }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" fontWeight="medium" sx={{ textAlign: 'center' }}>
          {title}
        </Typography>
        <Typography variant="h4" color="primary" fontWeight="bold" sx={{ textAlign: 'center' }}>
          {price}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {description}
        </Typography>
        <ul>
          {features.map((feature, index) => (
            <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircleOutlineIcon color="success" />
              <Typography variant="body2">{feature}</Typography>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardActions>
        <Button size="large" variant="contained" color="primary" onClick={onJoin} fullWidth>
          Inscribirse
        </Button>
      </CardActions>
    </Card>
  );
};


export default ChoosePlanScreen;
