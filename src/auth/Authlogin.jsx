import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Home from "../components/Home";
const Authlogin = () => {
    const navigate = useNavigate();
    const {user} = useAuth0();
    const [logged, setLogged] = useState(false);
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
                setLogged(true);
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
        <>
            {logged && navigate('/', {state : {user : user}})};
        </>
    )
}

export default Authlogin;