import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, FormGroup, Label, Input, Button, Alert, Card, CardBody } from 'reactstrap';

function ResetPasswordPage() {
    const { uidb64, token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8000/users/serve-qr-code/${uidb64}/${token}/`)
            .then(response => {
                setQrCode(response.data.qr_code);
                console.log(response.data)
            })
            .catch(err => {
                setError('Error al obtener el código QR.');
            });
    }, [uidb64, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            await axios.post('http://localhost:8000/users/reset-password-confirm/', {
                uidb64, token, new_password: newPassword
            });
            console.log('Contraseña restablecida correctamente');
            navigate(`/login`)
        } catch (err) {
            setError('Error al restablecer la contraseña.');
            console.error('Error en cambiar contraseña:', error.response ? error.response.data : error);
        }
    };

    return (
        <Container>
            {qrCode && (
                <div className="text-center my-4">
                    <p>Tu nuevo código QR para la autenticación de dos factores:</p>
                    <img src={`data:image/png;base64,${qrCode}`} alt="Código QR" style={{ maxWidth: '150px', height: 'auto' }} />
                </div>
            )}
            <Card>
                <CardBody>
                    <h2>Restablecer Contraseña</h2>
                    {error && <Alert color="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="newPassword">Nueva Contraseña</Label>
                            <Input
                                type="password"
                                name="newPassword"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="confirmPassword">Confirmar Nueva Contraseña</Label>
                            <Input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </FormGroup>
                        <Button type="submit" color="primary">Restablecer Contraseña</Button>
                    </Form>
                </CardBody>
            </Card>
        </Container>
    );
}

export default ResetPasswordPage;
