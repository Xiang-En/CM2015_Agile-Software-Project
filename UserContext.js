////////////////////Cuong////////////////////////////////
import React, { createContext, useState } from 'react';

// Create a Context for the user data
export const UserContext = createContext();

// Create a Provider component
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [isBusinessAccount, setIsBusinessAccount] = useState(null);

  return (
    <UserContext.Provider value={{ userId, setUserId ,isBusinessAccount,setIsBusinessAccount}}>
      {children}
    </UserContext.Provider>
  );
};