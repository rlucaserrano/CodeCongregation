import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
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
            if (data.status === 'success') {
                localStorage.setItem('user_id', data.user_id);
                localStorage.setItem('user_email', data.email);
                localStorage.setItem('user_name', data.name);
                localStorage.setItem('google_access_token', credentialResponse.credential); // Store the access token
    
                window.location.href = '/dashboard';
            } else {
                setLoginError(data.message);
            }
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

    return (
        <div>
            <h2>Login</h2>

            {/* Google Login */}
            <GoogleLogin
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
    );
};

export default Login;
