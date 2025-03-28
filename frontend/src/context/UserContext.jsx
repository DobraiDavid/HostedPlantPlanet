import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initialize user state from localStorage or null
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Function to log in the user and set the user object
  const login = (userData) => {
    setUser(userData);
    // Save user data to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Function to log out the user
  const logout = () => {
    setUser(null);
    // Remove user data from localStorage
    localStorage.removeItem('user');
  };

  // Optional: Sync localStorage with user state
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        if (e.newValue) {
          setUser(JSON.parse(e.newValue));
        } else {
          setUser(null);
        }
      }
    };

    // Listen for storage changes across tabs
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access user context
export const useUser = () => {
  return useContext(UserContext);
};