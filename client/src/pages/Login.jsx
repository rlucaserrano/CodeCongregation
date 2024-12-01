import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import '../components/Login.css';

const Login = () => {
    const [formError, setFormError] = useState('');
    const [showExtraOptions, setShowExtraOptions] = useState(false);

    // Handle Google OAuth login success
    const handleLoginSuccess = (credentialResponse) => {
        fetch('http://localhost:8080/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: credentialResponse.credential }),
        })
        .then(response => response.json())
        /*
        .then(data => {
            if (data.status === 'success') {
                // Store the token and user info for further authentication
                localStorage.setItem('google_token', credentialResponse.credential);
                localStorage.setItem('info', JSON.stringify(data.user_info));
                window.location.href = '/';
            } else if (data.status === 'incomplete') {
                // Store user_id if profile completion is needed
                localStorage.setItem('user_id', data.user_id);
                window.location.href = '/complete-profile';  // Redirect to complete profile page
            } else {
                setFormError(data.message || 'Google login error occurred.');
                console.error('Google login error:', data.message);
            }
        })
        .catch(error => {
            setFormError('Error during Google login. Please try again later.');
            console.error('Error during Google login:', error);
        });
    };
    */
        .then(data => {
            if (data.status === 'success') {
                // Store the token and user info for further authentication
                localStorage.setItem('token', credentialResponse.credential);
                localStorage.setItem('info', JSON.stringify(data.user_info));
                window.location.href = '/account';  // Redirect to account page
            } else if (data.status === 'incomplete') {
                // Store user_id if profile completion is needed
                localStorage.setItem('user_id', data.user_id);
                window.location.href = '/complete-profile';  // Redirect to complete profile page
            } else {
                setFormError(data.message || 'Google login error occurred.');
                console.error('Google login error:', data.message);
            }
        })
        .catch(error => {
            setFormError('Error during Google login. Please try again later.');
            console.error('Error during Google login:', error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');  // Clear previous errors
    
        const form = e.target;
        const username = form.Username.value;
        const password = form.Password.value;
    
        try {
            const response = await fetch('http://localhost:8080/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: { Username: username, Password: password } }),
            });
    
            if (response.ok) {
                const token = await response.text();
                console.log("Received token from server:", token); // Log the token from the server
                if (token) {
                    localStorage.setItem('token', token);  // Store the JWT token
                    localStorage.setItem('userFirst', username[0]); // Store the first Letter for the avatar
                    console.log("Stored token in localStorage:", localStorage.getItem('token')); // Verify storage
                    window.location.href = '/groups';     // Redirect to groups page
                } else {
                    setFormError("Token is empty. Please try again.");
                    console.error("Empty token received");
                }
            } else {
                const errorData = await response.json();
                setFormError(errorData.error || 'Login failed. Please try again.');
                console.error('Login failed:', errorData);
            }
        } catch (error) {
            setFormError('An error occurred during login. Please try again.');
            console.error('Error during login:', error);
        }
    };
    // Handle redirection for guests and new account creation
    const handleGuest = () => {
        window.location.href = '/';
    };

    const handleNew = () => {
        window.location.href = '/create';
    };

    return (
        <Box className="login-container">
            <Typography variant="h4" align="center" gutterBottom>
                Login
            </Typography>
            {formError && <Typography variant="body2" color="error" align="center">{formError}</Typography>}
            <Box component="form" onSubmit={handleSubmit} className="login-form">
                <TextField required label="Username" name="Username" fullWidth />
                <TextField required label="Password" name="Password" type="password" fullWidth />
                <Button variant='contained' type='submit'>Sign In</Button>
            </Box>
            <div className="google-login">
                <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={() => setFormError('Google login failed. Please try again.')}
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
