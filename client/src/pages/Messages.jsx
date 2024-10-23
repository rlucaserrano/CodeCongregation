import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { green, purple, red } from '@mui/material/colors';
import '../components/Messages.css';

function Messages() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [view, setView] = useState('Group Messages');
    const [openDM, setOpenDM] = useState(false);
    const [openNew, setOpenNew] = useState(false);
    const [openRem, setOpenRem] = useState(false);

    const handleClickOpenDM = () => setOpenDM(true);
    const handleCloseDM = () => setOpenDM(false);
    const handleClickOpenNew = () => setOpenNew(true);
    const handleCloseNew = () => setOpenNew(false);
    const handleClickOpenRem = () => setOpenRem(true);
    const handleCloseRem = () => setOpenRem(false);

    return (
        <div className="messages-page">
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
                <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} className="hamburger-button">
                    <MenuIcon />
                </IconButton>
                {sidebarOpen && (
                    <ul className="menu-list">
                        <li onClick={() => setView('Group Messages')}>Group Messages</li>
                        <li onClick={() => setView('Direct Messages')}>Direct Messages</li>
                        <li onClick={() => setView('Group Members')}>Group Members</li>
                    </ul>
                )}
            </aside>
            <div className="content">
                <h1 className="messages-header">Messages</h1>
                {view === 'Group Messages' && (
                    <div className="group-messages-view">
                        <TextField label="Filter by user" fullWidth className="filter-input" />
                        <List className="message-list">
                            {['Group Chat Message 1', 'Group Chat Message 2', 'Group Chat Message 3'].map((message, index) => (
                                <ListItem key={index} className="message-item">
                                    <ListItemText>{message}</ListItemText>
                                </ListItem>
                            ))}
                        </List>
                        <Button variant="outlined" className="video-call-button">Start a Video Call</Button>
                    </div>
                )}
                {view === 'Direct Messages' && (
                    <div className="direct-messages-view">
                        <TextField label="Search Direct Messages" fullWidth className="filter-input" />
                        <List className="message-list">
                            {['Direct Message 1', 'Direct Message 2', 'Direct Message 3'].map((message, index) => (
                                <ListItem key={index} className="message-item">
                                    <ListItemText>{message}</ListItemText>
                                </ListItem>
                            ))}
                        </List>
                        <Button variant="outlined" className="video-call-button">Start a Video Call</Button>
                    </div>
                )}
                {view === 'Group Members' && (
                    <div className="group-members-view">
                        <h2>Group Members</h2>
                        <List className="group-members-list">
                            {['ExampleUser1', 'ExampleUser2', 'ExampleUser3', 'ExampleUser4'].map((user, index) => (
                                <ListItem key={index}>
                                    <ListItemText>{user}</ListItemText>
                                </ListItem>
                            ))}
                        </List>
                        <Button variant="contained" className="invite-button" onClick={handleClickOpenNew}>Invite</Button>
                        <Dialog open={openNew} onClose={handleCloseNew}>
                            <DialogTitle>Look up by username</DialogTitle>
                            <TextField label="Username" fullWidth />
                            <Box component="form" className="invite-form">
                                <Avatar sx={{ bgcolor: purple[900], width: 100, height: 100 }} variant="square">E</Avatar>
                                <div>
                                    <p>Example 5</p>
                                    <Button style={{ textTransform: 'none' }}>Send Invite</Button>
                                </div>
                            </Box>
                            <Button variant="contained" onClick={handleCloseNew} className="done-button">Done</Button>
                        </Dialog>
                    </div>
                )}
            </div>
            <aside className={`notifications ${notificationsOpen ? 'open' : 'collapsed'}`}>
                <IconButton onClick={() => setNotificationsOpen(!notificationsOpen)} className="notifications-button">
                    <NotificationsIcon />
                </IconButton>
                {notificationsOpen && (
                    <div className="notifications-content">
                        <h2>Notifications</h2>
                        <List className="notification-list">
                            {['Example Notification 1', 'Example Notification 2', 'Example Notification 3'].map((notification, index) => (
                                <ListItem key={index}>
                                    <ListItemText>{notification}</ListItemText>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                )}
            </aside>
        </div>
    );
}

export default Messages;
