import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../api/client';
import { User, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: formData.name
      };

      if (formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }

      const response = await authAPI.updateProfile(payload);
      
      if (response.data.success) {
        setSuccessMsg(response.data.message);
        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        setErrorMsg(response.data.message);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          <div className="bg-[#00714C] p-6 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <User size={32} />
            </div>
            <h1 className="font-['Cinzel'] text-2xl font-bold">Admin Profile</h1>
            <p className="text-sm text-green-100 mt-1">{user?.email}</p>
          </div>

          <div className="p-6 sm:p-8">
            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-xl flex items-start gap-3 border border-green-200">
                <CheckCircle2 className="shrink-0 mt-0.5" size={18} />
                <span className="text-sm font-medium">{successMsg}</span>
              </div>
            )}
            
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-xl flex items-start gap-3 border border-red-200">
                <AlertCircle className="shrink-0 mt-0.5" size={18} />
                <span className="text-sm font-medium">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Personal Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-11 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00714C]/20 focus:border-[#00714C] transition-colors outline-none"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full h-11 px-4 border border-gray-200 bg-gray-50 text-gray-500 rounded-xl outline-none cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email address cannot be changed.</p>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <Shield size={18} className="text-[#00714C]" />
                  Change Password
                </h2>
                <p className="text-sm text-gray-500 pb-2">Leave blank if you don't want to change your password.</p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full h-11 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00714C]/20 focus:border-[#00714C] transition-colors outline-none"
                    placeholder="Enter current password"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full h-11 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00714C]/20 focus:border-[#00714C] transition-colors outline-none"
                      placeholder="New password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full h-11 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00714C]/20 focus:border-[#00714C] transition-colors outline-none"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors"
                >
                  Back to Dashboard
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-12 bg-[#00714C] hover:bg-[#005a3c] text-white font-bold rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
