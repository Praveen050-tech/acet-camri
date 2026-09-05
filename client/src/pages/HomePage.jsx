import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Microscope, Printer, Settings, Award } from 'lucide-react';
import { ThreeViewer } from '../components/product/ThreeViewer';

export const HomePage = () => {
  return (
    <div className="bg-white font-['Public_Sans']">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#005539] to-[#00714C] text-white py-20 lg:py-32 border-b-4 border-[#FFDA0F]">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-8">
              <span className="inline-flex items-center gap-2 bg-[#FFDA0F] text-[#005539] font-['Readex_Pro'] text-sm font-black px-4 py-2 rounded-full uppercase tracking-wider shadow-xs">
                Centre of Excellence
              </span>
              
              <h1 className="font-['Cinzel'] text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-white">
                Additive Manufacturing Research & Innovation
              </h1>
              
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl font-light leading-relaxed">
                Empowering academia and industry through advanced 3D printing technologies, rapid prototyping, and engineering consultancy.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  to="/custom-order"
                  className="bg-[#FFDA0F] hover:bg-white text-[#005539] font-bold px-6 py-3.5 rounded-xl transition-all hover:scale-[1.02] shadow-lg flex items-center gap-2"
                >
                  Request a Prototype
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/collection/all"
                  className="bg-[#00422c] hover:bg-[#003120] text-white font-bold px-6 py-3.5 rounded-xl border border-[#00714C] transition-all hover:scale-[1.02] flex items-center gap-2"
                >
                  Shop CAMRI
                </Link>
                <Link
                  to="/contact"
                  className="bg-transparent hover:bg-white/10 text-white font-bold px-6 py-3.5 rounded-xl border border-white/30 transition-all hover:scale-[1.02]"
                >
                  Get a Quote
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 h-[400px] lg:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl bg-black relative border-4 border-[#FFDA0F]/20">
               <ThreeViewer url="" />
               <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10 z-10">
                 Interactive Print Preview
               </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Institutional Highlights */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-['Cinzel'] text-3xl font-bold text-[#00714C] mb-4">Core Capabilities</h2>
            <p className="text-gray-600">State-of-the-art facilities dedicated to education, research, and industrial manufacturing solutions.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
              <Printer size={40} className="text-[#00714C] mx-auto mb-6" />
              <h3 className="font-bold text-gray-900 mb-3 text-lg">FDM & Resin Printing</h3>
              <p className="text-gray-500 text-sm">Industrial-grade polymer manufacturing with micron-level precision.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
              <Settings size={40} className="text-[#00714C] mx-auto mb-6" />
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Design Optimization</h3>
              <p className="text-gray-500 text-sm">DFAM consultancy and topological optimization for complex geometries.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
              <Microscope size={40} className="text-[#00714C] mx-auto mb-6" />
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Applied Research</h3>
              <p className="text-gray-500 text-sm">Supporting faculty and postgraduate studies in advanced material science.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
              <Award size={40} className="text-[#00714C] mx-auto mb-6" />
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Industrial Training</h3>
              <p className="text-gray-500 text-sm">Hands-on certification programs bridging the academia-industry skill gap.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
