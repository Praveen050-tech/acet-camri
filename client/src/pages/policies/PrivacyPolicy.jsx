import React from 'react';
import { Lock, Eye, ShieldCheck, Database } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8 bg-white">
      <div className="border-b border-gray-200 pb-4">
        <span className="text-xs font-bold text-[#00714C] uppercase tracking-wider block mb-1">
          DATA PROTECTION & SECURITY
        </span>
        <h1 className="font-['Cinzel'] text-3xl font-extrabold text-gray-900">Privacy Policy</h1>
        <p className="text-xs text-gray-500 mt-1">Akshaya College of Engineering & Technology 3D Lab Platform</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed shadow-xs">
        
        <section className="space-y-2">
          <h3 className="font-['Outfit'] font-bold text-base text-gray-900 flex items-center gap-2">
            <Lock size={18} className="text-[#00714C]" /> 1. Information We Collect
          </h3>
          <p>
            When placing an order or submitting a custom CAD design on ACET CAMRI, we collect your name, college roll number (if applicable), contact telephone number, shipping address, and project specifications. We do not store credit card or net banking credentials on our servers; all payment transactions are tokenized securely through 256-bit encrypted Razorpay gateways.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-['Outfit'] font-bold text-base text-gray-900 flex items-center gap-2">
            <Database size={18} className="text-[#00714C]" /> 2. Academic Intellectual Property Protection
          </h3>
          <p>
            All CAD 3D models (STL, STEP, OBJ, 3MF) uploaded by students, faculty, or external innovators remain the <strong>100% exclusive intellectual property of the submitting creator</strong>. Uploaded files are solely used to generate machine G-code toolpaths and are permanently purged after print completion upon request.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-['Outfit'] font-bold text-base text-gray-900 flex items-center gap-2">
            <Eye size={18} className="text-[#00714C]" /> 3. Data Usage & Non-Disclosure
          </h3>
          <p>
            We never sell, rent, or lease customer contact information to third-party advertisers. Information is strictly utilized to send automated WhatsApp print status updates, shipping tracking tokens, and emergency order clarifications.
          </p>
        </section>

      </div>
    </div>
  );
};
