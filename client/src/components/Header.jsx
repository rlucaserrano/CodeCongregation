// src/components/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { Avatar, Menu, MenuItem } from '@mui/material';

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav>
      <div className="nav-container">
        <div className="nav-left">
          <h1 className="logo">
            <Link to="/">CoderCongregation</Link>
          </h1>
          <ul>
            <li><Link to="/resources">Resources</Link></li>
            <li><Link to="/messages">Messages</Link></li>
            <li><Link to="/calendar">Calendar</Link></li>
            <li><Link to="/groups">Groups</Link></li>
          </ul>
        </div>
        <div className="nav-right">
          <Avatar 
            src="/path-to-profile-picture.jpg" 
            alt="User Profile"
            onClick={handleMenuClick}
            sx={{ width: 30, height: 30 }} /* smaller avatar */
          />
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleMenuClose}>
              <Link to="/account">Account</Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Link to="/login">Login</Link>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </nav>
  );
}

export default Header;
