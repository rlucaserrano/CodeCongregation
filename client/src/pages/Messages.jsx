import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid2 from '@mui/material/Grid2';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar';
import { green, purple, red } from '@mui/material/colors';

function Messages() {
  const [openDM, setOpenDM] = React.useState(false);

  const handleClickOpenDM = () => {
    setOpenDM(true);
  };

  const handleCloseDM = () => {
    setOpenDM(false);
  };

  const [openNew, setOpenNew] = React.useState(false);

  const handleClickOpenNew = () => {
    setOpenNew(true);
  };

  const handleCloseNew = () => {
    setOpenNew(false);
  };

  const [openRem, setOpenRem] = React.useState(false);

  const handleClickOpenRem = () => {
    setOpenRem(true);
  };

  const handleCloseRem = () => {
    setOpenRem(false);
  };

  return (
    <div>
      <h1>Messages</h1>
      <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
      <p>List of group members:<List style={{overflow: 'scroll', display: 'flex', flexDirection: 'row', maxWidth: 200, width: 200, maxHeight: 35, height: 35, gap: 120}}>
        <ListItemText>ExampleUser1</ListItemText>
        <ListItemText>ExampleUser2</ListItemText>
        <ListItemText>ExampleUser3</ListItemText>
        <ListItemText>ExampleUser4</ListItemText>
      </List></p>
      <Button variant='contained' style={{width:25, maxWidth:25, height:50, maxHeight:50}} onClick={handleClickOpenNew}>Invite</Button>
      <Dialog open={openNew} onClose={handleCloseNew}>
        <DialogTitle>Look up by username</DialogTitle>
        <TextField label="Username"/>
        <Box component="form" style={{display: 'flex', flexDirection: 'row', border: '1px solid black'}}>
          <Avatar id="Pic" sx={{ bgcolor: purple[900], width: 100, height: 100}} variant="square">E</Avatar>
          <div>
            <p>Example 5</p>
            <Button style={{textTransform: 'none'}}>Send Invite</Button>
          </div>
        </Box>
        <Button variant='contained' onClick={handleCloseNew} style={{textTransform: 'none'}}>Done</Button>
      </Dialog>
      <Button variant='contained' color='error' style={{width:25, maxWidth:25, height:50, maxHeight:50}} onClick={handleClickOpenRem}>Remove</Button> {/*Manager only feature*/}
      <Dialog open={openRem} onClose={handleCloseRem}>
        <DialogTitle>Look up by username</DialogTitle>
        <TextField label="Username"/>
        <Box component="form" style={{display: 'flex', flexDirection: 'row', border: '1px solid black'}}>
          <Avatar id="Pic" sx={{ bgcolor: red[900], width: 100, height: 100}} variant="square">E</Avatar>
          <div>
            <p>Example 1</p>
            <Button style={{textTransform: 'none'}}>Remove from *Group Name*</Button>
          </div>
        </Box>
        <Button variant='contained' onClick={handleCloseRem} style={{textTransform: 'none'}}>Done</Button>
      </Dialog>
      <Button variant='contained' color='warning' style={{width:25, maxWidth:25, height:50, maxHeight:50}}>Leave</Button>
      </div>
      <TextField label="Filter by user" style={{width: '100%'}}></TextField>
      <table style={{maxWidth: '100%'}}>
        <Grid2 style={{display: 'flex', flexDirection: 'column', padding: '12px'}}>
          <p>Group Chat for *Group Name*</p>
          <List style={{overflow: 'scroll', height: 200, width: 500, maxHeight: 200, maxWidth: 500,  display: 'flex', flexDirection: 'column', border: '1px solid grey'}}>
            <ListItem style={{display: 'flex', flexDirection: 'column-reverse'}}>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Latest Message Preview 1</ListItemText>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Latest Message Preview 2</ListItemText>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Latest Message Preview 3</ListItemText>
            </ListItem>
          </List>
          <p><Button variant='outlined' sx={{minWidth:15, width:15, minHeight:25, height:25 , paddingTop: '15px', paddingBottom: '15px', paddingLeft: '15px', paddingRight: '15px'}} onClick={handleClickOpenDM}>+</Button>
            <Dialog open={openDM} onClose={handleCloseDM}>
              <DialogTitle>Look up by username</DialogTitle>
              <TextField label="Username"/>
              <Box component="form" style={{display: 'flex', flexDirection: 'row', border: '1px solid black'}}>
                <Avatar id="Pic" sx={{ bgcolor: green[900], width: 100, height: 100}} variant="square">E</Avatar>
                <div>
                  <p>Example 4</p>
                  <Button style={{textTransform: 'none'}}>Add to chat</Button>
                </div>
              </Box>
              <Button variant='contained' onClick={handleCloseDM} style={{textTransform: 'none'}}>Done</Button>
            </Dialog>
          Direct Messages</p>
          <List style={{overflow: 'scroll', height: 200, width: 500, maxHeight: 200, maxWidth: 500,  display: 'flex', flexDirection: 'column', border: '1px solid grey'}}>
            <ListItem style={{display: 'flex', flexDirection: 'column'}}>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 1</ListItemText>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 2</ListItemText>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 3</ListItemText>
            </ListItem>
          </List>
        <Button variant='contained'>Start a video call</Button>
        </Grid2>
        <Grid2 style={{display: 'flex', flexDirection: 'column', padding: '12px'}}>
        <p>Notification Feed</p>
          <List style={{overflow: 'scroll', height: 500, width: 500, maxHeight: 500, maxWidth: 500,  display: 'flex', flexDirection: 'column', border: '1px solid grey'}}>
            <ListItem style={{display: 'flex', flexDirection: 'column'}}>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 1</ListItemText>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 2</ListItemText>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 3</ListItemText>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 4</ListItemText>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 5</ListItemText>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 6</ListItemText>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 7</ListItemText>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 8</ListItemText>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 9</ListItemText>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 10</ListItemText>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 11</ListItemText>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 12</ListItemText>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 13</ListItemText>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 14</ListItemText>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 15</ListItemText>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 16</ListItemText>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 17</ListItemText>
              <ListItemText style={{width: '100%',maxWidth: '100%',border:'1px solid black'}}>Example 18</ListItemText>
            </ListItem>
          </List>
        </Grid2>
      </table>
    </div>
  );
}

export default Messages;