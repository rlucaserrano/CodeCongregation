import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';  
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Create() {
    const [formError, setFormError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;

        const username = form.Username.value;
        const password = form.Password.value;
        const confirmPassword = form.ConfirmPassword.value;
        const email = form.Email.value;
        const firstName = form.FirstName.value || null;
        const lastName = form.LastName.value || null;

        if (password !== confirmPassword) {
            setFormError("Passwords do not match.");
            return;
        }

        setFormError('');

        const formData = {
            username: username,
            email: email,
            hashedPassword: password, 
            firstName: firstName,
            lastName: lastName,
            admin: 0  
        };

        try {
            const response = await fetch('http://localhost:8080/add', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({ data: formData }),
            });

            if (response.ok) {
                const result = await response.json();
                
                window.location.href = '/login'; 
            } else {
                const errorData = await response.json();
                console.error('Error creating account:', errorData);
                setFormError(errorData.ERROR || 'Error creating account');
            }
        } catch (error) {
            console.error('Error: ' + error);
            setFormError('An unexpected error occurred. Please try again later.');
        }
    }

    function handleCancel(e) {
        e.preventDefault();
        window.location.href = '/login';
    }

  
    return (
        <Box sx={{ maxWidth: 400, margin: 'auto', padding: 4, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>Create a New Account</Typography>
            {formError && <Typography variant="body2" color="error" align="center">{formError}</Typography>}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField required id="Username" label="Username" fullWidth />
                <TextField required id="Password" label="Password" type="password" fullWidth />
                <TextField required id="ConfirmPassword" label="Confirm Password" type="password" fullWidth />
                <TextField required id="Email" label="Email" type="email" fullWidth />
                <TextField id="FirstName" label="First Name (Optional)" fullWidth />
                <TextField id="LastName" label="Last Name (Optional)" fullWidth />
                <Button variant="contained" type="submit">Sign Up</Button>
                <Button variant="text" color="secondary" onClick={handleCancel}>Cancel</Button>
            </Box>
        </Box>
    );
}

export default Create;
