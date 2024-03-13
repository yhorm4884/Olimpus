import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink as RSNavLink } from 'reactstrap';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Logout from './Logout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/users/check_user_authenticated/', {
      method: 'GET',
      credentials: 'include',
    })
    .then((response) => response.json())
    .then((data) => {
      setIsAuthenticated(data.isAuthenticated);
    })
    .catch((error) => {
      console.error('Error fetching auth status:', error);
    });
  }, []);

  return (
    <Router>
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">SPORTEVENTS</NavbarBrand>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <RSNavLink to="/" tag={NavLink} className="nav-link">Inicio</RSNavLink>
            </NavItem>
            {!isAuthenticated && (
              <NavItem>
                <RSNavLink to="/login" tag={NavLink} className="nav-link">Iniciar sesión</RSNavLink>
              </NavItem>
            )}
            {isAuthenticated && (
              <NavItem>
                <RSNavLink to="/logout" tag={NavLink} className="nav-link">Cerrar sesión</RSNavLink>
              </NavItem>
            )}
          </Nav>
        </Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
