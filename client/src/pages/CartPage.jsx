import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export const CartPage = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
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

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      const res = applyCoupon(couponInput.trim());
      setCouponMsg(res.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-md space-y-4 bg-white">
        <ShoppingBag size={56} className="mx-auto text-gray-300" />
        <h2 className="font-['Cinzel'] text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500">Discover our collection of working kinematics and Carrara marble sculptures.</p>
        <Link 
          to="/collection/all"
          className="inline-block bg-[#00714C] hover:bg-[#005a3c] text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition-all"
        >
          Explore 3D Store Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-8 bg-white">
      
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="font-['Cinzel'] text-3xl font-extrabold text-gray-900">Shopping Cart</h1>
        <p className="text-xs text-gray-500 mt-1">Review your additive manufacturing items & fulfillment details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div key={item.cartItemId} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img src={item.image} alt={item.title} className="w-20 h-20 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-200" />
                <div>
                  <Link to={`/product/${item.slug || item.productId}`} className="font-['Outfit'] font-bold text-sm text-gray-900 hover:text-[#00714C]">
                    {item.title}
                  </Link>
                  <div className="text-xs text-[#00714C] font-semibold mt-0.5">{item.material} • {item.size}</div>
                  <div className="text-xs font-bold text-gray-900 mt-1">₹{item.price.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                  <button 
                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-black"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-[#00714C]">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-black"
                  >
                    +
                  </button>
                </div>

                <div className="font-black text-gray-900 text-base">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>

                <button 
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          <button 
            onClick={clearCart}
            className="text-xs text-gray-500 hover:text-red-500 underline font-semibold"
          >
            Clear entire cart
          </button>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm sticky top-24">
          <h3 className="font-['Cinzel'] text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Order Summary
          </h3>

          {/* Fulfillment Toggle */}
          <div className="space-y-2 text-xs">
            <span className="text-gray-700 font-bold block">Delivery Option:</span>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setFulfillment('campus')}
                className={`py-2 px-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                  fulfillment === 'campus' 
                    ? 'bg-[#00714C] border-[#00714C] text-white shadow-xs' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                 Campus Pickup (FREE)
              </button>
              <button 
                onClick={() => setFulfillment('courier')}
                className={`py-2 px-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                  fulfillment === 'courier' 
                    ? 'bg-[#00714C] border-[#00714C] text-white shadow-xs' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                 Courier (+₹99)
              </button>
            </div>
          </div>

          {/* Coupon */}
          <form onSubmit={handleApplyCoupon} className="space-y-1.5">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Coupon code (e.g. ACET20)"
                className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 uppercase placeholder-gray-400 focus:outline-none focus:border-[#00714C]"
              />
              <button type="submit" className="bg-gray-800 hover:bg-black text-white text-xs px-4 py-2 rounded-xl font-bold transition-all shadow-2xs">
                Apply
              </button>
            </div>
            {couponMsg && <div className="text-xs text-[#00714C] font-bold">{couponMsg}</div>}
          </form>

          {/* Calculations */}
          <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#00714C] font-bold">
                <span>Club Discount (20%)</span>
                <span>-₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping / Pickup</span>
              <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
              <span>Total Amount</span>
              <span className="text-[#00714C] text-xl font-black">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-[#00714C] hover:bg-[#005a3c] text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2 transition-all"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>

    </div>
  );
};
