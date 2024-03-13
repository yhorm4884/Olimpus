import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'reactstrap';
import './argon-design-system-react.css';

export const Logout = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/users/logout/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        // Espera un poco antes de redirigir para que el usuario pueda leer el mensaje
        setTimeout(() => {
          navigate('/login');
        }, 3000); // 3 segundos de espera
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  }, [navigate]);

  return (
    <div>
      {message ? <Alert color="success">{message}</Alert> : <Alert color="warning">Cerrando sesión...</Alert>}
    </div>
  );
}

export default Logout;
