import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Alert, Tooltip, FormFeedback
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, } from '@fortawesome/free-solid-svg-icons';
import './css/argon-design-system-react.css';
import './css/propio-css.css';

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
    const imageContainerRef = useRef(null);

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

    // const renderInput = (name, type, placeholder, labelText, tooltipText, value) => (
    //     <FormGroup className="mb-3 position-relative">
    //         <Label for={name}>
    //             {labelText} <span className="text-danger">*</span>
    //             <span style={{ fontWeight: "bold", cursor: "pointer" }} id={`${name}Tooltip`}>?</span>
    //             <Tooltip
    //                 placement="right"
    //                 isOpen={tooltipOpen[`${name}Tooltip`]}
    //                 target={`${name}Tooltip`}
    //                 toggle={() => toggleTooltip(`${name}Tooltip`)}
    //             >
    //                 {tooltipText}
    //             </Tooltip>
    //         </Label>
    //         <Input
    //             type={type !== 'password' ? type : showPassword[name] ? 'text' : 'password'}
    //             name={name}
    //             id={name}
    //             placeholder={placeholder}
    //             value={value}
    //             onChange={handleChange}
    //             invalid={fieldErrors[name]}
    //         />
    //         {type === 'password' && (
    //             <span
    //                 onClick={() => setShowPassword({ ...showPassword, [name]: !showPassword[name] })}
    //                 style={{ position: 'absolute', right: '10px', top: 'calc(40% - -10px)', cursor: 'pointer', zIndex: 5 }}
    //             >
    //                 <FontAwesomeIcon icon={showPassword[name] ? faEyeSlash : faEye} />
    //             </span>
    //         )}
    //         {fieldErrors[name] && <p className="text-danger">Este campo es obligatorio.</p>}
    //     </FormGroup>
    // );

    return (
        <Container className="py-5">
            <Row className="justify-content-center align-items-center">
                <Col lg="6">
                    <div className="crop-container px-lg-5 py-lg-5" ref={imageContainerRef}>
                        <img src="./media/prueba.jpg" alt="Imagen de Gym o Deporte" className="crop-image" />
                    </div>
                </Col>
                <Col lg="6">
                    <Card className="bg-secondary shadow border-0">
                        <CardBody className="px-lg-5 py-lg-5">
                            <h2 className="text-center mb-4">Registro</h2>
                            {alert.visible && <Alert color={alert.color}>{alert.message}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Row form>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="username">Nombre de usuario <span className="text-danger">*</span>
                                                <span id="UsernameTooltip" style={{ textDecoration: "underline", cursor: "pointer" }}>?</span>
                                                <Tooltip
                                                    placement="right"
                                                    isOpen={tooltipOpen.username}
                                                    target="UsernameTooltip"
                                                    toggle={() => toggleTooltip('username')}
                                                >
                                                    Escribe tu nombre de usuario.
                                                </Tooltip>
                                            </Label>
                                            <Input
                                                id="username"
                                                name="username"
                                                onChange={handleChange}
                                                value={username}
                                                invalid={fieldErrors.username}
                                            />
                                            {fieldErrors.username && <FormFeedback>{fieldErrors.username}</FormFeedback>}
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="DNI">DNI <span className="text-danger">*</span>
                                                <span id="DNITooltip" style={{ textDecoration: "underline", cursor: "pointer" }}>?</span>
                                                <Tooltip
                                                    placement="right"
                                                    isOpen={tooltipOpen.DNITooltip}
                                                    target="DNITooltip"
                                                    toggle={() => toggleTooltip('DNITooltip')}
                                                >
                                                    Ingresa tu DNI sin puntos ni espacios.
                                                </Tooltip>
                                            </Label>
                                            <Input
                                                id="DNI"
                                                name="DNI"
                                                onChange={handleChange}
                                                value={DNI}
                                                invalid={fieldErrors.DNI}
                                            />
                                            {fieldErrors.DNI && <FormFeedback>{fieldErrors.DNI}</FormFeedback>}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row form>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="telefono">Teléfono <span className="text-danger">*</span>
                                                <span id="TelefonoTooltip" style={{ textDecoration: "underline", cursor: "pointer" }}>?</span>
                                                <Tooltip
                                                    placement="right"
                                                    isOpen={tooltipOpen.TelefonoTooltip}
                                                    target="TelefonoTooltip"
                                                    toggle={() => toggleTooltip('TelefonoTooltip')}
                                                >
                                                    Número de teléfono sin espacios ni guiones.
                                                </Tooltip>
                                            </Label>
                                            <Input
                                                id="telefono"
                                                name="telefono"
                                                onChange={handleChange}
                                                value={telefono}
                                                invalid={fieldErrors.telefono}
                                            />
                                            {fieldErrors.telefono && <FormFeedback>{fieldErrors.telefono}</FormFeedback>}
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="correo">Correo <span className="text-danger">*</span>
                                                <span id="CorreoTooltip" style={{ textDecoration: "underline", cursor: "pointer" }}>?</span>
                                                <Tooltip
                                                    placement="right"
                                                    isOpen={tooltipOpen.CorreoTooltip}
                                                    target="CorreoTooltip"
                                                    toggle={() => toggleTooltip('CorreoTooltip')}
                                                >
                                                    Dirección de correo electrónico válida.
                                                </Tooltip>
                                            </Label>
                                            <Input
                                                id="correo"
                                                name="correo"
                                                type="email"
                                                onChange={handleChange}
                                                value={correo}
                                                invalid={fieldErrors.correo}
                                            />
                                            {fieldErrors.correo && <FormFeedback>{fieldErrors.correo}</FormFeedback>}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row form>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="password1">Contraseña <span className="text-danger">*</span>
                                                <span id="Password1Tooltip" style={{ textDecoration: "underline", cursor: "pointer" }}>?</span>
                                                <Tooltip
                                                    placement="right"
                                                    isOpen={tooltipOpen.Password1Tooltip}
                                                    target="Password1Tooltip"
                                                    toggle={() => toggleTooltip('Password1Tooltip')}
                                                >
                                                    Crea una contraseña segura.
                                                </Tooltip>
                                            </Label>
                                            <div className="position-relative">
                                                <Input
                                                    id="password1"
                                                    name="password1"
                                                    type={showPassword.password1 ? 'text' : 'password'}
                                                    onChange={handleChange}
                                                    value={password1}
                                                    invalid={fieldErrors.password1}
                                                />
                                                <span
                                                    onClick={() => setShowPassword({ ...showPassword, password1: !showPassword.password1 })}
                                                    style={{ position: 'absolute', right: '10px', top: 'calc(50% - 10px)', cursor: 'pointer' }}
                                                >
                                                    <FontAwesomeIcon icon={showPassword.password1 ? faEyeSlash : faEye} />
                                                </span>
                                            </div>
                                            {fieldErrors.password1 && <FormFeedback>{fieldErrors.password1}</FormFeedback>}
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="password2">Confirmar Contraseña <span className="text-danger">*</span>
                                                <span id="Password2Tooltip" style={{ textDecoration: "underline", cursor: "pointer" }}>?</span>
                                                <Tooltip
                                                    placement="right"
                                                    isOpen={tooltipOpen.Password2Tooltip}
                                                    target="Password2Tooltip"
                                                    toggle={() => toggleTooltip('Password2Tooltip')}
                                                >
                                                    Repite tu contraseña.
                                                </Tooltip>
                                            </Label>
                                            <div className="position-relative">
                                                <Input
                                                    id="password2"
                                                    name="password2"
                                                    type={showPassword.password2 ? 'text' : 'password'}
                                                    onChange={handleChange}
                                                    value={password2}
                                                    invalid={fieldErrors.password2}
                                                />
                                                <span
                                                    onClick={() => setShowPassword({ ...showPassword, password2: !showPassword.password2 })}
                                                    style={{ position: 'absolute', right: '10px', top: 'calc(50% - 10px)', cursor: 'pointer' }}
                                                >
                                                    <FontAwesomeIcon icon={showPassword.password2 ? faEyeSlash : faEye} />
                                                </span>
                                            </div>
                                            {fieldErrors.password2 && <FormFeedback>{fieldErrors.password2}</FormFeedback>}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <div className="text-center">
                                    <Button type="submit" color="primary" className="my-4">Registrar</Button>
                                </div>
                            </Form>
                            {qrCode && (
                                <div className="position-fixed top-0 start-50 translate-middle-x mt-4" style={{ zIndex: 1050 }}>
                                    <Card className="bg-light shadow-lg border-0">
                                        <CardBody className="px-4 py-3">
                                            <p>Escanea este código QR con tu aplicación de autenticación 2FA:</p>
                                            <div className="qr-code-container">
                                                <img src={`data:image/png;base64,${qrCode}`} alt="Código QR 2FA" className="qr-code" />
                                            </div>
                                            <div className="text-center">
                                                <Link to="/login">
                                                    <Button color="primary" className="my-4">Iniciar Sesión</Button>
                                                </Link>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}


export default Register;
