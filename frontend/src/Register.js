import React, { useState } from 'react';
import './Styles.css';

function Register() {
    const [username, setUsername] = useState('');
    const [telefono, setTelefono] = useState('');
    const [DNI, setDNI] = useState('');
    const [correo, setCorreo] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [qrCode, setQrCode] = useState(''); // Estado para almacenar y mostrar el código QR

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Añadimos tipo_usuario y estado por defecto en el objeto de datos
        const data = {
            username,
            telefono,
            DNI,
            correo,  // Asumimos que este será el username
            password1,
            password2,
            tipo_usuario: 'cliente', // Valor por defecto
            estado: 'activo', // Valor por defecto
        };

        const response = await fetch('http://127.0.0.1:8000/users/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            setQrCode(result.qr_code); // Guarda el código QR para mostrarlo
            alert('Registro exitoso');
        } else {
            response.json().then(data => {
                console.error('Registro fallido:', data.errors);
                alert(`Registro fallido: ${data.errors}`);
            });
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nombre de usuario" required />
                <input type="text" value={DNI} onChange={(e) => setDNI(e.target.value)} placeholder="DNI" required />
                <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" required />
                <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Correo" required />
                <input type="password" value={password1} onChange={(e) => setPassword1(e.target.value)} placeholder="Contraseña" required />
                <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="Confirmar contraseña" required />
                <button type="submit">Register</button>
            </form>
            {qrCode && (
                <div>
                    <p>Scan this QR code with your 2FA app:</p>
                    <img src={`data:image/png;base64,${qrCode}`} alt="2FA QR Code" />
                </div>
            )}
        </div>
    );
}

export default Register;
