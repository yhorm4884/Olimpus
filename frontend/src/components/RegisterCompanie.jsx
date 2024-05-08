import React, { useState, useEffect } from 'react';
import { useNavigate, useParams  } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Alert, FormFeedback, Tooltip } from 'reactstrap';

function RegisterEmpresa() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        if (userId) {
            axios.get(`http://backend.olimpus.arkania.es/api/usuarios/${userId}/`, { withCredentials: true })
                .then(response => {
                    setUserData(response.data);
                })
                .catch(error => console.error('Error fetching user data:', error));
        }
    }, [userId]);

    const [nombre, setNombre] = useState('');
    const [codigoEmpresa, setCodigoEmpresa] = useState('');
    const [cif, setCif] = useState('');
    const [direccion, setDireccion] = useState('');
    const [alert, setAlert] = useState({ visible: false, color: '', message: '' });
    const [tooltipOpen, setTooltipOpen] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'nombre': setNombre(value); break;
            case 'codigoEmpresa': setCodigoEmpresa(value); break;
            case 'cif': setCif(value); break;
            case 'direccion': setDireccion(value); break;
            default: break;
        }
    };

    const toggleTooltip = (id) => {
        setTooltipOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const validateFields = () => {
        const errors = {};
        if (nombre === '') errors.nombre = "El nombre de la empresa no puede estar vacío.";
        if (codigoEmpresa === '') errors.codigoEmpresa = "El código de la empresa no puede estar vacío.";
        if (cif === '') {
            errors.cif = "El CIF no puede estar vacío.";
        } else if (cif.length !== 9) {
            errors.cif = "El CIF debe tener exactamente 9 caracteres.";
        }
        if (direccion === '') errors.direccion = "La dirección no puede estar vacía.";
        setFieldErrors(errors);
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateFields();
        if (Object.keys(errors).length > 0) {
            const errorMessages = Object.keys(errors).map(key => <li key={key}>{errors[key]}</li>);
            setAlert({
                visible: true,
                color: 'danger',
                message: <ul>{errorMessages}</ul>
            });
            return;
        }

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('codigo_empresa', codigoEmpresa);
        formData.append('cif', cif);
        formData.append('direccion', direccion);

        try {
            const response = await axios.post('http://backend.olimpus.arkania.es/companies/register/', formData, { withCredentials: true });
            if (response.status === 201) {
                setAlert({ visible: true, color: 'success', message: 'Registro exitoso.' });
                navigate(`/dashboard/user/${response.data.userid}`);
            }
        } catch (error) {
            console.error('Registro fallido:', error.response || error);
            setAlert({ visible: true, color: 'danger', message: `Registro fallido: ${error.response?.data?.error || 'Error desconocido'}` });
        }
    };

    return (
        <div className="section section-shaped">
            <Container className="pt-lg-md">
                <Row className="justify-content-center">
                    <Col lg="5">
                        <Card className="bg-secondary shadow border-0">
                            <CardBody className="px-lg-5 py-lg-5">
                                <h2 className="text-center mb-4">Registro de Empresa</h2>
                                {alert.visible && <Alert color={alert.color}>{alert.message}</Alert>}
                                <Form onSubmit={handleSubmit}>
                                    {['nombre', 'codigoEmpresa', 'cif', 'direccion'].map(field => (
                                        <FormGroup className="mb-3" key={field}>
                                            <Label for={field}>
                                                {field === 'nombre' ? 'Nombre de la empresa' :
                                                 field === 'codigoEmpresa' ? 'Código de la empresa' :
                                                 field === 'cif' ? 'CIF (9 caracteres)' :
                                                 'Dirección de la empresa'} <span className="text-danger">*</span>
                                                <span id={`${field}Tooltip`} style={{ textDecoration: "underline", cursor: "pointer" }}>?</span>
                                            </Label>
                                            <Tooltip
                                                placement="right"
                                                isOpen={tooltipOpen[`${field}Tooltip`]}
                                                target={`${field}Tooltip`}
                                                toggle={() => toggleTooltip(`${field}Tooltip`)}
                                            >
                                                {field === 'nombre' ? 'Ingresa el nombre completo de la empresa.' :
                                                 field === 'codigoEmpresa' ? 'Introduce el código único de la empresa.' :
                                                 field === 'cif' ? 'Debe ser un CIF válido de 9 caracteres, sin espacios.' :
                                                 'Introduce la dirección completa de la empresa.'}
                                            </Tooltip>
                                            <Input
                                                type="text"
                                                name={field}
                                                id={field}
                                                placeholder={field === 'nombre' ? 'Nombre de la empresa' :
                                                            field === 'codigoEmpresa' ? 'Código de la empresa' :
                                                            field === 'cif' ? 'Ejemplo: A12345678' :
                                                            'Dirección completa'}
                                                value={eval(field)}
                                                onChange={handleChange}
                                                invalid={fieldErrors[field] ? true : false}
                                            />
                                            {fieldErrors[field] && <FormFeedback>{fieldErrors[field]}</FormFeedback>}
                                        </FormGroup>
                                    ))}
                                    <div className="text-center">
                                        <Button type="submit" color="primary" className="my-4">Registrar Empresa</Button>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default RegisterEmpresa;
