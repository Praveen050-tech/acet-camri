import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Award, ShieldCheck, MapPin, Clock, ArrowRight, Layers, Sparkles } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16 bg-white font-['Public_Sans']">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="bg-[#00714C]/10 text-[#00714C] border border-[#00714C]/30 text-xs font-['Readex_Pro'] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
          ️ 3D PRINTING PLATFORM • DEVELOPED BY DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
        </span>
        <h1 className="font-['Readex_Pro'] text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
          High-Precision 3D Printing & Physical Manufacturing
        </h1>
        <p className="text-xs sm:text-base text-gray-600 leading-relaxed font-normal">
          ACET CAMRI is the central additive manufacturing and product store for Akshaya College of Engineering & Technology (Kinathukadavu, Coimbatore) — delivering museum-grade SLA composite prints, functional kinematic engineering assemblies, campus memorabilia, and custom CAD fabrication for all departments and makers. The digital store and software platform is developed and maintained by the <strong>Department of Computer Science and Engineering (CSE)</strong>.
        </p>
      </div>

      {/* 3 Core Production Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs hover:border-[#00714C] transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#eef9f3] text-[#00714C] flex items-center justify-center">
            <Layers size={24} />
          </div>
          <h3 className="font-['Readex_Pro'] text-base font-bold text-gray-900">50-Micron Micro Resolution</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Utilizing calibrated 12K optical SLA light engines to cure specialized marble-loaded resins and mineral polymers at 0.05mm layer intervals with glass-smooth surface finishes.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs hover:border-[#00714C] transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#eef9f3] text-[#00714C] flex items-center justify-center">
            <Box size={24} />
          </div>
          <h3 className="font-['Readex_Pro'] text-base font-bold text-gray-900">Kinematic Mechanical Assemblies</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Engineered print-in-place tolerances (0.15mm) in self-lubricating PA12 nylon and tough polymers for planetary gearboxes, bearings, and functional power transmission models.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs hover:border-[#00714C] transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#eef9f3] text-[#00714C] flex items-center justify-center">
            <Award size={24} />
          </div>
          <h3 className="font-['Readex_Pro'] text-base font-bold text-gray-900">Custom CAD Prototyping</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Full-service STL, STEP, and OBJ mesh processing with instant slicing estimates, automated structural integrity checks, and priority print bed scheduling.
          </p>
        </div>
      </div>

      {/* Lab Facilities & Quality Standards */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-['Readex_Pro'] font-bold text-[#00714C] uppercase tracking-wider block">FACILITY STANDARDS & CAPABILITIES</span>
          <h3 className="font-['Readex_Pro'] text-2xl font-bold text-gray-900 mt-1">Laboratory Equipment & Materials</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
            <div className="font-['Readex_Pro'] font-bold text-sm text-[#00714C]">SLA Resin Curing</div>
            <p className="text-[11px] text-gray-600">405nm UV post-cure chambers with diamond-buffed finishing.</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
            <div className="font-['Readex_Pro'] font-bold text-sm text-[#00714C]">Industrial CoreXY</div>
            <p className="text-[11px] text-gray-600">High-temperature chambers for Carbon-Fiber and PA12 Nylon.</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
            <div className="font-['Readex_Pro'] font-bold text-sm text-[#00714C]">Quality Inspection</div>
            <p className="text-[11px] text-gray-600">100% optical inspection and dimensional tolerance verification.</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
            <div className="font-['Readex_Pro'] font-bold text-sm text-[#00714C]">Campus Logistics</div>
            <p className="text-[11px] text-gray-600">Free desk pickup at Kinathukadavu & secure all-India courier shipping.</p>
          </div>
        </div>
      </div>

      {/* Ready to Order CTA */}
      <div className="text-center space-y-4 font-['Readex_Pro']">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Explore the 3D Print Catalog or Upload Your Model</h2>
        <div className="flex flex-wrap gap-4 justify-center pt-2">
          <Link to="/custom-order" className="bg-[#00714C] hover:bg-[#005539] text-[#FFDA0F] font-bold text-xs px-7 py-3.5 rounded-xl shadow-md transition-all">
            Launch CAD Estimator 
          </Link>
          <Link to="/collection/all" className="bg-white border border-gray-300 text-gray-800 font-bold text-xs px-7 py-3.5 rounded-xl hover:bg-gray-50 shadow-2xs">
            Browse Store Catalog
          </Link>
        </div>
      </div>

    </div>
  );
};
