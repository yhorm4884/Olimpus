import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';

function JoinEmpresa() {
    
    const navigate = useNavigate();
    const { userId } = useParams();
    const [userData, setUserData] = useState(null); 
    const [codigoEmpresa, setCodigoEmpresa] = useState('');
    const [formReady, setFormReady] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false); // Estado para controlar si el botón está deshabilitado
    const [alert, setAlert] = useState({ visible: false, color: '', message: '' });

    useEffect(() => {
        if (userId) {
          const url = `https://backend.olimpus.arkania.es/api/usuarios/${userId}/`;
          axios.get(url, { withCredentials: true })
            .then(response => {
              console.log(response.data);
              setUserData(response.data); 
              const url2 = `https://backend.olimpus.arkania.es/api/empresas/${localStorage.getItem('companyId')}/`;
              axios.get(url2, { withCredentials: true })
                .then(response2 => {
                  var codigo = response2.data.codigo_empresa;
                  setCodigoEmpresa(codigo); 
                  setFormReady(true); // Indicar que el formulario está listo para enviar
                })
            })
            .catch(error => console.error('Error fetching user data:', error));
        }
      }, [userId]);

    useEffect(() => {
        // Simular clic del botón cuando el formulario esté listo
        if (formReady) {
            document.getElementById('submitButton').click();
            setButtonDisabled(true); // Deshabilitar el botón después de hacer clic en él
        }
    }, [formReady]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'codigoEmpresa': setCodigoEmpresa(value); break;
            default: break;
        }
    };

    const handleSubmit = async (e) => {
        e && e.preventDefault();
        
        // Verificar si el formulario está listo para enviar
        if (!formReady) {
            console.error('El formulario no está listo para enviar');
            return;
        }
        
        try {
            const formData = new FormData();
            formData.append('codigoEmpresa', codigoEmpresa);
            formData.append('userId', userData?.id);
    
            const response = await axios.post('https://backend.olimpus.arkania.es/companies/join/', formData, { withCredentials: true });
    
            if (response.status === 200) {
                setAlert({ visible: true, color: 'success', message: 'Solicitud unión enviada correctamente. Por favor espere a que el administrador acepte su petición.' });
                setTimeout(() => {
                    navigate(`/dashboard/user/${userId}`);
                }, 4000);
            }
        } catch (error) {
            console.log(error);
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
                required
            />
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
                                    {renderInput('codigoEmpresa', 'password', 'Código de la empresa', 'Código de la empresa', codigoEmpresa)}
                                    {/* Campo invisible para almacenar el usuario */}
                                    <input type="hidden" name="userId" value={userData?.id} />
                                    <div className="text-center">
                                        <Button id="submitButton" type="submit" color="primary" className="my-4" disabled={buttonDisabled}>Unirse a Empresa</Button>
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