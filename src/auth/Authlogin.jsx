import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const Authlogin = () => {
    const navigate = useNavigate();
    const {user} = useAuth0();
    useEffect(() => {
        console.log(user);
        async function sendData(data)
        {
            try{
                const response = await fetch('http://localhost:3001/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                if (!response.ok){
                    throw new Error('Network Response was not ok');
                }
                navigate('/');
            }
            catch(error)
            {
                console.log('Error sending data', error);
            }
        }
        if (user)
        {
            sendData(user);
        }
        else   
            console.log("waiting");
    },[user])
    return(
        <h1>Aa rha hai balak</h1>
    )
}

export default Authlogin;