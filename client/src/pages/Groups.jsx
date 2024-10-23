import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

function Groups(){

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
        //formData.append("4", form.Desc.value) //Group description to be added? (As an optional field)
        const formJson = Object.fromEntries(formData);
        let group = await fetch('http://localhost:8080/addgroup', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method: 'POST',
            body: JSON.stringify({
                data: formJson
            })
        })
        /*.then(function(res){console.log(res)})
        .catch(function(res){console.log("Error: " + res)})*/
        let test = await group.text()
        //window.location.href = '/'
        console.log(formJson)
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
        window.location.href = '/login'
    }

    return (
        <Box style={{border: '2px solid black', minWidth: 250, width: 250}}>
            <h2>Your Groups</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center'}}>
                <List style={{overflow: 'scroll', height: 200, width: 250, maxHeight: 200, maxWidth: 250, display: 'flex', flexDirection: 'column'}}>
                    <ListItem style={{display: 'flex', flexDirection: 'column'}}>
                        <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 1</ListItemText>
                        <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 2</ListItemText>
                        <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 3</ListItemText>
                        <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 4</ListItemText>
                        <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 5</ListItemText>
                        <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 6</ListItemText>
                        <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 7</ListItemText>
                        <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 8</ListItemText>
                    </ListItem>
                </List>       
                <div>
                    <Button variant='outlined' onClick={handleOpenC}>Create New Group</Button>
                    <Dialog open={openC} onClose={handleCloseC}>
                    <form method='post' onSubmit={handleCreate} style={{border: '2px solid black', minWidth: 250, width: 250}}>
                        <DialogTitle>Greate a new Group</DialogTitle>
                        <TextField required id="Name" label="Group Name"/>
                        <TextField id="Desc" label="Description"/>
                        <Button variant='contained' onClick={handleCloseC} style={{textTransform: 'none'}} type='submit'>Done</Button>
                    </form>
                    </Dialog>
                </div>
                <div>
                    <Button variant='contained' color='secondary'>Join New Group</Button>
                </div>
                <div>
                    <Button variant='contained' onClick={handleNone}>Continue without a group</Button>
                </div>
            </div>
        </Box>
    );
};

export default Groups;