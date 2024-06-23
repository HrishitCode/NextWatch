import React from "react";
import { Link } from "react-router-dom";
import Search from "./Search";

const Navbar = ({ user }) => {
    const nav = ['NextWatch', 'Top Rated', 'Recommend', 'Profile', <Search user={user}/>];
    let url = "";
    if (user){
        url = "profile";
    }else{
        url = "login"
    }
    return (
        <div className="grid grid-cols-5 space-x-1">
            {nav.map((navb, index) => ( 
                <div key={index}>
                    {index === 0 ? (
                        <Link to="/">
                            {navb}
                        </Link>
                    ) : index === 3 ? (
                        <Link to={`/${url}`}>
                            {navb}
                        </Link>
                    ) : (
                        navb
                    )}
                </div>
            ))}
        </div>
    );
};

export default Navbar;
