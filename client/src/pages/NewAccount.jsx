import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Create = () => {

    async function handleSubmit(e)
    {
        e.preventDefault()
        const form = e.target;
        console.log(form.Username.value + ' ' + form.Password.value + ' ' + form.Email.value)
        const formData = new FormData();
        const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        console.log(id)
        formData.append("0", id)
        formData.append("1", form.Username.value)
        formData.append("2", form.Password.value)
        formData.append("3", form.Email.value)
        formData.append("4", 0) //Original Test
        /*formData.append("UserId", id)
        formData.append("UserName", form.Username.value)
        formData.append("Email", form.Email.value)
        formData.append("HashedPassword", form.Password.value)
        formData.append("Admin", 0) //How will we create Admin accounts?
        formData.append("FirstName", null)
        formData.append("LastName", null)
        formData.append("Bio", null)*/
        const formJson = Object.fromEntries(formData);
        console.log(formJson)
        await fetch('http://localhost:8080/add', { //Switch to /user when its working
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
        window.location.href = '/' //Awaiting response from server allows connection to wait for connection to open/close properly.
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