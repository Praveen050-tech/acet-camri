/**
 * ACET 3D — Global State Store & Event Bus
 * Handles Cart, Wishlist, Modals, Promo Codes, and Toast Notifications
 */

class Store {
  constructor() {
    this.cart = this.loadCart();
    this.appliedDiscount = null; // { code: 'ACET20', percentage: 20, fixed: 0 }
    this.subscribers = [];
  }

  loadCart() {
    try {
      const saved = localStorage.getItem('acet_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem('acet_cart_v1', JSON.stringify(this.cart));
    } catch (e) {}
    this.notify();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  notify() {
    this.subscribers.forEach(cb => cb(this.getState()));
  }

  getState() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discountAmount = 0;
    if (this.appliedDiscount) {
      if (this.appliedDiscount.percentage) {
        discountAmount = (subtotal * this.appliedDiscount.percentage) / 100;
      } else if (this.appliedDiscount.fixed) {
        discountAmount = Math.min(subtotal, this.appliedDiscount.fixed);
      }
    }
    const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
    const tax = Math.round((subtotal - discountAmount) * 0.18); // 18% GST standard
    const total = Math.max(0, subtotal - discountAmount + (subtotal > 0 ? shipping : 0));
    const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const freeShippingRemaining = Math.max(0, 999 - subtotal);

    return {
      items: this.cart,
      itemCount: count,
      subtotal,
      discountAmount,
      appliedDiscount: this.appliedDiscount,
      shipping,
      freeShippingRemaining,
      freeShippingQualified: subtotal >= 999,
      tax,
      total
    };
  }

  addToCart(product, options = {}) {
    const selectedMaterial = options.material || product.materials[0];
    const selectedSize = options.size || (product.sizes ? product.sizes[0] : { id: 'default', name: 'Standard', priceMult: 1.0 });
    const quantity = options.quantity || 1;

    // Calculate variant unit price
    const basePrice = product.salePrice;
    const materialDelta = selectedMaterial ? selectedMaterial.delta : 0;
    const sizeMultiplier = selectedSize ? selectedSize.priceMult : 1.0;
    const unitPrice = Math.round((basePrice + materialDelta) * sizeMultiplier);

    const itemKey = `${product.id}-${selectedMaterial ? selectedMaterial.id : 'def'}-${selectedSize ? selectedSize.id : 'def'}`;

    const existingIndex = this.cart.findIndex(i => i.key === itemKey);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        key: itemKey,
        productId: product.id,
        title: product.title,
        image: product.image,
        material: selectedMaterial ? selectedMaterial.name : 'Standard PLA',
        size: selectedSize ? selectedSize.name : 'Standard',
        price: unitPrice,
        regularPrice: product.regularPrice,
        quantity: quantity,
        productRef: product
      });
    }

    this.saveCart();
    this.showToast(`Added "${product.title}" (${selectedMaterial ? selectedMaterial.name : 'Standard'}) to cart!`);
  }

  updateQuantity(itemKey, newQty) {
    if (newQty <= 0) {
      this.cart = this.cart.filter(i => i.key !== itemKey);
    } else {
      const item = this.cart.find(i => i.key === itemKey);
      if (item) item.quantity = newQty;
    }
    this.saveCart();
  }

  removeItem(itemKey) {
    this.cart = this.cart.filter(i => i.key !== itemKey);
    this.saveCart();
  }

  applyCoupon(code) {
    const upper = code.trim().toUpperCase();
    if (upper === 'ACET20') {
      this.appliedDiscount = { code: 'ACET20', percentage: 20 };
      this.saveCart();
      this.showToast('Promo Code ACET20 applied! (20% OFF)');
      return { success: true, message: '20% discount applied!' };
    } else if (upper === 'FREESHIP') {
      this.appliedDiscount = { code: 'FREESHIP', fixed: 99 };
      this.saveCart();
      this.showToast('Coupon applied: Free Delivery on all carts!');
      return { success: true, message: 'Free delivery applied!' };
    } else if (upper === 'LAUNCH3D') {
      this.appliedDiscount = { code: 'LAUNCH3D', fixed: 300 };
      this.saveCart();
      this.showToast('Promo Code LAUNCH3D applied! (₹300 OFF)');
      return { success: true, message: '₹300 Launch Discount applied!' };
    } else {
      return { success: false, message: 'Invalid coupon code. Try "ACET20"' };
    }
  }

  removeCoupon() {
    this.appliedDiscount = null;
    this.saveCart();
    this.showToast('Coupon removed');
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-cyan); flex-shrink: 0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-leave');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

export const store = new Store();
