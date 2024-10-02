import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './pages/Home';
import About from './pages/About';
import Tst from './pages/Tst'; 
import Calendar from './pages/Calendar'; 
import Social from './pages/Social'; 
import Tutorial from './pages/Tutorial'; 
import Login from './pages/Login'; 
import Header from './components/Header';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tst" element={<Tst />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/social" element={<Social />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
