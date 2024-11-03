import React, {useState, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import '../components/Groups.css';

function Groups() {
    const [safe, setSafe] = useState(false)

    const [userID, setUser] = useState()

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
        let tuples = await fetch('http://localhost:8080/groups', {
            headers: {
                'Accept': 'text/html',
                'Content-Type': 'text/html'
            },
            method: 'POST',
            body: info.id
        })
        let list = await tuples.json()
        let current = list.filter(omit)
        function omit(id)
        {
            return id[0][2] != localStorage.getItem("groupID")
        }
        setGroups(current)
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
        formData.append("2", id) //Same as group id for their default calendar?
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
        window.location.reload() //Do we reload the page to select from updated list or select that group on accepting invite (redirect to Home)?
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

    if (safe == true) 
    {
        return (
            <div className="groups-container">
                <div className="groups-box">
                    <h2 className='title'>Your Groups</h2>
                    {groups.length == 0 ? <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}><b style={{color: 'red'}}>You currently have no groups available</b></div> : 
                    <List style = {{overflow: 'scroll', height: 600, maxHeight: 600, display: 'flex', flexDirection: 'column'}}>
                        {groups.map((group, index) =>
                            <div className='groups-select' key={index} onClick={handleChoose(group[0][2])}>
                                <h2 style={{marginLeft: '10px'}}>{group[0][0]}</h2> <p style={{marginLeft: '10px'}}>{group[0][1]}</p>
                            </div>
                        )}
                    </List>}
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
                                    <div className='accept-button' onClick={handleAccept(group[0][2])}>Accept</div>
                                    <div className='reject-button' onClick={handleReject(group[0][2])}>Reject</div>
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
