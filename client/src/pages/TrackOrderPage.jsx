import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { orderAPI } from '../api/client';
import { Compass, CheckCircle2, Clock, MapPin, Box, ArrowRight } from 'lucide-react';

export const TrackOrderPage = () => {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';

  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = async (idToSearch) => {
    if (!idToSearch) return;
    setLoading(true);
    setError('');
    try {
      const res = await orderAPI.track(idToSearch);
      if (res.data.success) {
        setOrderData(res.data.data);
      } else {
        setError('Order ID not found. Please verify your campus receipt.');
      }
    } catch (err) {
      setError('Unable to fetch print queue telemetry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      fetchTracking(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderIdInput.trim()) {
      fetchTracking(orderIdInput.trim());
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl space-y-8 bg-white">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="bg-[#00714C]/10 text-[#00714C] border border-[#00714C]/30 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
          🔍 CAMPUS PRINT BED TELEMETRY
        </span>
        <h1 className="font-['Cinzel'] text-3xl font-extrabold text-gray-900">
          Track Your 3D Print Queue
        </h1>
        <p className="text-xs text-gray-600">
          Real-time CAD mesh verification, 50-micron slicing progress, and lab pickup readiness at Kinathukadavu.
        </p>
      </div>

      {/* Lookup Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto bg-white border border-gray-300 p-2 rounded-2xl shadow-sm">
        <input 
          type="text" 
          value={orderIdInput}
          onChange={(e) => setOrderIdInput(e.target.value)}
          placeholder="Enter Order ID (e.g. ACET-84920)"
          className="flex-1 bg-transparent px-4 py-2 text-xs font-mono text-gray-900 placeholder-gray-400 focus:outline-none"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-[#00714C] hover:bg-[#005a3c] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow transition-all"
        >
          {loading ? 'Searching...' : 'Track Queue'}
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center">
          {error}
        </div>
      )}

      {orderData && (
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
          
          {/* Order Meta Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-bold">CAMPUS ORDER NUMBER</span>
              <div className="font-mono text-xl font-black text-[#00714C]">{orderData.orderId}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00714C] animate-pulse" />
              <span className="text-xs bg-[#eef9f3] text-[#00714C] font-bold px-3.5 py-1 rounded-full border border-[#aee6cb]">
                {orderData.status || '3D Printing on Bed 02'}
              </span>
            </div>
          </div>

          {/* Machine Telemetry Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs">
            <div>
              <span className="text-gray-500 text-[10px] block">Assigned Machine</span>
              <strong className="text-gray-900">{orderData.printBed || 'Bed 02 (Ender-3 V3 SLA)'}</strong>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] block">Campus Hub</span>
              <strong className="text-gray-900">Kinathukadavu Main Lab</strong>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] block">Estimated Pickup</span>
              <strong className="text-[#00714C] font-bold">Today, 4:30 PM</strong>
            </div>
          </div>

          {/* Milestones Progress Timeline */}
          <div className="space-y-4 pt-2">
            <h4 className="font-['Cinzel'] text-sm font-bold text-gray-900 uppercase">Production Milestones</h4>
            
            <div className="space-y-3">
              {(orderData.milestones || [
                { step: 'Order Placed & Mesh Audit', done: true, time: '31 Aug, 09:30 AM' },
                { step: '50-Micron SLA Slicing (Cura/Prusa)', done: true, time: '31 Aug, 10:15 AM' },
                { step: '3D Printing in Progress (Bed 02)', done: true, time: 'Layer 1,840 of 3,200' },
                { step: 'UV Curing & Gold Buffing', done: false, time: 'Est. 02:00 PM' },
                { step: 'Ready for Pickup at Kinathukadavu Desk', done: false, time: 'Est. 04:30 PM' }
              ]).map((m, idx) => (
                <div key={idx} className={`flex items-start gap-3 p-3.5 rounded-2xl transition-all ${
                  m.done ? 'bg-[#eef9f3] border border-[#aee6cb]' : 'bg-gray-50 opacity-60'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    m.done ? 'bg-[#00714C] text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {m.done ? '✓' : idx + 1}
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row justify-between sm:items-center gap-1 text-xs">
                    <span className="font-bold text-gray-900">{m.step}</span>
                    <span className="text-[#00714C] font-mono text-[11px]">{m.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Collection Notice */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} className="text-[#00714C] shrink-0" />
              <span>Bring your Student ID card or WhatsApp receipt to the Kinathukadavu 3D Lab Desk.</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
