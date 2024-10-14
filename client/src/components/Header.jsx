import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Optional: Add styling if needed
import { Button } from '@mui/material';

function Header() {
  return (
    <nav>
        <Button variant='contained' component = {Link} to={"/"}>Home</Button>
        <Button variant='contained' component = {Link} to={"/tst"}>Test</Button>
        <Button variant='contained' component = {Link} to={"/resources"}>Resources</Button>
        <Button variant='contained' component = {Link} to={"/social"}>Social</Button>
        <Button variant='contained' component = {Link} to={"/calendar"}>Calendar</Button>
        <Button variant='contained' component = {Link} to={"/account"}>Account</Button>
        <Button variant='contained' component = {Link} to={"/login"}>Login</Button>
    </nav>
  );
}

export default Header;