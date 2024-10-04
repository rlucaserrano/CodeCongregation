// Header.jsx - Navigation bar for the application

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
}

export default Header;
