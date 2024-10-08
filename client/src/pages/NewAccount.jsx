import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Create = () => {

    function handleSubmit(e)
    {
        e.preventDefault()
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        console.log('User: ' + formJson.Username)
        console.log('Pass: ' + formJson.Password)
        console.log('Mail: ' + formJson.Email)
        window.location.href = '/'
    }

    function handleCancel(e)
    {
        e.preventDefault()
        window.location.href = '/login'
    }

    return (
        <form method='post' onSubmit={handleSubmit} style={{border: '2px solid black'}}>
            <h2>Create a new account</h2>
            <log>
                <TextField required id="Username" label="Username" defaultValue = ""/>
                <TextField required id="Password" label="Password" type="password" defaultValue = ""/>
                <TextField required id="Email" label="Email" type="email" defaultValue = ""/>
            </log>
            <div>
            <Button variant='contained' type='submit'>Sign Up</Button>
            </div>
            <div>
                <Button variant='contained' color='warning' onClick={handleCancel}>Cancel</Button>
            </div>
        </form>
    );
};

export default Create;