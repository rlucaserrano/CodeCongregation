import React, {useState, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import '../components/Groups.css';
<<<<<<< HEAD
=======
import GroupsIcon from '@mui/icons-material/Groups';
>>>>>>> 43cf935a6e697def62271eb07b341be74e4b9fb9

function Groups() {
    const [safe, setSafe] = useState(false)

    const [userID, setUser] = useState()

<<<<<<< HEAD
=======
    const [groupID, setGroupID] = useState()

    const [toRemove, setToRemove] = useState()

>>>>>>> 43cf935a6e697def62271eb07b341be74e4b9fb9
    const [groups, setGroups] = useState()

    const [invites, setInvites] = useState()

    async function handleID()
    {
        let token = localStorage.getItem('token')
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
<<<<<<< HEAD
=======
        setGroupID(localStorage.getItem('groupID'))
>>>>>>> 43cf935a6e697def62271eb07b341be74e4b9fb9
        let tuples = await fetch('http://localhost:8080/groups', {
            headers: {
                'Accept': 'text/html',
                'Content-Type': 'text/html'
            },
            method: 'POST',
            body: info.id
        })
        let list = await tuples.json()
<<<<<<< HEAD
        let current = list.filter(omit)
        function omit(id)
        {
            return id[0][2] != localStorage.getItem("groupID")
        }
        setGroups(current)
=======
        setGroups(list)
>>>>>>> 43cf935a6e697def62271eb07b341be74e4b9fb9
        let pending = await fetch('http://localhost:8080/invite', {
            headers: {
                'Accept': 'text/html',
                'Content-Type': 'text/html'
            },
            method: 'POST',
            body: info.id
        })
        let rsvp = await pending.json()
        setInvites(rsvp)
        setSafe(true)
    }

    useEffect(() => {
        handleID()
      }, [])

    async function handleCreate(e)
    {
        e.preventDefault()
        const form = e.target;
        const formData = new FormData();
        const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        formData.append("0", id)
        formData.append("1", form.Name.value)
<<<<<<< HEAD
        formData.append("2", id) //Same as group id for their default calendar?
=======
        formData.append("2", id)
>>>>>>> 43cf935a6e697def62271eb07b341be74e4b9fb9
        formData.append("3", 0) //What would be the default? Temporary or permanent?
        formData.append("4", form.Desc.value)
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

    const [openC, setOpenC] = React.useState(false);

    const handleOpenC = () => {
        setOpenC(true);
    };

    const handleCloseC = () => {
        setOpenC(false);
    };

<<<<<<< HEAD
=======
    const handleView = (id) => () =>
    {
        view(id)
    }

    async function view(group) 
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
        let items = Object.keys(list)
        setClicked(group)
        setMembers(items) //To be reworked to highlight members invited, but not yet accepted
    }

    const [clicked, setClicked] = useState()
    const [members, setMembers] = useState([])

>>>>>>> 43cf935a6e697def62271eb07b341be74e4b9fb9
    const handleChoose = (id) => () =>
    {
        localStorage.setItem('groupID', id)
        window.location.href = '/'
    }

    const handleAccept = (id) => () =>
    {
        accept(id)
    }

    async function accept(group) 
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
<<<<<<< HEAD
        window.location.reload() //Do we reload the page to select from updated list or select that group on accepting invite (redirect to Home)?
=======
        window.location.reload()
>>>>>>> 43cf935a6e697def62271eb07b341be74e4b9fb9
    }

    const handleReject = (id) => () =>
    {
        reject(id)
    }

    async function reject(group) 
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

<<<<<<< HEAD
=======
    const handleClickOpenNew = (id) => 
    {
        setOpenGroup(id);
        setOpenNew(true);
    };
    const handleCloseNew = () => 
    {
        setOpenGroup();
        setOpenNew(false);
    }
    const handleClickOpenLeave = (id) => 
    {
        setOpenGroup(id);
        setOpenLeave(true);
    };
    const handleCloseLeave = () => 
    {
        setOpenGroup();
        setOpenLeave(false);
    };
    const handleClickOpenRem = (id) => 
    {
        setOpenGroup(id);
        setOpenRem(true);
    }
    const handleCloseRem = () => 
    {
        setOpenGroup();
        setToRemove();
        setOpenRem(false);
    }

    const [openNew, setOpenNew] = useState(false);
    const [openLeave, setOpenLeave] = useState(false);
    const [openRem, setOpenRem] = useState(false);
    const [openGroup, setOpenGroup] = useState();

    async function handleInvite(e)
    {
        e.preventDefault()
        const form = e.target;
        const formData = new FormData();
        formData.append("0", openGroup)
        formData.append("1", userID)
        formData.append("2", form.Name.value)
        const formJson = Object.fromEntries(formData);
        handleCloseNew()
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
        setClicked()
    }

    const handleLeave = () => {
        leave();
    };

    async function leave()
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

    const handleSelect = (id) => () =>
    {
        setToRemove(id)
    }

    const handleRemove = () => {
        remove();
    };

    async function remove()
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
        setClicked()
    }

>>>>>>> 43cf935a6e697def62271eb07b341be74e4b9fb9
    if (safe == true) 
    {
        return (
            <div className="groups-container">
                <div className="groups-box">
                    <h2 className='title'>Your Groups</h2>
                    {groups.length == 0 ? <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}><b style={{color: 'red'}}>You currently have no groups available</b></div> : 
                    <List style = {{overflow: 'scroll', height: 600, maxHeight: 600, display: 'flex', flexDirection: 'column'}}>
                        {groups.map((group, index) =>
<<<<<<< HEAD
                            <div className='groups-select' key={index} onClick={handleChoose(group[0][2])}>
                                <h2 style={{marginLeft: '10px'}}>{group[0][0]}</h2> <p style={{marginLeft: '10px'}}>{group[0][1]}</p>
                            </div>
                        )}
                    </List>}
=======
                        <div className = {(group[0][2] == localStorage.getItem("groupID") ? 'groups-current' : 'groups-select')}>
                            <div key={index} onClick={handleView(group[0][2])}>
                                <h2 style={{marginLeft: '10px'}}>{group[0][0]} {group[1] == 1 ? <GroupsIcon/> : <></>}</h2>
                                <p style={{marginLeft: '10px'}}>{group[0][1]}</p>
                            </div>
                            {group[0][2] == clicked ?
                            <div>
                                <div className='invite-buttons'> 
                                    <p>Group members: </p>{members.length == 0 ? <b style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', color: 'red'}}>This group currently has no other members</b> 
                                    : members.map((member,index) => 
                                    <p>{member}</p>)}
                                </div>
                                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', backgroundColor: 'lightgray', borderRadius: '12px', gap: '15px'}}>
                                    <Button style={{backgroundColor: 'lightblue', color: 'black', border: '2px solid black'}} onClick={handleChoose(group[0][2])}>Select</Button>
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
                                {members.length == 0 ? <b style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', color: 'red'}}>This group currently has no other members</b> :
                                members.map((member,index) => 
                                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    <Button style={member == toRemove ? {maxHeight: '20px', color: 'yellow', border: '2px solid yellow'} : {maxHeight: '20px'}} onClick={handleSelect(member)}>{member}</Button>
                                </div>)}
                            </div>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                            <Button variant='contained' onClick={handleRemove} style={{textTransform: 'none', minWidth: 125, maxWidth: 125}}>Remove</Button>
                            <Button variant='contained' onClick={handleCloseRem} style={{textTransform: 'none', minWidth: 125, maxWidth: 125, backgroundColor: '#ff3b30'}}>Cancel</Button>
                        </div>
                    </Dialog>
>>>>>>> 43cf935a6e697def62271eb07b341be74e4b9fb9
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
                </div>
                <div className="groups-box">
                    <h2 className='title'>Pending Invites</h2>
                    {invites.length == 0 ? <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}><b style={{color: 'red'}}>You currently have no pending invites</b></div> : 
                    <List style = {{overflow: 'scroll', height: 600, maxHeight: 600, display: 'flex', flexDirection: 'column'}}>
                        {invites.map((group, index) =>
                            <div className='groups-invite' key={index}>
                                <h2 style={{marginLeft: '10px'}}>{group[0][0]}</h2> <p style={{marginLeft: '10px'}}>{group[0][1]}</p>
                                <div className='invite-buttons'>
<<<<<<< HEAD
                                    <div className='accept-button' onClick={handleAccept(group[0][2])}>Accept</div>
                                    <div className='reject-button' onClick={handleReject(group[0][2])}>Reject</div>
=======
                                    <Button style={{border: '2px solid black', borderRadius: '12px', color: 'black', backgroundColor: 'greenyellow', minWidth: '60px', maxHeight: '40.5px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} onClick={handleAccept(group[0][2])}>Accept</Button>
                                    <Button style={{border: '2px solid black', borderRadius: '12px', color: 'black', backgroundColor: 'red', minWidth: '60px', maxHeight: '40.5px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} onClick={handleReject(group[0][2])}>Reject</Button>
>>>>>>> 43cf935a6e697def62271eb07b341be74e4b9fb9
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
