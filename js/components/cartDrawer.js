/**
 * ACET 3D — Cart Drawer & Campus Pickup Checkout Flow
 */

import { store } from '../utils/store.js';

export class CartDrawer {
  constructor() {
    this.overlay = document.getElementById('cart-drawer-overlay');
    this.body = document.getElementById('cart-drawer-body');
    this.badge = document.getElementById('cart-badge');
    this.subtotalEl = document.getElementById('cart-subtotal');
    this.discountRow = document.getElementById('cart-discount-row');
    this.discountVal = document.getElementById('cart-discount-val');
    this.shippingVal = document.getElementById('cart-shipping-val');
    this.totalEl = document.getElementById('cart-total');
    this.shippingProgressFill = document.getElementById('shipping-progress-fill');
    this.shippingMessage = document.getElementById('shipping-message');
    this.couponInput = document.getElementById('cart-coupon-input');
    this.couponBtn = document.getElementById('cart-coupon-btn');
    this.couponAppliedTag = document.getElementById('coupon-applied-tag');

    this.isCampusPickup = false;
    this.init();
  }

  init() {
    store.subscribe((state) => this.render(state));

    const openBtns = document.querySelectorAll('.trigger-open-cart');
    openBtns.forEach(btn => btn.addEventListener('click', (e) => {
      e.preventDefault();
      this.open();
    }));

    const closeBtn = document.getElementById('cart-drawer-close');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) this.close();
      });
    }

    if (this.couponBtn && this.couponInput) {
      this.couponBtn.addEventListener('click', () => {
        const val = this.couponInput.value;
        if (!val) return;
        const res = store.applyCoupon(val);
        if (!res.success) {
          alert(res.message);
        } else {
          this.couponInput.value = '';
        }
      });
    }

    // Proceed to Checkout Trigger
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.onclick = () => {
        const cart = store.getCart();
        if (cart.length === 0) {
          store.showToast('Your cart is empty! Add 3D prints first.');
          return;
        }
        this.close();
        if (window.acetCheckoutModal) {
          window.acetCheckoutModal.open();
        }
      };
    }

    this.render(store.getState());
  }

  open() {
    if (this.overlay) this.overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (this.overlay) this.overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  render(state) {
    const badges = document.querySelectorAll('.cart-counter');
    badges.forEach(b => {
      b.textContent = state.itemCount;
      b.style.display = state.itemCount > 0 ? 'flex' : 'none';
    });

    if (this.shippingProgressFill && this.shippingMessage) {
      const pct = Math.min(100, Math.round((state.subtotal / 999) * 100));
      this.shippingProgressFill.style.width = `${pct}%`;

      if (state.freeShippingQualified) {
        this.shippingMessage.innerHTML = `🎉 <strong>Eligible for FREE Delivery</strong> or <strong>Direct Campus Pickup</strong>!`;
        this.shippingProgressFill.style.background = 'var(--gold-gradient)';
      } else {
        this.shippingMessage.innerHTML = `Add <strong style="color: var(--gold-primary);">₹${state.freeShippingRemaining.toLocaleString('en-IN')}</strong> more for <strong>FREE Delivery</strong> 📦`;
        this.shippingProgressFill.style.background = 'var(--wine-gradient)';
      }
    }

    if (!this.body) return;

    if (state.items.length === 0) {
      this.body.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem; color: var(--gold-primary); opacity: 0.6;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <h4 style="color: var(--marble-white); margin-bottom: 0.5rem;">Your Cart is Empty</h4>
          <p style="font-size: 0.88rem; margin-bottom: 1.5rem;">Explore college merch, engineering demonstrators, and custom 3D models.</p>
          <button class="btn btn-outline btn-sm" onclick="document.getElementById('cart-drawer-overlay').classList.remove('open'); document.body.style.overflow=''; window.location.hash='#explore-collections';">Explore Catalog</button>
        </div>
      `;
    } else {
      this.body.innerHTML = state.items.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.title}" class="cart-item-thumb">
          <div class="cart-item-meta">
            <h5 style="color: var(--marble-white);">${item.title}</h5>
            <div class="cart-item-variant" style="color: var(--gold-primary); font-size: 0.78rem;">
              <span>${item.material}</span> • <span>${item.size}</span>
            </div>
            <div style="font-weight: 700; color: var(--marble-white); font-size: 0.95rem;">
              ₹${item.price.toLocaleString('en-IN')}
            </div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.6rem;">
            <button class="cart-remove-btn" data-key="${item.key}" style="color: var(--text-muted); cursor: pointer; font-size: 0.8rem; background: none; border: none;" title="Remove">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
            <div class="cart-stepper">
              <button class="cart-step-minus" data-key="${item.key}" data-qty="${item.quantity - 1}">-</button>
              <span>${item.quantity}</span>
              <button class="cart-step-plus" data-key="${item.key}" data-qty="${item.quantity + 1}">+</button>
            </div>
          </div>
        </div>
      `).join('');

      this.body.querySelectorAll('.cart-step-minus, .cart-step-plus').forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.getAttribute('data-key');
          const qty = parseInt(btn.getAttribute('data-qty'), 10);
          store.updateQuantity(key, qty);
        });
      });

      this.body.querySelectorAll('.cart-remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.getAttribute('data-key');
          store.removeItem(key);
        });
      });
    }

    if (this.subtotalEl) this.subtotalEl.textContent = `₹${state.subtotal.toLocaleString('en-IN')}`;
    
    if (this.discountRow) {
      if (state.discountAmount > 0) {
        this.discountRow.style.display = 'flex';
        this.discountVal.textContent = `-₹${state.discountAmount.toLocaleString('en-IN')}`;
      } else {
        this.discountRow.style.display = 'none';
      }
    }

    if (this.couponAppliedTag) {
      if (state.appliedDiscount) {
        this.couponAppliedTag.style.display = 'inline-flex';
        this.couponAppliedTag.innerHTML = `
          <span>Applied: <strong>${state.appliedDiscount.code}</strong></span>
          <button id="remove-coupon-btn" style="background: none; border: none; color: #ff859d; cursor: pointer; margin-left: 0.4rem;">✕</button>
        `;
        const rmBtn = document.getElementById('remove-coupon-btn');
        if (rmBtn) rmBtn.addEventListener('click', () => store.removeCoupon());
      } else {
        this.couponAppliedTag.style.display = 'none';
      }
    }

    if (this.shippingVal) {
      this.shippingVal.textContent = state.shipping === 0 ? 'FREE' : `₹${state.shipping}`;
    }

    if (this.totalEl) this.totalEl.textContent = `₹${state.total.toLocaleString('en-IN')}`;
  }

  openCheckoutModal(state) {
    let modal = document.getElementById('checkout-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'checkout-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-container" style="width: 590px; max-width: 92vw; padding: 2.5rem;">
        <button class="modal-close-btn" onclick="document.getElementById('checkout-modal').classList.remove('open'); document.body.style.overflow='';" aria-label="Close Checkout">✕</button>
        <div style="margin-bottom: 1.5rem;">
          <span class="sub-badge" style="font-size: 0.75rem;">AKSHAYA CAMPUS INTEGRATED CHECKOUT</span>
          <h3 style="margin-top: 0.4rem; color: var(--marble-white);">Confirm ACET 3D Print Order</h3>
          <p style="font-size: 0.88rem;">Total Payable: <strong style="color: var(--gold-primary); font-size: 1.1rem;">₹${state.total.toLocaleString('en-IN')}</strong> (${state.itemCount} items)</p>
        </div>

        <form id="checkout-form" onsubmit="event.preventDefault(); window.processMockCheckout();">
          <!-- Delivery vs Campus Pickup Choice -->
          <div style="background: rgba(84, 13, 42, 0.3); border: 1.5px solid var(--border-gold); padding: 0.85rem; border-radius: var(--radius-md); margin-bottom: 1.2rem;">
            <div style="font-weight: 700; font-size: 0.85rem; color: var(--gold-primary); margin-bottom: 0.4rem;">SELECT FULFILLMENT:</div>
            <div style="display: flex; gap: 1rem;">
              <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;">
                <input type="radio" name="fulfillment" value="pickup" checked onchange="document.getElementById('shipping-address-wrap').style.display='none';">
                <strong>🏫 Campus Pickup (Kinathukadavu 3D Lab) - FREE</strong>
              </label>
              <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;">
                <input type="radio" name="fulfillment" value="doorstep" onchange="document.getElementById('shipping-address-wrap').style.display='block';">
                📦 Doorstep Courier
              </label>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div>
              <label class="form-label">Full Name / Student Name *</label>
              <input type="text" class="form-control" placeholder="e.g. S. Manikandan" required value="S. Manikandan">
            </div>
            <div>
              <label class="form-label">Mobile Number / WhatsApp *</label>
              <input type="tel" class="form-control" placeholder="+91 98765 43210" required value="+91 97894 44111">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div>
              <label class="form-label">Roll No / Alumnus Batch / Email *</label>
              <input type="text" class="form-control" placeholder="e.g. 21CS045 or alumnus" required value="21CS045 (CSE 3D Club)">
            </div>
            <div>
              <label class="form-label">Department</label>
              <input type="text" class="form-control" placeholder="Computer Science & Engineering (CSE)" value="Computer Science & Engineering">
            </div>
          </div>

          <div id="shipping-address-wrap" style="display: none; margin-bottom: 1rem;">
            <label class="form-label">Delivery Address (for Doorstep Courier)</label>
            <input type="text" class="form-control" placeholder="Door No, Street, City, Pincode" value="Kinathukadavu, Coimbatore 642109">
          </div>

          <div class="form-group">
            <label class="form-label">Payment Gateway</label>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; margin-top: 0.4rem;">
              <label style="background: rgba(84, 13, 42, 0.4); border: 1px solid var(--gold-primary); padding: 0.6rem; border-radius: var(--radius-sm); font-size: 0.8rem; display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
                <input type="radio" name="payment" checked> Razorpay / UPI
              </label>
              <label style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); padding: 0.6rem; border-radius: var(--radius-sm); font-size: 0.8rem; display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
                <input type="radio" name="payment"> NetBanking / Cards
              </label>
              <label style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); padding: 0.6rem; border-radius: var(--radius-sm); font-size: 0.8rem; display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
                <input type="radio" name="payment"> Pay at Lab Desk
              </label>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem; margin-top: 1rem; font-size: 1rem;">
            Authorize & Submit 3D Print Order (₹${state.total.toLocaleString('en-IN')})
          </button>
        </form>
      </div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    window.processMockCheckout = () => {
      const orderId = `ACET-${Math.floor(100000 + Math.random() * 900000)}`;
      modal.innerHTML = `
        <div class="modal-container" style="width: 490px; max-width: 90vw; padding: 2.5rem; text-align: center;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(212, 175, 55, 0.15); border: 2px solid var(--gold-primary); color: var(--gold-primary); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h3 style="margin-bottom: 0.5rem; color: var(--marble-white);">Order Queued in Print Lab!</h3>
          <p style="color: var(--text-secondary); font-size: 0.92rem; margin-bottom: 1.5rem;">
            Your CAD model has been scheduled on Bed 02 at ACET Kinathukadavu 3D Printing Lab.
          </p>
          <div style="background: rgba(35, 12, 22, 0.6); border: 1px solid var(--border-gold); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
            <div style="font-size: 0.8rem; color: var(--text-muted);">CAMPUS TRACKING ID</div>
            <div style="font-family: var(--font-mono); font-size: 1.3rem; font-weight: 700; color: var(--gold-primary); letter-spacing: 0.05em; margin-top: 0.2rem;">${orderId}</div>
          </div>
          <button class="btn btn-primary" onclick="document.getElementById('checkout-modal').classList.remove('open'); document.body.style.overflow=''; window.openTrackerWithId('${orderId}');" style="width: 100%;">
            Track Real-Time Slicing & Campus Queue
          </button>
        </div>
      `;
      store.clearCart();
    };
  }
}
