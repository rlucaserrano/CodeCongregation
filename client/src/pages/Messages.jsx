import React, { useState, useEffect } from 'react';
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
    const [openLeave, setOpenLeave] = useState(false);
    const [openRem, setOpenRem] = useState(false);

    const handleClickOpenDM = () => setOpenDM(true);
    const handleCloseDM = () => setOpenDM(false);
    const handleClickOpenNew = () => setOpenNew(true);
    const handleCloseNew = () => setOpenNew(false);
    const handleClickOpenLeave = () => setOpenLeave(true);
    const handleCloseLeave = () => setOpenLeave(false);
    const handleClickOpenRem = () => setOpenRem(true);
    const handleCloseRem = () => setOpenRem(false);

    const [safe, setSafe] = useState(false)
    const [userID, setUser] = useState()
    const [groupID, setGroup] = useState()
    const [members, setMembers] = useState()

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
        setGroup(group)
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

    useEffect(() => {
        handleMembers()
    }, [])

    const test = (name) => () =>
    {
        console.log(name)
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

    //Uncertain about if these buttons should be included if not. Also want to change so its obvious if the user is a group manager (like in the "Groups" Page)
    /*async function handleInvite(e)
    {
        e.preventDefault()
        const form = e.target;
        const formData = new FormData();
        formData.append("0", groupID)
        formData.append("1", userID)
        formData.append("2", form.Name.value)
        const formJson = Object.fromEntries(formData);
        await fetch('http://localhost:8080/sendinvite', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: 'POST',
            body: JSON.stringify({
                data: formJson
            })
        })
    }

    const handleLeave = () => {
        leave();
    };

    async function leave()
    {
        const formData = new FormData();
        formData.append("0", groupID)
        formData.append("1", userID)
        const formJson = Object.fromEntries(formData);
        await fetch('http://localhost:8080/leave', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: 'POST',
            body: JSON.stringify({
                data: formJson
            })
        })
        localStorage.removeItem('groupID');
        window.location.href = '/groups'
    }

    async function handleRemove(e)
    {
        e.preventDefault()
        const form = e.target;
        const formData = new FormData();
        formData.append("0", groupID)
        formData.append("1", userID)
        formData.append("2", form.Name.value)
        const formJson = Object.fromEntries(formData);
        await fetch('http://localhost:8080/remuser', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: 'POST',
            body: JSON.stringify({
                data: formJson
            })
        })
        window.location.reload()
    }*/

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
                            {members.length == 0 ? <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'row'}}><b style={{color: 'red'}}>This group currently has no other members</b></div> : 
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
                            {/*<Button style={{backgroundColor: 'blue', border: '2px solid gold'}} onClick={handleClickOpenNew}>Invite</Button>
                            <Dialog open={openNew} onClose={handleCloseNew}>
                            <form method='post' onSubmit={handleInvite} style={{border: '2px solid black', minWidth: 500, width: 500, display: 'flex', flexDirection: 'column'}}>
                                <DialogTitle>Look up by username</DialogTitle>
                                <p>Note: This will only work if you are the group manager!</p>
                                <TextField required id="Name" label="Username"/>
                                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                                    <Button variant='contained' onClick={handleCloseNew} style={{textTransform: 'none', minWidth: 125, maxWidth: 125}} type='submit'>Send</Button>
                                    <Button variant='contained' onClick={handleCloseNew} style={{textTransform: 'none', minWidth: 125, maxWidth: 125, backgroundColor: '#ff3b30'}}>Cancel</Button>
                                </div>
                            </form>
                            </Dialog>
                            <Button style={{backgroundColor: 'crimson', border: '2px solid black'}} onClick={handleClickOpenLeave}>Leave</Button>
                            <Dialog open={openLeave} onClose={handleCloseLeave}>
                            <div style={{border: '2px solid black', minWidth: 500, width: 500, display: 'flex', flexDirection: 'column'}}>
                                <DialogTitle>Are you sure you want to leave?</DialogTitle>
                                <p>Note: You will not be allowed to return to the group again without another invite.</p>
                                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                                    <Button variant='contained' onClick={handleLeave} style={{textTransform: 'none', minWidth: 125, maxWidth: 125}}>Yes, I am sure.</Button>
                                    <Button variant='contained' onClick={handleCloseLeave} style={{textTransform: 'none', minWidth: 125, maxWidth: 125, backgroundColor: '#ff3b30'}}>No, cancel</Button>
                                </div>
                            </div>
                            </Dialog>
                            <Button style={{backgroundColor: 'darkred', border: '2px solid gold'}} onClick={handleClickOpenRem}>Remove</Button>
                            <Dialog open={openRem} onClose={handleCloseRem}>
                            <form method='post' onSubmit={handleRemove} style={{border: '2px solid black', minWidth: 500, width: 500, display: 'flex', flexDirection: 'column'}}>
                                <DialogTitle>Remove user from group/Revoke invite</DialogTitle>
                                <p>Note: This will only work if you are the group manager!</p>
                                <TextField required id="Name" label="Username"/>
                                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                                    <Button variant='contained' onClick={handleCloseRem} style={{textTransform: 'none', minWidth: 125, maxWidth: 125}} type='submit'>Remove</Button>
                                    <Button variant='contained' onClick={handleCloseRem} style={{textTransform: 'none', minWidth: 125, maxWidth: 125, backgroundColor: '#ff3b30'}}>Cancel</Button>
                                </div>
                            </form>
                            </Dialog>*/}
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
