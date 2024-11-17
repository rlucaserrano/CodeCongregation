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

    // const handleGoogleSignIn = async () => {
    //     try {
            
    //         if (typeof gapi === 'undefined') {
    //             await new Promise(resolve => {
    //                 const script = document.createElement("script");
    //                 script.src = "https://apis.google.com/js/api.js";
    //                 script.onload = resolve;
    //                 document.body.appendChild(script);
    //             });
    //         }

    //         gapi.load('client', async () => {
    //             await gapi.client.init({
    //                 apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    //                 discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
    //             });
    //         });

    //         const result = await signInWithPopup(auth, provider);
    //         const user = result.user;

    //         if (user) {
    //             const idToken = await user.getIdToken(); 
    //             localStorage.setItem("token", idToken);  
    //             localStorage.setItem("uid", user.uid);
    //             localStorage.setItem("email", user.email);
    //             localStorage.setItem("displayName", user.displayName);

    //             // Initialize the token client for Google Calendar authorization
    //             const tokenClient = google.accounts.oauth2.initTokenClient({
    //                 client_id: CLIENT_ID,
    //                 scope: SCOPES,
    //                 callback: (response) => {
    //                     if (response.error) {
    //                         throw response;
    //                     }


    //                     const expiresIn = response.expires_in * 1000; 
    //                     const expiryTime = new Date().getTime() + expiresIn;
    //                     localStorage.setItem("google_access_token", response.access_token);
    //                     localStorage.setItem("google_token_expiry", expiryTime.toString());

    //                     window.location.href = '/complete-profile';
    //                 },
    //             });

    //             const tokenExpiry = localStorage.getItem("google_token_expiry");
    //             if (!tokenExpiry || new Date().getTime() > Number(tokenExpiry)) {
    //                 tokenClient.requestAccessToken();
    //             } else {
    //                 window.location.href = '/complete-profile';
    //             }
    //         }
    //     } catch (error) {
    //         console.error("Google Sign-In error:", error);
    //     }
    // }  
    const handleGoogleSignIn = async () => {
        try {
            // Ensure Google API client is loaded
            if (typeof gapi === 'undefined') {
                await new Promise(resolve => {
                    const script = document.createElement("script");
                    script.src = "https://apis.google.com/js/api.js";
                    script.onload = resolve;
                    document.body.appendChild(script);
                });
            }

            // Load Google Calendar API
            gapi.load('client', async () => {
                await gapi.client.init({
                    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
                    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
                });
            });

            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (user) {
                const idToken = await user.getIdToken(); 
                localStorage.setItem("token", idToken);  
                localStorage.setItem("uid", user.uid);
                localStorage.setItem("email", user.email);
                localStorage.setItem("displayName", user.displayName);

                // Initialize Google Calendar token client
                const tokenClient = google.accounts.oauth2.initTokenClient({
                    client_id: CLIENT_ID,
                    scope: SCOPES,
                    callback: (response) => {
                        if (response.error) {
                            throw response;
                        }

                        // Save access token and expiry in local storage
                        const expiresIn = response.expires_in * 1000; 
                        const expiryTime = new Date().getTime() + expiresIn;
                        localStorage.setItem("google_access_token", response.access_token);
                        localStorage.setItem("google_token_expiry", expiryTime.toString());
                    },
                });

                const tokenExpiry = localStorage.getItem("google_token_expiry");
                if (!tokenExpiry || new Date().getTime() > Number(tokenExpiry)) {
                    tokenClient.requestAccessToken();
                }

                // Check if user already has an account associated
                const userExists = await checkUserExists(user.uid);
                if (userExists) {
                    navigate('/groups');
                } else {
                    navigate('/complete-profile');
                }
            }
        } catch (error) {
            console.error("Google Sign-In error:", error);
        }
    };

    // Check if a user already exists in your backend
    const checkUserExists = async (uid) => {
        try {
            const response = await fetch('http://localhost:8080/check_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ uid }),
            });
            const data = await response.json();
            return data.exists;  // Assuming your backend returns { exists: true } or { exists: false }
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
                const token = await response.text();
                if (token) {
                    localStorage.setItem('token', token);  
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
