import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { green, purple, red } from '@mui/material/colors';
import '../components/Messages.css';

function Messages() {
    const [safe, setSafe] = useState(false) //Safe to render

    const [userID, setUser] = useState() //User's ID
    
    const [groupName, setName] = useState() //Display group names
    
    const [members, setMembers] = useState() //Get the other group members
    
    const [sidebarOpen, setSidebarOpen] = useState(false); //Left sidebar

    const [notificationsOpen, setNotificationsOpen] = useState(false); //Right sidebar (notifications)

    const [view, setView] = useState('Group Messages'); //Messages

    const [openDM, setOpenDM] = useState(false); //Open pop-up to DM a user in the group

    const handleClickOpenDM = () => setOpenDM(true);

    const handleCloseDM = () => setOpenDM(false);

    async function handleMembers()
    {
        let token = localStorage.getItem('token')
        let group = localStorage.getItem('groupID')
        let data = await fetch('http://localhost:8080/info', {
            headers: {
                'Accept': 'text/html',
                'Content-Type': 'text/html'
            },
            method: 'POST',
            body: token
        })
        let info = await data.json();
        setUser(info.id)
        let name = await fetch('http://localhost:8080/groupname', {
            headers: {
                'Accept': 'text/html',
                'Content-Type': 'text/html'
            },
            method: 'POST',
            body: group
        })
        let setting = await name.text();
        setName(setting) //Appear only in messages or all pages? (LocalStorage)
        const formData = new FormData();
        formData.append("0", group)
        formData.append("1", info.id)
        const formJson = Object.fromEntries(formData);
        let mem = await fetch('http://localhost:8080/memberid', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method: 'POST',
            body: JSON.stringify({
                data: formJson
            })
        })
        let list = await mem.json()
        setMembers(list)
        setSafe(true)
    }

    const handleRequest = (id, col) => () =>
    {
        request(id, col)
    }

    async function request(user, colab) 
    {
        const formData = new FormData();
        formData.append("0", userID)
        formData.append("1", user)
        formData.append("2", colab)
        const formJson = Object.fromEntries(formData);
        await fetch('http://localhost:8080/friendreq', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: 'POST',
            body: JSON.stringify({
                data: formJson
            })
        })
        window.location.reload() //Reload the page
    }

    const test = (name) => () => //While we get the Discord API working
    {
        console.log(name)
    }

    useEffect(() => {
        handleMembers()
    }, [])

    if (safe == true) 
    {
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
                    <h1 className="messages-header">Messages for {groupName}</h1>
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
                            {Object.keys(members).length == 0 ? <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'row'}}><b style={{color: 'red'}}>This group currently has no other members</b></div> : 
                            <List style = {{overflow: 'scroll', display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
                                {Object.keys(members).map((member) =>
                                    <div style={members[member][3] == 1 ? {display: 'flex', flexDirection: 'row'} : {display: 'flex', flexDirection: 'row', backgroundColor: 'lightgoldenrodyellow'}} key={member}>
                                        <div style={{border: '1px solid black', borderRadius: '6px'}}>
                                        <p>{member}</p>
                                        {members[member][1] == 1 ? <p className='friend-button'>You are already friends! :D</p> /*Obviously change the message.*/ : (
                                        members[member][1] == 0 ? <p className='friend-button'>Request pending...</p> :
                                        <p onClick={handleRequest(members[member][0], members[member][2])} className='friend-button'>Send Friend Request?</p>)}
                                        <p onClick={test(members[member][0])} className='dm-button'>DM</p>
                                        </div>
                                    </div>
                                )}
                            </List>}
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
}

export default Messages;
