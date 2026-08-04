import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, userApi } from '../api/endpoints';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('expense_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('expense_jwt_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      authApi.getCurrentUser()
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('expense_user', JSON.stringify(res.data));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { accessToken, user: userProfile } = res.data;
    localStorage.setItem('expense_jwt_token', accessToken);
    localStorage.setItem('expense_user', JSON.stringify(userProfile));
    setToken(accessToken);
    setUser(userProfile);
    return userProfile;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    const { accessToken, user: userProfile } = res.data;
    localStorage.setItem('expense_jwt_token', accessToken);
    localStorage.setItem('expense_user', JSON.stringify(userProfile));
    setToken(accessToken);
    setUser(userProfile);
    return userProfile;
  };

  const updateProfile = async (updatedData) => {
    const res = await userApi.updateProfile(updatedData);
    setUser(res.data);
    localStorage.setItem('expense_user', JSON.stringify(res.data));
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('expense_jwt_token');
    localStorage.removeItem('expense_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
