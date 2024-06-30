import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Search from "./Search";

const Navbar = ({ user }) => {
  console.log("NAVVVBAAR", user);
  const navigate = useNavigate();
  const [navigatePath, setNavigatePath] = useState(null);
  const profileUrl = user ? "/user/profile" : "/login";

  useEffect(() => {
    if (navigatePath) {
      navigate(navigatePath, { state: { user: user } });
      setNavigatePath(null); // Reset the navigation path after navigation
    }
  }, [navigatePath, navigate, user]);

  return (
    <div className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-8">
          <span
            className="cursor-pointer text-xl font-bold"
            onClick={() => setNavigatePath('/')}
          >
            <span className="text-white">Next</span>
            <span className="text-red-500">Watch</span>
          </span>
          <span
            className="text-white hover:text-gray-300 cursor-pointer"
            onClick={() => setNavigatePath('/letmeguess')}
          >
            LetMeGuess?
          </span>
          <span
            className="text-white hover:text-gray-300 cursor-pointer"
            onClick={() => setNavigatePath('/recommendmovies')}
          >
            Recommend
          </span>
          <span
            className="text-white hover:text-gray-300 cursor-pointer"
            onClick={() => setNavigatePath(profileUrl)}
          >
            Profile
          </span>
        </div>
        <Search user={user} />
      </div>
    </div>
  );
};

export default Navbar;
