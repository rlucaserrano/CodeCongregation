import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid2 from '@mui/material/Grid2';

function Social() {
  return (
    <div>
      <h2>Social Page</h2>
      <p>Test Social.</p>
      <TextField label="Filter by user or group"></TextField>
      <table style={{maxWidth: '100%'}}>
        <Grid2 style={{display: 'flex', flexDirection: 'column', padding: '12px'}}>
          <p><Button variant='outlined' sx={{minWidth:15, width:15, minHeight:25, height:25 , paddingTop: '15px', paddingBottom: '15px', paddingLeft: '15px', paddingRight: '15px'}}>+</Button>
            DMs/Group Chats</p>
          <List style={{overflow: 'scroll', height: 500, width: 500, maxHeight: 500, maxWidth: 500,  display: 'flex', flexDirection: 'column', border: '1px solid grey'}}>
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

export default Social;