import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Calendar from './pages/Calendar'; 
import GoogleCalendar from './pages/GoogleCalendar';
import Messages from './pages/Messages'; 
import Login from './pages/Login';
import Account from './pages/Account';
import Resources from './pages/Resources';
import Create from './pages/NewAccount';
import CompleteProfile from './pages/CompleteProfile';
import Groups from './pages/Groups';
import Header from './components/Header';
import theme from './theme';
import Homee from './components/googleSignin/Home';
import Signin from './components/googleSignin/signin';
import { ThemeProvider } from '@mui/material/styles';

function App() {


  return (
      <Router>
        <Header />
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/googlecalendar" element={<GoogleCalendar />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/create" element={<Create />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/complete-profile" element={<CompleteProfile />} /> 
            <Route path="/Homee" element={<Homee />} />
            <Route path="/Signin" element={<Signin />} />
          </Routes>
        </ThemeProvider>
      </Router>
  );
}

export default App;
