import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useBuyerAuth } from '../context/BuyerAuthContext';
import { orderAPI, paymentAPI } from '../api/client';
import { CheckCircle2, ShieldCheck, ArrowRight, Lock, MapPin, CreditCard, LogIn } from 'lucide-react';

export const CheckoutPage = () => {
  const { items, subtotal, discount, shipping, total, fulfillment, setFulfillment, clearCart } = useCart();
  const { isBuyerLoggedIn, buyer, setIsAuthModalOpen } = useBuyerAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: buyer?.name || '',
    contact: buyer?.phone || '',
    rollNo: '',
    department: '',
    address: '',
    paymentMethod: 'Bank/UPI Transfer'
  });

  const [placing, setPlacing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const orderPayload = {
        items: items.map(i => ({
          serviceId: i.id,
          serviceName: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        totalAmount: total,
        customerName: formData.customerName,
        contact: formData.contact,
        rollNo: formData.rollNo,
        department: formData.department,
        address: formData.address,
        paymentMethod: formData.paymentMethod,
        fulfillment: fulfillment,
      };
      const { data: newOrder } = await orderAPI.createOrder(orderPayload);
      if (formData.paymentMethod === 'Bank/UPI Transfer') {
        navigate('/payment', { state: { orderId: newOrder.id } });
      } else {
        setConfirmedOrder(newOrder);
        clearCart();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (!isBuyerLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-24 text-center bg-white">
        <div className="max-w-md mx-auto space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#eef9f3] flex items-center justify-center mx-auto">
            <Lock size={28} className="text-[#00714C]" />
          </div>
          <h2 className="font-['Cinzel'] text-2xl font-bold text-gray-900">Sign In Required</h2>
          <p className="text-sm text-gray-600">You need to sign in or create an account before you can checkout.</p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#00714C] hover:bg-[#005a3c] text-white font-bold py-3.5 px-8 rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
          >
            <LogIn size={16} />
            Sign In / Create Account
          </button>
          <div>
            <Link to="/collection/all" className="text-[#00714C] underline text-xs font-bold">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !confirmedOrder) {
    return (
      <div className="container mx-auto px-4 py-24 text-center bg-white">
        <h2 className="text-xl font-bold text-gray-900 mb-2">No Items in Cart for Checkout</h2>
        <Link to="/collection/all" className="text-[#00714C] underline text-sm font-bold">Return to 3D Catalog</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl space-y-8 bg-white">
      {confirmedOrder ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-[#eef9f3] text-[#00714C] flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="font-['Cinzel'] text-3xl font-bold text-gray-900">Order Confirmed!</h2>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
            Thank you, <strong className="text-gray-900">{confirmedOrder.customerName}</strong>. 
            Your order <strong className="text-gray-900">#{confirmedOrder.id}</strong> has been received. 
            {confirmedOrder.razorpayPaymentId && (
              <span className="block mt-2 text-sm text-gray-500">Payment ID: {confirmedOrder.razorpayPaymentId}</span>
            )}
          </p>
          <div className="pt-6">
            <button
              onClick={() => navigate('/track')}
              className="bg-[#00714C] hover:bg-[#005a3c] text-white font-bold py-3 px-8 rounded-xl shadow transition-colors"
            >
              Track Order Status
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h1 className="font-['Cinzel'] text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
              
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-[#00714C]" /> Fulfillment Method
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className={`border rounded-xl p-4 cursor-pointer transition-all ${fulfillment === 'campus' ? 'border-[#00714C] bg-[#eef9f3] shadow-sm' : 'border-gray-200 hover:border-[#00714C]/30'}`}>
                    <input type="radio" name="fulfillment" className="hidden" checked={fulfillment === 'campus'} onChange={() => setFulfillment('campus')} />
                    <span className="block font-bold text-sm text-gray-900 mb-1">Campus Pickup</span>
                    <span className="block text-xs text-gray-500">Kinathukadavu 3D Lab (Free)</span>
                  </label>
                  <label className={`border rounded-xl p-4 cursor-pointer transition-all ${fulfillment === 'delivery' ? 'border-[#00714C] bg-[#eef9f3] shadow-sm' : 'border-gray-200 hover:border-[#00714C]/30'}`}>
                    <input type="radio" name="fulfillment" className="hidden" checked={fulfillment === 'delivery'} onChange={() => setFulfillment('delivery')} />
                    <span className="block font-bold text-sm text-gray-900 mb-1">Courier Delivery</span>
                    <span className="block text-xs text-gray-500">BlueDart Express (+₹{shipping})</span>
                  </label>
                </div>
              </div>
            </div>

            <form id="checkout-form" onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                <CreditCard size={18} className="text-[#00714C]" /> Billing & Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name *</label>
                  <input required type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#00714C] focus:bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone Number *</label>
                  <input required type="text" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#00714C] focus:bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Roll Number (Students)</label>
                  <input type="text" value={formData.rollNo} onChange={e => setFormData({...formData, rollNo: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#00714C] focus:bg-white" placeholder="e.g. 21CS045" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Department / Year</label>
                  <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#00714C] focus:bg-white" placeholder="e.g. CSE, 3rd Year" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Delivery Address / Instructions</label>
                  <textarea rows="2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#00714C] focus:bg-white" placeholder={fulfillment === 'campus' ? 'Any specific pickup instructions?' : 'Full delivery address...'} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Payment Method</label>
                  <select value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#00714C] focus:bg-white">
                    <option value="Bank/UPI Transfer">Bank/UPI Transfer (Manual Screenshot)</option>
                    <option value="Pay at Lab">Pay at Lab (Cash / Direct UPI)</option>
                  </select>
                </div>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 pb-4 border-b border-gray-200">Order Summary ({items.length} items)</h3>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={`${item.id}-${item.variant?.id}`} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-gray-200 bg-white shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{item.name}</h4>
                      {item.variant && <p className="text-xs text-gray-500">{item.variant.name}</p>}
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                        <span className="text-sm font-bold text-[#00714C]">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#00714C]">
                    <span>Discount</span>
                    <span className="font-medium">-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="font-bold text-gray-900 text-base">Total Amount</span>
                  <span className="font-['Readex_Pro'] font-bold text-xl text-[#00714C]">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={placing}
                className="w-full mt-6 bg-[#00714C] hover:bg-[#005a3c] text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {placing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    {formData.paymentMethod === 'Bank/UPI Transfer' ? 'Proceed to Make Payment' : 'Confirm Order'}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-500">
                <Lock size={12} />
                <span>256-bit secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
