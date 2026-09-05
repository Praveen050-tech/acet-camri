import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, MapPin, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ShippingPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8 bg-white">
      <div className="border-b border-gray-200 pb-4">
        <span className="text-xs font-bold text-[#00714C] uppercase tracking-wider block mb-1">
          CAMPUS & DOMESTIC LOGISTICS
        </span>
        <h1 className="font-['Cinzel'] text-3xl font-extrabold text-gray-900">Shipping & Delivery Policy</h1>
        <p className="text-xs text-gray-500 mt-1">Effective Date: January 1, 2026 • Akshaya College of Engineering & Technology</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed shadow-xs">
        
        <section className="space-y-2">
          <h3 className="font-['Outfit'] font-bold text-base text-gray-900 flex items-center gap-2">
            <MapPin size={18} className="text-[#00714C]" /> 1. Campus Pickup (100% Free)
          </h3>
          <p>
            For all Akshaya College students, faculty, staff, and campus visitors, <strong>free campus pickup</strong> is available at our central additive manufacturing desk located on the ground floor of the Computer Science Block (Department of CSE 3D Printing Lab, Kinathukadavu Main Campus).
          </p>
          <div className="p-4 bg-[#eef9f3] border border-[#aee6cb] rounded-2xl text-[#00714C] text-xs font-medium space-y-1">
            <div>• <strong>Pickup Timings:</strong> Monday through Saturday, 8:30 AM to 5:30 PM IST.</div>
            <div>• <strong>Verification:</strong> Present your Student ID, Staff ID, or WhatsApp Order Confirmation receipt upon collection.</div>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="font-['Outfit'] font-bold text-base text-gray-900 flex items-center gap-2">
            <Truck size={18} className="text-[#00714C]" /> 2. Domestic Courier Delivery Across India
          </h3>
          <p>
            Orders addressed outside the Kinathukadavu campus are dispatched via trusted courier partners (BlueDart, DTDC Express, and India Post Speed Post). All shipments are packed in custom-contoured high-density foam casing to eliminate transit vibration and protect 50-micron resin geometry.
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 pl-2">
            <li><strong>Tamil Nadu & Coimbatore Region:</strong> 1–2 business days from print completion.</li>
            <li><strong>South India (Karnataka, Kerala, AP, Telangana):</strong> 2–3 business days.</li>
            <li><strong>Rest of India:</strong> 3–5 business days.</li>
            <li><strong>Standard Courier Fee:</strong> Flat ₹99 (Free on all orders above ₹999).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="font-['Outfit'] font-bold text-base text-gray-900 flex items-center gap-2">
            <Clock size={18} className="text-[#00714C]" /> 3. Additive Manufacturing Lead Times
          </h3>
          <p>
            Every physical object is custom sliced and cured to order. Standard in-stock catalog products require <strong>8 to 24 hours</strong> of 3D printing, UV post-curing, and surface inspection prior to dispatch. Custom CAD prototype lead times depend on volume and infill density.
          </p>
        </section>

      </div>
    </div>
  );
};
