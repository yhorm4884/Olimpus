import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { Navbar, NavbarBrand } from 'reactstrap';
import BreadcrumbComponent from './BreadcrumbComponent';
import routesConfig from './routesConfig';

import './css/app.css';

function App() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userId: null,
    photo: ''
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const storedAuth = localStorage.getItem('authState');
    if (storedAuth) {
      setAuthState(JSON.parse(storedAuth));
    }
    const checkAuth = async () => {
      try {
        const authResponse = await fetch('https://backend.olimpus.arkania.es/users/check_user_authenticated/', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await authResponse.json();
        if (data.isAuthenticated && data.userId) {
          setAuthState({
            isAuthenticated: true,
            userId: data.userId,
            photo: data.photo
          });
          localStorage.setItem('authState', JSON.stringify({
            isAuthenticated: true,
            userId: data.userId,
            photo: data.photo
          }));
        }
        else {
          // Asegurar que el estado de no autenticado se refleje en localStorage
          localStorage.setItem('authState', JSON.stringify({
            isAuthenticated: false,
            userId: null,
            photo: ''
          }));
        }  
      } catch (error) {
        console.error('Error fetching auth status:', error);
      }
    };

    checkAuth();
  }, []);

  return (
    <Router>
      <div>
        <Navbar color="dark" dark expand="md">
          <img src="https://backend.olimpus.arkania.es/media/logo.png" alt="Logo SportEvent" className="logo-nav" />
          <NavbarBrand href="/">SPORTEVENTS</NavbarBrand>
          <button onClick={toggleSidebar} className="menu-button">☰</button>
        </Navbar>
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <button onClick={toggleSidebar} className="close-btn">&times;</button>
          {authState.isAuthenticated && (
            <>
              <div className="user-info">
                <Avatar src={authState.photo || ''} alt="User Photo" sx={{ width: 128, height: 128 }} />
                <NavLink to={`/dashboard/user/${authState.userId}`} className="sidebar-link" onClick={toggleSidebar}>Inicio</NavLink>
                <NavLink to={`/dashboard/profile/${authState.userId}`} className="sidebar-link" onClick={toggleSidebar}>Ver Perfil</NavLink>
                <NavLink to="/logout" className="sidebar-link" onClick={toggleSidebar}>Cerrar sesión</NavLink>
              </div>
            </>
          )}
          {!authState.isAuthenticated && (
            <>
              <NavLink to="/" className="sidebar-link" onClick={toggleSidebar}>Inicio</NavLink>
              <NavLink to="/login" className="sidebar-link" onClick={toggleSidebar}>Iniciar sesión</NavLink>
              <NavLink to="/register" className="sidebar-link" onClick={toggleSidebar}>Registrarse</NavLink>
            </>
          )}
        </div>
        <RoutesWithBreadcrumbs authState={authState} />
      </div>
    </Router>
  );
}

function RoutesWithBreadcrumbs({ authState }) {
  const location = useLocation();

  // Comprobación de existencia de ruta sin usar regex.
  const routeExists = routesConfig.some(route => {
    // Divide tanto la ruta actual como la ruta de configuración en segmentos.
    const currentPathSegments = location.pathname.split('/').filter(p => p);
    const routePathSegments = route.path.split('/').filter(p => p);

    // Comprueba si cada segmento coincide, tratando los parámetros como comodines.
    if (routePathSegments.length !== currentPathSegments.length) {
      return false;
    }

    return routePathSegments.every((segment, index) => {
      return segment.startsWith(':') || segment === currentPathSegments[index];
    });
  });

  // console.log("Location Pathname:", location.pathname);
  // console.log("Route Exists:", routeExists);
  // console.log("Is Authenticated:", authState.isAuthenticated);
  // console.log("Show Breadcrumb:", routeExists && location.pathname !== '/' && authState.isAuthenticated);

  return (
    <>
      {routeExists && location.pathname !== '/' && authState.isAuthenticated && <BreadcrumbComponent authState={authState} />}
      <Routes>
        {routesConfig.map(({ path, Component, isPrivate }, index) => (
          <Route
            key={index}
            path={path}
            element={isPrivate ? <PrivateRouteWrapper Component={Component} isAuthenticated={authState.isAuthenticated} /> : <Component />}
          />
        ))}
      </Routes>
    </>
  );
}

function PrivateRouteWrapper({ Component, isAuthenticated }) {
  return isAuthenticated ? <Component /> : <Navigate to="/login" replace />;
}

export default App;