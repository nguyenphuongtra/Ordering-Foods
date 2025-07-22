import React, { createContext, useState, useEffect } from 'react';
import { apiService } from '../service/apiService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          const { data } = await apiService.getProfile();
          setUser(data);
        } catch (error) {
          console.error("Token không hợp lệ:", error);
          logout();
        }
      }
      setLoading(false);
    };
    validateToken();
  }, [token]);

  const login = async (newToken, userData = null) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);

    if (userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      try {
        const { data } = await apiService.getProfile();
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      } catch (err) {
        logout();
        throw err;
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
