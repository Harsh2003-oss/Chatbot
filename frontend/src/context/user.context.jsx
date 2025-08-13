import React, { createContext, useContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('user');
      setIsAuthenticated(false);
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (newData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...newData
    }));
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout,
      updateUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

