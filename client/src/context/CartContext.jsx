import React, { createContext, useContext, useState, useEffect } from 'react';
import { useBuyerAuth } from './BuyerAuthContext';
import { settingsAPI } from '../api/client';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { buyer, isBuyerLoggedIn, requireAuth } = useBuyerAuth();
  
  const [globalSettings, setGlobalSettings] = useState({ studentDiscountPercent: 40, facultyDiscountPercent: 20 });
  
  useEffect(() => {
    settingsAPI.get().then(res => {
      if(res.data.success) setGlobalSettings(res.data.data);
    }).catch(e => console.error("Failed to load settings", e));
  }, []);

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('acet_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [fulfillment, setFulfillment] = useState('campus'); // 'campus' | 'courier'

  useEffect(() => {
    localStorage.setItem('acet_cart', JSON.stringify(items));
  }, [items]);

  const _addToCartInternal = (product, selectedMaterial, selectedSize) => {
    const materialObj = selectedMaterial || (product.availableMaterials && product.availableMaterials[0]) || { name: product.specs?.material || 'Standard Material', priceDelta: 0 };
    const sizeObj = selectedSize || (product.availableSizes && product.availableSizes[0]) || { name: 'Standard Scale', multiplier: 1.0 };
    
    const unitPrice = Math.round((product.salePrice + (materialObj.priceDelta || 0)) * (sizeObj.multiplier || 1.0));
    const cartItemId = `${product.id}-${materialObj.name}-${sizeObj.name}`;

    setItems((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          productId: product.id,
          title: product.title,
          slug: product.slug,
          image: product.image,
          material: materialObj.name,
          size: sizeObj.name,
          price: unitPrice,
          quantity: 1
        }
      ];
    });

    setIsDrawerOpen(true);
  };

  const addToCart = (product, selectedMaterial = null, selectedSize = null) => {
    // Gate: require buyer login before adding to cart
    if (!isBuyerLoggedIn) {
      const authRequired = requireAuth(() => {
        _addToCartInternal(product, selectedMaterial, selectedSize);
      });
      if (authRequired) return; // modal opened, will retry after login
    }

    _addToCartInternal(product, selectedMaterial, selectedSize);
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (cartItemId) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyCoupon = (code) => {
    if (code.toUpperCase() === 'ACET20') {
      setCoupon('ACET20');
      setDiscountPercent(20);
      return { success: true, message: 'ACET20 applied: 20% Student/Club Discount!' };
    }
    return { success: false, message: 'Invalid promo code. Try "ACET20"' };
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  let appliedDiscountPercent = discountPercent;
  if (buyer?.role === 'student' && globalSettings.studentDiscountPercent > appliedDiscountPercent) {
    appliedDiscountPercent = globalSettings.studentDiscountPercent;
  } else if (buyer?.role === 'faculty' && globalSettings.facultyDiscountPercent > appliedDiscountPercent) {
    appliedDiscountPercent = globalSettings.facultyDiscountPercent;
  }
  
  const discount = Math.round((subtotal * appliedDiscountPercent) / 100);
  const shipping = fulfillment === 'campus' || subtotal >= 999 ? 0 : 99;
  const total = Math.max(0, subtotal - discount + shipping);
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        coupon,
        discountPercent: appliedDiscountPercent,
        applyCoupon,
        fulfillment,
        setFulfillment,
        isDrawerOpen,
        setIsDrawerOpen,
        subtotal,
        discount,
        shipping,
        total,
        totalCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
