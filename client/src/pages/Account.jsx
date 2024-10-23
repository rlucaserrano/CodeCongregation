import React, { useState, useEffect } from 'react';
import { Avatar, TextField, Button, Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import '../components/Account.css';

function Account() {
    const [safe, setSafe] = useState(false);
    const [data, setData] = useState({});
    const [view, setView] = useState('Settings');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    async function handleInfGet() {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:8080/info', {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({ token }),
            });
            if (response.ok) {
                const info = await response.json();
                setData(info);
                setSafe(true);
            } else {
                console.error('Error fetching user info');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    }

    useEffect(() => {
        handleInfGet();
    }, []);

    async function handleSaveChanges(e) {
        e.preventDefault();
        const form = e.target;
        const updatedData = {
            valUserID: data.id,
            valUserName: form.username.value,
            valHashedPassword: form.password.value,
            valEmail: form.email.value,
            valFirstName: form.firstName.value,
            valLastName: form.lastName.value,
            valBio: form.bio.value,
        };

        try {
            const response = await fetch('http://localhost:8080/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });
            if (response.ok) {
                console.log('User information updated successfully');
            } else {
                console.error('Failed to update user information');
            }
        } catch (error) {
            console.error('Error during update:', error);
        }
    }

    async function handleLogout() {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    if (!safe) return null;

    return (
        <div className="account-page">
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
                <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} className="hamburger-button">
                    <MenuIcon />
                </IconButton>
                {sidebarOpen && (
                    <ul className="menu-list">
                        <li onClick={() => setView('Settings')}>Settings</li>
                        <li onClick={() => setView('Friends')}>Friends</li>
                    </ul>
                )}
            </aside>
            <div className="content">
                <h1 className="account-header">Account</h1>
                {view === 'Settings' && (
                    <div className="settings-view">
                        <Box className="avatar-section">
                            <Avatar className="avatar" sx={{ width: 100, height: 100 }}>A</Avatar>
                            <Button variant="outlined" className="change-picture">Change Picture</Button>
                        </Box>
                        <form className="account-form" onSubmit={handleSaveChanges}>
                            <TextField label="Username" name="username" defaultValue={data.user} required fullWidth />
                            <TextField label="Password" name="password" type="password" fullWidth />
                            <TextField label="Email" name="email" defaultValue={data.mail} required fullWidth />
                            <TextField label="First Name" name="firstName" defaultValue={data.first} fullWidth />
                            <TextField label="Last Name" name="lastName" defaultValue={data.last} fullWidth />
                            <TextField label="Bio" name="bio" defaultValue={data.bio} multiline rows={3} fullWidth />
                            <Button variant="contained" type="submit" className="save-button">Save Changes</Button>
                            <Button variant="contained" color="error" onClick={handleLogout} className="logout-button">
                                Log Out
                            </Button>
                        </form>
                    </div>
                )}
                {view === 'Friends' && (
                    <div className="friends-view">
                        {/* Your Friends UI code here */}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Account;
