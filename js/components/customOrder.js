/**
 * ACET 3D — Custom 3D Print Studio & Student Project Prototyping Estimator
 */

import { store } from '../utils/store.js';

export class CustomOrderStudio {
  constructor() {
    this.form = document.getElementById('custom-inquiry-form');
    this.dropzone = document.getElementById('file-dropzone');
    this.fileInput = document.getElementById('custom-file-input');
    this.fileNameDisplay = document.getElementById('file-name-display');

    // Estimator inputs
    this.dimLength = document.getElementById('est-dim-l');
    this.dimWidth = document.getElementById('est-dim-w');
    this.dimHeight = document.getElementById('est-dim-h');
    this.infillRange = document.getElementById('est-infill');
    this.infillDisplay = document.getElementById('est-infill-val');
    this.materialSelect = document.getElementById('est-material');
    this.finishSelect = document.getElementById('est-finish');

    // Output displays
    this.estPrice = document.getElementById('est-calculated-price');
    this.estWeight = document.getElementById('est-weight-val');
    this.estTime = document.getElementById('est-time-val');

    this.init();
  }

  init() {
    if (!this.form) return;

    if (this.dropzone && this.fileInput) {
      this.dropzone.addEventListener('click', () => this.fileInput.click());
      
      this.dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        this.dropzone.classList.add('dragover');
      });

      this.dropzone.addEventListener('dragleave', () => {
        this.dropzone.classList.remove('dragover');
      });

      this.dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        this.dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.handleFile(e.dataTransfer.files[0]);
        }
      });

      this.fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          this.handleFile(e.target.files[0]);
        }
      });
    }

    const inputs = [this.dimLength, this.dimWidth, this.dimHeight, this.infillRange, this.materialSelect, this.finishSelect];
    inputs.forEach(input => {
      if (input) {
        input.addEventListener('input', () => this.calculateEstimate());
        input.addEventListener('change', () => this.calculateEstimate());
      }
    });

    if (this.infillRange && this.infillDisplay) {
      this.infillRange.addEventListener('input', (e) => {
        this.infillDisplay.textContent = `${e.target.value}%`;
      });
    }

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitInquiry();
    });

    this.calculateEstimate();
  }

  handleFile(file) {
    if (this.fileNameDisplay) {
      this.fileNameDisplay.innerHTML = `
        <div style="color: var(--gold-primary); font-weight: 600; margin-top: 0.5rem; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)
        </div>
      `;
    }
    store.showToast(`CAD/STL file "${file.name}" uploaded to ACET Maker Lab queue.`);
  }

  calculateEstimate() {
    const l = parseFloat(this.dimLength ? this.dimLength.value : 14) || 14;
    const w = parseFloat(this.dimWidth ? this.dimWidth.value : 10) || 10;
    const h = parseFloat(this.dimHeight ? this.dimHeight.value : 8) || 8;
    const infill = parseInt(this.infillRange ? this.infillRange.value : 25, 10) || 25;
    const mat = this.materialSelect ? this.materialSelect.value : 'resin';
    const finish = this.finishSelect ? this.finishSelect.value : 'raw';

    const boundingVolume = l * w * h;
    const meshVolume = boundingVolume * 0.22;
    const effectiveVolume = meshVolume * (0.4 + (infill / 100) * 0.6);

    let density = 1.24;
    let costPerGram = 4.0;
    let baseRate = 250;

    if (mat === 'resin') {
      density = 1.22; // Carrara Marble Resin
      costPerGram = 6.5;
      baseRate = 450;
    } else if (mat === 'nylon') {
      density = 1.05;
      costPerGram = 9.5;
      baseRate = 700;
    } else if (mat === 'metal') {
      density = 2.4;
      costPerGram = 12.0;
      baseRate = 950;
    }

    let finishCost = 0;
    if (finish === 'primed') finishCost = 350;
    if (finish === 'electroplate') finishCost = 1100;

    const estimatedWeightGrams = Math.max(25, Math.round(effectiveVolume * density));
    const estimatedHours = Math.max(2, Math.round((estimatedWeightGrams / 24) + (h * 0.5)));
    // Subsidized pricing for student / college store
    const calculatedPrice = Math.max(599, Math.round(baseRate + (estimatedWeightGrams * costPerGram) + finishCost));

    if (this.estPrice) this.estPrice.textContent = `₹${calculatedPrice.toLocaleString('en-IN')}`;
    if (this.estWeight) this.estWeight.textContent = `~${estimatedWeightGrams} grams`;
    if (this.estTime) this.estTime.textContent = `~${estimatedHours} Print Hours`;
  }

  submitInquiry() {
    const ticketId = `ACET-CAD-${Math.floor(10000 + Math.random() * 90000)}`;
    const container = document.getElementById('custom-order-container');
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem 2rem; background: var(--marble-card); border-radius: var(--radius-lg); border: 1.5px solid var(--border-gold); box-shadow: var(--shadow-lg), var(--shadow-gold);">
          <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(84, 13, 42, 0.4); border: 2px solid var(--gold-primary); color: var(--gold-primary); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h2 style="margin-bottom: 0.5rem; color: var(--marble-white);">Custom CAD / 3D Print Request Logged!</h2>
          <p style="color: var(--text-secondary); max-width: 540px; margin: 0 auto 1.5rem auto; font-size: 1rem;">
            The ACET 3D Printing Club student coordinator & faculty mentor will review your CAD mesh geometry and confirm slice parameters within 4 hours.
          </p>
          <div style="display: inline-block; background: rgba(35, 12, 22, 0.7); border: 1px solid var(--border-gold); padding: 1rem 2rem; border-radius: var(--radius-md); margin-bottom: 2rem;">
            <div style="font-size: 0.8rem; color: var(--text-muted);">CAMPUS TICKET ID</div>
            <div style="font-family: var(--font-mono); font-size: 1.5rem; font-weight: 700; color: var(--gold-primary);">${ticketId}</div>
          </div>
          <div>
            <button class="btn btn-outline" onclick="window.location.reload();">Submit Another CAD Model</button>
          </div>
        </div>
      `;
    }
  }
}
