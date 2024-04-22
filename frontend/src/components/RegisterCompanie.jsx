import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';

function RegisterEmpresa() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [userData, setUserData] = useState(null); // Estado para almacenar los datos del usuario
    useEffect(() => {
        if (userId) {
          const url = `http://127.0.0.1:8000/api/usuarios/${userId}/`;
          axios.get(url, { withCredentials: true })
            .then(response => {
              console.log(response.data);
              setUserData(response.data); // Almacenar los datos del usuario en el estado
            })
            .catch(error => console.error('Error fetching user data:', error));
        }
      }, [userId]);

    const [nombre, setNombre] = useState('');
    const [codigoEmpresa, setCodigoEmpresa] = useState('');
    const [cif, setCif] = useState('');
    const [direccion, setDireccion] = useState('');
    const [alert, setAlert] = useState({ visible: false, color: '', message: '' });
    const [fieldErrors, setFieldErrors] = useState({ nombre: false, codigoEmpresa: false, cif: false, direccion: false });

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

    const validateFields = () => {
        const errors = {};
        errors.nombre = nombre === '';
        errors.codigoEmpresa = codigoEmpresa === '';
        errors.cif = cif === '' || cif.length !== 9; // Longitud del CIF debe ser 9
        errors.direccion = direccion === '';
        setFieldErrors(errors);
        return Object.values(errors).every(error => error === false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('codigo_empresa', codigoEmpresa);
        formData.append('cif', cif);
        formData.append('direccion', direccion);
    
        try {
            const response = await axios.post('http://127.0.0.1:8000/companies/register/', formData, { withCredentials: true });
    
            if (response.status === 201) {
                setAlert({ visible: true, color: 'success', message: 'Registro exitoso.' });
                var idusuario = response.data.userid
                setTimeout(() => {
                    navigate(`/dashboard/user/${idusuario}`);
                  }, 5000);
            }
        } catch (error) {
            console.error('Registro fallido:', error.response || error);
            setAlert({ visible: true, color: 'danger', message: `Registro fallido: ${error.response.data.error}` });
        }
    };

    const renderInput = (name, type, placeholder, labelText, value) => (
        <FormGroup className="mb-3 position-relative">
            <Label for={name}>
                {labelText} <span className="text-danger">*</span>
            </Label>
            <Input
                type={type}
                name={name}
                id={name}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                invalid={fieldErrors[name]}
                required
            />
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
                                <h2 className="text-center mb-4">Registro de Empresa</h2>
                                {alert.visible && <Alert color={alert.color}>{alert.message}</Alert>}
                                <Form onSubmit={handleSubmit}>
                                    {renderInput('nombre', 'text', 'Nombre de la empresa', 'Nombre de la empresa', nombre)}
                                    {renderInput('codigoEmpresa', 'text', 'Código de la empresa', 'Código de la empresa', codigoEmpresa)}
                                    {renderInput('cif', 'text', 'CIF', 'CIF (9 caracteres)', cif)}
                                    {renderInput('direccion', 'text', 'Dirección', 'Dirección de la empresa', direccion)}

                                    {/* Campo invisible para almacenar el usuario */}
                                    <input type="hidden" name="userId" value={userData?.id} />

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
