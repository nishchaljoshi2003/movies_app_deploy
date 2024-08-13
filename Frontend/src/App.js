import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/signup';
import Signin from './components/Signin';
import Navbar from './components/navbar';
import Banners from './components/banners';
import Cards from './components/cards';
import Homepage from './components/homepage';
import Favorites from './components/favorites';
import Profile from './components/Profile';


const App = () => {
  return (
    <Router>
       <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/signin" element={<Signin/>} />
          <Route path="/favorites" element={<Favorites/>} />
          <Route path="/profile" element={<Profile/>} />
       </Routes>
    </Router>
  );
};

export default App;
