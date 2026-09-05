/**
 * ACET 3D — Admin Dashboard & Print Farm Management Component
 * Allows ACET 3D Club coordinators & faculty advisors to manage orders,
 * monitor 3D print beds, inspect custom CAD submissions, and update inventory.
 */

import { PRODUCTS } from '../data/catalog.js';
import { store } from '../utils/store.js';

export class AdminDashboard {
  constructor() {
    this.modalEl = document.getElementById('admin-modal');
    this.currentTab = 'orders';
    this.orders = [
      {
        id: 'ACET-84920',
        customer: 'S. Manikandan (21ME045)',
        item: 'ACET Crest Monolith (Carrara Marble)',
        total: 899,
        bed: 'Bed 02 (Ender-3 V3 SLA)',
        status: 'Printing (65%)',
        statusColor: 'var(--gold-primary)',
        time: 'Today, 10:15 AM'
      },
      {
        id: 'ACET-84921',
        customer: 'Kavitha R. (Alumnus 2022)',
        item: 'Epicyclic Planetary Gearbox',
        total: 1499,
        bed: 'Bed 05 (Prusa MK4 PA12)',
        status: 'UV Curing / QC',
        statusColor: '#00f5a0',
        time: 'Today, 09:00 AM'
      },
      {
        id: 'ACET-84922',
        customer: 'Prof. Ramesh N. (Mech HOD)',
        item: 'Akshaya Fest Winner Trophy (x4)',
        total: 7996,
        bed: 'Bed 01 & 03 (Elegoo Saturn 8K)',
        status: 'Ready for Pickup',
        statusColor: '#00f2fe',
        time: 'Yesterday'
      }
    ];

    this.cadRequests = [
      {
        id: 'ACET-CAD-4921',
        student: 'Dinesh V. (Aero 3rd Year)',
        contact: '+91 98421 22334',
        project: 'UAV Dual-Rotor Frame (STL)',
        material: 'PA12 Carbon-Fiber Nylon',
        infill: '60%',
        estPrice: '₹1,850',
        status: 'Awaiting Slice Review'
      },
      {
        id: 'ACET-CAD-4922',
        student: 'Ananya S. (Robotics Club)',
        contact: '+91 97894 11223',
        project: 'Bio-Robotic Gripper Finger Linkage',
        material: 'Matte Red Wine PLA',
        infill: '40%',
        estPrice: '₹650',
        status: 'Approved & Scheduled'
      }
    ];

    this.init();
  }

  init() {
    // Admin Trigger in Header / Footer
    const adminTriggers = document.querySelectorAll('.trigger-admin-dashboard');
    adminTriggers.forEach(t => t.addEventListener('click', (e) => {
      e.preventDefault();
      this.open();
    }));

    if (this.modalEl) {
      this.modalEl.addEventListener('click', (e) => {
        if (e.target === this.modalEl) this.close();
      });
    }
  }

  open() {
    if (!this.modalEl) {
      let modal = document.createElement('div');
      modal.id = 'admin-modal';
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
    this.modalEl.innerHTML = `
      <div class="modal-container" style="width: 1080px; max-width: 95vw; padding: 2.5rem; max-height: 88vh;">
        <button class="modal-close-btn" id="admin-modal-close" aria-label="Close admin dashboard">✕</button>
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1.2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span class="sub-badge" style="font-size: 0.75rem;">ACET 3D CLUB • STAFF & LAB TELEMETRY</span>
              <span style="font-size: 0.75rem; color: var(--gold-primary); background: rgba(212,175,55,0.1); padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px solid var(--border-gold);">
                ● 8 Active Print Beds
              </span>
            </div>
            <h2 style="font-size: 1.8rem; margin-top: 0.4rem; color: var(--marble-white);">Campus Print Farm Control Center</h2>
            <p style="font-size: 0.88rem; color: var(--text-secondary);">Akshaya College of Engineering & Technology (Kinathukadavu Main Lab)</p>
          </div>

          <!-- Top Stats Overview -->
          <div style="display: flex; gap: 1rem;">
            <div style="background: rgba(84, 13, 42, 0.35); border: 1px solid var(--border-gold); padding: 0.6rem 1.2rem; border-radius: var(--radius-md); text-align: center;">
              <div style="font-size: 0.75rem; color: var(--text-muted);">TODAY'S ORDERS</div>
              <div style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 700; color: var(--gold-primary);">${this.orders.length} Active</div>
            </div>
            <div style="background: rgba(84, 13, 42, 0.35); border: 1px solid var(--border-gold); padding: 0.6rem 1.2rem; border-radius: var(--radius-md); text-align: center;">
              <div style="font-size: 0.75rem; color: var(--text-muted);">CAD QUEUE</div>
              <div style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 700; color: var(--marble-white);">${this.cadRequests.length} Pending</div>
            </div>
          </div>
        </div>

        <!-- Dashboard Tabs -->
        <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem;">
          <button class="btn btn-sm ${this.currentTab === 'orders' ? 'btn-gold' : 'btn-outline'}" id="admin-tab-orders">
            📦 Live Orders & Print Queue (${this.orders.length})
          </button>
          <button class="btn btn-sm ${this.currentTab === 'cad' ? 'btn-gold' : 'btn-outline'}" id="admin-tab-cad">
            📐 Student CAD Submissions (${this.cadRequests.length})
          </button>
          <button class="btn btn-sm ${this.currentTab === 'inventory' ? 'btn-gold' : 'btn-outline'}" id="admin-tab-inventory">
            🏷️ Catalog & Material Stock
          </button>
        </div>

        <!-- Tab Content Area -->
        <div id="admin-tab-content">
          ${this.getTabContent()}
        </div>
      </div>
    `;

    // Attach listeners
    document.getElementById('admin-modal-close').onclick = () => this.close();
    
    document.getElementById('admin-tab-orders').onclick = () => {
      this.currentTab = 'orders';
      this.render();
    };

    document.getElementById('admin-tab-cad').onclick = () => {
      this.currentTab = 'cad';
      this.render();
    };

    document.getElementById('admin-tab-inventory').onclick = () => {
      this.currentTab = 'inventory';
      this.render();
    };

    // Action listeners for order status update
    this.modalEl.querySelectorAll('.btn-update-status').forEach(btn => {
      btn.onclick = () => {
        const orderId = btn.getAttribute('data-order-id');
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
          order.status = 'Ready for Pickup';
          order.statusColor = '#00f2fe';
          store.showToast(`Order ${orderId} updated: Ready for Campus Pickup!`);
          this.render();
        }
      };
    });

    // Action listeners for CAD approval
    this.modalEl.querySelectorAll('.btn-approve-cad').forEach(btn => {
      btn.onclick = () => {
        const cadId = btn.getAttribute('data-cad-id');
        const req = this.cadRequests.find(r => r.id === cadId);
        if (req) {
          req.status = 'Approved & Slicing Bed Scheduled';
          store.showToast(`CAD Request ${cadId} approved! Student notified via WhatsApp.`);
          this.render();
        }
      };
    });
  }

  getTabContent() {
    if (this.currentTab === 'orders') {
      return `
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 1.5px solid var(--border-gold); color: var(--gold-primary);">
                <th style="padding: 0.75rem;">Order ID</th>
                <th style="padding: 0.75rem;">Customer / Roll No</th>
                <th style="padding: 0.75rem;">Product & Spec</th>
                <th style="padding: 0.75rem;">Print Bed</th>
                <th style="padding: 0.75rem;">Total</th>
                <th style="padding: 0.75rem;">Current Status</th>
                <th style="padding: 0.75rem; text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${this.orders.map(o => `
                <tr style="border-bottom: 1px solid var(--border-subtle); background: rgba(35, 12, 22, 0.3);">
                  <td style="padding: 0.85rem; font-family: var(--font-mono); font-weight: 700; color: var(--gold-primary);">${o.id}</td>
                  <td style="padding: 0.85rem; color: var(--marble-white);">${o.customer}</td>
                  <td style="padding: 0.85rem; color: var(--text-secondary);">${o.item}</td>
                  <td style="padding: 0.85rem; font-size: 0.8rem; color: var(--text-muted);">${o.bed}</td>
                  <td style="padding: 0.85rem; font-weight: 700; color: var(--marble-white);">₹${o.total.toLocaleString('en-IN')}</td>
                  <td style="padding: 0.85rem;">
                    <span class="badge" style="background: rgba(84, 13, 42, 0.6); border: 1px solid ${o.statusColor}; color: ${o.statusColor};">
                      ${o.status}
                    </span>
                  </td>
                  <td style="padding: 0.85rem; text-align: right;">
                    ${o.status !== 'Ready for Pickup' ? `
                      <button class="btn btn-sm btn-outline btn-update-status" data-order-id="${o.id}" style="font-size: 0.75rem; padding: 0.35rem 0.75rem;">
                        Mark Ready
                      </button>
                    ` : `
                      <span style="color: #00f2fe; font-size: 0.78rem;">✓ Complete</span>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else if (this.currentTab === 'cad') {
      return `
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 1.5px solid var(--border-gold); color: var(--gold-primary);">
                <th style="padding: 0.75rem;">Request ID</th>
                <th style="padding: 0.75rem;">Student / Club</th>
                <th style="padding: 0.75rem;">CAD File & Project</th>
                <th style="padding: 0.75rem;">Material</th>
                <th style="padding: 0.75rem;">Infill</th>
                <th style="padding: 0.75rem;">Est. Price</th>
                <th style="padding: 0.75rem;">Status</th>
                <th style="padding: 0.75rem; text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${this.cadRequests.map(r => `
                <tr style="border-bottom: 1px solid var(--border-subtle); background: rgba(35, 12, 22, 0.3);">
                  <td style="padding: 0.85rem; font-family: var(--font-mono); font-weight: 700; color: var(--gold-primary);">${r.id}</td>
                  <td style="padding: 0.85rem; color: var(--marble-white);">${r.student}<br><span style="font-size: 0.75rem; color: var(--text-muted);">${r.contact}</span></td>
                  <td style="padding: 0.85rem; color: var(--text-secondary);">💾 ${r.project}</td>
                  <td style="padding: 0.85rem; font-size: 0.82rem;">${r.material}</td>
                  <td style="padding: 0.85rem; font-weight: 600; color: var(--gold-primary);">${r.infill}</td>
                  <td style="padding: 0.85rem; font-weight: 700; color: var(--marble-white);">${r.estPrice}</td>
                  <td style="padding: 0.85rem;">
                    <span class="badge" style="background: rgba(84, 13, 42, 0.6); border: 1px solid var(--gold-primary); color: var(--gold-primary);">
                      ${r.status}
                    </span>
                  </td>
                  <td style="padding: 0.85rem; text-align: right;">
                    <button class="btn btn-sm btn-gold btn-approve-cad" data-cad-id="${r.id}" style="font-size: 0.75rem; padding: 0.35rem 0.75rem;">
                      Approve & Queue
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else {
      return `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
          <div style="background: rgba(35, 12, 22, 0.4); border: 1px solid var(--border-gold); padding: 1.25rem; border-radius: var(--radius-md);">
            <h4 style="color: var(--gold-primary); margin-bottom: 0.5rem;">SLA Resin (Carrara Marble)</h4>
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.4rem;">Stock Level: <strong>14.5 Liters</strong></div>
            <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
              <div style="width: 75%; height: 100%; background: var(--gold-gradient);"></div>
            </div>
          </div>

          <div style="background: rgba(35, 12, 22, 0.4); border: 1px solid var(--border-gold); padding: 1.25rem; border-radius: var(--radius-md);">
            <h4 style="color: var(--gold-primary); margin-bottom: 0.5rem;">FDM PLA (Bordeaux Red Wine)</h4>
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.4rem;">Stock Level: <strong>22 Spools (1kg)</strong></div>
            <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
              <div style="width: 88%; height: 100%; background: var(--wine-gradient);"></div>
            </div>
          </div>

          <div style="background: rgba(35, 12, 22, 0.4); border: 1px solid var(--border-gold); padding: 1.25rem; border-radius: var(--radius-md);">
            <h4 style="color: var(--gold-primary); margin-bottom: 0.5rem;">PA12 Carbon-Fiber Nylon</h4>
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.4rem;">Stock Level: <strong>8.2 kg</strong></div>
            <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
              <div style="width: 45%; height: 100%; background: #00f2fe;"></div>
            </div>
          </div>
        </div>
      `;
    }
  }
}
