import React, { useState, useEffect } from 'react';
import { Avatar, TextField, Button, Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import '../components/Account.css';

function Account() {
    const [safe, setSafe] = useState(false);
<<<<<<< HEAD
    const [data, setData] = useState({});
=======
    const [data, setData] = useState({
        pass: '', // Initialize password as empty
    });
>>>>>>> 43cf935a6e697def62271eb07b341be74e4b9fb9
    const [view, setView] = useState('Settings');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    async function handleInfGet() {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:8080/info', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: token,
            });
            if (response.ok) {
                const info = await response.json();
<<<<<<< HEAD
                setData(info); // Assuming info includes user details, including UserID
=======
                // Exclude 'pass' from the data to prevent displaying the current password
                setData({
                    id: info.id,
                    user: info.user,
                    mail: info.mail,
                    first: info.first,
                    last: info.last,
                    bio: info.bio,
                    pass: '', // Ensure pass is empty
                });
>>>>>>> 43cf935a6e697def62271eb07b341be74e4b9fb9
                setSafe(true);
            } else {
                console.error('Error fetching user info. Status:', response.status);
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    }

    useEffect(() => {
        handleInfGet();
    }, []);

    function handleInputChange(e) {
        const { name, value } = e.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    }

    async function handleSaveChanges(e) {
        e.preventDefault();

<<<<<<< HEAD
        const updatedData = {
            valUserID: data.id,  
            valUserName: data.user,
            valHashedPassword: data.pass,
=======
        // Prepare the data to be updated
        const updatedData = {
            valUserID: data.id,
            valUserName: data.user,
>>>>>>> 43cf935a6e697def62271eb07b341be74e4b9fb9
            valEmail: data.mail,
            valFirstName: data.first,
            valLastName: data.last,
            valBio: data.bio,
        };

<<<<<<< HEAD
        try {
            const response = await fetch('http://localhost:8080/update_user', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Update response:", result);
                alert("User information updated successfully!");
            } else {
                const errorData = await response.json();
                console.error('Failed to update user information. Status:', response.status, 'Error:', errorData);
                alert(errorData.ERROR || 'Failed to update user information');
            }
        } catch (error) {
            console.error('Error during update:', error);
            alert('An error occurred while updating. Please try again later.');
        }
    }

    async function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('groupID'); //Also clear the currently selected group.
        window.location.href = '/';
    }

    if (!safe) return null;

=======
        // Include the password only if a new one has been entered
        if (data.pass && data.pass.trim() !== '') {
            updatedData.valHashedPassword = data.pass;
        }

        try {
            const response = await fetch('http://localhost:8080/update_user', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Update response:", result);
                alert("User information updated successfully!");
            } else {
                const errorData = await response.json();
                console.error('Failed to update user information. Status:', response.status, 'Error:', errorData);
                alert(errorData.ERROR || 'Failed to update user information');
            }
        } catch (error) {
            console.error('Error during update:', error);
            alert('An error occurred while updating. Please try again later.');
        }
    }

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('groupID'); // Also clear the currently selected group.
        window.location.href = '/';
    }

    if (!safe) return null;

>>>>>>> 43cf935a6e697def62271eb07b341be74e4b9fb9
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
<<<<<<< HEAD
                            <TextField label="Username" name="user" value={data.user || ''} onChange={handleInputChange} required fullWidth />
                            <TextField label="Password" name="pass" value={data.pass || ''} type="password" onChange={handleInputChange} fullWidth />
                            <TextField label="Email" name="mail" value={data.mail || ''} onChange={handleInputChange} required fullWidth />
                            <TextField label="First Name" name="first" value={data.first || ''} onChange={handleInputChange} fullWidth />
                            <TextField label="Last Name" name="last" value={data.last || ''} onChange={handleInputChange} fullWidth />
                            <TextField label="Bio" name="bio" value={data.bio || ''} onChange={handleInputChange} multiline rows={3} fullWidth />
=======
                            <TextField
                                label="Username"
                                name="user"
                                value={data.user || ''}
                                onChange={handleInputChange}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Password"
                                name="pass"
                                value={data.pass || ''} // Password field is empty
                                type="password"
                                onChange={handleInputChange}
                                fullWidth
                            />
                            <TextField
                                label="Email"
                                name="mail"
                                value={data.mail || ''}
                                onChange={handleInputChange}
                                required
                                fullWidth
                            />
                            <TextField
                                label="First Name"
                                name="first"
                                value={data.first || ''}
                                onChange={handleInputChange}
                                fullWidth
                            />
                            <TextField
                                label="Last Name"
                                name="last"
                                value={data.last || ''}
                                onChange={handleInputChange}
                                fullWidth
                            />
                            <TextField
                                label="Bio"
                                name="bio"
                                value={data.bio || ''}
                                onChange={handleInputChange}
                                multiline
                                rows={3}
                                fullWidth
                            />
>>>>>>> 43cf935a6e697def62271eb07b341be74e4b9fb9
                            <Button variant="contained" type="submit" className="save-button">Save Changes</Button>
                            <Button variant="contained" color="error" onClick={handleLogout} className="logout-button">
                                Log Out
                            </Button>
                        </form>
                    </div>
                )}
                {view === 'Friends' && (
                    <div className="friends-view">
                        {/* Friends UI code */}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Account;
