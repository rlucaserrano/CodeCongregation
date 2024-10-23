import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Login = () => {
<<<<<<< HEAD
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (userId) {
            window.location.href = '/dashboard';  // Redirect to dashboard if user is already logged in
        }
    }, []);

    const handleGoogleLoginSuccess = (credentialResponse) => {
        fetch('http://localhost:8080/api/users/auth/google', {
=======
    const handleLoginSuccess = (credentialResponse) => {
        console.log('Login Success:', credentialResponse);
        fetch('http://localhost:8080/api/auth/google', {
>>>>>>> 9b1143f5c09ac00b1c44227f2cb84a060ed544b2
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',  // Ensures cookies are sent for session management
            body: JSON.stringify({
                token: credentialResponse.credential,  // Send the Google credential token
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
<<<<<<< HEAD
            if (data.status === 'success') {
                localStorage.setItem('user_id', data.user_id);
                localStorage.setItem('user_email', data.email);
                localStorage.setItem('user_name', data.name);
                localStorage.setItem('google_access_token', credentialResponse.credential); // Store the access token
    
                window.location.href = '/dashboard';
            } else {
                setLoginError(data.message);
            }
=======
            console.log('User data:', data);
            // Store the token for later use
            localStorage.setItem('google_token', credentialResponse.credential);
            localStorage.setItem('info', data)
            localStorage.setItem('in', true)
            console.log('Token?: ', localStorage.getItem('google_token'))
>>>>>>> 9b1143f5c09ac00b1c44227f2cb84a060ed544b2
        })
        .catch(error => {
            console.error('Error during Google login:', error);
            setLoginError('Google login failed.');
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',  // Manage session cookies for username/password login
            body: JSON.stringify({
                username,
                password,
            }),
        });

        const data = await response.json();
        if (data.status === 'success') {
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('user_name', data.user_name);
            window.location.href = '/dashboard';
        } else {
            setLoginError(data.message);
        }
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
        localStorage.setItem("token", token)
        window.location.href = '/'
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

            {/* Google Login */}
            <GoogleLogin
<<<<<<< HEAD
                onSuccess={handleGoogleLoginSuccess}
                onError={() => setLoginError('Google login failed')}
                uxMode="popup"
                scope="https://www.googleapis.com/auth/calendar"
            />

            <h3>Or login with username and password</h3>
            <form onSubmit={handleLogin}>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                    />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>

            {loginError && <p>{loginError}</p>}
        </div>
=======
                onSuccess={handleLoginSuccess}
                onError={handleLoginFailure}
                uxMode="popup" 
            />
            <div style={{display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center'}}>
            <TextField style={{minWidth: 225, width: 225}} required id="Username" label="Username" defaultValue = ""/>
            <TextField style={{minWidth: 225, width: 225}} required id="Password" label="Password" type="password" defaultValue = ""/>
            <Button variant='contained' type='submit'>Sign In</Button>
            </div>
            <div>
            <p>Don't have an account yet?</p>
            <Button style={{textTransform: 'none'}} onClick={handleNew}>Create an Account</Button>
            </div>
            <Button variant='contained' onClick={handleGuest}>Continue as Guest</Button>
        </form>
>>>>>>> 9b1143f5c09ac00b1c44227f2cb84a060ed544b2
    );
};

export default Login;
