import React, { useState } from 'react';
import { customRequestAPI, uploadAPI } from '../api/client';
import { Upload, CheckCircle2, Calculator, Clock, Scale, ShieldCheck, Box } from 'lucide-react';

export const CustomOrderPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    studentName: '',
    contact: '',
    rollNo: '',
    department: 'Engineering',
    fileName: 'custom_part.stl',
    dimensions: { length: 14, width: 10, height: 8 },
    material: 'Carrara Marble SLA Resin',
    finish: 'Studio Raw',
    infillDensity: 25,
    specialInstructions: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  const materials = [
    { name: 'Pure White SLA Resin', rate: 6.5, desc: '50-micron micro-resolution smooth finish' },
    { name: 'ACET Emerald Green SLA', rate: 6.5, desc: 'Signature institutional emerald polymer' },
    { name: 'Industrial Tough PLA', rate: 4.5, desc: 'Standard mechanical prototyping filament' },
    { name: 'PA12 Carbon-Fiber Nylon', rate: 7.5, desc: 'Extreme tensile strength & wear resistance' },
    { name: 'Cold-Cast Brass Metal', rate: 9.0, desc: 'Heavy metal composite' }
  ];

  const finishes = [
    { name: 'Studio Raw', fee: 0, desc: 'Direct from build plate, supports removed' },
    { name: 'Hand-Sanded & Primed', fee: 350, desc: 'Micro-sanded smooth, primed for paint' },
    { name: '24K Gold Leaf Accents', fee: 1100, desc: 'Artisanal hand-applied gold leaf trim' }
  ];

  // Mathematical estimation formula
  const volumeCm3 = (formData.dimensions.length * formData.dimensions.width * formData.dimensions.height) * (formData.infillDensity / 100) * 0.45;
  const weightGrams = Math.round(volumeCm3 * 1.25);
  const printHours = Math.max(2, Math.round(weightGrams / 18));
  
  const activeMaterialObj = materials.find(m => m.name === formData.material) || materials[0];
  const activeFinishObj = finishes.find(f => f.name === formData.finish) || finishes[0];
  
  const estimatedPrice = Math.round((weightGrams * activeMaterialObj.rate) + (printHours * 40) + activeFinishObj.fee);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.contact || !formData.studentName) return;

    setSubmitting(true);
    try {
      const res = await customRequestAPI.submit({
        ...formData,
        estimatedPrice
      });
      if (res.data.success) {
        setSubmittedRequest(res.data.data);
      }
    } catch (err) {
      console.error('Custom request error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 space-y-12 bg-white font-['Public_Sans']">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="bg-[#00714C]/10 text-[#00714C] border border-[#00714C]/30 text-xs font-['Readex_Pro'] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
          ⚙️ CUSTOM 3D CAD & PROTOTYPING INTAKE
        </span>
        <h1 className="font-['Readex_Pro'] text-3xl sm:text-4xl font-extrabold text-gray-900">
          Custom 3D Print Studio & Estimator
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Calculate instant production costs or submit your STEP, STL, or OBJ 3D model files for rapid slicing at our Kinathukadavu maker facility.
        </p>
      </div>

      {submittedRequest ? (
        <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-3xl p-8 text-center space-y-4 shadow-xl animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-[#eef9f3] text-[#00714C] flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="font-['Readex_Pro'] text-2xl font-bold text-gray-900">CAD Submission Received!</h2>
          
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Request ID:</span>
              <strong className="font-mono text-[#00714C]">{submittedRequest.requestId}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Estimated Price:</span>
              <strong className="text-gray-900 font-bold">₹{submittedRequest.estimatedPrice.toLocaleString('en-IN')}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Estimated Slicing Turnaround:</span>
              <strong className="text-[#00714C]">~24 Hours (Kinathukadavu Lab)</strong>
            </div>
          </div>

          <p className="text-xs text-gray-600">
            Our 3D lab team is auditing your mesh tolerances. You will receive an update at <strong>{submittedRequest.contact}</strong> shortly.
          </p>

          <button 
            onClick={() => setSubmittedRequest(null)}
            className="bg-[#00714C] hover:bg-[#005a3c] text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition-all font-['Readex_Pro']"
          >
            Submit Another CAD Model
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="font-['Readex_Pro'] text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Calculator size={18} className="text-[#00714C]" />
              <span>Configure Print Parameters</span>
            </h3>

            {/* File Dropzone */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-2 font-['Readex_Pro']">Upload 3D CAD Model (STL, STEP, OBJ, 3MF)</label>
              <div className="border-2 border-dashed border-gray-300 hover:border-[#00714C] rounded-2xl p-6 text-center bg-gray-50 hover:bg-[#eef9f3]/40 transition-colors cursor-pointer group">
                <Upload size={32} className="mx-auto text-gray-400 group-hover:text-[#00714C] mb-2 transition-colors" />
                <div className="text-xs text-gray-700 font-medium">Drag & drop your CAD model file here or <span className="text-[#00714C] font-bold">browse computer</span></div>
                <span className="text-[10px] text-gray-400 block mt-1">Supports STL, STEP, IGES, OBJ up to 50MB</span>
                <input 
                  type="file" 
                  accept=".stl,.step,.stp,.obj,.3mf"
                  className="hidden" 
                  id="cadFileInput"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const file = e.target.files[0];
                      if (file.size > 50 * 1024 * 1024) {
                        alert('File exceeds 50MB limit.');
                        return;
                      }
                      setSelectedFile(file);
                      setFormData({ ...formData, fileName: file.name });
                    }
                  }}
                />
                <label htmlFor="cadFileInput" className="mt-3 inline-block bg-white border border-gray-300 text-gray-700 text-xs font-bold px-4 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50 shadow-2xs font-['Readex_Pro']">
                  Select File ({formData.fileName})
                </label>
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-2 font-['Readex_Pro']">Bounding Box Dimensions (cm)</label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-gray-500 block mb-1">Length (X)</span>
                  <input 
                    type="number" 
                    min="1" 
                    max="40"
                    value={formData.dimensions.length}
                    onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, length: Number(e.target.value) } })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#00714C]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block mb-1">Width (Y)</span>
                  <input 
                    type="number" 
                    min="1" 
                    max="40"
                    value={formData.dimensions.width}
                    onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, width: Number(e.target.value) } })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#00714C]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block mb-1">Height (Z)</span>
                  <input 
                    type="number" 
                    min="1" 
                    max="40"
                    value={formData.dimensions.height}
                    onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, height: Number(e.target.value) } })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#00714C]"
                  />
                </div>
              </div>
            </div>

            {/* Material Selector */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-2 font-['Readex_Pro']">Manufacturing Material</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {materials.map((m) => (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, material: m.name })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.material === m.name
                        ? 'border-[#00714C] bg-[#eef9f3] text-[#00714C] shadow-xs'
                        : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="font-['Readex_Pro'] font-bold text-xs">{m.name}</div>
                    <div className="text-[10px] opacity-75 mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Surface Finish */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-2 font-['Readex_Pro']">Surface Post-Processing & Finish</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {finishes.map((f) => (
                  <button
                    key={f.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, finish: f.name })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.finish === f.name
                        ? 'border-[#00714C] bg-[#eef9f3] text-[#00714C] shadow-xs'
                        : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="font-['Readex_Pro'] font-bold text-xs">{f.name}</div>
                    <div className="text-[10px] opacity-75 mt-0.5">{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Infill Density Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-800 mb-1 font-['Readex_Pro']">
                <span>Internal Infill Density</span>
                <span className="text-[#00714C]">{formData.infillDensity}%</span>
              </div>
              <input 
                type="range" 
                min="15" 
                max="100" 
                step="5"
                value={formData.infillDensity}
                onChange={(e) => setFormData({ ...formData, infillDensity: Number(e.target.value) })}
                className="w-full accent-[#00714C]"
              />
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1 font-['Readex_Pro']">Your Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. S. Manikandan"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#00714C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1 font-['Readex_Pro']">WhatsApp / Phone *</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+91 97894 44111"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#00714C]"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-[#00714C] hover:bg-[#005539] text-[#FFDA0F] font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all text-sm font-['Readex_Pro']"
            >
              {submitting ? 'Calculating & Submitting...' : 'Submit CAD Request to Lab Queue ➔'}
            </button>
          </form>

          {/* Right Live Estimator Card */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm sticky top-24">
            <div>
              <span className="text-[10px] font-bold text-[#00714C] uppercase tracking-wider block mb-1 font-['Readex_Pro']">
                LIVE ESTIMATE ENGINE
              </span>
              <h3 className="font-['Readex_Pro'] text-xl font-bold text-gray-900">Estimated Production Cost</h3>
            </div>

            {/* Price Tag */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-center shadow-2xs">
              <div className="font-['Readex_Pro'] text-4xl font-black text-[#00714C]">
                ₹{estimatedPrice.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">Includes manufacturing & taxes</span>
            </div>

            {/* Live Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-gray-500 block text-[10px]">Est. Weight</span>
                <strong className="text-gray-900 text-sm font-['Readex_Pro']">~{weightGrams} grams</strong>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-gray-500 block text-[10px]">Est. Print Time</span>
                <strong className="text-[#00714C] text-sm font-['Readex_Pro']">~{printHours} Print Hours</strong>
              </div>
            </div>

            {/* Workflow Points */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-600">
              <h5 className="font-['Readex_Pro'] font-bold text-gray-900 text-xs uppercase mb-2">Manufacturing Process</h5>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#00714C] shrink-0" />
                <span><strong>Mesh Audit:</strong> Coordinators verify wall thickness & tolerances.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#00714C] shrink-0" />
                <span><strong>Quality Slicing:</strong> Precision layer slicing at 50 to 150 microns.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#00714C] shrink-0" />
                <span><strong>Campus Collection:</strong> Free pickup from Kinathukadavu 3D Lab Desk.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#eef9f3] border border-[#aee6cb] text-[11px] text-[#00714C]">
              🔒 <strong>Design Confidentiality:</strong> All uploaded project CAD files and 3D designs remain 100% exclusive intellectual property of the submitting creator.
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
