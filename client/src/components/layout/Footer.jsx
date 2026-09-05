import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, ExternalLink, Phone, MapPin, Mail, 
  Award, Clock, ChevronRight, ArrowRight
} from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full font-['Public_Sans'] mt-auto border-t-4 border-[#FFDA0F]">
      
      {/* 1. TOP ACTION STRIP (Matching .ftr-top-links on acetcbe.edu.in - Enlarged) */}
      <div className="bg-[#00714C] text-white py-8 px-4 sm:px-8 border-b border-[#005539]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <Link 
              to="/custom-order"
              className="flex items-center gap-4 p-4 bg-white/10 hover:bg-[#FFDA0F] hover:text-[#005539] rounded-2xl transition-all group font-['Readex_Pro'] shadow-xs"
            >
              <div className="w-12 h-12 rounded-xl bg-white text-[#00714C] group-hover:bg-[#005539] group-hover:text-[#FFDA0F] flex items-center justify-center shrink-0 shadow-sm transition-colors">
                <Box size={24} />
              </div>
              <div>
                <span className="text-sm font-bold block">Request CAD Quote</span>
                <span className="text-xs text-white/80 group-hover:text-[#005539]/80 font-normal">Instant SLA & FDM Slicing</span>
              </div>
              <ArrowRight size={18} className="ml-auto opacity-70 group-hover:translate-x-1.5 transition-transform" />
            </Link>

            <Link 
              to="/about"
              className="flex items-center gap-4 p-4 bg-white/10 hover:bg-[#FFDA0F] hover:text-[#005539] rounded-2xl transition-all group font-['Readex_Pro'] shadow-xs"
            >
              <div className="w-12 h-12 rounded-xl bg-white text-[#00714C] group-hover:bg-[#005539] group-hover:text-[#FFDA0F] flex items-center justify-center shrink-0 shadow-sm transition-colors">
                <MapPin size={24} />
              </div>
              <div>
                <span className="text-sm font-bold block">Visit Kinathukadavu Lab</span>
                <span className="text-xs text-white/80 group-hover:text-[#005539]/80 font-normal">CSE Block, Lab 04</span>
              </div>
              <ArrowRight size={18} className="ml-auto opacity-70 group-hover:translate-x-1.5 transition-transform" />
            </Link>

            <Link 
              to="/collection/college-merch"
              className="flex items-center gap-4 p-4 bg-white/10 hover:bg-[#FFDA0F] hover:text-[#005539] rounded-2xl transition-all group font-['Readex_Pro'] shadow-xs"
            >
              <div className="w-12 h-12 rounded-xl bg-white text-[#00714C] group-hover:bg-[#005539] group-hover:text-[#FFDA0F] flex items-center justify-center shrink-0 shadow-sm transition-colors">
                <Award size={24} />
              </div>
              <div>
                <span className="text-sm font-bold block">Official Crest Merch</span>
                <span className="text-xs text-white/80 group-hover:text-[#005539]/80 font-normal">Desk Monoliths & Plaques</span>
              </div>
              <ArrowRight size={18} className="ml-auto opacity-70 group-hover:translate-x-1.5 transition-transform" />
            </Link>

            <a 
              href="https://www.acetcbe.edu.in/about-acet/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white/10 hover:bg-[#FFDA0F] hover:text-[#005539] rounded-2xl transition-all group font-['Readex_Pro'] shadow-xs"
            >
              <div className="w-12 h-12 rounded-xl bg-white text-[#00714C] group-hover:bg-[#005539] group-hover:text-[#FFDA0F] flex items-center justify-center shrink-0 shadow-sm transition-colors">
                <ExternalLink size={24} />
              </div>
              <div>
                <span className="text-sm font-bold block">Learn About ACET</span>
                <span className="text-xs text-white/80 group-hover:text-[#005539]/80 font-normal">Autonomous • TNEA 2763</span>
              </div>
              <ArrowRight size={18} className="ml-auto opacity-70 group-hover:translate-x-1.5 transition-transform" />
            </a>

          </div>
        </div>
      </div>

      {/* 2. INSTITUTIONAL SIGNATURE SHOWCASE (Matching ACET Department Platform Standard) */}
      <div className="bg-white py-14 px-4 sm:px-8 border-b border-gray-200">
        <div className="container mx-auto max-w-4xl text-center space-y-5">
          
          {/* Main Title */}
          <h2 className="font-['Readex_Pro'] text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            ACET CAMRI developed by Department of COMPUTER SCIENCE AND ENGINEERING
          </h2>

          {/* Pill Badge */}
          <div className="inline-block">
            <span className="bg-[#eef9f3] text-[#00714C] border border-[#aee6cb] font-['Readex_Pro'] text-xs sm:text-sm font-extrabold px-5 py-2 rounded-full shadow-2xs tracking-wide">
              Official 3D PRINTING & ADDITIVE MANUFACTURING FACILITY
            </span>
          </div>

          {/* Subtitle Description */}
          <p className="text-gray-600 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            Empowering student and faculty makers with precision 50-micron additive manufacturing, functional kinematic mechanisms, and seamless digital-to-physical prototype fabrication.
          </p>

          {/* POWERED BY Section */}
          <div className="pt-4 space-y-4">
            <span className="text-[11px] sm:text-xs font-['Readex_Pro'] font-extrabold text-gray-400 tracking-[0.25em] uppercase block">
              POWERED BY
            </span>

            {/* Official Logo Banner */}
            <div className="flex justify-center items-center">
              <img 
                src="/ACET Logo.png" 
                alt="Akshaya College of Engineering and Technology" 
                className="h-20 sm:h-28 md:h-32 w-auto max-w-[90vw] sm:max-w-2xl object-contain"
              />
            </div>
          </div>

        </div>
      </div>

      {/* 3. MAIN 4-COLUMN FOOTER (Exact ACET Footer Green #006342 / #005539 - Enlarged) */}
      <div className="bg-[#006342] text-white py-14 sm:py-16 px-4 sm:px-8 border-b border-[#004d33]">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 text-sm">
          
          {/* Col 1: Institutional Profile (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Official ACET College Logo in Footer Card - Enlarged */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 inline-block shadow-md border border-gray-100 max-w-full sm:max-w-[380px]">
              <img 
                src="/ACET Logo.png" 
                alt="Akshaya College of Engineering and Technology" 
                className="w-full h-20 sm:h-24 md:h-26 object-contain"
              />
            </div>

            <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
              <strong className="text-white font-bold">ACET CAMRI</strong> is the dedicated Centre for Additive Manufacturing Research and Innovation at Akshaya College of Engineering and Technology (Kinathukadavu, Coimbatore).
            </p>

            <div className="p-4 bg-white/10 rounded-2xl space-y-1.5 text-xs sm:text-[13px] border border-white/15 shadow-xs">
              <div className="flex items-center gap-2 text-[#FFDA0F] font-['Readex_Pro'] font-bold">
                <Award size={16} />
                <span>NAAC 'B+' Grade • Autonomous Institution</span>
              </div>
              <div className="text-white/80 font-medium">Approved by AICTE, New Delhi • Affiliated to Anna University, Chennai</div>
            </div>
          </div>

          {/* Col 2: Store Collections (3 cols) -> Replaced with Program Highlights */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-['Readex_Pro'] font-bold text-base sm:text-lg text-[#FFDA0F] border-b border-white/20 pb-2.5 flex items-center gap-2">
              <span>Program Highlights</span>
            </h4>
            <ul className="space-y-2.5 text-white/85 font-['Readex_Pro'] text-xs sm:text-sm">
              <li className="flex items-center gap-2">
                <ChevronRight size={14} className="text-[#FFDA0F]" /> Intro to Additive Manufacturing
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight size={14} className="text-[#FFDA0F]" /> FDM & SLA Technologies
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight size={14} className="text-[#FFDA0F]" /> Bambu Lab H2C Hands-on
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight size={14} className="text-[#FFDA0F]" /> Multi-Material Printing
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight size={14} className="text-[#FFDA0F]" /> Real-world Prototyping
              </li>
            </ul>
          </div>

          {/* Col 3: Student & Prototyping Services (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-['Readex_Pro'] font-bold text-base sm:text-lg text-[#FFDA0F] border-b border-white/20 pb-2.5 flex items-center gap-2">
              <span>Event Links</span>
            </h4>
            <ul className="space-y-2.5 text-white/85 font-['Readex_Pro'] text-xs sm:text-sm">
              <li>
                <Link to="/" className="hover:text-[#FFDA0F] flex items-center gap-2 transition-colors">
                  <ChevronRight size={14} className="text-[#FFDA0F]" /> Register Now
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#FFDA0F] flex items-center gap-2 transition-colors">
                  <ChevronRight size={14} className="text-[#FFDA0F]" /> Contact Coordinators
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-[#FFDA0F] flex items-center gap-2 transition-colors text-amber-200">
                  <ChevronRight size={14} className="text-[#FFDA0F]" /> Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Kinathukadavu Contact & Location (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-['Readex_Pro'] font-bold text-base sm:text-lg text-[#FFDA0F] border-b border-white/20 pb-2.5 flex items-center gap-2">
              <span>Campus Maker Hub</span>
            </h4>
            
            <div className="space-y-3 text-white/85 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin size={18} className="text-[#FFDA0F] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Centre for Additive Manufacturing and Innovation (CAMRI)</strong><br />
                  Akshaya College of Engineering & Technology, Kinathukadavu, Coimbatore – 642 109
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone size={16} className="text-[#FFDA0F] shrink-0 mt-0.5" />
                <span>
                  <strong>Event Coordinators:</strong><br />
                  Mr. B. Sudhakar (AP/Mech): 8610599083<br />
                  Mr. R. Gowtham (AP/Mech): 99408 31085
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-[#FFDA0F] shrink-0" />
                <span>info@acetcbe.edu.in</span>
              </div>
            </div>

            {/* Newsletter */}
            <form onSubmit={handleNewsletter} className="pt-2">
              <span className="text-xs font-bold text-[#FFDA0F] block mb-1.5 font-['Readex_Pro']">Join Maker Newsletter:</span>
              <div className="flex gap-1.5">
                <input 
                  type="email"
                  required
                  placeholder="student@acetcbe.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border border-white/25 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-[#FFDA0F] flex-1"
                />
                <button type="submit" className="bg-[#FFDA0F] text-[#005539] font-extrabold px-4 py-2 rounded-xl text-xs sm:text-sm hover:bg-[#F4E757] transition-colors shadow-xs">
                  Join
                </button>
              </div>
              {subscribed && <span className="text-xs text-[#FFDA0F] block mt-1 font-semibold"> Subscribed to lab drops!</span>}
            </form>
          </div>

        </div>
      </div>

      {/* 4. BOTTOM SUB-FOOTER (Deep Night Green #004d33 - Enlarged) */}
      <div className="bg-[#004d33] text-white/75 py-5 px-4 sm:px-8 text-xs sm:text-sm font-['Readex_Pro']">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-3.5 text-center md:text-left">
          
          <div>
            <span>Copyright © 2026 <strong className="text-white">Akshaya College of Engineering and Technology</strong>. All Rights Reserved.</span>
            <span className="hidden sm:inline text-white/30 mx-2.5">|</span>
            <span className="text-[#FFDA0F] font-bold">TNEA Counselling Code: 2763</span>
            <div className="text-[11px] sm:text-xs text-white/80 mt-1">Platform Architecture & Development: <strong className="text-[#FFDA0F]">Department of Computer Science and Engineering (CSE)</strong></div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-[13px] text-white/85">
            <Link to="/shipping-policy" className="hover:text-[#FFDA0F] transition-colors font-medium">Shipping Policy</Link>
            <Link to="/refund-policy" className="hover:text-[#FFDA0F] transition-colors font-medium">Refund & Return Policy</Link>
            <Link to="/privacy-policy" className="hover:text-[#FFDA0F] transition-colors font-medium">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-[#FFDA0F] transition-colors font-medium">Terms of Service</Link>
            <Link to="/warranty-policy" className="hover:text-[#FFDA0F] transition-colors font-medium">Warranty</Link>
          </div>

        </div>
      </div>

    </footer>
  );
};
