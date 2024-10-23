import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function Groups(){

    async function handleSubmit(e)
    {
        e.preventDefault()
        const form = e.target;
        const formData = new FormData();
        const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        formData.append("0", id)
        formData.append("1", form.Username.value)
        formData.append("2", form.Password.value)
        formData.append("3", form.Email.value)
        formData.append("4", 0)
        const formJson = Object.fromEntries(formData);
        await fetch('http://localhost:8080/add', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method: 'POST',
            body: JSON.stringify({
                data: formJson
            })
        })
        .then(function(res){console.log(res)})
        .catch(function(res){console.log("Error: " + res)})
        window.location.href = '/'
    }

    function handleCancel(e)
    {
        e.preventDefault()
        window.location.href = '/login'
    }

    return (
        <form method='post' onSubmit={handleSubmit} style={{border: '2px solid black', minWidth: 250, width: 250}}>
            <h2>Create a new group</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center'}}>
                <TextField style={{minWidth: 225, width: 225}} required id="Username" label="Username" defaultValue = ""/>
                <TextField style={{minWidth: 225, width: 225}} required id="Password" label="Password" type="password" defaultValue = ""/>
                <TextField style={{minWidth: 225, width: 225}} required id="Email" label="Email" type="email" defaultValue = ""/>            
            <div>
            <Button variant='contained' type='submit'>Sign Up</Button>
            </div>
            <div>
                <Button variant='contained' color='warning' onClick={handleCancel}>Cancel</Button>
            </div></div>
        </form>
    );
};

export default Groups;