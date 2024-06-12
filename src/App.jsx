import { useState } from 'react'
import { Auth0Provider } from '@auth0/auth0-react' 
import {Route, Routes, Navigate } from "react-router-dom";


import './index.css'
import './App.css'
import Home from './components/Home'
import Check from './components/Check'
import Authlogin from './auth/Authlogin'
import Profile from './components/Profile';
import UserWishlist from './components/UserWishList';
import Userlist from './components/Lists'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Check />} />  {/*temporary*/}
        <Route path="/auth/login" element={<Authlogin />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/user/Wishlist" element={<UserWishlist />} />
        <Route path="/user/List" element={<Userlist />} />
      </Routes>
    </>
  )
}

export default App
