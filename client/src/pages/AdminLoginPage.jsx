import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';




import { Lock, ShieldCheck, ArrowRight, Box } from 'lucide-react';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login, googleLogin, loading } = useAuth();

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      const res = await googleLogin();
      if (!res.success) {
        setError(res.message);
      }
      return res;
    } catch (err) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email. Please sign in with your password, or contact support.');
      } else {
        setError('Google sign-in failed. Please try again.');
      }
      return { success: false, message: err.message };
    }
  };

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.message || 'Login failed. Verify credentials.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md space-y-6 bg-white font-['Public_Sans']">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#eef9f3] text-[#00714C] flex items-center justify-center mx-auto shadow-xs">
          <ShieldCheck size={24} />
        </div>
        <span className="bg-[#00714C]/10 text-[#00714C] border border-[#00714C]/30 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider font-['Readex_Pro']">
          STAFF & LAB LEAD PORTAL
        </span>
        <h1 className="font-['Readex_Pro'] text-2xl font-extrabold text-gray-900">
          Club Lead Admin Login
        </h1>
        <p className="text-xs text-gray-600">
          Sign in to manage active print farm beds, approve student CAD requests, and review incoming orders.
        </p>
      </div>

      <form onSubmit={handleLogin} className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1 font-['Readex_Pro']">Club Admin Email</label>
          <input 
            type="email" 
            required
            placeholder="admin@acetcbe.edu.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-[#00714C]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1 font-['Readex_Pro']">Security Password</label>
          <input 
            type="password" 
            required
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-[#00714C]"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#00714C] hover:bg-[#005a3c] text-white font-['Readex_Pro'] font-bold py-3.5 rounded-xl shadow-xs hover:shadow-md text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Lock size={14} />
          <span>{loading ? 'Authenticating...' : 'Sign In to Control Center '}</span>
        </button>

            <div className="relative my-4">
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
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-xl shadow-sm transition-all text-sm flex items-center justify-center gap-3"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Sign in with Google</span>
            </button>

      </form>

    </div>
  );
};
