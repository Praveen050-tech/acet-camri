import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 py-24 text-center max-w-md space-y-6 bg-white">
      <div className="w-16 h-16 rounded-3xl bg-[#eef9f3] text-[#00714C] flex items-center justify-center mx-auto shadow-sm">
        <Box size={32} />
      </div>
      
      <div className="space-y-2">
        <span className="text-xs font-black text-[#00714C] tracking-widest uppercase">ERROR 404</span>
        <h1 className="font-['Cinzel'] text-3xl font-extrabold text-gray-900">3D Geometry Not Found</h1>
        <p className="text-xs text-gray-500">The page or CAD model mesh you are looking for does not exist or has been relocated in the print catalog.</p>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <Link 
          to="/"
          className="bg-[#00714C] hover:bg-[#005a3c] text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition-all flex items-center gap-1.5"
        >
          <Home size={14} />
          <span>Return Home</span>
        </Link>
        <Link 
          to="/collection/all"
          className="bg-white border border-gray-300 text-gray-700 font-bold text-xs px-6 py-3 rounded-xl hover:bg-gray-50 shadow-2xs"
        >
          Browse Store Catalog
        </Link>
      </div>
    </div>
  );
};
