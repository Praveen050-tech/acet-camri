import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { productAPI } from '../api/client';
import { ProductCard } from '../components/product/ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const CollectionPage = () => {
  const { category = 'all' } = useParams();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'new-launches', name: 'New Launches' },
    { id: 'college-merch', name: 'College Merch' },
    { id: 'engineering-models', name: 'Engineering Models' },
    { id: 'figurines', name: 'Figurines' },
    { id: 'home-decor', name: 'Home & Décor' },
    { id: 'event-merch', name: 'Fest Merch' },
    { id: 'alumni-gifting', name: 'Alumni Gifting' }
  ];

  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getAll({
          category: category !== 'all' ? category : undefined,
          search: search || undefined,
          material: selectedMaterial !== 'all' ? selectedMaterial : undefined,
          sort: sortBy
        });
        if (res.data.success) {
          let list = res.data.data;
          list = list.filter((p) => p.salePrice <= maxPrice);
          setProducts(list);
        }
      } catch (err) {
        console.error('Error fetching collection:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [category, search, selectedMaterial, maxPrice, sortBy]);

  const currentCategoryObj = categories.find((c) => c.id === category) || { name: 'Complete Collection' };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 bg-white">
      
      {/* Breadcrumb & Header */}
      <div className="border-b border-gray-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link to="/" className="hover:text-[#00714C]">Home</Link>
            <span>/</span>
            <span className="text-[#00714C] font-semibold">{currentCategoryObj.name}</span>
          </div>
          <h1 className="font-['Cinzel'] text-3xl font-extrabold text-gray-900">
            {currentCategoryObj.name}
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Showing <strong className="text-[#00714C] font-bold">{products.length}</strong> verified 3D models • 50-micron micro-resolution
          </p>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600 whitespace-nowrap flex items-center gap-1">
            <ArrowUpDown size={14} className="text-[#00714C]" /> Sort by:
          </label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-300 text-xs text-gray-800 rounded-xl px-3 py-2 focus:outline-none focus:border-[#00714C] shadow-xs"
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated (5★)</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-6 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 font-['Outfit']">
              <Filter size={16} className="text-[#00714C]" />
              <span>Filter Catalog</span>
            </div>

            {/* Categories */}
            <div>
              <h5 className="text-xs font-bold text-gray-800 uppercase mb-2">Category</h5>
              <div className="space-y-1">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/collection/${c.id}`}
                    className={`block text-xs py-2 px-3 rounded-xl transition-all ${
                      category === c.id 
                        ? 'bg-[#00714C] text-white font-bold shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#00714C]'
                    }`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Material */}
            <div className="pt-4 border-t border-gray-100">
              <h5 className="text-xs font-bold text-gray-800 uppercase mb-2">Material</h5>
              <div className="space-y-2 text-xs text-gray-600">
                {[
                  { id: 'all', label: 'All Materials' },
                  { id: 'marble', label: 'Carrara Marble SLA' },
                  { id: 'green', label: 'ACET Emerald Green SLA' },
                  { id: 'nylon', label: 'PA12 Carbon-Fiber Nylon' },
                  { id: 'gold', label: 'Cold-Cast Brass Metal' }
                ].map((m) => (
                  <label key={m.id} className="flex items-center gap-2 cursor-pointer hover:text-black">
                    <input 
                      type="radio" 
                      name="material-filter" 
                      checked={selectedMaterial === m.id}
                      onChange={() => setSelectedMaterial(m.id)}
                      className="accent-[#00714C]"
                    />
                    <span>{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-gray-800 uppercase">Max Price</span>
                <span className="text-[#00714C] font-black">₹{maxPrice}</span>
              </div>
              <input 
                type="range" 
                min="500" 
                max="5000" 
                step="250"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#00714C]"
              />
            </div>

          </div>
        </div>

        {/* Products Grid Area */}
        <div className="lg:col-span-9">
          {loading ? (
            <div className="text-center py-20 text-gray-500">
              <div className="w-8 h-8 border-2 border-[#00714C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <span>Loading ACET CAMRI catalog...</span>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white border border-gray-200 rounded-3xl p-8 shadow-xs">
              <span className="text-4xl block mb-2">🔍</span>
              <h3 className="font-['Cinzel'] text-xl font-bold text-gray-900">No 3D Models Found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                No products match the selected filters or search query. Try broadening your price range or switching categories.
              </p>
              <button 
                onClick={() => { setSelectedMaterial('all'); setMaxPrice(5000); }}
                className="mt-4 bg-[#00714C] hover:bg-[#005a3c] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
