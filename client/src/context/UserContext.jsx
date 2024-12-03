

import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ userId: null });

  useEffect(() => {
 
    const storedUser = localStorage.getItem("user");
    const userId = localStorage.getItem("userId");

    if (userId) {

      setUser({ userId });
      console.log("Non-Google User ID set in context:", userId); 
    } else if (storedUser) {
      
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.id) {
          setUser({ userId: parsedUser.id });
          localStorage.setItem("userId", parsedUser.id); 
          console.log("Google User ID set in context:", parsedUser.id); 
        } else {
          console.error("User object found in localStorage but no ID exists.");
        }
      } catch (error) {
        console.error("Failed to parse user object from localStorage:", error);
      }
    } else {
      console.error("No user or userId found in localStorage");
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
