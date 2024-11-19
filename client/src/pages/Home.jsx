import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import '../components/Home.css';

function Home() {
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <Box className="home-container">
      <Typography variant="h3" className="home-title">
        Welcome to CoderCongregation!
      </Typography>
      <Typography variant="h5" className="home-subtitle">
        CoderCongregation is the Virtual Study Group Environment that allows you to study and practice programming skills with
        <Typography component="span" variant="h4" className="highlight">
          {' '}
          FRIENDS!
        </Typography>
      </Typography>
    </Box>
    {localStorage.getItem("token") == null ?
    <Button style={{maxWidth: '200px', width: '200px', color: 'black', backgroundColor: 'white', border: '2px solid black'}} onClick={() => window.location.href = '/login'}>Log In Now!</Button>
    : <></>}
    </div>
  );
}

export default Home;