/**
 * ACET 3D — Full Collection Page & Filter Sidebar View
 * Category taxonomy, material filtering, price sliders, and sorting engine.
 */

import { PRODUCTS, CATEGORIES } from '../data/catalog.js';
import { generateProductCardHtml } from '../app.js';

export class CollectionView {
  constructor() {
    this.modalEl = document.getElementById('collection-view-modal');
    this.activeCategory = 'all';
    this.selectedMaterial = 'all';
    this.maxPrice = 5000;
    this.sortBy = 'popular';
    this.init();
  }

  init() {
    if (this.modalEl) {
      this.modalEl.addEventListener('click', (e) => {
        if (e.target === this.modalEl) this.close();
      });
    }
  }

  open(categoryId = 'all') {
    this.activeCategory = categoryId;
    if (!this.modalEl) {
      let modal = document.createElement('div');
      modal.id = 'collection-view-modal';
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

  getFilteredProducts() {
    let list = [...PRODUCTS];

    if (this.activeCategory !== 'all') {
      list = list.filter(p => p.category === this.activeCategory);
    }

    if (this.selectedMaterial !== 'all') {
      list = list.filter(p => {
        const mat = (p.specs.material || '').toLowerCase();
        return mat.includes(this.selectedMaterial);
      });
    }

    list = list.filter(p => p.salePrice <= this.maxPrice);

    if (this.sortBy === 'price-low') {
      list.sort((a, b) => a.salePrice - b.salePrice);
    } else if (this.sortBy === 'price-high') {
      list.sort((a, b) => b.salePrice - a.salePrice);
    } else if (this.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }

  render() {
    const products = this.getFilteredProducts();
    const currentCategoryObj = CATEGORIES.find(c => c.id === this.activeCategory) || { name: 'Complete Collection' };

    this.modalEl.innerHTML = `
      <div class="modal-container" style="width: 1200px; max-width: 96vw; height: 90vh; padding: 2.5rem; display: flex; flex-direction: column;">
        <button class="modal-close-btn" id="collection-modal-close" aria-label="Close collection view">✕</button>
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span class="sub-badge" style="font-size: 0.75rem;">ACET 3D PRINTING CLUB CATALOG</span>
            <h2 style="font-size: 1.8rem; margin-top: 0.3rem; color: var(--marble-white);">${currentCategoryObj.name}</h2>
            <p style="font-size: 0.88rem; color: var(--text-secondary);">Showing <strong>${products.length}</strong> items • 50-micron SLA & FDM additive manufacturing</p>
          </div>

          <!-- Sort Select -->
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <label style="font-size: 0.85rem; color: var(--text-muted);">Sort by:</label>
            <select id="collection-sort-select" class="form-control" style="padding: 0.45rem 1rem; font-size: 0.85rem; width: auto;">
              <option value="popular" ${this.sortBy === 'popular' ? 'selected' : ''}>Most Popular</option>
              <option value="price-low" ${this.sortBy === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
              <option value="price-high" ${this.sortBy === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
              <option value="rating" ${this.sortBy === 'rating' ? 'selected' : ''}>Highest Rated (5★)</option>
            </select>
          </div>
        </div>

        <!-- Main Body: Filter Sidebar + Products Grid -->
        <div style="display: grid; grid-template-columns: 260px 1fr; gap: 2rem; flex: 1; min-height: 0;">
          
          <!-- Filter Sidebar -->
          <div style="background: rgba(35, 12, 22, 0.4); border: 1px solid var(--border-gold); border-radius: var(--radius-md); padding: 1.5rem; overflow-y: auto;">
            <h4 style="font-size: 0.95rem; color: var(--gold-primary); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em;">Filters</h4>

            <!-- Category List -->
            <div style="margin-bottom: 1.5rem;">
              <label class="form-label" style="font-size: 0.8rem; text-transform: uppercase;">Category</label>
              <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                <button class="filter-cat-btn ${this.activeCategory === 'all' ? 'active-cat' : ''}" data-cat="all">All Products</button>
                ${CATEGORIES.filter(c => c.id !== 'all').map(c => `
                  <button class="filter-cat-btn ${this.activeCategory === c.id ? 'active-cat' : ''}" data-cat="${c.id}">${c.name}</button>
                `).join('')}
              </div>
            </div>

            <!-- Material Filter -->
            <div style="margin-bottom: 1.5rem; border-top: 1px solid var(--border-subtle); padding-top: 1.2rem;">
              <label class="form-label" style="font-size: 0.8rem; text-transform: uppercase;">Material</label>
              <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                  <input type="radio" name="filter-mat" value="all" ${this.selectedMaterial === 'all' ? 'checked' : ''}> All Materials
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                  <input type="radio" name="filter-mat" value="marble" ${this.selectedMaterial === 'marble' ? 'checked' : ''}> Carrara Marble SLA
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                  <input type="radio" name="filter-mat" value="pla" ${this.selectedMaterial === 'pla' ? 'checked' : ''}> Bordeaux Red Wine PLA
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                  <input type="radio" name="filter-mat" value="nylon" ${this.selectedMaterial === 'nylon' ? 'checked' : ''}> PA12 Carbon Nylon
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                  <input type="radio" name="filter-mat" value="brass" ${this.selectedMaterial === 'brass' ? 'checked' : ''}> Cold-Cast Brass Metal
                </label>
              </div>
            </div>

            <!-- Price Slider -->
            <div style="border-top: 1px solid var(--border-subtle); padding-top: 1.2rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <label class="form-label" style="font-size: 0.8rem; margin-bottom: 0; text-transform: uppercase;">Max Price</label>
                <span style="font-weight: 700; color: var(--gold-primary); font-size: 0.85rem;">₹${this.maxPrice}</span>
              </div>
              <input type="range" id="collection-price-slider" min="500" max="5000" step="250" value="${this.maxPrice}" style="width: 100%; accent-color: var(--gold-primary);">
            </div>
          </div>

          <!-- Products Grid -->
          <div style="overflow-y: auto; padding-right: 0.5rem;">
            ${products.length > 0 ? `
              <div class="product-grid-4" style="grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));">
                ${products.map(p => generateProductCardHtml(p)).join('')}
              </div>
            ` : `
              <div style="text-align: center; padding: 4rem; color: var(--text-muted);">
                <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔍</div>
                <h3>No 3D Models Match Your Filters</h3>
                <p style="margin-top: 0.5rem;">Try adjusting the price slider or selecting another material.</p>
              </div>
            `}
          </div>

        </div>
      </div>
    `;

    // Bind event listeners
    document.getElementById('collection-modal-close').onclick = () => this.close();

    const sortSelect = document.getElementById('collection-sort-select');
    if (sortSelect) {
      sortSelect.onchange = (e) => {
        this.sortBy = e.target.value;
        this.render();
      };
    }

    this.modalEl.querySelectorAll('.filter-cat-btn').forEach(btn => {
      btn.onclick = () => {
        this.activeCategory = btn.getAttribute('data-cat');
        this.render();
      };
    });

    this.modalEl.querySelectorAll('input[name="filter-mat"]').forEach(radio => {
      radio.onchange = (e) => {
        this.selectedMaterial = e.target.value;
        this.render();
      };
    });

    const priceSlider = document.getElementById('collection-price-slider');
    if (priceSlider) {
      priceSlider.oninput = (e) => {
        this.maxPrice = parseInt(e.target.value, 10);
        this.render();
      };
    }
  }
}
