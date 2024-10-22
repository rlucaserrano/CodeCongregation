import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Optional: Add styling if needed
import { Button } from '@mui/material';

function Header() {
  return (
    <nav>
        <Button variant='contained' component = {Link} to={"/"}>Home</Button> {/*Only has splash screen, so no button to lead back to it should exist in the final version (will link back after selecting a group or logging out)*/}
        <Button variant='contained' component = {Link} to={"/resources"}>Resources (TBD)</Button> {/*Always available, resources listed will be handled within the page itself*/}
        <Button variant='contained' component = {Link} to={"/messages"}>Messages</Button> {/*Should only be available once logged in AND group has been selected*/}
        <Button variant='contained' component = {Link} to={"/calendar"}>Calendar</Button> {/*Should only be available once logged in, personal and group calendars should be displayed as appropriate*/}
        <Button variant='contained' component = {Link} to={"/account"}>Account</Button> {/*Should only be available once logged in*/}
        <Button variant='contained' component = {Link} to={"/login"}>Login</Button> {/*Should only be available while not logged in*/}
        <Button variant='contained' color='error' component = {Link} to={"/groups"}>Groups</Button> {/*Should only be available once logged in (auto navigate there first once logged in)*/}
    </nav>
  );
}

export default Header;