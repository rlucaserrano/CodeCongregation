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

    function handleNone()
    {
        localStorage.setItem('groupID', null)
        window.location.href = '/'
    }

    const handleChoose = (id) => () =>
    {
        localStorage.setItem('groupID', id)
        window.location.href = '/'
    }


    if (safe == true) 
    {
        return (
            <div className="groups-container">
                <div className="groups-box">
                    <h2>Your Groups</h2>
                    {groups.length == 0 ? <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}><b style={{color: 'red'}}>You currently have no groups available</b></div> : 
                    <List style = {{overflow: 'scroll', height: 200, maxHeight: 200, display: 'flex', flexDirection: 'column'}}>
                        {groups.map((group, index) =>
                                <Button style={{border: '2px solid black', display: 'flex', flexDirection: 'column', alignItems: 'start', backgroundColor: 'white', color: 'black'}} key={index} onClick={handleChoose(group[0][2])}>
                                    <h2>{group[0][0]}</h2> <p>{group[0][1]}</p>
                                </Button>
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
                            <Button variant='contained' onClick={handleCloseC} style={{textTransform: 'none', minWidth: 125, maxWidth: 125}}>Cancel</Button>
                            </div>
                        </form>
                        </Dialog>
                        <Button variant='contained' onClick={handleNone} className="cancel-button">
                            Proceed Without a Group
                        </Button>
                    </div>
                </div>
            </div>
        ); 
    }
}

export default Groups;
