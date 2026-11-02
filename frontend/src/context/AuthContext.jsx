import React, { createContext, useContext, useState, useEffect } from 'react';
import { shopApi } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children, showToast }) {
  const [token, setToken] = useState(() => localStorage.getItem('sasti_admin_token') || null);
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem('sasti_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      shopApi.getMe()
        .then(res => {
          setAdminUser(res.data.admin);
          localStorage.setItem('sasti_admin_user', JSON.stringify(res.data.admin));
        })
        .catch(err => {
          console.warn('Session expired or invalid token:', err.message);
          logout();
        });
    }
  }, [token]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await shopApi.login(username, password);
      const { token: newToken, admin } = res.data;

      setToken(newToken);
      setAdminUser(admin);
      localStorage.setItem('sasti_admin_token', newToken);
      localStorage.setItem('sasti_admin_user', JSON.stringify(admin));

      if (showToast) showToast(`Welcome back, ${admin.username}!`, 'success');
      return { success: true };
    } catch (err) {
      const msg = err.message || 'Login failed. Please check credentials.';
      if (showToast) showToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem('sasti_admin_token');
    localStorage.removeItem('sasti_admin_user');
    if (showToast) showToast('Logged out of admin console.', 'info');
  };

  return (
    <AuthContext.Provider value={{
      token,
      adminUser,
      isAuthenticated: Boolean(token),
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
