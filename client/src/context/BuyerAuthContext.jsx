import React, { createContext, useContext, useState, useCallback } from 'react';
import { buyerAuthAPI } from '../api/client';

const BuyerAuthContext = createContext();

export const BuyerAuthProvider = ({ children }) => {
  const [buyer, setBuyer] = useState(() => {
    try {
      const saved = localStorage.getItem('acet_buyer_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [buyerToken, setBuyerToken] = useState(() => localStorage.getItem('acet_buyer_token') || null);
  const [loading, setLoading] = useState(false);

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingCartAction, setPendingCartAction] = useState(null);

  const isBuyerLoggedIn = !!buyerToken;

  const buyerLogin = async (email, password) => {
    setLoading(true);
    try {
      const res = await buyerAuthAPI.login({ email, password });
      if (res.data.success) {
        const userData = res.data.data;
        setBuyer(userData);
        setBuyerToken(userData.token);
        localStorage.setItem('acet_buyer_token', userData.token);
        localStorage.setItem('acet_buyer_user', JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, message: 'Login failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    } finally {
      setLoading(false);
    }
  };

  const buyerRegister = async (name, email, phone, password, requestedRole = 'external') => {
    setLoading(true);
    try {
      const res = await buyerAuthAPI.register({ name, email, phone, password, requestedRole });
      if (res.data.success) {
        const userData = res.data.data;
        setBuyer(userData);
        setBuyerToken(userData.token);
        localStorage.setItem('acet_buyer_token', userData.token);
        localStorage.setItem('acet_buyer_user', JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  const buyerLogout = () => {
    setBuyer(null);
    setBuyerToken(null);
    localStorage.removeItem('acet_buyer_token');
    localStorage.removeItem('acet_buyer_user');
  };

  // Open the auth modal, optionally with a pending action to execute after login
  const requireAuth = useCallback((pendingAction = null) => {
    if (isBuyerLoggedIn) return false; // already logged in, no action needed
    setPendingCartAction(() => pendingAction);
    setIsAuthModalOpen(true);
    return true; // signal that auth is required
  }, [isBuyerLoggedIn]);

  // Called after successful login/register — execute any pending action
  const onAuthSuccess = useCallback(() => {
    setIsAuthModalOpen(false);
    if (pendingCartAction) {
      pendingCartAction();
      setPendingCartAction(null);
    }
  }, [pendingCartAction]);

  return (
    <BuyerAuthContext.Provider value={{
      buyer,
      buyerToken,
      isBuyerLoggedIn,
      loading,
      buyerLogin,
      buyerRegister,
      buyerLogout,
      isAuthModalOpen,
      setIsAuthModalOpen,
      requireAuth,
      onAuthSuccess,
      pendingCartAction,
      setPendingCartAction
    }}>
      {children}
    </BuyerAuthContext.Provider>
  );
};

export const useBuyerAuth = () => useContext(BuyerAuthContext);
