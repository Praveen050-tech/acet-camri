import React from 'react';
import { FileText, ShieldCheck, Scale } from 'lucide-react';

export const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8 bg-white">
      <div className="border-b border-gray-200 pb-4">
        <span className="text-xs font-bold text-[#00714C] uppercase tracking-wider block mb-1">
          LEGAL & PLATFORM CONDITIONS
        </span>
        <h1 className="font-['Cinzel'] text-3xl font-extrabold text-gray-900">Terms of Service</h1>
        <p className="text-xs text-gray-500 mt-1">ACET CAMRI Printing Club & Storefront Terms</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed shadow-xs">
        
        <section className="space-y-2">
          <h3 className="font-['Outfit'] font-bold text-base text-gray-900 flex items-center gap-2">
            <FileText size={18} className="text-[#00714C]" /> 1. Overview & Platform Scope
          </h3>
          <p>
            By accessing or ordering from the ACET CAMRI storefront (operated under the 3D Printing & Additive Manufacturing Laboratory at Akshaya College of Engineering & Technology, Kinathukadavu), you agree to be bound by these Terms of Service.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-['Outfit'] font-bold text-base text-gray-900 flex items-center gap-2">
            <Scale size={18} className="text-[#00714C]" /> 2. Pricing & Currency
          </h3>
          <p>
            All listed prices are displayed in Indian National Rupees (INR / ₹) and are inclusive of applicable institutional maker subsidies and taxes. Prices are subject to revision based on raw engineering resin and polymer market dynamics.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-['Outfit'] font-bold text-base text-gray-900 flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#00714C]" /> 3. Permitted Print Submissions
          </h3>
          <p>
            Customers and students agree not to submit 3D models intended for harmful, unlawful, weaponized, or defamatory applications. ACET CAMRI reserves the right to decline print requests that violate safety standards or college ethics guidelines.
          </p>
        </section>

      </div>
    </div>
  );
};
