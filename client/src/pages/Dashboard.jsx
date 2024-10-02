import React, { useState } from 'react';

const Dashboard = () => {
    const userId = localStorage.getItem('user_id');  // Assuming user_id is stored in localStorage

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    const [message, setMessage] = useState('');  // state for success/error message

    // Handle form submission to update user details
    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:8080/api/update-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                username,      // Send the updated username
                first_name: firstName,  // Send first name
                last_name: lastName,    // Send last name
                password,      // Send password (we assume it's plain text, for now)
                bio,           // Send bio
            }),
        });

        const data = await response.json();
        if (data.status === 'success') {
            setMessage('User information updated successfully.');
        } else {
            setMessage(`Error: ${data.message}`);
        }
    };

    return (
        <div>
            <h2>Update Your Profile</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter new username"
                    />
                </label>
                <br />
                <label>
                    First Name:
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter first name"
                    />
                </label>
                <br />
                <label>
                    Last Name:
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter last name"
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Set a new password"
                    />
                </label>
                <br />
                <label>
                    Bio:
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself"
                    />
                </label>
                <br />
                <button type="submit">Update Profile</button>
            </form>

            {/*  success or error message */}
            {message && <p>{message}</p>}
        </div>
    );
};

export default Dashboard;
