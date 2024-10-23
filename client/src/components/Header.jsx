// Header.jsx - Navigation bar for the application

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import './Header.css';

function Header() {
    const [profilePic, setProfilePic] = useState(null);

    useEffect(() => {
        const pic = localStorage.getItem('profile_picture');
        if (pic) {
            setProfilePic(pic);
        }
    }, []);

    return (
        <nav>
            <ul className="left-nav">
                <li><Link to="/tutorial">Tutorial</Link></li>
                <li><Link to="/social">Social</Link></li>
                <li><Link to="/calendar">Calendar</Link></li>
                <li><Link to="/account">Account</Link></li>
            </ul>
            <ul className="right-nav">
                <li><Link to="/about">About</Link></li>
                <li><Link to="/tst">Test</Link></li>
                <li>
                    <Link to="/login">
                        {profilePic ? (
                            <img src={profilePic} alt="Profile" className="profile-icon" />
                        ) : (
                            <span className="login-icon">Login</span>
                        )}
                    </Link>
                </li>
            </ul>
        </nav>
    );
=======
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
>>>>>>> 9b1143f5c09ac00b1c44227f2cb84a060ed544b2
}

export default Header;
