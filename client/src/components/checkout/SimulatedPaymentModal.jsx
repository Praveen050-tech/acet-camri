import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export const SimulatedPaymentModal = ({ total, customerName, onSuccess, onFailure, onClose }) => {
  const [processing, setProcessing] = useState(false);

  const handleSimulate = (success) => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      if (success) {
        const fakePaymentId = `rzp_test_${Math.random().toString(36).substr(2, 9)}`;
        onSuccess(fakePaymentId);
      } else {
        onFailure();
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="bg-white rounded-2xl w-full max-w-sm shadow-2xl relative overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Razorpay-like Header */}
        <div className="bg-[#02042b] p-5 text-white flex justify-between items-start">
          <div>
            <div className="font-bold tracking-wider text-sm flex items-center gap-1.5 opacity-90 mb-1">
              <ShieldCheck size={16} />
              Razorpay Simulation
            </div>
            <div className="text-2xl font-bold text-white">₹{total.toLocaleString('en-IN')}</div>
            <div className="text-xs text-blue-200 mt-0.5">ACET CAMRI Store</div>
          </div>
          <button onClick={onClose} disabled={processing} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm text-gray-700">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              {customerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-gray-900">{customerName}</div>
              <div className="text-xs text-gray-500">Test Mode Checkout</div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-gray-500 text-center">
              This is a simulated payment gateway. No real transaction will occur. Please select an outcome to test the integration.
            </p>

            <button
              onClick={() => handleSimulate(true)}
              disabled={processing}
              className="w-full bg-[#1dbf73] hover:bg-[#19a764] text-white font-bold py-3.5 rounded-xl shadow transition-all text-sm flex items-center justify-center gap-2"
            >
              {processing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CheckCircle2 size={18} />
              )}
              <span>Simulate Successful Payment</span>
            </button>

            <button
              onClick={() => handleSimulate(false)}
              disabled={processing}
              className="w-full bg-white hover:bg-gray-50 text-red-600 border border-red-200 font-bold py-3.5 rounded-xl shadow-sm transition-all text-sm flex items-center justify-center gap-2"
            >
              <AlertCircle size={18} />
              <span>Simulate Failed Payment</span>
            </button>
          </div>

          <div className="text-[10px] text-gray-400 text-center flex justify-center items-center gap-1 mt-4">
            <CreditCard size={12} /> Secured by Razorpay Sandbox
          </div>
        </div>
      </div>
    </div>
  );
};
