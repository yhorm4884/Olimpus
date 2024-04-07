import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Alert, Tooltip, FormFeedback
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './css/argon-design-system-react.css';
import './css/propio-css.css';

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    otpToken: '',
  });
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState({
    username: false,
    password: false,
    otpToken: false,
  });

  const imageContainerRef = useRef(null);

  const toggleTooltip = (field) => {
    setTooltipOpen({ ...tooltipOpen, [field]: !tooltipOpen[field] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setShowAlert(false);
  };

  const validateFields = () => {
    let isValid = true;
    const newErrors = {};

    if (!credentials.username) {
      newErrors.username = 'El nombre de usuario es requerido.';
      isValid = false;
    }
    if (!credentials.password) {
      newErrors.password = 'La contraseña es requerida.';
      isValid = false;
    }
    if (!credentials.otpToken || credentials.otpToken.length !== 6 || isNaN(credentials.otpToken)) {
      newErrors.otpToken = 'El OTP debe ser un número de 6 dígitos.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      setAlertMessage('Por favor, corrige los errores en el formulario.');
      setShowAlert(true);
      return;
    }

    try {
      await axios.get("http://127.0.0.1:8000/api/setcsrf/");
      const loginResponse = await axios.post("http://127.0.0.1:8000/users/login/", {
        username: credentials.username,
        password: credentials.password,
        otpToken: credentials.otpToken,
      });
      
      console.log('Autenticación exitosa:', loginResponse.data.id);
      navigate(`/dashboard/user/${loginResponse.data.id}`);
      window.location.reload();
    } catch (error) {
      console.error('Error en la autenticación:', error.response ? error.response.data : error);
      setAlertMessage('Fallo en la autenticación. Por favor, verifica tus credenciales.');
      setShowAlert(true);
    }
  };
  useEffect(() => {
    const container = imageContainerRef.current;
    
    const handleMouseMove = (e) => {
      const { left, top, width, height } = container.getBoundingClientRect();
      // Calcula el porcentaje del desplazamiento del ratón desde el centro, pero invierte la dirección
      const x = -(e.clientX - left - width / 2) / width * 20; // Reduce la sensibilidad y cambia la dirección
      const y = -(e.clientY - top - height / 2) / height * 20; // Reduce la sensibilidad y cambia la dirección
  
      const img = container.querySelector('.crop-image');
      // Aplica el desplazamiento con suavizado para evitar movimientos bruscos
      img.style.transform = `translate(${x}px, ${y}px)`; // Usa píxeles en lugar de porcentajes para un control más fino
    };
  
    container.addEventListener('mousemove', handleMouseMove);
  
    // Limpieza al desmontar
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  
  return (
    <Container className="py-5">
      <Row className="justify-content-center align-items-center">
        <Col lg="6">
          
          <div className="crop-container px-lg-5 py-lg-5" ref={imageContainerRef}>
            {/* <img src="https://via.placeholder.com/500" alt="Imagen de Gym o Deporte" className="img-fluid" />  */}
            <img src="./media/prueba.jpg" alt="Imagen de Gym o Deporte" className="crop-image" />
          </div>
        </Col>
        <Col lg="6">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <h2 className="text-center mb-4">Iniciar Sesión</h2>
              {showAlert && <Alert color="danger">{alertMessage}</Alert>}
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="username">Nombre de usuario <span className="text-danger">*</span>
                    <span id="UsernameTooltip" style={{ textDecoration: "underline", cursor: "pointer" }}>?</span>
                    <Tooltip
                      placement="right"
                      isOpen={tooltipOpen.username}
                      target="UsernameTooltip"
                      toggle={() => toggleTooltip('username')}
                    >
                      Introduce tu nombre de usuario.
                    </Tooltip>
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    onChange={handleChange}
                    value={credentials.username}
                    invalid={!!errors.username}
                  />
                  <FormFeedback>{errors.username}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="password">Contraseña <span className="text-danger">*</span>
                    <span id="PasswordTooltip" style={{ textDecoration: "underline", cursor: "pointer" }}>?</span>
                    <Tooltip
                      placement="right"
                      isOpen={tooltipOpen.password}
                      target="PasswordTooltip"
                      toggle={() => toggleTooltip('password')}
                    >
                      Introduce tu contraseña.
                    </Tooltip>
                  </Label>
                  <div className="position-relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      onChange={handleChange}
                      value={credentials.password}
                      invalid={!!errors.password}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '10px', top: 'calc(50% - 10px)', cursor: 'pointer' }}
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </span>
                  </div>
                  <FormFeedback>{errors.password}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="otpToken">OTP <span className="text-danger">*</span>
                    <span id="OtpTokenTooltip" style={{ textDecoration: "underline", cursor: "pointer" }}>?</span>
                    <Tooltip
                      placement="right"
                      isOpen={tooltipOpen.otpToken}
                      target="OtpTokenTooltip"
                      toggle={() => toggleTooltip('otpToken')}
                    >
                      Introduce el código OTP de 6 dígitos.
                    </Tooltip>
                  </Label>
                  <Input
                    id="otpToken"
                    name="otpToken"
                    onChange={handleChange}
                    value={credentials.otpToken}
                    invalid={!!errors.otpToken}
                  />
                  <FormFeedback>{errors.otpToken}</FormFeedback>
                </FormGroup>
                <div className="text-center">
                  <Button color="primary" type="submit">Iniciar sesión</Button>
                </div>
              </Form>
              <div className="mt-3">
                <a href="/forgot-password">¿Has olvidado tu contraseña?</a><br />
                <a href="/register">¿No tienes cuenta? Créate una ahora mismo</a>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
