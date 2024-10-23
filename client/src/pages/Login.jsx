import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Login = () => {

    const [err, setErr] = useState("")

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
            localStorage.setItem('info', data)
            localStorage.setItem('in', true)
            console.log('Token?: ', localStorage.getItem('google_token'))
        })
        .catch(error => {
            console.error('Error during token verification:', error);
        });
    };

    const handleLoginFailure = () => {
        console.log('Login Failed');
    };

    async function handleSubmit(e)
    {
        e.preventDefault()
        const form = e.target;
        const formData = new FormData();
        formData.append("0", form.Username.value)
        formData.append("1", form.Password.value)
        const formJson = Object.fromEntries(formData);
        let data = await fetch('http://localhost:8080/log', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method: 'POST',
            body: JSON.stringify({
                data: formJson
            })
        })
        let token = await data.text()
        if (token.length == 0)
        {
            setErr("Invalid Credentials")
        }
        else
        {
            localStorage.setItem("token", token)
            window.location.href = '/'
        }
    }

    function handleGuest(e)
    {
        e.preventDefault()
        window.location.href = '/'
    }

    function handleNew(e)
    {
        e.preventDefault()
        window.location.href = '/create'
    }

    return (
        <form method='post' onSubmit={handleSubmit} style={{border: '2px solid black', minWidth: 250, width: 250}}>
            <h2>Login</h2>
            <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginFailure}
                uxMode="popup" 
                scope="https://www.googleapis.com/auth/calendar"
            />
            <div style={{display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center'}}>
            <TextField style={{minWidth: 225, width: 225}} required id="Username" label="Username" defaultValue = ""/>
            <TextField style={{minWidth: 225, width: 225}} required id="Password" label="Password" type="password" defaultValue = ""/>
            <Button variant='contained' type='submit'>Sign In</Button>
            </div>
            <p style={{color:"white", backgroundColor:"red"}}>{err}</p>
            <p>Don't have an account yet?</p>
            <div style={{display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center'}}>
            <Button variant='outlined' onClick={handleNew}>Create an Account</Button>
            <Button variant='contained' onClick={handleGuest}>Continue as Guest</Button>
            </div>
        </form>
    );
};

export default Login;
