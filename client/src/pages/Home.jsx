import React from 'react';
import { Box, Typography } from '@mui/material';
import '../components/Home.css';

function Home() {
  return (
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
  );
}

export default Home;