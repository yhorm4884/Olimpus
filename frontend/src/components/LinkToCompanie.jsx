import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';

function JoinEmpresa() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [userData, setUserData] = useState(null); 
    useEffect(() => {
        if (userId) {
          const url = `http://127.0.0.1:8000/api/usuarios/${userId}/`;
          axios.get(url, { withCredentials: true })
            .then(response => {
              console.log(response.data);
              setUserData(response.data); 
            })
            .catch(error => console.error('Error fetching user data:', error));
        }
      }, [userId]);

    const [codigoEmpresa, setCodigoEmpresa] = useState('');
    const [alert, setAlert] = useState({ visible: false, color: '', message: '' });
    const [fieldErrors, setFieldErrors] = useState({ codigoEmpresa: false });

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'codigoEmpresa': setCodigoEmpresa(value); break;
            default: break;
        }
    };

    const validateFields = () => {
        const errors = {};
        errors.codigoEmpresa = codigoEmpresa === '';
        setFieldErrors(errors);
        return Object.values(errors).every(error => error === false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const formData = new FormData();
            formData.append('codigoEmpresa', codigoEmpresa);
            formData.append('userId', userData?.id);
    
            const response = await axios.post('http://127.0.0.1:8000/companies/join/', formData, { withCredentials: true });
    
            if (response.status === 200) {
                setAlert({ visible: true, color: 'success', message: 'Solicitud unión enviada correctamente. Por favor espere a que el administrador acepte su petición.' });
                setTimeout(() => {
                    navigate(`/dashboard/user/${userId}`);
                }, 4000);
            }
        } catch (error) {
            console.log(error)
            console.error('Unión fallida a la empresa:', error.response || error);
            setAlert({ visible: true, color: 'danger', message: `Unión fallida a la empresa: ${error.response.data.error}` });
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
                                <h2 className="text-center mb-4">Unirse a Empresa</h2>
                                {alert.visible && <Alert color={alert.color}>{alert.message}</Alert>}
                                <Form onSubmit={handleSubmit}>
                                    {renderInput('codigoEmpresa', 'text', 'Código de la empresa', 'Código de la empresa', codigoEmpresa)}
                                    {/* Campo invisible para almacenar el usuario */}
                                    <input type="hidden" name="userId" value={userData?.id} />
                                    <div className="text-center">
                                        <Button type="submit" color="primary" className="my-4">Unirse a Empresa</Button>
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

export default JoinEmpresa;
