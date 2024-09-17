import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Tst from './pages/Tst'; 
import Calendar from './pages/Calendar'; 
import Social from './pages/Social'; 
import Tutorial from './pages/Tutorial'; 
import Login from './pages/Login'; 
import Header from './components/Header';

function App() {
  return (
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
      </Routes>
    </Router>
  );
}

export default App;
