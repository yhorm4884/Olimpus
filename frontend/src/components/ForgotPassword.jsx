import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await axios.post('http://backend.olimpus.arkania.es/users/forgot-password/', { email });
            setMessage('Si tu correo electrónico está registrado, recibirás instrucciones para restablecer tu contraseña.');
        } catch (error) {
            setError('Algo salió mal. Por favor, intenta nuevamente.');
        }
    };

    return (
        <Container style={{ marginTop: '20px' }}>
            <h2>Solicitud de Restablecimiento de Contraseña</h2>
            {message && <Alert color="info">{message}</Alert>}
            {error && <Alert color="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="email">Correo Electrónico</Label>
                    <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Ingresa tu correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </FormGroup>
                <Button type="submit" color="primary">Enviar Solicitud</Button>
            </Form>
        </Container>
    );
}

export default ForgotPassword;
