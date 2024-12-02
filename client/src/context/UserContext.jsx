// import React, { createContext, useState, useEffect } from "react";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState({ userId: null });

//   useEffect(() => {
//     const userId = localStorage.getItem("userId");
//     if (userId) {
//       setUser({ userId }); // set userId from localStorage
//     } else {
//       console.error("User ID not found in localStorage");
//     }
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ userId: null });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setUser({ userId });
      console.log("User ID set in context:", userId); // Debugging log
    } else {
      console.error("User ID not found in localStorage");
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
