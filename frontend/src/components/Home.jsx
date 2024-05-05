import React from 'react';
import { Container, Row, Col } from 'reactstrap';

function Home() {
  const backgroundImage = 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'; // Imagen aleatoria de Unsplash para el fondo del Hero Section

  return (
    <div>
      {/* Hero Section with Background Image */}
      <div className="hero-section text-white text-center" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <Container className="py-5">
          <h1 className="display-3">Bienvenidos a SPORTEVENTS</h1>
          <p className="lead">El lugar para todos tus eventos deportivos favoritos desde 2024.</p>
        </Container>
      </div>

      {/* Features Section with Bootstrap Icons */}
      <section className="py-5">
        <Container>
          <Row>
            <Col md="4" className="text-center">
              <i className="bi bi-calendar-event" style={{ fontSize: '48px' }}></i>
              <h3 className="mt-3">Organiza tu Día</h3>
              <p>Organiza tus actividades diarias con nuestro sistema.</p>
            </Col>
            <Col md="4" className="text-center">
              <i className="bi bi-people" style={{ fontSize: '48px' }}></i>
              <h3 className="mt-3">Comunidad</h3>
              <p>Únete a nuestra creciente comunidad de entusiastas del deporte.</p>
            </Col>
            <Col md="4" className="text-center">
              <i className="bi bi-bell" style={{ fontSize: '48px' }}></i>
              <h3 className="mt-3">Notificaciones</h3>
              <p>Mantente al dia de tus notificaciones y nuestros avisos.</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col lg="8">
              <h2 className="text-center">Sobre Nosotros</h2>
              <p className="text-center">
                En SPORTEVENTS nos dedicamos a brindarte la mejor experiencia en eventos deportivos,
                conectando a fanáticos y atletas de todo el mundo.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-5 bg-dark">
        <Container>
          <Row>
            <Col md="12" className="text-center">
              <p className="text-white mb-0">© {new Date().getFullYear()} SPORTEVENTS. Todos los derechos reservados.</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}

export default Home;
