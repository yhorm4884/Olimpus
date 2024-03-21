// Home.js
import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section bg-dark text-white text-center py-5">
        <Container>
          <Row>
            <Col>
              <h1 className="display-3">Bienvenidos a SPORTEVENTS</h1>
              <p className="lead">El lugar para todos tus eventos deportivos favoritos desde 2024.</p>
              <Button color="primary" size="lg">Descubre más</Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row>
            <Col md="4" className="text-center">
              <i className="ni ni-trophy" style={{ fontSize: '48px' }}></i>
              <h3 className="mt-3">Competiciones</h3>
              <p>Participa en competiciones locales e internacionales.</p>
            </Col>
            <Col md="4" className="text-center">
              <i className="ni ni-world" style={{ fontSize: '48px' }}></i>
              <h3 className="mt-3">Comunidad</h3>
              <p>Únete a nuestra creciente comunidad de entusiastas del deporte.</p>
            </Col>
            <Col md="4" className="text-center">
              <i className="ni ni-bell-55" style={{ fontSize: '48px' }}></i>
              <h3 className="mt-3">Notificaciones</h3>
              <p>Mantente al día con los últimos resultados y eventos.</p>
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

      {/* Contact Section */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg="8">
              <h2 className="text-center">Contacto</h2>
              <p className="text-center">
                ¿Tienes preguntas o comentarios? No dudes en contactarnos.
              </p>
              {/* You can replace this part with a Contact Form component */}
              <div className="text-center">
                <Button color="default" size="lg">Envíanos un mensaje</Button>
              </div>
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

