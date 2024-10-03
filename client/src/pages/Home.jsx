import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import '../App.css';

function Home() {
  return (
    <Box component="section" sx={{p: 2, border: "2px solid blue", width: '45%', backgroundColor: 'cyan'}} margin='auto'>
      <h1>Welcome to CoderCongregation!</h1>
      <h2>CoderCongregation is the Virtual Study Group Environment that allows you to study and practice programming skills with friends!</h2>
    </Box>
  );
}

export default Home;