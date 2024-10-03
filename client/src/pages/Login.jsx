import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Login = () => {
    const handleLoginSuccess = (credentialResponse) => {
        console.log('Login Success:', credentialResponse);
        console.log('Meep: ', credentialResponse.credential)
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
            localStorage.setItem('info', data)
            localStorage.setItem('in', true)
        })
        .catch(error => {
            console.error('Error during token verification:', error);
        });
    };

    const handleLoginFailure = () => {
        console.log('Login Failed');
    };

    function handleSubmit(e)
    {
        e.preventDefault()
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        console.log('User: ' + formJson.Username)
        console.log('Pass: ' + formJson.Password)
        window.location.href = '/'
    }

    return (
        <form method='post' onSubmit={handleSubmit}>
            <h2>Login</h2>
            <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginFailure}
                uxMode="popup" 
            />
            <log>
             <TextField required id="Username" label="Username" defaultValue = ""/>
             <TextField required id="Password" label="Password" type="password" defaultValue = ""/>
             </log>
             <div>
             <Button variant='contained' type='submit'>Sign In</Button>
             </div>
        </form>
    );
};

export default Login;
