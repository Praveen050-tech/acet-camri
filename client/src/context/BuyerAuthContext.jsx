import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';

const BuyerAuthContext = createContext();

export const BuyerAuthProvider = ({ children }) => {
  const [buyer, setBuyer] = useState(null);
  const [buyerToken, setBuyerToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingCartAction, setPendingCartAction] = useState(null);

  const isBuyerLoggedIn = !!buyerToken;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setBuyerToken(session.access_token);
        setBuyer(session.user);
        localStorage.setItem('acet_buyer_token', session.access_token);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setBuyerToken(session.access_token);
        setBuyer(session.user);
        localStorage.setItem('acet_buyer_token', session.access_token);
      } else {
        setBuyerToken(null);
        setBuyer(null);
        localStorage.removeItem('acet_buyer_token');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle OAuth redirect after Google sign‑in
  useEffect(() => {
    const url = window.location.href;
    if (url.includes('code=')) {
      supabase.auth.exchangeCodeForSession(url).then(({ data: { session }, error }) => {
        if (error) {
          console.error('OAuth exchange error:', error);
          return;
        }
        if (session) {
          setBuyerToken(session.access_token);
          setBuyer(session.user);
          localStorage.setItem('acet_buyer_token', session.access_token);
          // Clean the URL to remove auth query params
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      });
    }
  }, []);

  const executePendingAction = async () => {
    if (pendingCartAction) {
      await pendingCartAction();
      setPendingCartAction(null);
    }
  };

  const buyerGoogleLogin = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      await executePendingAction();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Google Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Helper to store / upsert buyer credentials in the "buyers" table
  const storeBuyerInfo = async (buyerObj) => {
    if (!buyerObj) return;
    try {
      const payload = {
        id: buyerObj.id,
        email: buyerObj.email,
        full_name: buyerObj.user_metadata?.full_name || buyerObj.email,
        provider: buyerObj.app_metadata?.provider || 'email'
      };
      const { error } = await supabase.from('buyers').upsert(payload, { onConflict: 'id' });
      if (error) throw error;
    } catch (e) {
      console.error('Failed to store buyer info:', e);
    }
  };

  // Persist buyer info whenever the buyer object is set/updated
  React.useEffect(() => {
    if (buyer) {
      storeBuyerInfo(buyer);
    }
  }, [buyer]);

  const buyerLogin = async (email, password) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      await executePendingAction();
      // buyer will be set via auth state change; storeBuyerInfo will run then
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const buyerRegister = async (userData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.name,
            phone: userData.phone
          }
        }
      });
      if (error) throw error;
      await executePendingAction();
      // Store buyer info (data.user will be available if sign‑up succeeds)
      if (data?.user) {
        storeBuyerInfo(data.user);
      }
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const buyerLogout = async () => {
    await supabase.auth.signOut();
  };

  const requireAuth = useCallback((action) => {
    if (isBuyerLoggedIn) {
      action();
    } else {
      setPendingCartAction(() => action);
      setIsAuthModalOpen(true);
    }
  }, [isBuyerLoggedIn]);

  return (
    <BuyerAuthContext.Provider value={{
      buyer,
      buyerToken,
      isBuyerLoggedIn,
      loading,
      buyerLogin,
      buyerRegister,
      buyerGoogleLogin,
      buyerLogout,
      isAuthModalOpen,
      setIsAuthModalOpen,
      requireAuth
    }}>
      {!loading && children}
    </BuyerAuthContext.Provider>
  );
};

export const useBuyerAuth = () => useContext(BuyerAuthContext);
