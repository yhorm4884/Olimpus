import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactLoading from 'react-loading';
import { Alert } from 'reactstrap';

export const Logout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // Inicia mostrando la animación de carga
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false); // Estado adicional para manejar errores

  useEffect(() => {
    const logoutUser = async () => {
      try {
        // Intenta realizar la solicitud de logout
        const response = await axios.get("https://backend.olimpus.arkania.es/users/logout/", {}, { withCredentials: true });
        setMessage(response.data.success || 'Has cerrado sesión exitosamente. En 5 segundos se cerrará esta pestaña');
        setIsLoading(false);
        setError(false); // Resetea el estado de error en caso de éxito
        // Redirige al usuario después de mostrar el mensaje
        setTimeout(() => {
          // Redirige a la raíz y recarga la página
          navigate('/'); // Cambia esto por la ruta deseada tras el login
          window.location.reload();
        }, 5000); // Espera 5 segundos
      } catch (error) {
        console.error('Logout failed:', error);
        setMessage('Error al cerrar sesión. Por favor, intenta nuevamente.');
        setIsLoading(false);
        setError(true); // Indica que ocurrió un error
      }
    };

    logoutUser();
  }, [navigate]);

  return (
    <div className="text-center">
      {isLoading ? (
        <>
          <ReactLoading type="spin" color="#28a745" height={'20%'} width={'20%'} />
          <Alert color="warning">Cerrando sesión...</Alert>
        </>
      ) : error ? (
        <Alert color="danger">{message}</Alert> // Muestra un mensaje de error si ocurre uno
      ) : (
        <Alert color="success">{message}</Alert> // Muestra un mensaje de éxito en caso contrario
      )}
    </div>
  );
};

export default Logout;
