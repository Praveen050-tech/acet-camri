import React, { useState, useEffect } from 'react';
import { paymentAPI } from '../../api/client';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AdminPaymentSettingsTab = () => {
  const [settings, setSettings] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    isActive: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await paymentAPI.getSettings();
      if (res.data.success) {
        setSettings(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await paymentAPI.updateSettings(settings);
      if (res.data.success) {
        setMessage('Settings saved successfully!');
        setSettings(res.data.data);
      } else {
        setMessage(res.data.message || 'Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Payment Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Configure Bank & UPI details for manual payments</p>
        </div>
      </div>
      
      <form onSubmit={handleSave} className="p-6 space-y-6">
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.includes('success') ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <p className="font-medium">{message}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
            <input 
              type="text" 
              required
              value={settings.accountHolderName}
              onChange={e => setSettings({...settings, accountHolderName: e.target.value})}
              className="w-full border-gray-300 rounded-lg px-4 py-2 border focus:ring-[#00714C] focus:border-[#00714C] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <input 
              type="text" 
              required
              value={settings.bankName}
              onChange={e => setSettings({...settings, bankName: e.target.value})}
              className="w-full border-gray-300 rounded-lg px-4 py-2 border focus:ring-[#00714C] focus:border-[#00714C] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <input 
              type="text" 
              required
              value={settings.accountNumber}
              onChange={e => setSettings({...settings, accountNumber: e.target.value})}
              className="w-full border-gray-300 rounded-lg px-4 py-2 border focus:ring-[#00714C] focus:border-[#00714C] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
            <input 
              type="text" 
              required
              value={settings.ifscCode}
              onChange={e => setSettings({...settings, ifscCode: e.target.value})}
              className="w-full border-gray-300 rounded-lg px-4 py-2 border focus:ring-[#00714C] focus:border-[#00714C] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
            <input 
              type="text" 
              required
              value={settings.upiId}
              onChange={e => setSettings({...settings, upiId: e.target.value})}
              className="w-full border-gray-300 rounded-lg px-4 py-2 border focus:ring-[#00714C] focus:border-[#00714C] outline-none"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox"
                checked={settings.isActive}
                onChange={e => setSettings({...settings, isActive: e.target.checked})}
                className="w-5 h-5 text-[#00714C] rounded border-gray-300 focus:ring-[#00714C]"
              />
              <span className="text-sm font-medium text-gray-700">Enable Manual Payments</span>
            </label>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-[#00714C] text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-[#005a3c] disabled:opacity-70"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
