import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { toast } from 'react-toastify';
import BASE from '../apis';
const GoogleAuth = () => {
 const clientId = "758980849951-vhtkhqho0u9575ga1e03dr72g8th00ej.apps.googleusercontent.com";
  return (
   <GoogleOAuthProvider clientId={clientId}>
     <GoogleLogin
       onSuccess={credentialResponse => {
         fetch(BASE+"/google-auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentialResponse),
            credentials: "include"
        })
        .then(response => response.json())
        .then((data) => {
          toast.success("Logged in")
          localStorage.setItem("User", data.user);
          localStorage.setItem("isLoggedIn", true);
          setTimeout(() => window.location.href = "/", 2000);
        }).catch(toast.error("Error Logging in"))
       }}
       onError={() => {
         toast.error("Login Failed");
       }}
     />
   </GoogleOAuthProvider>
   );
 };
export default GoogleAuth;