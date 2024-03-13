import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Alert, Tooltip, FormFeedback
} from 'reactstrap';
import './argon-design-system-react.css';
import CSRFToken from './csrftoken'; // Asegúrate de que la ruta de importación sea correcta
import getCookie from './csrftoken';
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
  const [tooltipOpen, setTooltipOpen] = useState({
    username: false,
    password: false,
    otpToken: false,
  });

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
        
        const response = await fetch('http://127.0.0.1:8000/users/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify(credentials),
            credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
            navigate('/');
        } else {
            setAlertMessage(data.error || 'Error durante el inicio de sesión');
            setShowAlert(true);
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setAlertMessage('Error al conectar con el servidor');
        setShowAlert(true);
    }
  };
  return (
    <Container className="py-5">
      <Row className="justify-content-center align-items-center">
        <Col lg="6">
          <img src="https://via.placeholder.com/500" alt="Imagen de Gym o Deporte" className="img-fluid" /> 
        </Col>
        <Col lg="6">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              {showAlert && <Alert color="danger">{alertMessage}</Alert>}
              <Form onSubmit={handleSubmit}>
              <CSRFToken />

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
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    onChange={handleChange}
                    value={credentials.password}
                    invalid={!!errors.password}
                  />
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
