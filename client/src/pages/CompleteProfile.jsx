import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function CompleteProfile() {
    const [formError, setFormError] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [firebaseUser, setFirebaseUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const uid = localStorage.getItem("uid");
        const email = localStorage.getItem("email");
        const token = localStorage.getItem("token");

        if (uid && email && token) {
            setFirebaseUser({ uid, email });
        } else {
            setFormError("Required authentication data not found. Please log in again.");
            navigate('/login');
        }
    }, [navigate]);

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            setFormError("Passwords do not match.");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setFormError("User is not authenticated.");
            return;
        }

        if (!firebaseUser) {
            setFormError("User data is missing. Please log in again.");
            return;
        }

        const formData = {
            username,
            email: firebaseUser.email,
            hashedPassword: password,
            firstName: firstName || null,
            lastName: lastName || null,
            googleUID: firebaseUser.uid,  
        };
        

        try {
            const response = await fetch('http://localhost:8080/complete_profile', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                method: 'POST',
                body: JSON.stringify({ data: formData }),
            });

            if (response.ok) {
                navigate('/account');
            } else {
                const errorData = await response.json();
                setFormError(errorData.message || 'Error completing profile');
            }
        } catch (error) {
            console.error('Error:', error);
            setFormError('An unexpected error occurred. Please try again later.');
        }
        console.log("Firebase User:", firebaseUser);
console.log("Email:", firebaseUser?.email);
console.log("UID:", firebaseUser?.uid);
console.log("Token:", token);
console.log("Username:", username);
console.log("Password:", password);
    }

    return (
        <Box sx={{ maxWidth: 400, margin: 'auto', padding: 4, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>Complete Your Profile</Typography>
            {formError && <Typography variant="body2" color="error" align="center">{formError}</Typography>}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField required label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth />
                <TextField required label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
                <TextField required label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth />
                <TextField label="First Name (Optional)" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth />
                <TextField label="Last Name (Optional)" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth />
                <Button variant="contained" type="submit">Complete Profile</Button>
            </Box>
        </Box>
    );
}

export default CompleteProfile;
