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
import '../components/Messages.css';

/*Purpose: This file is used to generate the frontend components associated with communications between users in a group. Discord integration
allows users to communicate group messages or direct messages via text. Quick access to Zoom allows for users to reach their accounts and
create and easily share created video calls with other members of the group. A dedicated group member tab also allows user to view the other
group members.*/

/*Sources used to create Groups.jsx:
1. https://mui.com/material-ui/
2. https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container
3. https://www.w3schools.com/css/css_align.asp
4. https://www.freecodecamp.org/news/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0/
5. https://www.iana.org/assignments/media-types/media-types.xhtml#image
6. https://medium.com/@anatoliiyatsenko/understanding-fetch-api-response-methods-and-the-content-type-header-6dcbe7b24ded
7. https://dmitripavlutin.com/javascript-fetch-async-await/
8. https://www.w3schools.com/sql/sql_ref_keywords.asp
9. https://www.w3schools.com/jsref/prop_win_localstorage.asp
10. https://www.geeksforgeeks.org/javascript-ternary-operator/
*/

function Messages() {
    const [safe, setSafe] = useState(false) //Safe to render

    const [userID, setUser] = useState() //User's ID
    
    const [groupName, setName] = useState() //Display group names
    
    const [members, setMembers] = useState() //Get the other group members
    
    const [sidebarOpen, setSidebarOpen] = useState(false); //Left sidebar

    const [notificationsOpen, setNotificationsOpen] = useState(false); //Right sidebar (notifications)

    const [view, setView] = useState('Group Messages'); //Messages

    const [meeting, setMeeting] = useState() //Link for the active meeting

    const [meetOwn, setMeetOwn] = useState() //ID of the user who made (and can delete) meeting

    const [openDM, setOpenDM] = useState(false); //Open pop-up to DM a user in the group

    const handleClickOpenDM = () => setOpenDM(true);

    const handleCloseDM = () => setOpenDM(false);

    async function handleMembers() //Retrieve all the necessary user and group data
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
        setName(localStorage.getItem('groupName'))
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
        let meet = await fetch('http://localhost:8080/currentmeeting', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method: 'POST',
            body: group
        })
        let meetingTest = await meet.json()
        if (meetingTest.length != 0)
        {
            setMeetOwn(meetingTest[0][0])
            setMeeting(meetingTest[0][1])
        }
        setSafe(true)
    }

    async function sendLink(e) //Send meeting link to all other group members
    {
        e.preventDefault()
        const form = e.target;
        const formData = new FormData();
        formData.append("0", userID)
        formData.append("1", localStorage.getItem('groupID'))
        formData.append("2", form.Link.value)
        const formJson = Object.fromEntries(formData);
        await fetch('http://localhost:8080/startmeeting', {
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
    }

    async function endMeet() //Remove group meeting link
    {
        const formData = new FormData();
        formData.append("0", userID)
        formData.append("1", localStorage.getItem('groupID'))
        const formJson = Object.fromEntries(formData);
        await fetch('http://localhost:8080/deletemeeting', {
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
    }

    const handleRequest = (id, col) => () => //Process friend request
    {
        request(id, col)
    }

    async function request(user, colab) //Send friend request to the backend
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

    useEffect(() => { //Retrieve all necessary data before rendering the page
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
                            <Button variant="outlined" className="video-call-button" onClick={() => window.open("https://zoom.us/myhome", "_blank")/* startZoomMeeting*/}>Access Zoom Account</Button>
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                            {meeting == null ?
                            <form method='post' onSubmit={sendLink} style={{minWidth: 500, width: 500, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <TextField required id='Link' label="Enter your Zoom Link here to share with the group:" style={{minWidth: 500, width: 500}}></TextField>
                                <Button variant='contained' style={{textTransform: 'none', minWidth: 125, maxWidth: 125}} type='submit'>Send Link</Button>
                            </form>
                            :<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <a href={meeting} target = "blank">Join the current meeting!</a>
                                {meetOwn != userID ? <></>: //Meeting owner can delete
                                    <Button variant='contained' style={{textTransform: 'none', minWidth: 125, maxWidth: 125, backgroundColor: 'red'}} onClick={endMeet}>End Meeting</Button>
                                }
                            </div>
                            }
                            </div>
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
                            <Button variant="outlined" className="video-call-button" onClick={() => window.open("https://zoom.us/myhome", "_blank")/* startZoomMeeting*/}>Access Zoom Account</Button>
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
