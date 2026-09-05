/**
 * ACET 3D — Main Application Orchestrator
 * Akshaya College of Engineering & Technology 3D Printing Club & Store
 */

import { PRODUCTS, CATEGORIES, LIFESTYLE_BANNERS, STUDIOS, TESTIMONIALS } from './data/catalog.js';
import { store } from './utils/store.js';
import { CartDrawer } from './components/cartDrawer.js';
import { QuickViewModal } from './components/quickViewModal.js';
import { CustomOrderStudio } from './components/customOrder.js';
import { AdminDashboard } from './components/adminDashboard.js';
import { CollectionView } from './components/collectionModal.js';
import { CheckoutModal } from './components/checkoutModal.js';

document.addEventListener('DOMContentLoaded', () => {
  window.acetCartDrawer = new CartDrawer();
  window.acetQuickView = new QuickViewModal();
  window.acetCustomStudio = new CustomOrderStudio();
  window.acetAdminDashboard = new AdminDashboard();
  window.acetCollectionView = new CollectionView();
  window.acetCheckoutModal = new CheckoutModal();

  initAnnouncementBar();
  initHeader();
  initHeroCarousel();

  renderTrendingProducts();
  renderBestSellers();
  renderLifestyleBanners();
  renderNewLaunches();
  renderFeaturedDrops();
  renderCollectionsTabs();
  renderTestimonials();
  renderStudios();

  initStatsObserver();
  initSearchModal();
  initTrackOrderModal();
  initNewsletter();
});

function initAnnouncementBar() {
  const items = document.querySelectorAll('.announcement-item');
  if (!items.length) return;
  let currentIdx = 0;

  setInterval(() => {
    items[currentIdx].classList.remove('active');
    currentIdx = (currentIdx + 1) % items.length;
    items[currentIdx].classList.add('active');
  }, 4500);
}

function initHeader() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      if (mobileDrawer.classList.contains('open')) {
        mobileDrawer.style.display = 'block';
      } else {
        mobileDrawer.style.display = 'none';
      }
    });
  }
}

function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  if (!slides.length) return;

  let activeIndex = 0;
  let autoplayTimer = null;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    activeIndex = (index + slides.length) % slides.length;
    slides[activeIndex].classList.add('active');
    if (dots[activeIndex]) dots[activeIndex].classList.add('active');
  }

  function startAutoplay() {
    autoplayTimer = setInterval(() => showSlide(activeIndex + 1), 6500);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(activeIndex + 1);
      resetAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(activeIndex - 1);
      resetAutoplay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      resetAutoplay();
    });
  });

  startAutoplay();
}

export function generateProductCardHtml(product) {
  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-thumb-wrap" onclick="window.acetQuickView.open('${product.id}')">
        <img src="${product.image}" alt="${product.title}" class="product-img" loading="lazy">
        <img src="${product.imageHover}" alt="${product.title} angle" class="product-img-hover" loading="lazy">
        
        <div class="product-badge-group">
          ${product.badge ? `<span class="badge" style="background: var(--wine-700); color: #fff; border: 1px solid var(--border-gold);">${product.badge}</span>` : ''}
          <span class="badge badge-material">${product.specs.resolution.split(' ')[0]}</span>
        </div>

        <div class="product-quick-actions" onclick="event.stopPropagation();">
          <button class="btn-quick-view" onclick="window.acetQuickView.open('${product.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            Quick Configure
          </button>
          <button class="btn-3d-inspect" title="Inspect 3D Geometry" onclick="window.acetQuickView.open('${product.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
          </button>
        </div>
      </div>

      <div class="product-info">
        <div class="product-category-tag">${product.categoryLabel}</div>
        <h3 class="product-title" title="${product.title}" onclick="window.acetQuickView.open('${product.id}')" style="cursor: pointer;">${product.title}</h3>
        
        <div class="product-rating-row">
          <div class="stars-wrap">★★★★★</div>
          <span style="color: var(--marble-white); font-weight: 600;">${product.rating}</span>
          <span class="review-count">(${product.reviewCount})</span>
        </div>

        <div class="product-specs-chip">
          <span>⏱️ ${product.specs.printTime}</span>
          <span>⚖️ ${product.specs.weight}</span>
        </div>

        <div class="product-price-row">
          <div class="price-box">
            <span class="sale-price">₹${product.salePrice.toLocaleString('en-IN')}</span>
            <span class="regular-price">₹${product.regularPrice.toLocaleString('en-IN')}</span>
          </div>
          <button class="btn-card-add" title="Quick Add Standard to Cart" onclick="window.quickAddToCart('${product.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

window.quickAddToCart = function(productId) {
  const p = PRODUCTS.find(prod => prod.id === productId);
  if (p) {
    store.addToCart(p);
    if (window.acetCartDrawer) window.acetCartDrawer.open();
  }
};

function renderTrendingProducts() {
  const container = document.getElementById('trending-products-grid');
  if (!container) return;
  const trending = PRODUCTS.filter(p => p.isTrending).slice(0, 4);
  container.innerHTML = trending.map(p => generateProductCardHtml(p)).join('');
}

function renderBestSellers() {
  const container = document.getElementById('bestsellers-grid');
  if (!container) return;
  const best = PRODUCTS.filter(p => p.isBestSeller || p.rating >= 4.9).slice(0, 8);
  container.innerHTML = best.map(p => generateProductCardHtml(p)).join('');
}

function renderLifestyleBanners() {
  const container = document.getElementById('lifestyle-banners-grid');
  if (!container) return;
  container.innerHTML = LIFESTYLE_BANNERS.map(b => `
    <div class="lifestyle-banner ${b.gridClass}" onclick="window.filterByCategory('${b.linkCategoryId}')" style="cursor: pointer;">
      <img src="${b.image}" alt="${b.title}" class="lifestyle-bg" loading="lazy">
      <div class="lifestyle-overlay"></div>
      <div class="lifestyle-content">
        <span class="lifestyle-tag">${b.tag}</span>
        <h3 class="lifestyle-title">${b.title}</h3>
        <p style="color: var(--text-secondary); font-size: 0.88rem;">${b.subtitle}</p>
        <span class="lifestyle-link">
          Explore Series 
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </span>
      </div>
    </div>
  `).join('');
}

function renderNewLaunches() {
  const container = document.getElementById('new-launches-grid');
  if (!container) return;
  const launches = PRODUCTS.filter(p => p.isNewLaunch || p.category === 'new-launches').slice(0, 4);
  container.innerHTML = launches.map(p => generateProductCardHtml(p)).join('');
}

function renderFeaturedDrops() {
  const container = document.getElementById('featured-drops-grid');
  if (!container) return;
  const drops = PRODUCTS.filter(p => p.isFeaturedCollab).slice(0, 4);
  container.innerHTML = drops.map(p => generateProductCardHtml(p)).join('');
}

function renderCollectionsTabs() {
  const tabsContainer = document.getElementById('collections-tabs-nav');
  const gridContainer = document.getElementById('collections-product-grid');
  if (!tabsContainer || !gridContainer) return;

  tabsContainer.innerHTML = CATEGORIES.map((cat, idx) => `
    <button class="tab-btn ${idx === 0 ? 'active' : ''}" data-cat-id="${cat.id}">
      ${cat.name} ${cat.discount ? `<span style="background: var(--wine-700); color:#fff; border: 1px solid var(--border-gold); font-size:0.65rem; padding:0.1rem 0.4rem; border-radius:99px; margin-left:4px;">${cat.discount}</span>` : ''}
    </button>
  `).join('');

  function loadCategory(catId) {
    let filtered = PRODUCTS;
    if (catId !== 'all') {
      filtered = PRODUCTS.filter(p => p.category === catId);
    }
    gridContainer.innerHTML = filtered.map(p => generateProductCardHtml(p)).join('');
  }

  loadCategory('all');

  tabsContainer.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadCategory(btn.getAttribute('data-cat-id'));
    });
  });

  window.filterByCategory = function(catId) {
    const targetBtn = tabsContainer.querySelector(`[data-cat-id="${catId}"]`);
    if (targetBtn) {
      targetBtn.click();
      const section = document.getElementById('explore-collections');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  };
}

function renderTestimonials() {
  const container = document.getElementById('testimonials-grid');
  if (!container) return;
  container.innerHTML = TESTIMONIALS.map(t => `
    <div class="testimonial-card">
      <div>
        <div class="stars-wrap" style="margin-bottom: 1rem;">★★★★★</div>
        <p class="testimonial-quote" style="color: var(--text-secondary); font-style: italic;">“${t.quote}”</p>
      </div>
      <div>
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.5rem;">
          Verified Project: <strong style="color: var(--gold-primary);">${t.productPurchased}</strong>
        </div>
        <div style="display: flex; align-items: center; gap: 0.85rem;">
          <img src="${t.avatar}" alt="${t.author}" class="author-avatar">
          <div>
            <h5 style="color: var(--marble-white); font-size: 0.95rem;">${t.author}</h5>
            <p style="font-size: 0.8rem; color: var(--gold-primary);">${t.role}</p>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderStudios() {
  const container = document.getElementById('studios-grid');
  if (!container) return;
  container.innerHTML = STUDIOS.map(s => `
    <div class="studio-card">
      <div class="studio-gallery-strip">
        <img src="${s.images[0]}" alt="${s.name}" loading="lazy">
        <img src="${s.images[1]}" alt="${s.city} Print Lab" loading="lazy">
      </div>
      <div class="studio-info">
        <div class="studio-city">${s.city}</div>
        <h4 class="studio-name" style="color: var(--marble-white);">${s.name}</h4>
        
        <div class="studio-detail-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>${s.address}</span>
        </div>

        <div class="studio-detail-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span>${s.hours}</span>
        </div>

        <div class="studio-detail-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          <span>${s.phone}</span>
        </div>

        <a href="https://maps.google.com/?q=Akshaya+College+of+Engineering+and+Technology+Kinathukadavu" target="_blank" rel="noopener" class="studio-direction-link">
          Get Campus Directions & Book Lab Slot
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </a>
      </div>
    </div>
  `).join('');
}

function initStatsObserver() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'), 10);
        const prefix = entry.target.getAttribute('data-prefix') || '';
        const suffix = entry.target.getAttribute('data-suffix') || '';
        let current = 0;
        const step = Math.ceil(target / 45);

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          entry.target.textContent = `${prefix}${current.toLocaleString('en-IN')}${suffix}`;
        }, 30);

        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  statNumbers.forEach(num => observer.observe(num));
}

function initSearchModal() {
  const modal = document.getElementById('search-modal');
  const trigger = document.getElementById('search-modal-trigger');
  const input = document.getElementById('search-input-field');
  const resultsContainer = document.getElementById('search-results-grid');

  if (!modal || !trigger) return;

  trigger.addEventListener('click', () => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (input) {
      input.value = '';
      input.focus();
      renderSearchResults('');
    }
  });

  const closeBtn = document.getElementById('search-modal-close');
  if (closeBtn) closeBtn.onclick = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  if (input) {
    input.addEventListener('input', (e) => renderSearchResults(e.target.value));
  }

  function renderSearchResults(query) {
    if (!resultsContainer) return;
    const q = query.toLowerCase().trim();
    let matches = PRODUCTS;
    if (q) {
      matches = PRODUCTS.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
          No matching 3D models found for "${query}". Try searching "Crest", "Gearbox", "Marble", or "Trophy".
        </div>
      `;
    } else {
      resultsContainer.innerHTML = matches.map(p => generateProductCardHtml(p)).join('');
    }
  }
}

function initTrackOrderModal() {
  const modal = document.getElementById('track-modal');
  const triggers = document.querySelectorAll('.trigger-track-order');
  const input = document.getElementById('track-order-input');
  const submitBtn = document.getElementById('track-order-submit');
  const output = document.getElementById('track-order-output');

  if (!modal) return;

  triggers.forEach(t => t.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }));

  const closeBtn = document.getElementById('track-modal-close');
  if (closeBtn) closeBtn.onclick = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  window.openTrackerWithId = function(orderId) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (input) input.value = orderId;
    renderTracking(orderId);
  };

  if (submitBtn && input) {
    submitBtn.addEventListener('click', () => {
      const val = input.value.trim();
      if (!val) {
        alert('Please enter an Order ID or Roll Number');
        return;
      }
      renderTracking(val);
    });
  }

  function renderTracking(orderId) {
    if (!output) return;
    output.style.display = 'block';
    output.innerHTML = `
      <div style="background: rgba(35, 12, 22, 0.6); border: 1.5px solid var(--border-gold); border-radius: var(--radius-md); padding: 1.5rem; margin-top: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.8rem;">
          <div>
            <span style="font-size: 0.75rem; color: var(--text-muted);">CAMPUS ORDER #</span>
            <div style="font-family: var(--font-mono); font-weight: 700; color: var(--gold-primary); font-size: 1.15rem;">${orderId.toUpperCase()}</div>
          </div>
          <span class="badge" style="background: var(--wine-700); color: #fff; border: 1px solid var(--border-gold); display: inline-flex; align-items: center; gap: 0.3rem;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--gold-primary); animation: pulseHint 1s infinite;"></span>
            Printing on Bed 02 (Kinathukadavu)
          </span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="display: flex; gap: 1rem; align-items: flex-start;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--gold-primary); color: #1a050d; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold;">✓</div>
            <div>
              <div style="font-weight: 600; font-size: 0.9rem; color: var(--marble-white);">CAD Slicing & Mesh Audit</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">50-micron Cura / PrusaSlicer profile configured</div>
            </div>
          </div>

          <div style="display: flex; gap: 1rem; align-items: flex-start;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--wine-600); color: #fff; border: 1px solid var(--gold-primary); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold;">⚙️</div>
            <div>
              <div style="font-weight: 600; font-size: 0.9rem; color: var(--gold-primary);">Precision 3D Printing In Progress</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Layer 1,840 of 3,200 • Ready at campus lab in 3 hours</div>
            </div>
          </div>

          <div style="display: flex; gap: 1rem; align-items: flex-start; opacity: 0.45;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.1); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">3</div>
            <div>
              <div style="font-weight: 600; font-size: 0.9rem;">UV Post-Curing & Gold Hand Buffing</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Quality inspection by club faculty mentor</div>
            </div>
          </div>

          <div style="display: flex; gap: 1rem; align-items: flex-start; opacity: 0.45;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.1); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">4</div>
            <div>
              <div style="font-weight: 600; font-size: 0.9rem;">Ready for Campus Pickup / Courier</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Kinathukadavu 3D Lab Desk or BlueDart Air</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(f => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = f.querySelector('input[type="email"]');
      if (input && input.value) {
        store.showToast(`Thank you! ${input.value} subscribed to ACET 3D Club updates & drop alerts.`);
        input.value = '';
      }
    });
  });
}
