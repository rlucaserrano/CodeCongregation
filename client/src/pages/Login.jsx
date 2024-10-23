import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import '../components/Login.css';

const Login = () => {
    const [showExtraOptions, setShowExtraOptions] = useState(false);

    const handleLoginSuccess = (credentialResponse) => {
        fetch('http://localhost:8080/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: credentialResponse.credential }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                localStorage.setItem('google_token', credentialResponse.credential);
                localStorage.setItem('info', JSON.stringify(data.user_info));
                window.location.href = '/';
            } else if (data.status === 'incomplete') {
                localStorage.setItem('user_id', data.user_id);
                window.location.href = '/complete-profile';  // Redirect to complete profile page
            } else {
                console.error('Google login error:', data.message);
            }
        })
        .catch(error => console.error('Error during Google login:', error));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:8080/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: formJson }),
            });

            if (response.ok) {
                const token = await response.text();
                localStorage.setItem('token', token);
                window.location.href = '/';
            } else {
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const handleGuest = (e) => {
        e.preventDefault();
        window.location.href = '/';
    };

    const handleNew = (e) => {
        e.preventDefault();
        window.location.href = '/create';
    };

    return (
        <Box className="login-container">
            <Typography variant="h4" align="center" gutterBottom>Login</Typography>
            <Box component="form" onSubmit={handleSubmit} className="login-form">
                <TextField required label="Username" name="Username" fullWidth />
                <TextField required label="Password" name="Password" type="password" fullWidth />
                <Button variant='contained' type='submit'>Sign In</Button>
            </Box>
            <div className="google-login">
                <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={() => console.log('Google login failed')}
                    uxMode="popup"
                />
            </div>
            <Box className="login-actions">
                <Typography 
                    className="toggle-text" 
                    onClick={() => setShowExtraOptions(!showExtraOptions)}
                >
                    Don't have an account yet?
                </Typography>
                <div className={showExtraOptions ? 'show' : 'hidden-buttons'}>
                    <Button onClick={handleNew} sx={{ textTransform: 'none' }}>Create an Account</Button>
                    <Button variant='outlined' onClick={handleGuest}>Continue as Guest</Button>
                </div>
            </Box>
        </Box>
    );
};

export default Login;
