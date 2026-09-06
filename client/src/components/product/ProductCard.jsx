import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Star, Plus, Box, Clock, Scale } from 'lucide-react';

export const ProductCard = ({ product, onQuick3D }) => {
  const { addToCart } = useCart();

  const isVideo = (url) => typeof url === 'string' && ['mp4', 'webm', 'mov'].includes(url.split('?')[0].split('.').pop().toLowerCase());
  return (
    <div className="group bg-white hover:bg-white border border-gray-200 hover:border-[#00714C] rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col text-gray-900 font-['Public_Sans']">
      
      {/* Thumbnail Area */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden cursor-pointer">
        <Link to={`/product/${product.slug || product.id}`}>
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-500"
            loading="lazy"
          />
          <img 
            src={product.imageHover || product.image} 
            alt={`${product.title} angle`}
            className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none font-['Readex_Pro']">
          {product.badge && (
            <span className="bg-[#00714C] text-[#FFDA0F] text-[10px] font-black px-2.5 py-0.5 rounded-md shadow-xs">
              {product.badge}
            </span>
          )}
          <span className="bg-white/95 backdrop-blur-xs text-gray-700 border border-gray-200 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
            {product.specs?.resolution?.split(' ')[0] || '0.05mm'}
          </span>
        </div>

        {/* Quick 3D Trigger */}
        <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button 
            onClick={(e) => {
              e.preventDefault();
              if (onQuick3D) onQuick3D(product);
            }}
            className="bg-[#00714C] hover:bg-[#005539] text-[#FFDA0F] p-2 rounded-xl shadow-md hover:scale-110 transition-transform font-['Readex_Pro'] font-bold text-xs flex items-center gap-1"
            title="Inspect 3D Geometry"
          >
            <Box size={14} />
            <span className="text-[10px]">3D</span>
          </button>
        </div>
      </div>

      {/* Info Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] text-[#00714C] font-['Readex_Pro'] font-bold uppercase tracking-wider block mb-1">
            {product.categoryLabel}
          </span>
          <Link to={`/product/${product.slug || product.id}`} className="block">
            <h4 className="font-['Readex_Pro'] font-bold text-sm text-gray-900 line-clamp-2 hover:text-[#00714C] transition-colors leading-snug min-h-[2.6rem] flex items-start">
              {product.title}
            </h4>
          </Link>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
          {/* Rating & Print Time */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-amber-500 font-['Readex_Pro']">
              <Star size={13} fill="currentColor" />
              <span className="font-bold text-gray-900 text-[11px]">{product.rating}</span>
              <span className="text-gray-400 text-[11px]">({product.reviewCount})</span>
            </div>
            <div className="text-[10px] text-gray-500 flex items-center gap-1">
              <Clock size={11} className="text-[#00714C]" />
              <span className="font-medium">{product.specs?.printTime || '4.5 hrs'}</span>
            </div>
          </div>

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-1.5 font-['Readex_Pro']">
              <span className="font-extrabold text-base text-[#00714C]">
                ₹{product.salePrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-gray-400 line-through">
                ₹{product.regularPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <button 
              onClick={() => addToCart(product)}
              className="w-9 h-9 rounded-xl bg-[#00714C] hover:bg-[#005539] text-[#FFDA0F] flex items-center justify-center transition-all shadow-xs hover:shadow hover:scale-105 shrink-0"
              title="Add to Cart"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
