import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import '../components/Groups.css';

function Groups() {
    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData();
        const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        formData.append("0", id);
        formData.append("1", form.Username.value);
        formData.append("2", form.Password.value);
        formData.append("3", form.Email.value);
        formData.append("4", 0);
        const formJson = Object.fromEntries(formData);
        await fetch('http://localhost:8080/add', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ data: formJson }),
        })
        .then((res) => console.log(res))
        .catch((res) => console.log("Error: " + res));
        window.location.href = '/';
    }

    function handleCancel(e) {
        e.preventDefault();
        window.location.href = '/login';
    }

    return (
        <div className="groups-container">
            <form className="groups-form" onSubmit={handleSubmit}>
                <h2>Create a new group</h2>
                <div className="input-container">
                    <TextField required id="Username" label="Username" fullWidth />
                    <TextField required id="Password" label="Password" type="password" fullWidth />
                    <TextField required id="Email" label="Email" type="email" fullWidth />
                    <Button variant='contained' type='submit' className="submit-button">Sign Up</Button>
                    <Button variant='contained' color='warning' onClick={handleCancel} className="cancel-button">
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default Groups;
