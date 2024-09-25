import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const handleLoginSuccess = (credentialResponse) => {
        console.log('Login Success:', credentialResponse);
    
        fetch('http://localhost:8080/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: credentialResponse.credential,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('User data:', data);
            // Store the token for later use
            localStorage.setItem('google_token', credentialResponse.credential);
        })
        .catch(error => {
            console.error('Error during token verification:', error);
        });
    };

    const handleLoginFailure = () => {
        console.log('Login Failed');
    };

    return (
        <div>
            <h2>Login</h2>
            <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginFailure}
                uxMode="popup"
                scope="https://www.googleapis.com/auth/calendar"
            />
        </div>
    );
};

export default Login;
