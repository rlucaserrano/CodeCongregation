import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';  
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
function Create() {
    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData();
        const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        formData.append('0', id);
        formData.append('1', form.Username.value);
        formData.append('2', form.Password.value);
        formData.append('3', form.Email.value);
        formData.append('4', 0);
        const formJson = Object.fromEntries(formData);

        try {
            const response = await fetch('http://localhost:8080/add', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({ data: formJson }),
            });

            if (response.ok) {
                localStorage.setItem('user_id', id);
                window.location.href = '/complete-profile';
            } else {
                console.error('Error creating account');
            }
        } catch (error) {
            console.error('Error: ' + error);
        }
    }

    function handleCancel(e) {
        e.preventDefault();
        window.location.href = '/login';
    }

    return (
        <Box sx={{ maxWidth: 400, margin: 'auto', padding: 4, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>Create a New Account</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField required id="Username" label="Username" fullWidth />
                <TextField required id="Password" label="Password" type="password" fullWidth />
                <TextField required id="Email" label="Email" type="email" fullWidth />
                <Button variant="contained" type="submit">Sign Up</Button>
                <Button variant="text" color="secondary" onClick={handleCancel}>Cancel</Button>
            </Box>
        </Box>
    );
};

export default Create;