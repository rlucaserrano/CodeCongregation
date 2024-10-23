import React, { useState, useEffect } from 'react';
import '../assets/arrange.css';
import '@react-oauth/google'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { blue, yellow } from '@mui/material/colors';
import Grid2 from '@mui/material/Grid2';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

function Account() {

  const [safe, setSafe] = useState(false)
  const [data, setData] = useState()
  async function handleInfGet()
  {
    let token = localStorage.getItem('token')
    console.log("Check token: " + token)
    let data = await fetch('http://localhost:8080/info', {
        headers: {
            'Accept': 'text/html',
            'Content-Type': 'text/html'
          },
        method: 'POST',
        body: token
    })
    let info = await data.json();
    setData(info)
    setSafe(true)
  }

  useEffect(() => {
    handleInfGet()
  }, [])

  const [openF, setOpenF] = React.useState(false);

  const handleClickOpenF = () => {
    setOpenF(true);
  };

  const handleCloseF = () => {
    setOpenF(false);
  };

  const [open1, setOpen1] = React.useState(false);

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const [open2, setOpen2] = React.useState(false);

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const [open3, setOpen3] = React.useState(false);

  const handleClickOpen3 = () => {
    setOpen3(true);
  };

  const handleClose3 = () => {
    setOpen3(false);
  };

  const [open4, setOpen4] = React.useState(false);

  const handleClickOpen4 = () => {
    setOpen4(true);
  };

  const handleClose4 = () => {
    setOpen4(false);
  };

  async function handleLogout()
  {
    localStorage.setItem("token", '')
    window.location.href = '/'
  }

  if (safe == true) 
  {
    return (
      <html>
        <header>
        <h1>Account</h1>
        </header>
        <Button variant='contained' color='warning' onClick={handleLogout}>Log Out</Button>
        <body> {/*Yes this is necessary*/}
            <div>
                <Box component="form" sx={{ '& .MuiTextField-root': {m:1, width: '25ch'}}}>
                  <lft>
                    <Avatar id="Pic" sx={{ bgcolor: blue[900], width: 100, height: 100}} variant="square">B</Avatar>
                    <TextField required id="Username" label="Username" defaultValue = {data.user}/>
                    <TextField required id="Password" label="Password" type="password" defaultValue = {data.pass}/>
                    <TextField id="First" label="First Name" defaultValue = {data.first}/>
                    <TextField id="Last" label="Last Name" defaultValue = {data.last}/>
                    <TextField required id="Email" label="Email" type="email" defaultValue = {data.mail}/>
                    <TextField id="Bio" label="Bio" multiline="true" rows={5} defaultValue = {data.bio}/>
                    <Button variant='outlined' type='submit'>Save</Button>
                  </lft>
                </Box>
            </div>
            <cen>
              <Grid2 style={{display: 'flex', flexDirection: 'column'}}>
              <p><Button variant='outlined' sx={{minWidth:15, width:15, minHeight:25, height:25 , paddingTop: '15px', paddingBottom: '15px', paddingLeft: '15px', paddingRight: '15px'}} onClick={handleClickOpenF}>+</Button>
                <Dialog open={openF} onClose={handleCloseF}>
                  <DialogTitle>Look up by username</DialogTitle>
                  <TextField label="Username"/>
                  <Box component="form" style={{display: 'flex', flexDirection: 'row', border: '1px solid black'}}>
                    <Avatar id="Pic" sx={{ bgcolor: yellow[600], width: 100, height: 100}} variant="square">E</Avatar>
                    <div>
                      <p>Example 1</p>
                      <Button style={{textTransform: 'none'}}>Send Friend Request</Button>
                    </div>
                  </Box>
                  <Button variant='contained' onClick={handleCloseF} style={{textTransform: 'none'}}>Done</Button>
                </Dialog>
              Friends</p>
              <List style={{overflow: 'scroll', height: 500, maxHeight: 500, width: 200, maxWidth: 200, display: 'flex', flexDirection: 'column'}}>
                  <ListItem style={{display: 'flex', flexDirection: 'column'}}>
                  <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 1</ListItemText>
                  <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 2</ListItemText>
                  <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 3</ListItemText>
                </ListItem>
              </List>
              </Grid2>
            </cen>
            <cen>
              <Button variant='contained' sx={{width:100, height:100}} style={{border:'3px solid red'}} onClick={handleClickOpen1}>Facebook</Button>
              <Dialog open={open1} onClose={handleClose1}>
                <DialogTitle>Link your Facebook!</DialogTitle>
                <TextField label="Facebook URL"/>
                <Button variant='contained' onClick={handleClose1} style={{textTransform: 'none'}}>Done</Button>
              </Dialog>
              <Button variant='contained' sx={{width:100, height:100}} style={{border:'3px solid red'}} onClick={handleClickOpen2}>Twitter/X</Button>
              <Dialog open={open2} onClose={handleClose2}>
                <DialogTitle>Link your Twitter/X!</DialogTitle>
                <TextField label="Twitter/X URL"/>
                <Button variant='contained' onClick={handleClose2} style={{textTransform: 'none'}}>Done</Button>
              </Dialog>
              <Button variant='contained' sx={{width:100, height:100}} style={{border:'3px solid red'}} onClick={handleClickOpen3}>Instagram</Button>
              <Dialog open={open3} onClose={handleClose3}>
                <DialogTitle>Link your Instagram!</DialogTitle>
                <TextField label="Instagram URL"/>
                <Button variant='contained' onClick={handleClose3} style={{textTransform: 'none'}}>Done</Button>
              </Dialog>
              <Button variant='contained' sx={{width:100, height:100}} style={{border:'3px solid red'}} onClick={handleClickOpen4}>LinkedIn</Button>
              <Dialog open={open4} onClose={handleClose4}>
                <DialogTitle>Link your LinkedIn!</DialogTitle>
                <TextField label="LinkedIn URL"/>
                <Button variant='contained' onClick={handleClose4} style={{textTransform: 'none'}}>Done</Button>
              </Dialog>
            </cen>
            <rgt>
            <Grid2 style={{display: 'flex', flexDirection: 'column'}}>
              <List style={{overflow: 'scroll', maxHeight: 200, display: 'flex', flexDirection: 'column'}}>
              <p>Recent Accomplishments</p>
                  <ListItem style={{display: 'flex', flexDirection: 'column', height: 200, width: 500, maxHeight: 200, maxWidth: 500,}}>
                  <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 1</ListItemText>
                  <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 2</ListItemText>
                </ListItem>
              </List>
              <List style={{overflow: 'scroll', maxHeight: 200, display: 'flex', flexDirection: 'column'}}>
              <p>User History</p>
                  <ListItem style={{display: 'flex', flexDirection: 'column', height: 200, width: 500, maxHeight: 200, maxWidth: 500,}}>
                  <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 1</ListItemText>
                  <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 2</ListItemText>
                  <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 3</ListItemText>
                  <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 4</ListItemText>
                  <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 5</ListItemText>
                </ListItem>
              </List>
              </Grid2>
            </rgt>
        </body>
      </html>
    );
  }
}

export default Account;