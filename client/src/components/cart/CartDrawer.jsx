import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const CartDrawer = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    isDrawerOpen,
    setIsDrawerOpen,
    coupon,
    applyCoupon,
    fulfillment,
    setFulfillment,
    subtotal,
    discount,
    shipping,
    total
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      const res = applyCoupon(couponInput.trim());
      setCouponMsg(res.message);
    }
  };

  const handleCheckoutClick = () => {
    setIsDrawerOpen(false);
    navigate('/checkout');
  };

  const progressPercent = Math.min(100, Math.round((subtotal / 999) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-gray-200 shadow-2xl flex flex-col text-gray-900">
          
          {/* Header */}
          <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#00714C]" />
              <h3 className="font-['Cinzel'] font-bold text-lg text-gray-900">Your 3D Print Cart</h3>
            </div>
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-[#eef9f3] p-3.5 border-b border-[#aee6cb] text-xs text-center text-[#00714C]">
            {subtotal >= 999 || fulfillment === 'campus' ? (
              <span className="font-bold">
                 FREE Express Delivery / Campus Pickup Unlocked!
              </span>
            ) : (
              <span>
                Add <strong className="text-[#00714C]">₹{999 - subtotal}</strong> more for <strong>FREE Delivery</strong> 
              </span>
            )}
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-1.5 border border-gray-300">
              <div 
                className="bg-[#00714C] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
                <h4 className="text-gray-800 font-semibold text-base mb-1">Your cart is empty</h4>
                <p className="text-xs mb-4 text-gray-500">Discover precision engineering models & Carrara marble art.</p>
                <button
                  onClick={() => { setIsDrawerOpen(false); navigate('/collection/all'); }}
                  className="bg-[#00714C] hover:bg-[#005a3c] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow"
                >
                  Explore 3D Catalog
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.cartItemId} className="flex gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-3.5 shadow-xs">
                  <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover bg-gray-200 shrink-0 border border-gray-200" />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-gray-900 truncate">{item.title}</h5>
                    <div className="text-[11px] text-[#00714C] font-semibold mt-0.5">{item.material} • {item.size}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-gray-900">₹{item.price?.toLocaleString('en-IN')}</span>
                      
                      <div className="flex items-center border border-gray-300 rounded-lg bg-white shadow-2xs">
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-gray-600 hover:text-black"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-bold text-[#00714C]">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-gray-600 hover:text-black"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Calculations */}
          {items.length > 0 && (
            <div className="p-5 border-t border-gray-200 bg-gray-50 space-y-3">
              
              {/* Campus Pickup Selector */}
              <div className="space-y-1.5 text-xs">
                <label className="text-gray-700 font-bold block text-[11px]">Fulfillment Mode:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setFulfillment('campus')}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold text-[11px] transition-all ${
                      fulfillment === 'campus' 
                        ? 'bg-[#00714C] border-[#00714C] text-white shadow-sm' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                     Campus Pickup (FREE)
                  </button>
                  <button 
                    onClick={() => setFulfillment('courier')}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold text-[11px] transition-all ${
                      fulfillment === 'courier' 
                        ? 'bg-[#00714C] border-[#00714C] text-white shadow-sm' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                     Courier (+₹99)
                  </button>
                </div>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input 
                  type="text" 
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Promo code (e.g. ACET20)" 
                  className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 uppercase placeholder-gray-400 focus:outline-none focus:border-[#00714C]"
                />
                <button type="submit" className="bg-gray-800 hover:bg-black text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs">
                  Apply
                </button>
              </form>
              {couponMsg && <div className="text-[11px] text-[#00714C] font-bold">{couponMsg}</div>}

              {/* Price Rows */}
              <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-gray-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">₹{subtotal?.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#00714C] font-bold">
                    <span>Club Discount (20%)</span>
                    <span>-₹{discount?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery / Pickup</span>
                  <span className="font-semibold text-gray-800">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-1.5 border-t border-gray-200">
                  <span>Total (Incl. GST)</span>
                  <span className="text-[#00714C] text-lg font-black">₹{total?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={handleCheckoutClick}
                className="w-full bg-[#00714C] hover:bg-[#005a3c] text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm transition-all"
              >
                <span>Proceed to Campus Checkout</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
