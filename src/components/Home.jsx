import React, { useState, useEffect } from "react";
import GetMovies from "./GetMovies";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from './Navbar'
import { useLocation } from "react-router-dom";
import Check from './Check'
const Home = () => {
  const location = useLocation();
  let user = null;
  if (location.state){
    user = location.state.user;
  }
  console.log('HOME : ', user);
  return (
    <>
      {!user && <Check />}
      {user && <Navbar user={user}/>}
      {user && <GetMovies user={user}/>}
    </>
  );
};

export default Home;
