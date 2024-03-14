import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink as RSNavLink } from 'reactstrap';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Logout from './Logout';
import Dashboard from './Dashboard';
import UsersSection from './UserSection';
import NotFound from './NotFound';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/users/check_user_authenticated/', {
      method: 'GET',
      credentials: 'include', // Importante para las cookies de sesión
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/users" element={<UsersSection />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
