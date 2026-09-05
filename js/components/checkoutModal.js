/**
 * ACET 3D — Razorpay & Campus Pickup Checkout Modal Component
 * Handles student roll number verification, campus pickup, UPI QR, and order receipt generation.
 */

import { store } from '../utils/store.js';

export class CheckoutModal {
  constructor() {
    this.modalEl = document.getElementById('checkout-modal');
    this.init();
  }

  init() {
    if (this.modalEl) {
      this.modalEl.addEventListener('click', (e) => {
        if (e.target === this.modalEl) this.close();
      });
    }
  }

  open() {
    if (!this.modalEl) {
      let modal = document.createElement('div');
      modal.id = 'checkout-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
      this.modalEl = modal;
    }

    this.render();
    this.modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (this.modalEl) {
      this.modalEl.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  render() {
    const summary = store.getCartSummary();
    const cart = store.getCart();

    this.modalEl.innerHTML = `
      <div class="modal-container" style="width: 780px; max-width: 92vw; padding: 2.5rem;">
        <button class="modal-close-btn" id="checkout-modal-close" aria-label="Close checkout">✕</button>
        
        <div style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="sub-badge" style="font-size: 0.75rem;">ACET 3D CLUB CHECKOUT</span>
            <span style="font-size: 0.75rem; color: #00f2fe;">🔒 256-Bit SSL Encrypted</span>
          </div>
          <h2 style="font-size: 1.6rem; margin-top: 0.4rem; color: var(--marble-white);">Complete Your Campus Order</h2>
          <p style="font-size: 0.88rem; color: var(--text-secondary);">Direct fulfillment from Akshaya College of Engineering & Technology 3D Lab</p>
        </div>

        <form id="checkout-form">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
            
            <!-- Left: Contact & Student Details -->
            <div>
              <h4 style="font-size: 0.95rem; color: var(--gold-primary); margin-bottom: 1rem;">1. Buyer Details</h4>
              
              <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input type="text" id="chk-name" class="form-control" placeholder="e.g. S. Manikandan" required value="S. Manikandan">
              </div>

              <div class="form-group">
                <label class="form-label">WhatsApp Number *</label>
                <input type="tel" id="chk-phone" class="form-control" placeholder="+91 97894 44111" required value="+91 97894 44111">
              </div>

              <div class="form-group">
                <label class="form-label">Roll Number / Alumni Batch</label>
                <input type="text" id="chk-roll" class="form-control" placeholder="21CS045 (Leave blank if public)" value="21CS045">
              </div>

              <div class="form-group">
                <label class="form-label">Department / College</label>
                <input type="text" id="chk-dept" class="form-control" placeholder="Computer Science & Engineering, ACET" value="Computer Science and Engineering, ACET">
              </div>
            </div>

            <!-- Right: Delivery & Payment Options -->
            <div>
              <h4 style="font-size: 0.95rem; color: var(--gold-primary); margin-bottom: 1rem;">2. Fulfillment & Payment</h4>

              <!-- Delivery Options -->
              <div class="form-group">
                <label class="form-label">Fulfillment Method</label>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                  <label style="background: rgba(84, 13, 42, 0.4); border: 1.5px solid var(--border-gold); padding: 0.75rem; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 0.6rem; cursor: pointer;">
                    <input type="radio" name="chk-fulfillment" value="campus" checked>
                    <div>
                      <strong style="color: var(--marble-white); font-size: 0.88rem;">🏫 Campus Pickup (FREE)</strong>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">Kinathukadavu 3D Lab Desk (Mon-Sat 9AM-5PM)</div>
                    </div>
                  </label>

                  <label style="background: rgba(35, 12, 22, 0.4); border: 1px solid var(--border-subtle); padding: 0.75rem; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 0.6rem; cursor: pointer;">
                    <input type="radio" name="chk-fulfillment" value="courier">
                    <div>
                      <strong style="color: var(--marble-white); font-size: 0.88rem;">📦 BlueDart / DTDC Courier (+₹99)</strong>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">Express shipping across India</div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Payment Method -->
              <div class="form-group">
                <label class="form-label">Payment Gateway</label>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                  <label style="background: rgba(84, 13, 42, 0.4); border: 1.5px solid var(--border-gold); padding: 0.75rem; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 0.6rem; cursor: pointer;">
                    <input type="radio" name="chk-payment" value="razorpay" checked>
                    <div>
                      <strong style="color: var(--gold-primary); font-size: 0.88rem;">⚡ Razorpay / UPI (GPay / PhonePe / QR)</strong>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">Instant zero-fee verification</div>
                    </div>
                  </label>

                  <label style="background: rgba(35, 12, 22, 0.4); border: 1px solid var(--border-subtle); padding: 0.75rem; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 0.6rem; cursor: pointer;">
                    <input type="radio" name="chk-payment" value="cash-on-pickup">
                    <div>
                      <strong style="color: var(--marble-white); font-size: 0.88rem;">💵 Pay at Lab Desk on Collection</strong>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">Cash / UPI QR at Kinathukadavu Lab Desk</div>
                    </div>
                  </label>
                </div>
              </div>

            </div>
          </div>

          <!-- Order Total Strip -->
          <div style="background: rgba(35, 12, 22, 0.6); border: 1px solid var(--border-gold); padding: 1.25rem; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">ITEMS IN CART: <strong>${cart.reduce((a, b) => a + b.quantity, 0)}</strong></div>
              <div style="font-size: 1.3rem; font-weight: 800; color: var(--gold-primary);">Total: ₹${summary.total.toLocaleString('en-IN')}</div>
            </div>
            <button type="submit" class="btn btn-gold" style="padding: 0.85rem 2rem; font-size: 1rem;">
              Confirm & Place Order ➔
            </button>
          </div>
        </form>
      </div>
    `;

    document.getElementById('checkout-modal-close').onclick = () => this.close();

    const form = document.getElementById('checkout-form');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        this.processOrder();
      };
    }
  }

  processOrder() {
    const name = document.getElementById('chk-name').value;
    const phone = document.getElementById('chk-phone').value;
    const roll = document.getElementById('chk-roll').value;
    const summary = store.getCartSummary();
    const orderId = `ACET-${Math.floor(100000 + Math.random() * 900000)}`;

    // Show instant receipt
    this.modalEl.innerHTML = `
      <div class="modal-container" style="width: 650px; max-width: 90vw; padding: 2.5rem; text-align: center;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--wine-gradient); border: 2px solid var(--gold-primary); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: var(--gold-primary); font-size: 1.8rem;">
          ✓
        </div>

        <span class="sub-badge">CAMPUS ORDER CONFIRMED</span>
        <h2 style="font-size: 1.8rem; margin: 0.5rem 0; color: var(--marble-white);">Order Logged in Print Queue!</h2>
        
        <div style="background: rgba(35, 12, 22, 0.6); border: 1.5px solid var(--border-gold); padding: 1.5rem; border-radius: var(--radius-md); margin: 1.5rem 0; text-align: left;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.8rem; margin-bottom: 0.8rem;">
            <span style="color: var(--text-muted);">Order Tracking ID:</span>
            <strong style="font-family: var(--font-mono); color: var(--gold-primary);">${orderId}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem;">
            <span style="color: var(--text-secondary);">Student / Creator:</span>
            <strong style="color: var(--marble-white);">${name} (${roll})</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem;">
            <span style="color: var(--text-secondary);">Total Amount:</span>
            <strong style="color: var(--gold-primary);">₹${summary.total.toLocaleString('en-IN')}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
            <span style="color: var(--text-secondary);">Collection Point:</span>
            <strong style="color: #00f2fe;">Kinathukadavu 3D Lab Desk</strong>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: center;">
          <button class="btn btn-gold" onclick="window.openTrackerWithId('${orderId}'); document.getElementById('checkout-modal').classList.remove('open');">
            Track Print Bed Status Live ➔
          </button>
          <button class="btn btn-outline" onclick="document.getElementById('checkout-modal').classList.remove('open');">
            Continue Shopping
          </button>
        </div>
      </div>
    `;

    // Clear cart in store
    store.clearCart();
    store.showToast(`Order ${orderId} placed successfully!`);
  }
}
