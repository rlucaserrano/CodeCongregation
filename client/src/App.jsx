import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './pages/Home';
import Tst from './pages/Tst'; 
import Calendar from './pages/Calendar'; 
import Social from './pages/Social'; 
import Login from './pages/Login';
import Account from './pages/Account'
import Resources from './pages/Resources'
import Create from './pages/NewAccount';
import Header from './components/Header';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <Header />
        <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tst" element={<Tst />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/social" element={<Social />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/create" element={<Create/>} />
        </Routes>
        </ThemeProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
