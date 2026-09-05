import React from 'react';
import { XCircle, Clock, CheckCircle2 } from 'lucide-react';

export const CancellationPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8 bg-white">
      <div className="border-b border-gray-200 pb-4">
        <span className="text-xs font-bold text-[#00714C] uppercase tracking-wider block mb-1">
          ORDER MODIFICATIONS & CANCELLATIONS
        </span>
        <h1 className="font-['Cinzel'] text-3xl font-extrabold text-gray-900">Cancellation Policy</h1>
        <p className="text-xs text-gray-500 mt-1">ACET CAMRI Order Modification Guidelines</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed shadow-xs">
        
        <section className="space-y-2">
          <h3 className="font-['Outfit'] font-bold text-base text-gray-900 flex items-center gap-2">
            <Clock size={18} className="text-[#00714C]" /> 1. Pre-Print Slicing Cancellation Window
          </h3>
          <p>
            Orders can be cancelled with a <strong>100% full refund</strong> at any time prior to the commencement of 3D printing on the machine bed (typically within 1 to 2 hours of placing the order).
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-['Outfit'] font-bold text-base text-gray-900 flex items-center gap-2">
            <XCircle size={18} className="text-red-600" /> 2. Post-Printing Commencement
          </h3>
          <p>
            Once a 3D model has been assigned to a physical machine bed and resin/filament extrusion has started, raw polymer cannot be reclaimed. At this stage, material costs cannot be refunded, though shipping/courier fees can be refunded if cancellation occurs prior to dispatch.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-['Outfit'] font-bold text-base text-gray-900 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[#00714C]" /> 3. How to Cancel
          </h3>
          <p>
            To request an immediate cancellation, message the 3D lab desk on WhatsApp at <strong>+91 97894 44111</strong> with your Order ID for immediate queue halt.
          </p>
        </section>

      </div>
    </div>
  );
};
