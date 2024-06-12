import React, { useState, useEffect } from "react";
import GetMovies from "./GetMovies";
import { useAuth0 } from "@auth0/auth0-react";

const Home = () => {
  const {user} = useAuth0();
  console.log('HOME : ', user);
  return (
    <GetMovies user={user}/>
  );
};

export default Home;
