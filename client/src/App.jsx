import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { BuyerAuthProvider } from './context/BuyerAuthContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { BuyerAuthModal } from './components/auth/BuyerAuthModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { HomePage } from './pages/HomePage';
import { CollectionPage } from './pages/CollectionPage';
import { ProductPage } from './pages/ProductPage';
import { CustomOrderPage } from './pages/CustomOrderPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { ServicesPage } from './pages/ServicesPage';
import { ResearchPage } from './pages/ResearchPage';
import { TrainingPage } from './pages/TrainingPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { IndustryPage } from './pages/IndustryPage';

import { ShippingPolicy } from './pages/policies/ShippingPolicy';
import { RefundPolicy } from './pages/policies/RefundPolicy';
import { PrivacyPolicy } from './pages/policies/PrivacyPolicy';
import { TermsOfService } from './pages/policies/TermsOfService';
import { WarrantyPolicy } from './pages/policies/WarrantyPolicy';
import { CustomOrderPolicy } from './pages/policies/CustomOrderPolicy';
import { CancellationPolicy } from './pages/policies/CancellationPolicy';

const StoreLayout = () => (
  <>
    <AnnouncementBar />
    <Header />
    <CartDrawer />
    <BuyerAuthModal />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </>
);

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BuyerAuthProvider>
          <CartProvider>
            <Router>
              <div className="min-h-screen flex flex-col bg-white text-[#111827]">
                <Routes>
                  {/* Public Store Routes */}
                  <Route element={<StoreLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/collection/:category" element={<CollectionPage />} />
                    <Route path="/collection" element={<CollectionPage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/custom-order" element={<CustomOrderPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/track-order" element={<TrackOrderPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/facilities" element={<FacilitiesPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/research" element={<ResearchPage />} />
                    <Route path="/training" element={<TrainingPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/industry" element={<IndustryPage />} />
                    
                    {/* Policies */}
                    <Route path="/shipping-policy" element={<ShippingPolicy />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/warranty-policy" element={<WarrantyPolicy />} />
                    <Route path="/custom-order-policy" element={<CustomOrderPolicy />} />
                    <Route path="/cancellation-policy" element={<CancellationPolicy />} />
                    
                    {/* 404 Fallback */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>

                  {/* Admin Routes (No Store Header/Footer) */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/profile" element={<AdminProfilePage />} />
                </Routes>
              </div>
            </Router>
          </CartProvider>
        </BuyerAuthProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
