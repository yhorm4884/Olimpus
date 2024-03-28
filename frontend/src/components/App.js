import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Logout from './Logout';
import Dashboard from './Dashboard';
import UserProfile from './UserProfile';
import ActivityCalendar from './ActivityCalendar';
import NotFound from './NotFound';
import ForgotPassword from './ForgotPassword';
import ResetPasswordPage from './ResetPasswordPage';


function App() {
  const [authState, setAuthState] = useState({ isAuthenticated: false, userId: null });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/users/check_user_authenticated/', {
      method: 'GET',
      credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setAuthState({ isAuthenticated: data.isAuthenticated, userId: data.userId || null });
    })
    .catch(error => console.error('Error fetching auth status:', error));
  }, []);

  return (
    <Router>
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">SPORTEVENTS</NavbarBrand>
          <Nav className="mr-auto" navbar>
            {authState.isAuthenticated ? (
              <NavItem>
                <NavLink to={`/dashboard/user/${authState.userId}`} className="nav-link">Inicio</NavLink>
              </NavItem>
            ) : (
              <NavItem>
                <NavLink to="/" className="nav-link">Inicio</NavLink>
              </NavItem>
            )}
            {!authState.isAuthenticated && (
              <NavItem>
                <NavLink to="/login" className="nav-link">Iniciar sesión</NavLink>
              </NavItem>
            )}
            {authState.isAuthenticated && (
              <NavItem>
                <NavLink to="/logout" className="nav-link">Cerrar sesión</NavLink>
              </NavItem>
            )}
          </Nav>
        </Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:uidb64/:token" element={<ResetPasswordPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/user/:userId" element={<Dashboard />} />
          <Route path="/dashboard/profile/:userId" element={<UserProfile />} />
          <Route path="/dashboard/activities" element={<ActivityCalendar />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
