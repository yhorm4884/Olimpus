import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Alert, Tooltip } from 'reactstrap';
import './css/argon-design-system-react.css';
import './css/propio-css.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


function Register() {
    const [username, setUsername] = useState('');
    const [telefono, setTelefono] = useState('');
    const [DNI, setDNI] = useState('');
    const [correo, setCorreo] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [alert, setAlert] = useState({ visible: false, color: '', message: '' });
    const [tooltipOpen, setTooltipOpen] = useState({});
    const [fieldErrors, setFieldErrors] = useState({ username: false, telefono: false, DNI: false, correo: false, password1: false, password2: false });
    const [showPassword, setShowPassword] = useState({ password1: false, password2: false });

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'username': setUsername(value); break;
            case 'telefono': setTelefono(value); break;
            case 'DNI': setDNI(value); break;
            case 'correo': setCorreo(value); break;
            case 'password1': setPassword1(value); break;
            case 'password2': setPassword2(value); break;
            default: break;
        }
    };

    const toggleTooltip = (id) => {
        setTooltipOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const validateFields = () => {
        const errors = {};
        errors.username = username === '';
        errors.telefono = telefono === '';
        errors.DNI = DNI === '';
        errors.correo = correo === '' || !/\S+@\S+\.\S+/.test(correo);
        errors.password1 = password1 === '';
        errors.password2 = password2 === '' || password1 !== password2;
        setFieldErrors(errors);
        return Object.values(errors).every(error => error === false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) {
            setAlert({ visible: true, color: 'danger', message: 'Por favor, corrige los errores en el formulario.' });
            return;
        }
        const data = { username, telefono, DNI, correo, password1, password2, tipo_usuario: 'cliente', estado: 'activo' };
    
        try {
            const response = await axios.post('http://127.0.0.1:8000/users/register/', data, { withCredentials: true });
    
            if (response.status === 201) {
                const result = response.data;
                setQrCode(result.qr_code);
                setAlert({ visible: true, color: 'success', message: 'Registro exitoso. Por favor, escanea el QR para completar la configuración 2FA.' });
            }
        } catch (error) {
            console.error('Registro fallido:', error.response || error);
            const errorMessage = error.response?.data?.errors || 'Error desconocido al registrar.';
            setAlert({ visible: true, color: 'danger', message: `Registro fallido: ${errorMessage}` });
        }
    };
    

    const renderInput = (name, type, placeholder, labelText, tooltipText, value) => (
        <FormGroup className="mb-3 position-relative">
            <Label for={name}>
                {labelText} <span className="text-danger">*</span>
                <span style={{ fontWeight: "bold", cursor: "pointer" }} id={`${name}Tooltip`}>?</span>
                <Tooltip
                    placement="right"
                    isOpen={tooltipOpen[`${name}Tooltip`]}
                    target={`${name}Tooltip`}
                    toggle={() => toggleTooltip(`${name}Tooltip`)}
                >
                    {tooltipText}
                </Tooltip>
            </Label>
            <Input
                type={type !== 'password' ? type : showPassword[name] ? 'text' : 'password'}
                name={name}
                id={name}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                invalid={fieldErrors[name]}
            />
            {type === 'password' && (
                <span
                    onClick={() => setShowPassword({ ...showPassword, [name]: !showPassword[name] })}
                    style={{ position: 'absolute', right: '10px', top: 'calc(40% - -10px)', cursor: 'pointer', zIndex: 5 }}
                >
                    <FontAwesomeIcon icon={showPassword[name] ? faEyeSlash : faEye} />
                </span>
            )}
            {fieldErrors[name] && <p className="text-danger">Este campo es obligatorio.</p>}
        </FormGroup>
    );
      
    return (
        <div className="section section-shaped">
            <Container className="pt-lg-md">
                <Row className="justify-content-center">
                    <Col lg="5">
                        <Card className="bg-secondary shadow border-0">
                            <CardBody className="px-lg-5 py-lg-5">
                                <h2 className="text-center mb-4">Registro</h2>
                                {alert.visible && <Alert color={alert.color}>{alert.message}</Alert>}
                                <Form onSubmit={handleSubmit}>
                                    {renderInput('username', 'text', 'Nombre de usuario', 'Nombre de usuario', 'Escribe tu nombre de usuario.', username, setUsername)}
                                    {renderInput('DNI', 'text', 'DNI', 'DNI', 'Ingresa tu DNI sin puntos ni espacios.', DNI, setDNI)}
                                    {renderInput('telefono', 'text', 'Teléfono', 'Teléfono', 'Número de teléfono sin espacios ni guiones.', telefono, setTelefono)}
                                    {renderInput('correo', 'email', 'Correo', 'Correo', 'Dirección de correo electrónico válida.', correo, setCorreo)}
                                    {renderInput('password1', 'password', 'Contraseña', 'Contraseña', 'Crea una contraseña segura.', password1, setPassword1)}
                                    {renderInput('password2', 'password', 'Confirmar contraseña', 'Confirmar Contraseña', 'Repite tu contraseña.', password2, setPassword2)}
                                    <div className="text-center">
                                        <Button type="submit" color="primary" className="my-4">Registrar</Button>
                                    </div>
                                </Form>
                                {qrCode && (
                                    <div className="mt-4">
                                        <p>Escanea este código QR con tu aplicación de autenticación 2FA:</p>
                                        <img src={`data:image/png;base64,${qrCode}`} alt="Código QR 2FA" className="qr-code"/>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Register;
