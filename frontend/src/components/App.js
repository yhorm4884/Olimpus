import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Avatar} from '@mui/material';
import { Navbar, NavbarBrand,} from 'reactstrap';
import axios from 'axios'; // Asegúrate de tener axios instalado o importa tu configuración de axios si es personalizada
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
import ReactivateAccount from './ReactiveAccount';
import './css/app.css'; // Asegúrate de que tus estilos estén en este archivo

function App() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userId: null,
    photo: ''
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authResponse = await fetch('http://127.0.0.1:8000/users/check_user_authenticated/', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await authResponse.json();
        const isAuthenticated = data.isAuthenticated;
        const userId = data.userId || null;

        setAuthState(prevState => ({
          ...prevState,
          isAuthenticated: isAuthenticated,
          userId: userId
        }));

        if (isAuthenticated && userId) {
          const userDataResponse = await axios.get(`http://127.0.0.1:8000/api/usuarios/${userId}/`, {
            withCredentials: true,
          });
          setAuthState(prevState => ({
            ...prevState,
            photo: userDataResponse.data.photo
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
          <img src="../../media/logo.png" alt="Logo SportEvent" className="logo-nav"/>
          <NavbarBrand href="/">SPORTEVENTS</NavbarBrand>
          <button onClick={toggleSidebar} className="menu-button">☰</button>
          
        </Navbar>
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <button onClick={toggleSidebar} className="close-btn">&times;</button>
          {authState.isAuthenticated && (
            <>
              <div className="user-info">
                <Avatar src={authState.photo || ''} alt="Foto del Usuario" sx={{ width: 128, height: 128 }} />
                <NavLink to={`/dashboard/user/${authState.userId}`} className="sidebar-link" onClick={toggleSidebar}>INICIO</NavLink>
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
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/reactivate/:userId/:token" element={<ReactivateAccount />} />
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