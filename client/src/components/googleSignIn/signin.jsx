// test file for firebase signin 
import React, { useState, useEffect } from "react";
import { auth, provider } from "./config";
import { signInWithPopup } from "firebase/auth";
import Homee from "./Home";

function SignIn() {
    const [value, setValue] = useState('');

   
    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const token = result.user.accessToken;
            const email = result.user.email;
    
        
            localStorage.setItem("token", token);
            localStorage.setItem("email", email);
    
           
            const response = await fetch('http://localhost:8080/check_profile', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                method: 'POST',
                body: JSON.stringify({ email })
            });
    
            const data = await response.json();
            if (data.status === 'incomplete') {
              
                window.location.href = '/complete-profile';
            } else {
              
                window.location.href = '/account';
            }
        } catch (error) {
            setFormError('Google login failed. Please try again.');
            console.error("Google Sign-In error:", error);
        }
    };

    const handleSignOut = () => {
        setValue('');
        localStorage.removeItem("email");
    };

    useEffect(() => {
        setValue(localStorage.getItem('email') || '');
    }, []);

    return (
        <div>
            {value ? (
                <div>
                    <Homee />
                    <button onClick={handleSignOut}>Sign Out</button>
                </div>
            ) : (
                <button onClick={handleGoogleSignIn}>Sign-in with Google</button>
            )}
        </div>
    );
}

 export default SignIn;