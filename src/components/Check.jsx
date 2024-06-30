import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

const Checking = () => {
    const {loginWithRedirect} = useAuth0();
    loginWithRedirect()
    return (
        <></>
    )
}

export default Checking;