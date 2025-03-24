import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  // Function to set userId
  const login = (id) => {
    console.log('Setting userId:', id);
    setUserId(id);
  };

  return (
    <UserContext.Provider value={{ userId, login }}>
      {children}
    </UserContext.Provider>
  );
};

// Named export of the useUser hook
export const useUser = () => {
  return useContext(UserContext);
};
