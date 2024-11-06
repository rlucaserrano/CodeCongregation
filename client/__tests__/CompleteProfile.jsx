import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Make sure you're using react-router for navigation
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function CompleteProfile() {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is a Google user based on the flag in localStorage.
        const isGoogleUser = localStorage.getItem('isGoogleUser');

        // If the user is not a Google user, redirect them to the account page.
        if (!isGoogleUser) {
            navigate('/account');
        }
    }, [navigate]);

    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = {
            userId: localStorage.getItem('user_id'),
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            bio: form.bio.value,
        };

        try {
            const response = await fetch('http://localhost:8080/users', {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Remove the isGoogleUser flag once profile completion is done.
                localStorage.removeItem('isGoogleUser');
                window.location.href = '/account';
            } else {
                const errorData = await response.json();
                console.error('Error updating profile:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <Box sx={{ maxWidth: 400, margin: 'auto', padding: 4, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>Complete Your Profile</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField required id="firstName" name="firstName" label="First Name" fullWidth />
                <TextField required id="lastName" name="lastName" label="Last Name" fullWidth />
                <TextField id="bio" name="bio" label="Bio" multiline rows={3} fullWidth />
                <Button variant="contained" type="submit">Save</Button>
            </Box>
        </Box>
    );
}

export default CompleteProfile;
