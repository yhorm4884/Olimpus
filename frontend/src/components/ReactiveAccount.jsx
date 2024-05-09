import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ReactivateAccount() {
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    axios.get(`https://backend.olimpus.arkania.es/users/reactivate/${userId}/${token}`)
      .then(response => {
        setMessage('Tu cuenta ha sido reactivada exitosamente.');
        setIsError(false);
        // Redirige al login tras 5 segundos
        setTimeout(() => navigate('/login'), 5000);
      })
      .catch(error => {
        setMessage('El enlace de reactivación no es válido o ha expirado.');
        setIsError(true);
        // Redirige a la página principal tras 5 segundos
        setTimeout(() => navigate('/'), 5000);
      });
  }, [userId, token, navigate]);

  const messageStyle = {
    color: isError ? 'red' : 'green',
    textAlign: 'center',
    marginTop: '20vh'
  };

  return (
    <div style={messageStyle}>
      <h1>{message}</h1>
    </div>
  );
}

export default ReactivateAccount;
