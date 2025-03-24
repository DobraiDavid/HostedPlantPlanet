import React, { createContext, useContext, useState, useEffect} from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Store user object
  const [user, setUser] = useState(null);

  // Function to log in the user and set the user object
  const login = (userData) => {
    setUser(userData); 
  };

  return (
    <UserContext.Provider value={{ user, login }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access user context
export const useUser = () => {
  return useContext(UserContext);
};
