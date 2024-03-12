// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink as RSNavLink } from 'reactstrap';
import Home from './Home'; // Asegúrate de importar el componente Home
import Login from './Login';
import Register from './Register';

function App() {
  return (
    <Router>
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">SPORTEVENTS</NavbarBrand>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <RSNavLink exact to="/" tag={NavLink}>Inicio</RSNavLink> {/* Agregado enlace al Home */}
            </NavItem>
            <NavItem>
              <RSNavLink to="/login" tag={NavLink}>Login</RSNavLink>
            </NavItem>
            <NavItem>
              <RSNavLink to="/register" tag={NavLink}>Register</RSNavLink>
            </NavItem>
          </Nav>
        </Navbar>
        <Routes>
          <Route path="/" element={<Home />} /> {/* Ruta agregada para Home */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
