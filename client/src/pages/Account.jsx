import React, { useState, useEffect } from 'react';
import { Avatar, TextField, Button, Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import '../components/Account.css';
import { useUser2 } from '../context/UserContext_2';


function Account() {
    const [safe, setSafe] = useState(false);
    const [data, setData] = useState({
        pass: '', // Initialize password as empty
    });
    const [view, setView] = useState('Settings');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { logIn } = useUser2();

    async function handleInfGet() {
        const token = localStorage.getItem('token');
    
        // Check if the login is with Google
        const isGoogleLogin = localStorage.getItem('uid') !== null;
        const endpoint = isGoogleLogin ? 'http://localhost:8080/google_update' : 'http://localhost:8080/info';
    
        console.log(`Starting handleInfGet...`);
        console.log(`Token: ${token}`);
        console.log(`Is Google Login: ${isGoogleLogin}`);
        console.log(`Endpoint: ${endpoint}`);
    
        let response, info;
    
        try {
            if (isGoogleLogin) {
                // Fetch for Google login
                response = await fetch(endpoint, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    method: 'POST',
                });
    
                if (!response.ok) {
                    console.error(`Failed to fetch user info from ${endpoint}. Status: ${response.status}`);
                    return; // Exit if fetch fails
                }
    
                // Parse JSON response directly
                const jsonResponse = await response.json();
                console.log("Parsed JSON response for Google login:", jsonResponse);
    
                if (jsonResponse && jsonResponse.id) {
                    info = {
                        id: jsonResponse.id,
                        user: jsonResponse.user,
                        mail: jsonResponse.mail,
                        first: jsonResponse.first,
                        last: jsonResponse.last,
                        bio: jsonResponse.bio || '',
                    }; // Extracted info structure
                } else {
                    throw new Error("User ID not found in response.");
                }
            } else {
                // Fetch for non-Google login
                response = await fetch(endpoint, {
                    headers: {
                        'Accept': 'text/html',
                        'Content-Type': 'text/html',
                    },
                    method: 'POST',
                    body: token,
                });
    
                if (!response.ok) {
                    console.error(`Failed to fetch user info from ${endpoint}. Status: ${response.status}`);
                    return; // Exit if fetch fails
                }
    
                info = await response.json();
                console.log("Parsed JSON response for non-Google login:", info);
            }
    
            // Update user data
            setData({
                id: info.id,
                user: info.user,
                mail: info.mail,
                first: info.first,
                last: info.last,
                bio: info.bio || '',
                pass: '', // Ensure password field remains empty
            });
            logIn(info); // Update context
            setSafe(true); // Allow rendering
        } catch (error) {
            console.error("Error during fetch or parsing in handleInfGet:", error);
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

        // Prepare the data to be updated
        const updatedData = {
            valUserID: data.id,
            valUserName: data.user,
            valEmail: data.mail,
            valFirstName: data.first,
            valLastName: data.last,
            valBio: data.bio,
        };

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
        localStorage.removeItem('groupName');
        localStorage.removeItem('userFirst'); //First Letter for the avatar
        localStorage.removeItem('groupID'); //Also clear the currently selected group.
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