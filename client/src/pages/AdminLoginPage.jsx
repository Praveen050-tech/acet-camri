import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ShieldCheck, ArrowRight, Box } from 'lucide-react';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
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
          <span>{loading ? 'Authenticating...' : 'Sign In to Control Center ➔'}</span>
        </button>
      </form>

    </div>
  );
};
