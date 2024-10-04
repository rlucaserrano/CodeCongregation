// manages user profile and account info

import React, { useState } from 'react';

const Account = () => {
    const userId = localStorage.getItem('user_id');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8080/api/update-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                username,
                first_name: firstName,
                last_name: lastName,
                password,
                bio,
            }),
        });
        const data = await response.json();
        if (data.status === 'success') {
            setMessage('User information updated successfully.');
        } else {
            setMessage(`Error: ${data.message}`);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        document.cookie = 'session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/login';
    };

    return (
        <div>
            <h2>Update Your Profile</h2>
            <form onSubmit={handleSubmit}>
                {/* Profile update fields */}
            </form>
            {message && <p>{message}</p>}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Account;
