import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  // Example function to set userId, replace with real authentication logic
  const login = (id) => {
    console.log('Setting userId:', id); // Log the userId being set
    setUserId(id); // Save the logged-in user's ID
  };

  return (
    <UserContext.Provider value={{ userId, login }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
