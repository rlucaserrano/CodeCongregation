import React, {useState, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import '../components/Groups.css';
import GroupsIcon from '@mui/icons-material/Groups';

/*Purpose: This file is used to generate the frontend components associated with accessing users groups, both those currently they've enrolled
in and those whom they've recieved invites for, but not yet accepted in appropriate lists. Enrolled study groups have the option to select
as the currently active one or to leave it. If the user is the group manager, they will have the additional options of inviting other users
to the group or removing them. All invites to join a group give users the option to accept or reject the request to join the group. All users
also have the ability to create their own new groups, of which they will be made the group manager of by default.*/

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

function Groups() {
    const [safe, setSafe] = useState(false) //Safe to render

    const [userID, setUser] = useState() //User's ID

    const [groupID, setGroupID] = useState() //Group's ID (if already selected)

    const [groups, setGroups] = useState() //Groups they are already members of.

    const [invites, setInvites] = useState() //Recieved invites to other groups
        
    const [openGroup, setOpenGroup] = useState(); //Currently opened/clicked group

    const [members, setMembers] = useState([]) //Display members of the clicked group

    const [openNew, setOpenNew] = useState(false); //Open pop-up to invite new user to group

    const [openLeave, setOpenLeave] = useState(false); //Open pop-up to leave the group

    const [openRem, setOpenRem] = useState(false); //Open pop-up to remove someone from group
    
    const [toRemove, setToRemove] = useState() //Which user to remove

    const [openMessage, setOpenMessage] = useState(false); //Open pop-up to display invite message

    const [message, setMessage] = useState() //Invite status messages

    const [openC, setOpenC] = useState(false); //Open pop-up to create new group
    
    const [error, setError] = useState(false) //Open pop-up display error when creating new groups

    async function handleID() {
        let token = localStorage.getItem('token');
    
        // Check if the login is with Google
        const isGoogleLogin = localStorage.getItem('uid') !== null; // check for Google UID in localStorage
        const endpoint = isGoogleLogin ? 'http://localhost:8080/google_update' : 'http://localhost:8080/info';
    
        console.log(`Starting handleID...`);
        console.log(`Token: ${token}`);
        console.log(`Is Google Login: ${isGoogleLogin}`);
        console.log(`Endpoint: ${endpoint}`);
    
        let response, info;
    
        try {
            if (isGoogleLogin) {
                // Google login fetch
                response = await fetch(endpoint, {
                    headers: {
                        'Accept': 'application/json', // Expect JSON response
                        'Content-Type': 'application/json', // Sending JSON request
                        'Authorization': `Bearer ${token}`, // Pass token in Authorization header
                    },
                    method: 'POST',
                });
    
                if (!response.ok) {
                    console.error(`Failed to fetch user info from ${endpoint}. Status: ${response.status}`);
                    return; // Exit function if fetch fails
                }
    
                // Parse JSON response directly
                let jsonResponse = await response.json();
                console.log("Raw response for Google login:", jsonResponse);
    
                // Use JSON object directly instead of decoding a JWT
                if (jsonResponse && jsonResponse.id) {
                    info = { id: jsonResponse.id }; // Extract ID
                    localStorage.setItem('userId', jsonResponse.id);
                    setUser(jsonResponse.id);
                } else {
                    throw new Error("User ID not found in response.");
                }
            } else {
                // Non-Google login fetch
                response = await fetch(endpoint, {
                    headers: {
                        'Accept': 'text/html',
                        'Content-Type': 'text/html'
                    },
                    method: 'POST',
                    body: token
                });
    
                if (!response.ok) {
                    console.error(`Failed to fetch user info from ${endpoint}. Status: ${response.status}`);
                    return; // Exit function if fetch fails
                }
    
                info = await response.json();
                console.log("Parsed JSON response for non-Google login:", info);
            }
    
            setUser(info.id); // Set user ID
        } catch (error) {
            console.error("Error during fetch or parsing:", error);
            return; // Exit on error
        }
        setUser(info.id)
        setGroupID(localStorage.getItem('groupID'));
    
        try {
            let tuples = await fetch('http://localhost:8080/groups', {
                headers: {
                    'Accept': 'text/html',
                    'Content-Type': 'text/html'
                },
                method: 'POST',
                body: info.id
            });
            let list = await tuples.json();
            setGroups(list);
    
            let pending = await fetch('http://localhost:8080/invite', {
                headers: {
                    'Accept': 'text/html',
                    'Content-Type': 'text/html'
                },
                method: 'POST',
                body: info.id
            });
            let rsvp = await pending.json();
            setInvites(rsvp);
    
            setSafe(true); // Safe to render UI
        } catch (error) {
            console.error("Error during fetching groups or invites:", error);
        }
    }
    

    const handleView = (id) => () => //Display more data about a group when it has been clicked
    {
        view(id)
    }

    async function view(group) //Retrieve data for the clicked group
    {
        const formData = new FormData();
        formData.append("0", group)
        formData.append("1", userID)
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
        setOpenGroup(group)
        setMembers(list)
    }

    const handleChoose = (name,id) => () => //Select the active group
    {
        localStorage.setItem('groupName', name)
        localStorage.setItem('groupID', id)
        window.location.href = '/'
    }

    const handleClickOpenNew = (id) => //Open prompt to invite user to your group
    {
        setOpenGroup(id);
        setOpenNew(true);
    };

    async function handleInvite(e) //Process request to invite user to your group
    {
        e.preventDefault()
        const form = e.target;
        const formData = new FormData();
        formData.append("0", openGroup)
        formData.append("1", userID)
        formData.append("2", form.Name.value)
        const formJson = Object.fromEntries(formData);
        handleCloseNew()
        let send = await fetch('http://localhost:8080/sendinvite', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: 'POST',
            body: JSON.stringify({
                data: formJson
            })
        })
        let response = await send.text() //Set response message
        if (response == 0)
        {
            setMessage("Invite sent!")
        }
        else if (response == 1)
        {
            setMessage("You are not a manager for this group!") //How it is set up, this shouldn't happen, but just in case.
        }
        else if (response == 2)
        {
            setMessage("That user does not exist!")
        }
        else if (response == 3)
        {
            setMessage("An invite has already been sent!")
        }
        setOpenGroup()
        setOpenMessage(true) //Open response message
    }

    const handleCloseMessage = () => //Close response message
    {
        setMessage()
        setOpenMessage(false);
    }
    
    const handleCloseNew = () => //Close response message
    {
        setOpenGroup();
        setOpenNew(false);
    }

    const handleClickOpenLeave = (id) => //Open prompt to leave the group
    {
        setOpenGroup(id);
        setOpenLeave(true);
    };

    const handleLeave = () => { //Leave the group
        leave();
    };

    async function leave() //Process request to leave the group
    {
        const formData = new FormData();
        formData.append("0", openGroup)
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
        if (openGroup == groupID)
        {
            localStorage.removeItem('groupID');
        }
        window.location.reload()
    }

    const handleCloseLeave = () => //Close prompt to leave the group
    {
        setOpenGroup();
        setOpenLeave(false);
    };

    const handleClickOpenRem = (id) => //Open prompt to remove user from your group
    {
        setOpenGroup(id);
        setOpenRem(true);
    }

    const handleSelect = (id) => () => //Select user to remove from your group
    {
        setToRemove(id)
    }

    const handleRemove = () => { //Remove user from your group
        remove();
    };

    async function remove() //Process request to remove user from your group
    {
        const formData = new FormData();
        formData.append("0", openGroup)
        formData.append("1", userID)
        formData.append("2", toRemove)
        const formJson = Object.fromEntries(formData);
        handleCloseRem()
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
        setToRemove()
        setOpenGroup()
    }

    const handleCloseRem = () => //Close prompt to remove user from your group
    {
        setOpenGroup();
        setToRemove();
        setOpenRem(false);
    }

    const handleOpenC = () => { //Open prompt to create a new group
        setOpenC(true);
    };

    async function handleCreate(e) //Process request to create a new group
    {
        e.preventDefault()
        try {
            const form = e.target;
            const formData = new FormData();
            const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
            formData.append("0", id)
            formData.append("1", (form.Name.value).replaceAll("'","\'"))
            formData.append("2", id)
            formData.append("3", 0)
            formData.append("4", (form.Desc.value).replaceAll("'","\'"))
            const formJson = Object.fromEntries(formData);
            await fetch('http://localhost:8080/addgroup', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    data: formJson
                })
            })

            const groupStart = new FormData();
            groupStart.append("0", id)
            groupStart.append("1", userID)
            groupStart.append("2", 1)
            groupStart.append("3", 1)
            const groupJson = Object.fromEntries(groupStart);
            await fetch('http://localhost:8080/addmem', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    data: groupJson
                })
            })
            localStorage.setItem("groupID", id)
            window.location.href = '/'
        }
        catch(err) {
            setError(true)
        }
    }

    const handleCloseError = () => //Close message if error occurred when creeating new group
    {
        setError(false);
    }

    const handleCloseC = () => { //Close prompt to create a new group
        setOpenC(false);
    };

    const handleAccept = (id) => () => //Accept invite to join a group
    {
        accept(id)
    }

    async function accept(group) //Process request to join a group
    {
        const formData = new FormData();
        formData.append("0", group)
        formData.append("1", userID)
        const formJson = Object.fromEntries(formData);
        await fetch('http://localhost:8080/groupacc', {
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

    const handleReject = (id) => () => //Reject invite to join a group
    {
        reject(id)
    }

    async function reject(group) //Process request to reject a group
    {
        const formData = new FormData();
        formData.append("0", group)
        formData.append("1", userID)
        const formJson = Object.fromEntries(formData);
        await fetch('http://localhost:8080/grouprej', {
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

    useEffect(() => { //Retrieve all necessary data before rendering the page
        handleID()
    }, [])

    if (safe == true) 
    {
        return (
            <div className="groups-container">
                <div className="groups-box">
                    <h2 className='title'>Your Groups</h2>
                    {groups.length == 0 ? <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}><b style={{color: 'red'}}>You currently have no groups available</b></div> : 
                    <List style = {{overflow: 'scroll', height: 600, maxHeight: 600, display: 'flex', flexDirection: 'column'}}>
                        {groups.map((group, index) =>
                        <div key={index} className = {(group[0][2] == localStorage.getItem("groupID") ? 'groups-current' : 'groups-select')}>
                            <div onClick={handleView(group[0][2])}>
                                <h2 style={{marginLeft: '10px'}}>{group[0][0]} {group[1] == 1 ? <GroupsIcon/> : <></>}</h2>
                                <p style={{marginLeft: '10px'}}>{group[0][1]}</p>
                            </div>
                            {group[0][2] == openGroup ?
                            <div>
                                <div className='invite-buttons'> 
                                    <p>Group members: </p>{Object.keys(members).length == 0 ? <b style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', color: 'red'}}>This group currently has no other members</b> 
                                    : Object.keys(members).map((member) =>
                                    <p style = {members[member][3] == 1 ? {border: '2px solid black', borderRadius: '5px'} : {border: '2px solid black', borderRadius: '5px', backgroundColor: 'lightgoldenrodyellow'}}>{member}</p>)}
                                </div>
                                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', backgroundColor: 'lightgray', borderRadius: '12px', gap: '15px'}}>
                                    <Button style={{backgroundColor: 'lightblue', color: 'black', border: '2px solid black'}} onClick={handleChoose(group[0][0],group[0][2])}>Select</Button>
                                    {group[1] == 1 ? <Button style={{backgroundColor: 'blue', border: '2px solid black'}} onClick={() => handleClickOpenNew(group[0][2])}>Invite</Button> : <></>}
                                    <Button style={{backgroundColor: 'crimson', border: '2px solid black'}} onClick={() => handleClickOpenLeave(group[0][2])}>Leave</Button>
                                    {group[1] == 1 ? <Button style={{backgroundColor: 'darkred', border: '2px solid black'}} onClick={() => handleClickOpenRem(group[0][2])}>Remove</Button> : <></>}
                                </div>
                            </div>
                            : <></>}
                        </div>
                        )}
                    </List>}
                    <Dialog open={openNew} onClose={handleCloseNew}> {/*Invite to Group*/}
                    <form method='post' onSubmit={handleInvite} style={{border: '2px solid black', minWidth: 500, width: 500, display: 'flex', flexDirection: 'column'}}>
                        <DialogTitle>Look up by username</DialogTitle>
                        <TextField required id="Name" label="Username"/>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                            <Button variant='contained' style={{textTransform: 'none', minWidth: 125, maxWidth: 125}} type='submit'>Send</Button>
                            <Button variant='contained' onClick={handleCloseNew} style={{textTransform: 'none', minWidth: 125, maxWidth: 125, backgroundColor: '#ff3b30'}}>Cancel</Button>
                        </div>
                    </form>
                    </Dialog>
                    <Dialog open={openLeave} onClose={handleCloseLeave}> {/*Leaving Group*/}
                    <div style={{border: '2px solid black', minWidth: 500, width: 500, display: 'flex', flexDirection: 'column'}}>
                        <DialogTitle>Are you sure you want to leave? </DialogTitle>
                        <p>Note: You will not be allowed to return to the group again without another invite.</p>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                            <Button variant='contained' onClick={handleLeave} style={{textTransform: 'none', minWidth: 125, maxWidth: 125}}>Yes, I am sure.</Button>
                            <Button variant='contained' onClick={handleCloseLeave} style={{textTransform: 'none', minWidth: 125, maxWidth: 125, backgroundColor: '#ff3b30'}}>No, cancel</Button>
                        </div>
                    </div>
                    </Dialog>
                    <Dialog open={openRem} onClose={handleCloseRem}>
                        <DialogTitle>Remove user from group/Revoke invite</DialogTitle>
                        <div className='invite-buttons'>
                            <p>Group members: </p>
                            <div style={{overflow: 'scroll', display: 'flex', flexDirection: 'row', gap: '10px'}}>
                                {Object.keys(members).length == 0 ? <b style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', color: 'red'}}>This group currently has no other members</b> :
                                Object.keys(members).map((member) =>
                                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    {members[member][3] == 1 ? <Button style={members[member][0] == toRemove ? {maxHeight: '20px', color: 'red', backgroundColor: 'white', border: '2px solid red', borderRadius: '5px'} : {maxHeight: '20px', color: 'black', backgroundColor: 'white', border: '2px solid black', borderRadius: '5px'}} onClick={handleSelect(members[member][0])}>{member}</Button>
                                    : <Button style={members[member][0] == toRemove ? {maxHeight: '20px', color: 'red', backgroundColor: 'lightgoldenrodyellow', border: '2px solid red', borderRadius: '5px'} : {maxHeight: '20px', color: 'black', backgroundColor: 'lightgoldenrodyellow', border: '2px solid black', borderRadius: '5px'}} onClick={handleSelect(members[member][0])}>{member}</Button>}
                                </div>)}
                            </div>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                            <Button variant='contained' onClick={handleRemove} style={{textTransform: 'none', minWidth: 125, maxWidth: 125}}>Remove</Button>
                            <Button variant='contained' onClick={handleCloseRem} style={{textTransform: 'none', minWidth: 125, maxWidth: 125, backgroundColor: '#ff3b30'}}>Cancel</Button>
                        </div>
                    </Dialog>
                    <Dialog open={openMessage} onClose={handleCloseMessage}>
                        <div style={{border: '2px solid black', minWidth: 500, width: 500, display: 'flex', flexDirection: 'column'}}>
                            <DialogTitle style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>{message}</DialogTitle>
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                                <Button variant='contained' onClick={handleCloseMessage} style={{textTransform: 'none', minWidth: 125, maxWidth: 125}}>OK</Button>
                            </div>
                        </div>
                    </Dialog>
                    <div className="input-container">
                    <Button variant='outlined' onClick={handleOpenC}>Create New Group</Button>
                        <Dialog open={openC} onClose={handleCloseC}>
                        <form method='post' onSubmit={handleCreate} style={{border: '2px solid black', minWidth: 250, width: 250, display: 'flex', flexDirection: 'column'}}>
                            <DialogTitle>Create a new Group</DialogTitle>
                            <TextField required id="Name" label="Group Name"/>
                            <TextField id="Desc" label="Description"/>
                            <div>
                                <Button variant='contained' onClick={handleCloseC} style={{textTransform: 'none', minWidth: 125, maxWidth: 125}} type='submit'>Create</Button>
                                <Button variant='contained' onClick={handleCloseC} style={{textTransform: 'none', minWidth: 125, maxWidth: 125, backgroundColor: '#ff3b30'}}>Cancel</Button>
                            </div>
                        </form>
                        </Dialog>
                    </div>
                    <Dialog open={error} onClose={handleCloseError}>
                        <div style={{border: '2px solid black', minWidth: 500, width: 500, display: 'flex', flexDirection: 'column'}}>
                            <DialogTitle style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>An unexpected error has occured when creating a new group. Please try again.</DialogTitle>
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                                <Button variant='contained' onClick={handleCloseError} style={{textTransform: 'none', minWidth: 125, maxWidth: 125}}>OK</Button>
                            </div>
                        </div>
                    </Dialog>
                </div>
                <div className="groups-box">
                    <h2 className='title'>Pending Invites</h2>
                    {invites.length == 0 ? <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}><b style={{color: 'red'}}>You currently have no pending invites</b></div> : 
                    <List style = {{overflow: 'scroll', height: 600, maxHeight: 600, display: 'flex', flexDirection: 'column'}}>
                        {invites.map((group, index) =>
                            <div className='groups-invite' key={index}>
                                <h2 style={{marginLeft: '10px'}}>{group[0][0]}</h2> <p style={{marginLeft: '10px'}}>{group[0][1]}</p>
                                <div className='invite-buttons'>
                                    <Button style={{border: '2px solid black', borderRadius: '12px', color: 'black', backgroundColor: 'greenyellow', minWidth: '60px', maxHeight: '40.5px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} onClick={handleAccept(group[0][2])}>Accept</Button>
                                    <Button style={{border: '2px solid black', borderRadius: '12px', color: 'black', backgroundColor: 'red', minWidth: '60px', maxHeight: '40.5px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} onClick={handleReject(group[0][2])}>Reject</Button>
                                </div>
                            </div>
                        )}
                    </List>}
                </div>
            </div>
        ); 
    }
}

export default Groups;