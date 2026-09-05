/**
 * ACET 3D — Quick View & Full Product Detail Modal with 3D WebGL Inspection
 * Theme: Red Wine & Carrara Marble
 */

import { Acet3DViewer } from './viewer3D.js';
import { store } from '../utils/store.js';
import { PRODUCTS } from '../data/catalog.js';

export class QuickViewModal {
  constructor() {
    this.modalEl = document.getElementById('quickview-modal');
    this.activeViewer = null;
    this.currentProduct = null;
    this.selectedMaterial = null;
    this.selectedSize = null;
    this.quantity = 1;
    this.init();
  }

  init() {
    if (!this.modalEl) return;
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });
  }

  open(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    this.currentProduct = product;
    this.selectedMaterial = product.materials ? product.materials[0] : null;
    this.selectedSize = product.sizes ? product.sizes[0] : null;
    this.quantity = 1;

    this.renderModal();
    this.modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';

    this.init3D();
  }

  close() {
    if (this.activeViewer) {
      this.activeViewer.destroy();
      this.activeViewer = null;
    }
    this.modalEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  init3D() {
    const stage = document.getElementById('modal-3d-stage');
    if (!stage) return;

    if (this.activeViewer) {
      this.activeViewer.destroy();
    }

    this.activeViewer = new Acet3DViewer(stage, {
      geometryType: this.currentProduct.geometryType || 'bust',
      materialType: this.selectedMaterial ? this.selectedMaterial.id : 'resin'
    });

    const wireframeBtn = document.getElementById('modal-wf-toggle');
    if (wireframeBtn) {
      wireframeBtn.onclick = () => {
        const isWf = this.activeViewer.toggleWireframe();
        wireframeBtn.classList.toggle('active', isWf);
      };
    }

    const resetBtn = document.getElementById('modal-reset-cam');
    if (resetBtn) {
      resetBtn.onclick = () => this.activeViewer.resetCamera();
    }
  }

  calculatePrice() {
    if (!this.currentProduct) return 0;
    const base = this.currentProduct.salePrice;
    const matDelta = this.selectedMaterial ? this.selectedMaterial.delta : 0;
    const mult = this.selectedSize ? this.selectedSize.priceMult : 1.0;
    return Math.round((base + matDelta) * mult);
  }

  renderModal() {
    const p = this.currentProduct;
    const currentPrice = this.calculatePrice();

    this.modalEl.innerHTML = `
      <div class="modal-container quickview-layout">
        <button class="modal-close-btn" id="modal-close-trigger" aria-label="Close modal">✕</button>

        <!-- Left Media Pane (Toggle between 3D and Studio Photos) -->
        <div class="quickview-media-pane">
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; width: 100%;">
            <button class="btn btn-sm btn-outline active-media-tab" id="tab-btn-3d" style="flex: 1; border-color: var(--gold-primary); color: var(--gold-primary); background: rgba(212, 175, 55, 0.1);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
              Interactive 3D View
            </button>
            <button class="btn btn-sm btn-outline" id="tab-btn-photo" style="flex: 1;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              Lab Photos
            </button>
          </div>

          <!-- 3D Viewport View -->
          <div id="modal-3d-view-wrap" style="width: 100%; display: block;">
            <div class="viewer3d-container" id="modal-3d-stage">
              <div class="viewer3d-hud">
                <div class="viewer3d-pill">
                  <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--gold-primary); display: inline-block;"></span>
                  WebGL 60 FPS
                </div>
                <div class="viewer3d-hud-actions">
                  <button class="hud-btn" id="modal-wf-toggle" title="Toggle Wireframe Mesh">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                  </button>
                  <button class="hud-btn" id="modal-reset-cam" title="Reset View">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                  </button>
                </div>
              </div>
              <div class="viewer3d-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3"></path></svg>
                Drag to rotate • Scroll to zoom 3D model
              </div>
            </div>
          </div>

          <!-- Photo View -->
          <div id="modal-photo-view-wrap" style="width: 100%; display: none;">
            <div style="width: 100%; aspect-ratio: 1/1; border-radius: var(--radius-md); overflow: hidden; background: #14050d; border: 1px solid var(--border-medium);">
              <img id="modal-main-photo" src="${p.image}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
              <img class="modal-thumb-btn active" src="${p.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-sm); border: 2px solid var(--gold-primary); cursor: pointer;">
              <img class="modal-thumb-btn" src="${p.imageHover}" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-sm); border: 2px solid transparent; cursor: pointer;">
            </div>
          </div>
        </div>

        <!-- Right Product Configuration & Detail Pane -->
        <div class="quickview-info-pane">
          <div>
            <div class="product-category-tag">${p.categoryLabel} • ${p.subcategory}</div>
            <h2 style="font-size: 1.65rem; margin-bottom: 0.4rem; color: var(--marble-white);">${p.title}</h2>
            <div class="product-rating-row">
              <div class="stars-wrap">★★★★★</div>
              <span style="color: var(--marble-white); font-weight: 600;">${p.rating}</span>
              <span class="review-count">(${p.reviewCount} verified reviews)</span>
            </div>
          </div>

          <!-- Price Row -->
          <div class="price-box" style="align-items: baseline; gap: 0.75rem;">
            <span class="sale-price" id="modal-price-display" style="font-size: 1.8rem; color: var(--gold-primary);">₹${currentPrice.toLocaleString('en-IN')}</span>
            <span class="regular-price" style="font-size: 1.1rem;">₹${(p.regularPrice * (this.selectedSize ? this.selectedSize.priceMult : 1)).toLocaleString('en-IN')}</span>
            <span class="badge" style="background: var(--wine-700); color: #fff; border: 1px solid var(--border-gold);">CLUB SUBSIDIZED</span>
          </div>

          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">
            ${p.description}
          </p>

          <!-- Material Selector -->
          <div class="material-selector-wrap">
            <div class="material-selector-label">
              <span>Select Material / Finish:</span>
              <span class="selected-mat-name" id="modal-mat-label">${this.selectedMaterial ? this.selectedMaterial.name : ''}</span>
            </div>
            <div class="material-swatches-grid">
              ${p.materials.map(m => `
                <div class="material-swatch-card ${m.id === this.selectedMaterial.id ? 'active' : ''}" data-mat-id="${m.id}">
                  <div class="material-color-disc swatch-${m.id}" style="background-color: ${m.color};"></div>
                  <div class="material-swatch-name">${m.name.split(' ')[0]}</div>
                  <div class="material-swatch-delta">${m.delta === 0 ? 'Standard' : (m.delta > 0 ? '+₹' + m.delta : '-₹' + Math.abs(m.delta))}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Size / Scale Selector -->
          ${p.sizes && p.sizes.length > 1 ? `
            <div style="margin-top: 0.5rem;">
              <div style="font-size: 0.82rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--marble-white);">Select Scale / Dimension:</div>
              <div class="size-selector-grid">
                ${p.sizes.map(s => `
                  <button class="size-pill-btn ${s.id === this.selectedSize.id ? 'active' : ''}" data-size-id="${s.id}">
                    ${s.name}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Print Specs Matrix -->
          <div class="print-spec-meta-list">
            <div class="print-spec-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>Print Time: <strong>${p.specs.printTime}</strong></span>
            </div>
            <div class="print-spec-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
              <span>Layer: <strong>${p.specs.resolution}</strong></span>
            </div>
            <div class="print-spec-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span>Warranty: <strong>${p.specs.warranty}</strong></span>
            </div>
            <div class="print-spec-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>Campus Pickup: <strong>Kinathukadavu</strong></span>
            </div>
          </div>

          <!-- Quantity and Add To Cart Action -->
          <div style="display: flex; gap: 1rem; align-items: center; margin-top: 0.5rem;">
            <div class="cart-stepper" style="padding: 0.4rem 0.6rem; border-radius: var(--radius-md);">
              <button id="modal-qty-minus" style="font-size: 1.1rem; width: 28px;">-</button>
              <span id="modal-qty-val" style="font-size: 1rem; padding: 0 0.8rem;">1</span>
              <button id="modal-qty-plus" style="font-size: 1.1rem; width: 28px;">+</button>
            </div>
            <button class="btn btn-primary" id="modal-add-cart-btn" style="flex: 1; padding: 1rem;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              Add to Cart • ₹${currentPrice.toLocaleString('en-IN')}
            </button>
          </div>

          <div style="background: rgba(84, 13, 42, 0.3); border-left: 3px solid var(--gold-primary); padding: 0.75rem 1rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 0.8rem; color: var(--text-secondary);">
            🏛️ <strong>Authenticity:</strong> Manufactured by ACET 3D Printing Club under faculty mentorship. Available for direct campus pickup at Kinathukadavu or doorstep courier.
          </div>
        </div>
      </div>
    `;

    document.getElementById('modal-close-trigger').onclick = () => this.close();

    const tab3d = document.getElementById('tab-btn-3d');
    const tabPhoto = document.getElementById('tab-btn-photo');
    const view3d = document.getElementById('modal-3d-view-wrap');
    const viewPhoto = document.getElementById('modal-photo-view-wrap');

    tab3d.onclick = () => {
      tab3d.classList.add('active-media-tab');
      tab3d.style.borderColor = 'var(--gold-primary)';
      tab3d.style.color = 'var(--gold-primary)';
      tab3d.style.background = 'rgba(212, 175, 55, 0.1)';
      tabPhoto.classList.remove('active-media-tab');
      tabPhoto.style.borderColor = 'var(--border-medium)';
      tabPhoto.style.color = 'var(--text-primary)';
      tabPhoto.style.background = 'none';
      view3d.style.display = 'block';
      viewPhoto.style.display = 'none';
      if (this.activeViewer) this.activeViewer.onResize();
    };

    tabPhoto.onclick = () => {
      tabPhoto.classList.add('active-media-tab');
      tabPhoto.style.borderColor = 'var(--gold-primary)';
      tabPhoto.style.color = 'var(--gold-primary)';
      tabPhoto.style.background = 'rgba(212, 175, 55, 0.1)';
      tab3d.classList.remove('active-media-tab');
      tab3d.style.borderColor = 'var(--border-medium)';
      tab3d.style.color = 'var(--text-primary)';
      tab3d.style.background = 'none';
      view3d.style.display = 'none';
      viewPhoto.style.display = 'block';
    };

    const mainPhoto = document.getElementById('modal-main-photo');
    const thumbs = this.modalEl.querySelectorAll('.modal-thumb-btn');
    thumbs.forEach(t => {
      t.onclick = () => {
        thumbs.forEach(other => other.style.borderColor = 'transparent');
        t.style.borderColor = 'var(--gold-primary)';
        mainPhoto.src = t.src;
      };
    });

    const matCards = this.modalEl.querySelectorAll('.material-swatch-card');
    matCards.forEach(c => {
      c.onclick = () => {
        const matId = c.getAttribute('data-mat-id');
        this.selectedMaterial = p.materials.find(m => m.id === matId);
        matCards.forEach(mc => mc.classList.remove('active'));
        c.classList.add('active');

        document.getElementById('modal-mat-label').textContent = this.selectedMaterial.name;
        this.updatePriceDisplay();

        if (this.activeViewer) {
          this.activeViewer.setMaterial(matId);
        }
      };
    });

    const sizeBtns = this.modalEl.querySelectorAll('.size-pill-btn');
    sizeBtns.forEach(sb => {
      sb.onclick = () => {
        const sizeId = sb.getAttribute('data-size-id');
        this.selectedSize = p.sizes.find(s => s.id === sizeId);
        sizeBtns.forEach(other => other.classList.remove('active'));
        sb.classList.add('active');
        this.updatePriceDisplay();
      };
    });

    const qtyVal = document.getElementById('modal-qty-val');
    document.getElementById('modal-qty-minus').onclick = () => {
      if (this.quantity > 1) {
        this.quantity--;
        qtyVal.textContent = this.quantity;
      }
    };
    document.getElementById('modal-qty-plus').onclick = () => {
      this.quantity++;
      qtyVal.textContent = this.quantity;
    };

    document.getElementById('modal-add-cart-btn').onclick = () => {
      store.addToCart(p, {
        material: this.selectedMaterial,
        size: this.selectedSize,
        quantity: this.quantity
      });
      this.close();
      if (window.acetCartDrawer) {
        window.acetCartDrawer.open();
      }
    };
  }

  updatePriceDisplay() {
    const updated = this.calculatePrice();
    const disp = document.getElementById('modal-price-display');
    const cartBtn = document.getElementById('modal-add-cart-btn');
    if (disp) disp.textContent = `₹${updated.toLocaleString('en-IN')}`;
    if (cartBtn) cartBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
      Add to Cart • ₹${updated.toLocaleString('en-IN')}
    `;
  }
}
