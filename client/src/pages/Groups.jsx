import React, {useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import '../components/Groups.css';

function Groups() {
    async function handleCreate(e)
    {
        e.preventDefault()

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

        const form = e.target;
        const formData = new FormData();
        const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        formData.append("0", id)
        formData.append("1", form.Name.value)
        formData.append("2", id) //Same as group id for their default calendar?
        formData.append("3", 0) //What would be the default? Temporary or permanent?
        formData.append("4", form.Desc.value) //Group description to be added? (As an optional field)
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
        groupStart.append("1", info.id)
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
        window.location.href = '/'
    }

    const [openC, setOpenC] = React.useState(false);

    const handleOpenC = () => {
        setOpenC(true);
    };

    const handleCloseC = () => {
        setOpenC(false);
    };

    const [openJ, setOpenJ] = React.useState(false);

    const handleOpenJ = () => {
        setOpenJ(true);
    };

    const handleCloseJ = () => {
        setOpenJ(false);
    };

    function handleNone()
    {
        window.location.href = '/'
    }

    async function test()
    {
        let token = localStorage.getItem('token')
        console.log(token)
        let data = await fetch('http://localhost:8080/info', {
            headers: {
                'Accept': 'text/html',
                'Content-Type': 'text/html'
            },
            method: 'POST',
            body: token
        })
        let info = await data.json();
        console.log(info)
    }

    return (
        <div className="groups-container">
            <div className="groups-box">
                <h2>Your Groups</h2>
                <div className="input-container">
                <Button variant='outlined' onClick={handleOpenC}>Create New Group</Button>
                    <Dialog open={openC} onClose={handleCloseC}>
                    <form method='post' onSubmit={handleCreate} style={{border: '2px solid black', minWidth: 250, width: 250, display: 'flex', flexDirection: 'column'}}>
                        <DialogTitle>Greate a new Group</DialogTitle>
                        <TextField required id="Name" label="Group Name"/>
                        <TextField id="Desc" label="Description"/>
                        <div>
                        <Button variant='contained' onClick={handleCloseC} style={{textTransform: 'none', minWidth: 125, maxWidth: 125}} type='submit'>Create</Button>
                        <Button variant='contained' onClick={handleCloseC} style={{textTransform: 'none', minWidth: 125, maxWidth: 125}}>Cancel</Button>
                        </div>
                    </form>
                    </Dialog>
                    <Button variant='contained' className="cancel-button">
                        Join New Group
                    </Button>
                    <Button variant='contained' onClick={handleNone} className="cancel-button">
                        Proceed Without a Group
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Groups;
