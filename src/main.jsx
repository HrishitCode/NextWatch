import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react'
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Auth0Provider
        domain="dev-58sfvybftbuxma56.us.auth0.com"
        clientId="JReTOzafMs81N62KvktD42Ixb0wi5XwA"
        authorizationParams={{
        redirect_uri: 'http://localhost:5173/auth/login'
        }}
    >
        <App />
    </Auth0Provider>
  </BrowserRouter>
    
)
