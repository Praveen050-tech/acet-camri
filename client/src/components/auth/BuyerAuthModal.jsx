import React, { useState, useEffect } from 'react';
import { useBuyerAuth } from '../../context/BuyerAuthContext';




import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { X, LogIn, UserPlus, Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';

export const BuyerAuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    buyerLogin,
    buyerRegister,
    onAuthSuccess,
    buyerGoogleLogin,
    buyer,
    isBuyerLoggedIn
  } = useBuyerAuth();

  // Close modal automatically when buyer is logged in (including after Google OAuth)
  React.useEffect(() => {
    if (buyer && isBuyerLoggedIn) {
      resetFields();
      setIsAuthModalOpen(false);
    }
  }, [buyer, isBuyerLoggedIn]);
  
  const { login: adminLogin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const resetFields = () => {
    setLoginEmail('');
    setLoginPassword('');
    setRegName('');
    setRegEmail('');
    setRegPhone('');
    setRegPassword('');
    setError('');
    setShowPassword(false);
  };

  const handleClose = () => {
    setIsAuthModalOpen(false);
    resetFields();
  };

  
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try { const res = await buyerGoogleLogin(); if (!res.success) {
        setError(res.message);
      }
    } catch (err) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email. Please sign in with your password, or contact support to link your Google account.');
      } else {
        setError('Google sign-in failed. Please try again.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {

    e.preventDefault();
    setError('');
    
    // Unified Login: Check Admin first
    const adminResult = await adminLogin(loginEmail, loginPassword);
    if (adminResult.success) {
      resetFields();
      setIsAuthModalOpen(false);
      navigate('/admin');
      return;
    }
    
    // If not admin, check Buyer
    const buyerResult = await buyerLogin(loginEmail, loginPassword);
    if (buyerResult.success) {
      resetFields();
      onAuthSuccess();
    } else {
      setError('Invalid email or password.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    const result = await buyerRegister(regName, regEmail, regPhone, regPassword, 'buyer');
    if (result.success) {
      resetFields();
      onAuthSuccess();
    } else {
      setError(result.message);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#00714C] via-[#FFDA0F] to-[#00714C]" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="px-7 pt-6 pb-2 text-center">
          <div className="inline-flex items-center gap-2 bg-[#00714C]/10 text-[#00714C] text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-[#00714C] animate-pulse" />
            ACET CAMRI STORE ACCOUNT
          </div>
          <h2 className="font-['Cinzel'] text-xl font-bold text-gray-900">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {activeTab === 'login' 
              ? 'Sign in to add products to your cart and checkout.'
              : 'Join the ACET CAMRI community to start shopping.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="px-7 pt-3">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => switchTab('login')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-[#00714C] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <LogIn size={14} />
              Sign In
            </button>
            <button
              onClick={() => switchTab('register')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-[#00714C] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <UserPlus size={14} />
              Sign Up
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-7 mt-3 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3.5 py-2.5">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

{activeTab === 'login' && (
  <>
    {/* Google Sign-In button */}
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="mt-4 w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl shadow-sm transition-all text-sm flex items-center justify-center gap-3"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      <span>Sign in with Google</span>
    </button>

    <form onSubmit={handleLogin} className="px-7 pt-5 pb-7 space-y-4">
      {/* Email */}
      <div>
        <label className="text-xs font-bold text-gray-700 block mb-1.5">Email Address</label>
        <div className="relative">
          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            required
            autoFocus
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#00714C] focus:ring-1 focus:ring-[#00714C]/30 transition-all"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="text-xs font-bold text-gray-700 block mb-1.5">Password</label>
        <div className="relative">
          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-12 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#00714C] focus:ring-1 focus:ring-[#00714C]/30 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#00714C] hover:bg-[#005a3c] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <LogIn size={16} />
            <span>Sign In &amp; Continue</span>
          </>
        )}
      </button>

      <div className="relative mt-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <p className="text-center text-xs text-gray-500">
        Don't have an account?{' '}
        <button type="button" onClick={() => switchTab('register')} className="text-[#00714C] font-bold hover:underline">
          Sign up now
        </button>
      </p>
    </form>
  </>
)}

        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="px-7 pt-5 pb-7 space-y-3.5">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#00714C] focus:ring-1 focus:ring-[#00714C]/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#00714C] focus:ring-1 focus:ring-[#00714C]/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+91 98765 43210 (optional)"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#00714C] focus:ring-1 focus:ring-[#00714C]/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">Create Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-12 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#00714C] focus:ring-1 focus:ring-[#00714C]/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00714C] hover:bg-[#005a3c] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Create Account & Continue</span>
                </>
              )}
            </button>

            <div className="relative mt-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="mt-4 w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl shadow-sm transition-all text-sm flex items-center justify-center gap-3"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Sign in with Google</span>
            </button>

            <p className="text-center text-xs text-gray-500">
              Already have an account?{' '}
              <button type="button" onClick={() => switchTab('login')} className="text-[#00714C] font-bold hover:underline">
                Sign in
              </button>
            </p>
          </form>
        )}

      </div>
    </div>
  );
};
