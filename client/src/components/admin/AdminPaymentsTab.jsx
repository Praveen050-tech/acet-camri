import React, { useState, useEffect } from 'react';
import { paymentAPI } from '../../api/client';
import { CheckCircle, XCircle, ExternalLink, Clock } from 'lucide-react';

export const AdminPaymentsTab = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const res = await paymentAPI.getPending();
      if (res.data.success) {
        setPayments(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    if (!window.confirm('Are you sure you want to verify this payment and confirm the order?')) return;
    
    setActionLoading(id);
    try {
      const res = await paymentAPI.verify(id);
      if (res.data.success) {
        setPayments(payments.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to verify payment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter reason for rejection (optional):');
    if (reason === null) return; // cancelled
    
    setActionLoading(id);
    try {
      const res = await paymentAPI.reject(id, reason);
      if (res.data.success) {
        setPayments(payments.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to reject payment');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading pending payments...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-900">Pending Payments ({payments.length})</h2>
        <p className="text-sm text-gray-500 mt-1">Review and verify user-submitted payment screenshots</p>
      </div>
      
      {payments.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
          <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
          <p className="text-gray-500 mt-1">There are no pending payments to review.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {payments.map(payment => (
            <div key={payment.id} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-gray-50/50 transition-colors">
              {/* Info */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">Order #{payment.orderId.slice(-8).toUpperCase()}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Clock size={14} /> 
                      Submitted {new Date(payment.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Amount Due</p>
                    <p className="text-lg font-bold text-[#00714C]">?{payment.amountDue.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Buyer Name</p>
                    <p className="font-medium text-gray-900">{payment.buyerContactName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{payment.buyerContactPhone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Transaction Ref / Note</p>
                    <p className="font-medium text-gray-900">{payment.transactionRefNote || 'None provided'}</p>
                  </div>
                </div>
              </div>
              
              {/* Screenshot & Actions */}
              <div className="w-full md:w-64 flex flex-col gap-4">
                <a 
                  href={payment.screenshotUrl.startsWith('/') ? `http://localhost:5000${payment.screenshotUrl}` : payment.screenshotUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block relative rounded-xl overflow-hidden border border-gray-200 group bg-gray-100 aspect-video flex items-center justify-center"
                >
                  <img 
                    src={payment.screenshotUrl.startsWith('/') ? `http://localhost:5000${payment.screenshotUrl}` : payment.screenshotUrl} 
                    alt="Payment Proof" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="text-white w-6 h-6" />
                  </div>
                </a>
                
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <button 
                    onClick={() => handleReject(payment.id)}
                    disabled={actionLoading === payment.id}
                    className="flex items-center justify-center gap-1 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium disabled:opacity-50"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                  <button 
                    onClick={() => handleVerify(payment.id)}
                    disabled={actionLoading === payment.id}
                    className="flex items-center justify-center gap-1 py-2 bg-[#00714C] text-white rounded-lg hover:bg-[#005a3c] text-sm font-medium disabled:opacity-50"
                  >
                    <CheckCircle size={16} /> Verify
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
