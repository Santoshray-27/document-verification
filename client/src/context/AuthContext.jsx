import React, { createContext, useState, useEffect, useCallback } from 'react';
import { client } from '../api/client';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await client('/api/auth/me');
      setUser(res.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    const res = await client('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    if (res.user) {
      setUser(res.user);
      return res;
    }
    throw new Error('Login failed');
  };

  const logout = async () => {
    try {
      await client('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
