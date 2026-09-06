import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI, reviewAPI } from '../api/client';
import { ThreeViewer } from '../components/product/ThreeViewer';
import { ProductCard } from '../components/product/ProductCard';
import { useCart } from '../context/CartContext';
import { Star, ShieldCheck, Truck, RefreshCw, Box, CheckCircle2, Clock, Scale } from 'lucide-react';

export const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('specs');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [reviewInput, setReviewInput] = useState({ author: '', comment: '', rating: 5 });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getById(id);
        if (res.data.success) {
          const p = res.data.data;
          setProduct(p);
          if (p.availableMaterials && p.availableMaterials.length > 0) {
            setSelectedMaterial(p.availableMaterials[0]);
          }
          if (p.availableSizes && p.availableSizes.length > 0) {
            setSelectedSize(p.availableSizes[0]);
          }

          // Fetch reviews
          const revRes = await reviewAPI.getByProduct(p.id);
          if (revRes.data.success) {
            setReviews(revRes.data.data);
          }

          // Fetch related
          const catRes = await productAPI.getAll({ category: p.category });
          if (catRes.data.success) {
            setRelated(catRes.data.data.filter((item) => item.id !== p.id).slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewInput.author || !reviewInput.comment) return;
    setReviewSubmitting(true);
    try {
      const res = await reviewAPI.create({
        productId: product.id,
        author: reviewInput.author,
        comment: reviewInput.comment,
        rating: reviewInput.rating
      });
      if (res.data.success) {
        setReviews([res.data.data, ...reviews]);
        setReviewInput({ author: '', comment: '', rating: 5 });
      }
    } catch (err) {
      console.error('Error posting review:', err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center text-gray-500">
        <div className="w-8 h-8 border-2 border-[#00714C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span>Loading 3D mesh and specifications...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <Link to="/collection/all" className="text-[#00714C] underline text-sm font-bold">Back to Store Catalog</Link>
      </div>
    );
  }

  const currentPrice = Math.round(
    (product.salePrice + (selectedMaterial?.priceDelta || 0)) * (selectedSize?.multiplier || 1.0)
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-16 bg-white">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-[#00714C]">Home</Link>
        <span>/</span>
        <Link to={`/collection/${product.category}`} className="hover:text-[#00714C]">{product.categoryLabel}</Link>
        <span>/</span>
        <span className="text-[#00714C] font-semibold truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main 2-Column Product Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Col: Rich Media Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {(() => {
            const allMedia = [];
            
            // Collect media
            const imgList = Array.isArray(product.images) ? product.images : [];
            const imageUrls = imgList.map(img => typeof img === "string" ? img : img.url).filter(Boolean);
            if (imageUrls.length === 0 && product.image) imageUrls.push(product.image);
            if (imageUrls.length === 0 && product.imageHover) imageUrls.push(product.imageHover);
            
            imageUrls.forEach(url => {
              if (!url || typeof url !== 'string') return;
              const ext = url.split("?")[0].split(".").pop().toLowerCase();
              let type = "image";
              if (["mp4", "webm", "mov"].includes(ext)) type = "video";
              else if (["glb", "gltf"].includes(ext)) type = "model3d";
              allMedia.push({ type, url });
            });
            
            // Collect legacy videos
            const vidList = Array.isArray(product.videos) ? product.videos : [];
            vidList.forEach(url => {
              if(url && !allMedia.some(m => m.url === url)) allMedia.push({ type: "video", url });
            });
            
            // Collect legacy 3D model
            if (product.model3d && !allMedia.some(m => m.url === product.model3d)) {
              allMedia.push({ type: "model3d", url: product.model3d });
            }

            if (allMedia.length === 0) {
              allMedia.push({ type: 'image', url: '/images/products/placeholder.jpg' });
            }

            const activeItem = allMedia[activeMediaIdx] || allMedia[0];

            return (
              <>
                {/* Main Viewer */}
                <div className="w-full aspect-square bg-gray-50 rounded-3xl border border-gray-200 overflow-hidden shadow-sm relative">
                  {activeItem.type === 'image' && (
                    <img src={activeItem.url} alt={product.title} className="w-full h-full object-contain" />
                  )}
                  {activeItem.type === 'video' && (
                    <video src={activeItem.url} controls className="w-full h-full object-contain bg-black" />
                  )}
                  {activeItem.type === 'model3d' && (
                    <model-viewer
                      src={activeItem.url}
                      alt={product.title}
                      auto-rotate
                      camera-controls
                      shadow-intensity="1"
                      style={{ width: '100%', height: '100%' }}
                    />
                  )}
                </div>

                {/* Thumbnail Strip */}
                {allMedia.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {allMedia.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveMediaIdx(idx)}
                        className={`w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all ${
                          activeMediaIdx === idx 
                            ? 'border-[#00714C] shadow-md ring-2 ring-[#00714C]/20' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {item.type === 'image' && (
                          <img src={item.url} alt="" className="w-full h-full object-cover" />
                        )}
                        {item.type === 'video' && (
                          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                            <span className="text-white text-lg">▶</span>
                          </div>
                        )}
                        {item.type === 'model3d' && (
                          <div className="w-full h-full bg-purple-50 flex items-center justify-center">
                            <span className="text-purple-500 text-xs font-bold">3D</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>

        {/* Right Col: Product Configurator */}
        <div className="lg:col-span-5 space-y-6">
          
          <div>
            <span className="bg-[#00714C]/10 text-[#00714C] border border-[#00714C]/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {product.categoryLabel}
            </span>
            <h1 className="font-['Cinzel'] text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2 leading-tight">
              {product.title}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-400">
                <Star size={14} fill="currentColor" />
              </div>
              <span className="font-bold text-gray-900 text-xs">{product.rating}</span>
              <span className="text-gray-500 text-xs">({product.reviewCount} verified campus reviews)</span>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-3 p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <span className="font-['Outfit'] text-3xl font-black text-[#00714C]">
              ₹{currentPrice?.toLocaleString('en-IN')}
            </span>
            <span className="text-sm text-gray-400 line-through">
              ₹{product.regularPrice?.toLocaleString('en-IN')}
            </span>
            <span className="text-xs bg-[#eef9f3] text-[#00714C] font-bold px-2.5 py-1 rounded-full ml-auto">
              Save ₹{product.regularPrice - product.salePrice}
            </span>
          </div>

          {/* Material Selector */}
          {product.availableMaterials && product.availableMaterials.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800 block">
                Select Print Material: <span className="text-[#00714C]">{selectedMaterial?.name}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.availableMaterials.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      selectedMaterial?.id === mat.id
                        ? 'bg-[#00714C] border-[#00714C] text-white shadow-sm'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{mat.name}</span>
                      {mat.priceDelta !== 0 && (
                        <span className={`text-[10px] ${selectedMaterial?.id === mat.id ? 'text-[#FFDA0F]' : 'text-[#00714C]'}`}>
                          {mat.priceDelta > 0 ? `+₹${mat.priceDelta}` : `-₹${Math.abs(mat.priceDelta)}`}
                        </span>
                      )}
                    </div>
                    <div className={`text-[10px] mt-0.5 ${selectedMaterial?.id === mat.id ? 'text-stone-200' : 'text-gray-500'}`}>
                      {mat.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800 block">
                Select Scale & Ratio: <span className="text-[#00714C]">{selectedSize?.name}</span>
              </label>
              <div className="flex gap-2">
                {product.availableSizes.map((sz) => (
                  <button
                    key={sz.id}
                    onClick={() => setSelectedSize(sz)}
                    className={`flex-1 py-2.5 px-3 rounded-xl border text-center text-xs font-bold transition-all ${
                      selectedSize?.id === sz.id
                        ? 'bg-[#00714C] border-[#00714C] text-white shadow-sm'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <div>{sz.name}</div>
                    <div className={`text-[10px] font-normal ${selectedSize?.id === sz.id ? 'text-stone-200' : 'text-gray-500'}`}>
                      {sz.dimensionStr}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button 
            onClick={() => addToCart(product, selectedMaterial, selectedSize)}
            className="w-full bg-[#00714C] hover:bg-[#005a3c] text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm flex items-center justify-center gap-2"
          >
            <span>Add to Cart & Select Campus Pickup</span>
            <span></span>
          </button>

          {/* Trust Points */}
          <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2 text-xs text-gray-600 shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#00714C]" />
              <span><strong>Campus Pickup:</strong> Free collection at Kinathukadavu 3D Lab Desk</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#00714C]" />
              <span><strong>Print-Time:</strong> ~{product.specs?.printTime} micro-layer production</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#00714C]" />
              <span><strong>Warranty:</strong> {product.specs?.warranty || '10-Day Exchange Guarantee'}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs: Specs, Story, Reviews */}
      <div className="border-t border-gray-200 pt-10">
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'specs' ? 'text-[#00714C] border-b-2 border-[#00714C]' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('story')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'story' ? 'text-[#00714C] border-b-2 border-[#00714C]' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Engineering & Maker Story
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'reviews' ? 'text-[#00714C] border-b-2 border-[#00714C]' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Verified Reviews ({reviews.length})
          </button>
        </div>

        {activeTab === 'specs' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(product.specs || {}).map(([k, v]) => (
              <div key={k} className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
                <span className="text-[10px] text-[#00714C] font-bold uppercase">{k}</span>
                <div className="text-sm font-bold text-gray-900 mt-1">{v}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'story' && (
          <div className="p-6 rounded-2xl bg-white border border-gray-200 text-gray-700 text-sm leading-relaxed max-w-3xl space-y-3 shadow-xs">
            <p>{product.description}</p>
            <p>{product.detailedStory || 'Crafted and sliced by the student innovator division at Akshaya College of Engineering and Technology (Kinathukadavu, Coimbatore).'}</p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Review Form */}
            <form onSubmit={handleReviewSubmit} className="p-6 rounded-2xl bg-white border border-gray-200 max-w-xl space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-gray-900 uppercase">Add a Verified Review</h4>
              <input 
                type="text" 
                value={reviewInput.author}
                onChange={(e) => setReviewInput({ ...reviewInput, author: e.target.value })}
                placeholder="Your Name / Roll Number (e.g. 21ME045)"
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#00714C]"
              />
              <textarea 
                value={reviewInput.comment}
                onChange={(e) => setReviewInput({ ...reviewInput, comment: e.target.value })}
                placeholder="Share your print inspection feedback..."
                required
                rows={3}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#00714C]"
              />
              <button 
                type="submit" 
                disabled={reviewSubmitting}
                className="bg-[#00714C] hover:bg-[#005a3c] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-all"
              >
                {reviewSubmitting ? 'Posting...' : 'Submit Review'}
              </button>
            </form>

            {/* Reviews List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2 shadow-xs">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-900">{rev.author}</span>
                    <span className="text-amber-400"></span>
                  </div>
                  <p className="text-xs text-gray-600 italic">“{rev.comment}”</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* You May Also Like Row */}
      {related.length > 0 && (
        <div className="border-t border-gray-200 pt-12">
          <h3 className="font-['Cinzel'] text-xl font-bold text-gray-900 mb-6">You May Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
