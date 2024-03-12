import React, { useState } from 'react';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import './argon-design-system-react.css';
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [otpToken, setOtpToken] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`http://127.0.0.1:8000/users/login/?username=${username}&password=${password}&otp_token=${otpToken}`);

        if (response.ok) {
            const result = await response.json();
            console.log(result); // Manejar respuesta exitosa como prefieras
        } else {
            const errorData = await response.json();
            setError(errorData.error);
        }
    };

    return (
        <div className="section section-shaped">
            <Container className="pt-lg-md">
                <Row className="justify-content-center">
                    <Col lg="5">
                        <Card className="bg-secondary shadow border-0">
                            <CardBody className="px-lg-5 py-lg-5">
                                {error && <p className="text-danger">{error}</p>}
                                <Form onSubmit={handleSubmit}>
                                    <FormGroup className="mb-3">
                                        <Label for="username" className="form-control-label">Username</Label>
                                        <Input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" required />
                                    </FormGroup>
                                    <FormGroup className="mb-3">
                                        <Label for="password" className="form-control-label">Password</Label>
                                        <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
                                    </FormGroup>
                                    <FormGroup className="mb-3">
                                        <Label for="otpToken" className="form-control-label">OTP Token</Label>
                                        <Input type="text" id="otpToken" value={otpToken} onChange={(e) => setOtpToken(e.target.value)} className="form-control" required />
                                    </FormGroup>
                                    <div className="text-center">
                                        <Button type="submit" color="primary" className="my-4">Login</Button>
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

export default Login;
