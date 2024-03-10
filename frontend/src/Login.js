import React, { useState } from 'react';
import './Styles.css';

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
        <div className="form-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <input type="text" value={otpToken} onChange={(e) => setOtpToken(e.target.value)} placeholder="OTP Token" required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
