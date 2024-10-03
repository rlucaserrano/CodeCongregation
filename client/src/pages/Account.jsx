import React from 'react';
import '../assets/arrange.css';
import '@react-oauth/google'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { blue, red } from '@mui/material/colors';
import Grid2 from '@mui/material/Grid2';

function Account() {
  return (
    <html>
      <header>
      <h1>Account Page</h1>
      </header>
    <body> {/*Yes this is necessary*/}
        <div>
            <Box component="form" sx={{ '& .MuiTextField-root': {m:1, width: '25ch'}}}>
              <lft>
                <Avatar id="Pic" sx={{ bgcolor: blue[900], width: 100, height: 100}} variant="square">B</Avatar>
                <TextField required id="Username" label="Username" defaultValue = ""/>
                <TextField required id="Password" label="Password" type="password" defaultValue = ""/>
                <TextField required id="Email" label="Email" type="email" defaultValue = ""/>
                <TextField id="Phone" label="Phone Number" type="tel" defaultValue = ""/>
                <TextField id="Bio" label="Bio" multiline="true" rows={5} defaultValue = ""/>
                <Button variant='outlined' type='submit'>Save</Button>
              </lft>
            </Box>
        </div>
        <cen>
          <Grid2 style={{display: 'flex', flexDirection: 'column'}}>
          <p>Friends</p>
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
          <Button variant='contained' sx={{width:100, height:100}}>Facebook</Button>
          <Button variant='contained' sx={{width:100, height:100}}>Twitter/X</Button>
          <Button variant='contained' sx={{width:100, height:100}}>Instagram</Button>
          <Button variant='contained' sx={{width:100, height:100}}>LinkedIn</Button>
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

export default Account;