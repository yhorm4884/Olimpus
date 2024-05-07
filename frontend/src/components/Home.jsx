import React from 'react';
import Slider from 'react-slick';
import { Paper, Typography, Box, Container, Grid, Slide, useTheme, useMediaQuery } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './css/propio-css.css';  // Asegúrate de que los estilos estén correctamente definidos en este archivo
import { useScrollTrigger } from '@mui/material';

function SlideOnScroll({ children }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  return (
    <Slide appear={false} direction="up" in={trigger}>
      {children}
    </Slide>
  );
}

function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <div>
      <Slider {...settings}>
        <div>
          <Paper
            sx={{
              backgroundImage: 'url(https://www.hopkinsmedicine.org/-/media/images/health/3_-wellness/sleep/group-kettlebell-exercise-hero.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: isMobile ? 300 : 500,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Typography variant={isMobile ? "h4" : "h3"} component="h1" color="primary.contrastText" sx={{ padding: 2, backgroundColor: 'rgba(0,0,0,0.5)' }}>
              Bienvenidos a SPORTEVENTS
            </Typography>
          </Paper>
        </div>
        <div>
          <Paper
            sx={{
              backgroundImage: 'url(https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2018/11/Group-Fitness-Class-Performing-A-Variety-Of-Exercises-1.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: isMobile ? 300 : 500,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Typography variant={isMobile ? "h4" : "h3"} component="h1" color="primary.contrastText" sx={{ padding: 2, backgroundColor: 'rgba(0,0,0,0.5)' }}>
              Organiza tus actividades
            </Typography>
          </Paper>
        </div>
      </Slider>

      <SlideOnScroll>
        <Box sx={{ bgcolor: 'background.paper', p: 4 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h2" gutterBottom textAlign="center">
              Sobre Nosotros
            </Typography>
            <Typography variant="body1" gutterBottom textAlign="center">
              En SPORTEVENTS nos dedicamos a brindarte la mejor experiencia para organizar tu semana, conectando a fanáticos y atletas de todo el mundo.
            </Typography>
          </Container>
        </Box>
      </SlideOnScroll>

      <SlideOnScroll>
        <Box sx={{ bgcolor: 'grey.200', p: 4 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h2" gutterBottom textAlign="center">
              Qué Hacemos
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} md={4} textAlign="center">
                <i className="bi bi-trophy" style={{ fontSize: '48px' }}></i>
                <Typography variant="h6" component="h3">Eventos Competitivos</Typography>
                <Typography>Organizamos y transmitimos competencias deportivas a nivel local.</Typography>
              </Grid>
              <Grid item xs={12} md={4} textAlign="center">
                <i className="bi bi-people-fill" style={{ fontSize: '48px' }}></i>
                <Typography variant="h6" component="h3">Comunidad</Typography>
                <Typography>Creamos una comunidad donde los aficionados pueden conectarse y compartir su pasión por el deporte.</Typography>
              </Grid>
              <Grid item xs={12} md={4} textAlign="center">
                <i className="bi bi-gear-fill" style={{ fontSize: '48px' }}></i>
                <Typography variant="h6" component="h3">Tecnología Innovadora</Typography>
                <Typography>Utilizamos la última tecnología para mejorar la experiencia de visualización de nuestros usuarios.</Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </SlideOnScroll>

      <SlideOnScroll>
        <Box sx={{ bgcolor: 'background.paper', p: 4 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h2" gutterBottom textAlign="center">
              Conoce al Equipo
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4} display="flex" flexDirection="column" alignItems="center">
                <img src="https://avatars.githubusercontent.com/u/94459279?v=4" alt="Team Member 1" className="img-fluid w-50 rounded-circle mb-2" />
                <Typography variant="h6" component="h3">Badel Bonilla Simón</Typography>
                <Typography>Desarrollador Principal</Typography>
              </Grid>
              <Grid item xs={12} sm={4} display="flex" flexDirection="column" alignItems="center">
                <img src="https://avatars.githubusercontent.com/u/102224204?v=4" alt="Team Member 3" className="img-fluid w-50 rounded-circle mb-2" />
                <Typography variant="h6" component="h3">Miguel Carballo González</Typography>
                <Typography>Programador y encargado del despliegue</Typography>
              </Grid>
              <Grid item xs={12} sm={4} display="flex" flexDirection="column" alignItems="center">
                <img src="https://avatars.githubusercontent.com/u/99322335?v=4" alt="Team Member 2" className="img-fluid w-50 rounded-circle mb-2" />
                <Typography variant="h6" component="h3">Afellay Ramos Luis</Typography>
                <Typography>Diseño y Documentación</Typography>
              </Grid>
              
            </Grid>
          </Container>
        </Box>
      </SlideOnScroll>

      <SlideOnScroll>
        <Box sx={{ bgcolor: 'grey.900', color: 'grey.50', p: 3 }}>
          <Container maxWidth="lg">
            <Typography textAlign="center">© {new Date().getFullYear()} SPORTEVENTS. Todos los derechos reservados.</Typography>
          </Container>
        </Box>
      </SlideOnScroll>
    </div>
  );
}

export default Home;
