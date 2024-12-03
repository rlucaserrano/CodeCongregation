
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { auth, provider } from "../components/googleSignIn/config";
import { signInWithPopup } from "firebase/auth";
import '../components/Login.css';
import { useNavigate } from 'react-router-dom';

const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
const CLIENT_ID =import.meta.env.VITE_GOOGLE_CLIENT_ID;


const Login = () => {
    const [formError, setFormError] = useState('');
    const [showExtraOptions, setShowExtraOptions] = useState(false);
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            // Ensure gapi is loaded
            if (typeof gapi === 'undefined') {
                await new Promise(resolve => {
                    const script = document.createElement("script");
                    script.src = "https://apis.google.com/js/api.js";
                    script.onload = resolve;
                    document.body.appendChild(script);
                });
            }
    
            // Sign in with Google using Firebase
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
    
            if (user) {
                const idToken = await user.getIdToken(); // Get Google ID token
                localStorage.setItem("google_id_token", idToken);
    
                // Send the token to your backend for verification
                const response = await fetch('http://localhost:8080/api/auth/google', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: idToken }),
                });
    
                if (response.ok) {
                    const { token, user } = await response.json();
    
                    // Store JWT and user info in localStorage or Context
                    localStorage.setItem("token", token); // Your app's token
                    localStorage.setItem("userId", user.id); // User ID from your backend
    
                    // Redirect user to the appropriate page
                    navigate('/groups');
                } else {
                    const error = await response.json();
                    console.error("Backend authentication error:", error.message);
                    alert(error.message || "Failed to authenticate with Google.");
                }
            }
        } catch (error) {
            console.error("Google Sign-In error:", error);
        }
    };

    // check if  user already exists in your backend
    const checkUserExists = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8080/users`, {
                method: 'HEAD',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ valUserID: userId }), //  `valUserID` HEAD method
            });
    
            if (response.ok) {
                const data = await response.json();
                return data.Result === "Valid UserID"; // backend returns Valid UserID on success
            } else if (response.status === 404) {
                console.error("User not found.");
                return false;
            } else {
                console.error("Error checking user existence:", response.status);
                return false;
            }
        } catch (error) {
            console.error("Error checking user existence:", error);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');  
    
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
                const token = await response.text(); // JWT token returned from the backend
                if (token) {
                    localStorage.setItem('token', token);  
    
                    
                    const payload = JSON.parse(atob(token.split('.')[1])); 
                    const userId = payload.id; //  token includes `id` for userId
    
                    localStorage.setItem('userId', userId); // save userId to localStorage
                    console.log(`User ID set to localStorage: ${userId}`);
    
                    window.location.href = '/groups';    
                } else {
                    setFormError("Token is empty. Please try again.");
                }
            } else {
                const errorData = await response.json();
                setFormError(errorData.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            setFormError('An error occurred during login. Please try again.');
            console.error('Error during login:', error);
        }
    };
    

    const handleGuest = () => {
        window.location.href = '/';
    };

    const handleNew = () => {
        window.location.href = '/create';
    };

    useEffect(() => {
        const handleInfGet = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token is empty");
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ somePayloadData: "example" })
                });

                if (!response.ok) {
                    console.error(`Error fetching user info. Status: ${response.status}`);
                    return;
                }

                const data = await response.json();
                console.log("User Info:", data);
            } catch (error) {
                console.error("Error during fetch:", error);
            }
        };

        handleInfGet();
    }, []);

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
                <button onClick={handleGoogleSignIn}>Sign-in with Google</button>
                {formError && <p>{formError}</p>}
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