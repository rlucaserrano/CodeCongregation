import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Optional: Add styling if needed

function Header() {
  return (
    <nav>
      <ul className="left-nav">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/tst">Tst</Link></li>
        <li><Link to="/calendar">Calendar</Link></li>
        <li><Link to="/social">Social</Link></li>
        <li><Link to="/tutorial">Tutorial</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li> {/* Dashboard link added */}
      </ul>
      <ul className="right-nav"> {/* Right-aligned login link */}
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}

export default Header;
