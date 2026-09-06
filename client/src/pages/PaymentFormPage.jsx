import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Copy, ArrowRight, AlertCircle, UploadCloud } from 'lucide-react';
import { orderAPI, paymentAPI, uploadAPI } from '../api/client';

export const PaymentFormPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState('');

  // Bank details - FIXED, not changeable
  const BANK_DETAILS = {
    name: 'THE PRINCIPAL AKSHAYA COLLEGE OF ENGINEERING AND TECHNOLOGY',
    accountNumber: '0034053000013214',
    ifscCode: 'SIBL0000034',
    branch: 'Kinathukadavu'
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderAPI.getById(orderId);
        if (res.data.success) {
          setOrder(res.data.data);
        } else {
          setError(res.data.message || 'Order not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        return;
      }
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!screenshotFile) {
      alert('Please upload a payment screenshot.');
      return;
    }
    
    setSubmitting(true);
    try {
      let screenshotUrl = '';
      try {
        const uploadForm = new FormData();
        uploadForm.append('file', screenshotFile);
        const uploadRes = await uploadAPI.uploadCadFile(uploadForm);
        if (uploadRes.data.success || uploadRes.data.url) {
          screenshotUrl = uploadRes.data.url || uploadRes.data.data?.url || '';
        }
      } catch (uploadErr) {
        screenshotUrl = screenshotPreview;
      }

      const paymentData = {
        screenshotUrl: screenshotUrl || screenshotPreview,
        buyerContactName: order?.customerName || '',
        buyerContactEmail: order?.email || '',
        buyerContactPhone: order?.contact || ''
      };

      const res = await paymentAPI.submitPayment(orderId, paymentData);
      if (res.data.success) {
        navigate('/track?id=' + orderId + '&success=true');
      } else {
        alert('Failed to submit payment: ' + (res.data.message || 'Unknown error'));
        setSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred submitting the payment proof.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#00714C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Notice</h2>
          <p className="text-gray-600 mb-6">{error || 'Something went wrong.'}</p>
          <button onClick={() => navigate('/')} className="bg-[#00714C] text-white px-6 py-2.5 rounded-xl font-medium">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="font-['Cinzel'] text-2xl font-bold text-gray-900">Payment</h1>
          <p className="text-gray-600 mt-1">
            Amount Due: <span className="font-bold text-[#00714C] text-lg">\u20B9{order.totalAmount?.toFixed ? order.totalAmount.toFixed(2) : order.totalAmount}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">Order #{orderId}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#00714C]"></div>
          
          <h2 className="text-xl font-bold text-center text-gray-900 mb-6 mt-2">Bank Details</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Name of the Account</p>
              <p className="font-semibold text-gray-900 leading-tight text-sm">{BANK_DETAILS.name}</p>
            </div>
            
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Account Number</p>
                <p className="font-semibold text-gray-900 text-lg tracking-wide font-mono">{BANK_DETAILS.accountNumber}</p>
              </div>
              <button onClick={() => handleCopy(BANK_DETAILS.accountNumber, 'acc')} className="p-2 bg-white rounded-lg shadow-sm text-gray-500 hover:text-[#00714C] transition-colors border border-gray-200">
                {copied === 'acc' ? <CheckCircle size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            </div>
            
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">IFSC Code</p>
                <p className="font-semibold text-gray-900 text-lg tracking-wide font-mono">{BANK_DETAILS.ifscCode}</p>
              </div>
              <button onClick={() => handleCopy(BANK_DETAILS.ifscCode, 'ifsc')} className="p-2 bg-white rounded-lg shadow-sm text-gray-500 hover:text-[#00714C] transition-colors border border-gray-200">
                {copied === 'ifsc' ? <CheckCircle size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Branch Name</p>
              <p className="font-semibold text-gray-900">{BANK_DETAILS.branch}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {screenshotPreview ? (
              <div className="relative rounded-2xl border-2 border-gray-200 overflow-hidden bg-white shadow-sm flex flex-col items-center p-2">
                <img src={screenshotPreview} alt="Screenshot preview" className="max-h-56 object-contain rounded-xl" />
                <button 
                  type="button" 
                  onClick={() => { setScreenshotFile(null); setScreenshotPreview(''); }}
                  className="mt-3 w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Change File
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full py-8 border-2 border-[#00714C]/30 border-dashed rounded-2xl cursor-pointer bg-white shadow-sm hover:bg-[#00714C]/5 transition-colors group">
                <div className="bg-[#00714C]/10 p-4 rounded-full mb-3 group-hover:bg-[#00714C]/20 transition-colors">
                  <UploadCloud className="w-8 h-8 text-[#00714C]" />
                </div>
                <span className="font-bold text-gray-900 mb-1">Upload File</span>
                <span className="text-sm text-gray-500 text-center px-4">Upload screenshot of your payment<br/>(PNG or JPG)</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            )}
          </div>
          
          <button
            type="submit"
            disabled={submitting || !screenshotFile}
            className="w-full bg-[#00714C] hover:bg-[#005a3c] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98]"
          >
            {submitting ? 'Submitting...' : 'Submit'}
            {!submitting && <ArrowRight size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentFormPage;
