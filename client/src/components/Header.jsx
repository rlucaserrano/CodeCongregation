// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { Avatar } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { deepOrange, teal } from '@mui/material/colors';

function Header() {

  const handleGroups = () =>
  {
    window.location.href = '/groups'
  }

  const handleAccount = () =>
  {
    window.location.href = '/account'
  }

  const handleLogin = () =>
  {
    window.location.href = '/login'
  }

  return (
    <nav>
      <div className="nav-container">
        <div className="nav-left">
          <h1 className="logo">
            <Link to="/">CoderCongregation</Link>
          </h1>
          <ul>
            {(localStorage.getItem("token") == null && localStorage.getItem("groupID") == null) ||
            (localStorage.getItem("token") != null && localStorage.getItem("groupID") != null) ?
            <li><Link to="/resources">Resources</Link></li>: 
            <li style={{display: 'flex'}}>Resources <LockIcon/></li> /*Locked only if logged in and no group.*/}
            {localStorage.getItem("token") == null || localStorage.getItem("groupID") == null ?
            <li style={{display: 'flex'}}>Messages <LockIcon/></li> : 
            <li><Link to="/messages">Messages</Link></li> /*Locked if not logged in AND no group.*/}
            {localStorage.getItem("token") == null || localStorage.getItem("groupID") == null ?
            <li style={{display: 'flex'}}>Calendar <LockIcon/></li> : 
            <li><Link to="/calendar">Calendar</Link></li> /*Locked if not logged in AND no group.*/}
          </ul>
        </div>
        <div className="nav-right">
          {localStorage.getItem("token") == null
            ?<></>:
            <Avatar 
            src="/path-to-group-picture.jpg" 
            alt={localStorage.getItem("groupName")} //Display (first) group initial on the Group button
            onClick={handleGroups}
            sx={{ width: 30, height: 30, bgcolor: deepOrange[500] }}
            />
          }
          {localStorage.getItem("token") == null ?
            <li style={{listStyle: 'none'}} onClick={handleLogin}>Login</li>:
            <Avatar 
            src="/path-to-profile-picture.jpg" 
            alt={localStorage.getItem("userFirst")} //Display (first) user initial on the Account button
            onClick={handleAccount}
            sx={{ width: 30, height: 30, bgcolor: teal[500] }} /* smaller avatar */
            />
          }
        </div>
      </div>
    </nav>
  );
}

export default Header;
