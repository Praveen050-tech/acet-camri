import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useBuyerAuth } from '../../context/BuyerAuthContext';
import { 
  ShoppingBag, Search, Menu, X, 
  ExternalLink, User, Phone, Clock, Box, LogOut, LogIn
} from 'lucide-react';
import { productAPI } from '../../api/client';

export const Header = () => {
  const { totalItems, setIsDrawerOpen } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const { buyer, isBuyerLoggedIn, buyerLogout, setIsAuthModalOpen } = useBuyerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    productAPI.getAll().then((res) => {
      if (res.data?.success) {
        setAllProducts(res.data.data);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const filtered = allProducts.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.categoryLabel.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      ).slice(0, 5);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collection/all?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About CAMRI', path: '/about' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Services', path: '/services' },
    { name: 'Store', path: '/collection/all' },
    { name: 'Custom Print', path: '/custom-order' },
    { name: 'Research', path: '/research' },
    { name: 'Training', path: '/training' },
    { name: 'Projects', path: '/projects' },
    { name: 'Industry', path: '/industry' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full shadow-md bg-white font-['Public_Sans']">
      
      {/* 1. TOP UTILITY BAR (Exact ACET Green #007C3D) */}
      <div className="bg-[#007C3D] text-white text-xs sm:text-[13px] font-medium py-2 px-4 sm:px-8 border-b border-[#005a3c]">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-2.5">
          
          {/* Left: TNEA Counselling Code & Autonomous Accreditation */}
          <div className="flex items-center gap-3">
            <div className="bg-[#FFDA0F] text-[#005539] font-['Readex_Pro'] font-extrabold px-3 py-0.5 rounded-sm tracking-wider uppercase text-[11px] sm:text-xs shadow-xs">
              TNEA CODE — 2763
            </div>
            <span className="hidden sm:inline-block text-white font-['Readex_Pro'] text-xs sm:text-[13px] font-semibold">
              Autonomous Institution • NAAC 'B+' Grade • Anna University
            </span>
          </div>

          {/* Right: Parent Links & Contact */}
          <div className="flex items-center gap-4 sm:gap-6 text-white text-xs sm:text-[13px]">
            <a 
              href="https://www.acetcbe.edu.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#FFDA0F] transition-colors flex items-center gap-1.5 font-bold"
            >
              <span>Main College Portal</span>
              <ExternalLink size={12} />
            </a>
            <span className="hidden md:inline text-white/40">|</span>
            <span className="hidden md:flex items-center gap-1.5 font-medium">
              <Phone size={13} className="text-[#FFDA0F]" /> +91 97894 44111
            </span>
            <span className="hidden lg:inline text-white/40">|</span>
            <span className="hidden lg:flex items-center gap-1.5 font-medium">
              <Clock size={13} className="text-[#FFDA0F]" /> Mon–Sat: 8:30 AM – 5:30 PM
            </span>
          </div>

        </div>
      </div>

      {/* 2. MAIN LOGO & BRANDING BAR (Clean White #FFFFFF with Gold Line - Enlarged) */}
      <div className="bg-white border-b-2 border-[#FFDA0F] py-3.5 sm:py-4.5 px-4 sm:px-8">
        <div className="container mx-auto flex justify-between items-center gap-4">
          
          {/* College Official Branding Emblem */}
          <Link to="/" className="flex items-center gap-3 sm:gap-4 group">
            {/* Official ACET Logo Image */}
            <div className="flex items-center">
              <img 
                src="/ACET Logo.png" 
                alt="Akshaya College of Engineering and Technology" 
                className="h-12 sm:h-16 md:h-18 max-w-[220px] sm:max-w-[340px] object-contain shrink-0 transition-transform duration-300 group-hover:scale-102"
              />
            </div>

            {/* CAMRI Logo */}
            <div className="flex flex-col justify-center border-l-2 border-gray-200 pl-3 sm:pl-4">
              <img 
                src="/camri-logo.png" 
                alt="ACET CAMRI Logo" 
                className="h-10 sm:h-12 md:h-14 object-contain shrink-0 transition-transform duration-300"
              />
            </div>
          </Link>

          {/* Search, Custom CAD CTA, Cart & Admin Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            
            {/* Search Trigger */}
            <div className="relative">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="h-11 w-11 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 flex items-center justify-center transition-all border border-gray-300 shadow-xs shrink-0 cursor-pointer"
                title="Search 3D Models"
              >
                <Search size={18} />
              </button>

              {/* Autocomplete Dropdown Search Box */}
              {isSearchOpen && (
                <div className="absolute right-0 top-14 w-72 sm:w-96 bg-white border border-gray-300 rounded-2xl p-3.5 shadow-2xl z-50 animate-fadeIn">
                  <form onSubmit={handleSearchSubmit} className="flex gap-2">
                    <input 
                      type="text"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search crest, gearbox, Shiva, lamp..."
                      className="flex-1 bg-[#F5F5F2] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#00714C]"
                    />
                    <button 
                      type="submit"
                      className="bg-[#00714C] hover:bg-[#005539] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-['Readex_Pro'] cursor-pointer"
                    >
                      Go
                    </button>
                  </form>

                  {/* Autocomplete Results */}
                  {searchResults.length > 0 && (
                    <div className="mt-2.5 divide-y divide-gray-100 max-h-60 overflow-y-auto">
                      {searchResults.map((item) => (
                        <Link
                          key={item.id}
                          to={`/product/${item.slug || item.id}`}
                          onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                          className="flex items-center gap-3 p-2.5 hover:bg-[#F5F5F2] rounded-xl transition-colors text-left"
                        >
                          <img src={item.image} alt={item.title} className="w-11 h-11 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-200" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs sm:text-sm font-bold text-gray-900 truncate">{item.title}</div>
                            <div className="text-[11px] sm:text-xs text-[#00714C] font-bold">₹{item.salePrice} • {item.categoryLabel}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Custom Print / CAD Upload CTA (ACET Yellow #F4E757) - HIDDEN for Event page, but kept in code for reference */}
            {/* <Link 
              to="/custom-order"
              className="hidden md:inline-flex items-center justify-center gap-2.5 h-11 bg-[#F4E757] hover:bg-[#FFDA0F] text-[#005539] font-['Readex_Pro'] font-extrabold text-xs sm:text-sm px-5 rounded-xl border border-[#d4af37] shadow-xs transition-all hover:scale-[1.02] whitespace-nowrap shrink-0"
            >
              <Box size={18} className="shrink-0" />
              <span>Custom CAD Print</span>
            </Link> */}

            {/* Shopping Cart Trigger */}
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="relative inline-flex items-center justify-center gap-2.5 h-11 bg-[#00714C] hover:bg-[#005539] text-white font-['Readex_Pro'] font-bold text-xs sm:text-sm px-5 rounded-xl shadow-xs transition-all hover:scale-[1.02] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag size={18} className="shrink-0" />
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="bg-[#FFDA0F] text-[#005539] font-black text-xs min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center font-mono shadow-xs ml-0.5">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Buyer Account Button — hidden when admin is logged in */}
            {!isAuthenticated && (
              isBuyerLoggedIn ? (
                <div className="relative group">
                  <button
                    className="h-11 flex items-center gap-2 bg-[#eef9f3] text-[#00714C] border border-[#aee6cb] px-3.5 rounded-xl hover:bg-[#d6f2e3] transition-colors shadow-xs shrink-0 cursor-pointer"
                    title={`Signed in as ${buyer?.name}`}
                  >
                    <User size={16} />
                    <span className="text-xs font-bold max-w-[80px] truncate hidden sm:inline">{buyer?.name?.split(' ')[0]}</span>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="px-3.5 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-900 truncate">{buyer?.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{buyer?.email}</p>
                    </div>
                    <button
                      onClick={buyerLogout}
                      className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="h-11 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-[#00714C] border border-gray-300 px-3.5 rounded-xl shadow-xs transition-all hover:scale-[1.02] shrink-0 cursor-pointer"
                  title="Sign in to your account"
                >
                  <LogIn size={16} className="text-[#00714C]" />
                  <span className="text-xs font-bold font-['Readex_Pro'] hidden sm:inline">Sign In</span>
                </button>
              )
            )}

            {/* Admin Profile Dropdown (when admin is logged in) */}
            {isAuthenticated ? (
              <div className="relative group">
                <button
                  className="h-11 flex items-center gap-2 bg-[#eef9f3] text-[#00714C] border border-[#aee6cb] px-3.5 rounded-xl hover:bg-[#d6f2e3] transition-colors shadow-xs shrink-0 cursor-pointer"
                  title={`Admin: ${user?.name || 'Admin'}`}
                >
                  <div className="w-7 h-7 rounded-full bg-[#00714C] text-white flex items-center justify-center text-[11px] font-black">
                    {(user?.name || 'A').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold max-w-[80px] truncate hidden sm:inline">{user?.name?.split(' ')[0] || 'Admin'}</span>
                </button>
                {/* Admin Dropdown */}
                <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="px-3.5 py-2.5 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900 truncate">{user?.name || 'Admin'}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-[9px] font-bold bg-[#00714C] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
                  </div>
                  <Link
                    to="/admin"
                    className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <Box size={14} />
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/profile"
                    className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <User size={14} />
                    Edit Profile
                  </Link>
                  <button
                    onClick={() => { logout(); navigate('/'); }}
                    className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : null}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-11 h-11 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>

        </div>
      </div>

      {/* 3. DESKTOP MAIN NAVIGATION BAR (ACET Forest Green #005539 - Enlarged) */}
      <nav className="hidden lg:block bg-[#005539] text-white border-t border-[#00422c]">
        <div className="container mx-auto px-4 sm:px-8 flex items-center justify-between">
          
          <ul className="flex items-center gap-1 text-sm font-['Readex_Pro'] font-bold">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path.startsWith('/collection') && location.pathname.startsWith(link.path));
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`block px-2.5 py-3.5 transition-colors border-b-2 text-[13px] ${
                      isActive 
                        ? 'bg-[#00714C] text-[#FFDA0F] border-[#FFDA0F] font-bold' 
                        : 'text-white/95 hover:text-[#FFDA0F] hover:bg-[#004830] border-transparent'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="text-xs sm:text-sm font-['Readex_Pro'] font-bold text-[#FFDA0F] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFDA0F] animate-pulse"></span>
            <span>50-Micron 3D Print Farm Live</span>
          </div>

        </div>
      </nav>

      {/* 4. MOBILE NAVIGATION SLIDEOUT */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-5 py-5 space-y-3 font-['Readex_Pro'] animate-fadeIn shadow-xl">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 text-sm font-bold text-gray-800 hover:bg-[#eef9f3] hover:text-[#00714C] rounded-xl"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3.5 border-t border-gray-100 flex flex-col gap-2.5">
            <Link
              to="/custom-order"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full bg-[#F4E757] text-[#005539] font-bold text-sm py-3 rounded-xl text-center shadow-xs"
            >
               Submit Custom CAD File
            </Link>
            /* Unified Auth handles admin login via Sign In button */
          </div>
        </div>
      )}

    </header>
  );
};
