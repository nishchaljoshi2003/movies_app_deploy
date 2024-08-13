import React, { useState } from 'react'
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faClapperboard } from '@fortawesome/free-solid-svg-icons';
import logo from './logo.svg'
import { useNavigate } from "react-router-dom"



function Navbar() {
  const token = localStorage.getItem('token');

  // console.log(token);
  const navigate = useNavigate();
  const handleClick=(path)=>{
    navigate(path);
  }
  return (
    <div className='dom'>
      <div className='navbar'>
        <div className='menu'>
          <FontAwesomeIcon icon={faBars} className='fa-2xl'/>
          <ul className="dropdown">
            <li className="dropdown-item">
              Genres
              <ul className="submenu">
                <li>Subitem 1-1</li>
                <li>Subitem 1-2</li>
                <li>Subitem 1-3</li>
                <li>Subitem 1-4</li>
                <li>Subitem 1-5</li>
              </ul>
            </li>
            <li className="dropdown-item" onClick={()=>handleClick('/favorites')}>
              Favorites
            </li>
            <li className="dropdown-item" onClick={()=>handleClick(token?'/profile':'/signin')}>
              My Profile
            </li>
          </ul>
        </div>
        
        <FontAwesomeIcon icon={faClapperboard} className='fa-2xl logo' onClick={()=>{
          handleClick('/');
        }}></FontAwesomeIcon>
        <h1 className='heading'>M</h1><div className='head'>ovies App</div>
        <div className='wrapper'>
          <div className="container">
            <input type="text" placeholder="Search..." className='input1'/>
            <div className="search"></div>
          </div>
        </div>
        <div className='favorites' title='favorites'><FontAwesomeIcon icon={faStar} className='fa-2xl' onClick={()=>handleClick(token?'/favorites':'/signin')}/></div>
        <div className='profile' title='My Profile'><FontAwesomeIcon icon={faUser} className='fa-2xl' onClick={()=>{
          handleClick(token?'/profile':'/signin')
        }}/></div>
      </div>
    </div>
    
  )
}

export default Navbar
