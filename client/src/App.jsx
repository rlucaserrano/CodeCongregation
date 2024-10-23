// App.jsx - Main application component with routing

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './pages/Home';
import Calendar from './pages/Calendar'; 
<<<<<<< HEAD
import Social from './pages/Social'; 
import Tutorial from './pages/Tutorial';
import Login from './pages/Login'; 
import Account from './pages/Account'; 
=======
import Messages from './pages/Messages'; 
import Login from './pages/Login';
import Account from './pages/Account'
import Resources from './pages/Resources'
import Create from './pages/NewAccount';
import Groups from './pages/Groups'
>>>>>>> 9b1143f5c09ac00b1c44227f2cb84a060ed544b2
import Header from './components/Header';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';

function App() {
<<<<<<< HEAD
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
                    <Route path="/account" element={<Account />} /> {/* Account page */}
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
=======
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <Header />
        <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/create" element={<Create/>} />
          <Route path="/groups" element={<Groups/>} />
        </Routes>
        </ThemeProvider>
      </Router>
    </GoogleOAuthProvider>
  );
>>>>>>> 9b1143f5c09ac00b1c44227f2cb84a060ed544b2
}

export default App;
