import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase.js';
import { authAPI } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setToken(session.access_token);
        setUser(session.user);
        localStorage.setItem('acet_admin_token', session.access_token);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setToken(session.access_token);
        setUser(session.user);
        localStorage.setItem('acet_admin_token', session.access_token);
      } else {
        setToken(null);
        setUser(null);
        localStorage.removeItem('acet_admin_token');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const googleLogin = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/admin'
        }
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Google Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, googleLogin, logout }}>
      (!loading) && children
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);